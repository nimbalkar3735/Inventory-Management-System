package com.yugant.backend.service;

import com.yugant.backend.dto.ProductRequest;
import com.yugant.backend.dto.ProductResponse;
import com.yugant.backend.entity.Category;
import com.yugant.backend.entity.Product;
import com.yugant.backend.exception.DuplicateResourceException;
import com.yugant.backend.exception.ResourceNotFoundException;
import com.yugant.backend.repository.CategoryRepository;
import com.yugant.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Value("${inventory.low-stock-threshold}")
    private int lowStockThreshold;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
    }

    public List<ProductResponse> searchProducts(String name, String sku, Long categoryId) {
        return productRepository.search(name, sku, categoryId).stream()
                .map(ProductResponse::fromEntity)
                .toList();
    }

    public ProductResponse getProductById(Long id) {
        Product product = findProductOrThrow(id);
        return ProductResponse.fromEntity(product);
    }

    public ProductResponse createProduct(ProductRequest request) {
        if (productRepository.existsBySkuIgnoreCase(request.getSku())) {
            throw new DuplicateResourceException("SKU already exists: " + request.getSku());
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + request.getCategoryId()));

        Product product = new Product();
        product.setName(request.getName());
        product.setSku(request.getSku());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setCategory(category);

        return ProductResponse.fromEntity(productRepository.save(product));
    }

    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product product = findProductOrThrow(id);

        // Only enforce SKU uniqueness if it's actually changing
        if (!product.getSku().equalsIgnoreCase(request.getSku())
                && productRepository.existsBySkuIgnoreCase(request.getSku())) {
            throw new DuplicateResourceException("SKU already exists: " + request.getSku());
        }

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Category not found with id: " + request.getCategoryId()));

        product.setName(request.getName());
        product.setSku(request.getSku());
        product.setPrice(request.getPrice());
        product.setQuantity(request.getQuantity());
        product.setCategory(category);

        return ProductResponse.fromEntity(productRepository.save(product));
    }

    public ProductResponse updateQuantity(Long id, Integer newQuantity) {
        Product product = findProductOrThrow(id);
        product.setQuantity(newQuantity);
        return ProductResponse.fromEntity(productRepository.save(product));
    }

    public void deleteProduct(Long id) {
        Product product = findProductOrThrow(id);
        productRepository.delete(product);
    }

    public List<ProductResponse> getLowStockProducts() {
        return productRepository.findByQuantityLessThan(lowStockThreshold).stream()
                .map(ProductResponse::fromEntity)
                .toList();
    }

    private Product findProductOrThrow(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }
}