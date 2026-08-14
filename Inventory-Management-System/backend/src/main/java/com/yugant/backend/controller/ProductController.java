package com.yugant.backend.controller;

import com.yugant.backend.dto.ProductRequest;
import com.yugant.backend.dto.ProductResponse;
import com.yugant.backend.dto.QuantityUpdateRequest;
import com.yugant.backend.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // Handles: GET /api/products
    //          GET /api/products?name=phone
    //          GET /api/products?sku=ABC123
    //          GET /api/products?categoryId=1
    //          any combination of the above
    @GetMapping
    public ResponseEntity<List<ProductResponse>> getAllProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String sku,
            @RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(productService.searchProducts(name, sku, categoryId));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<List<ProductResponse>> getLowStockProducts() {
        return ResponseEntity.ok(productService.getLowStockProducts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }

    @PostMapping
    public ResponseEntity<ProductResponse> createProduct(
            @Valid @RequestBody ProductRequest request) {
        ProductResponse created = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    @PatchMapping("/{id}/quantity")
    public ResponseEntity<ProductResponse> updateQuantity(
            @PathVariable Long id,
            @Valid @RequestBody QuantityUpdateRequest request) {
        return ResponseEntity.ok(productService.updateQuantity(id, request.getQuantity()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}