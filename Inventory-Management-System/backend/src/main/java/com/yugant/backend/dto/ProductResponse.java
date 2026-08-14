package com.yugant.backend.dto;

import com.yugant.backend.entity.Product;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ProductResponse {

    private Long id;
    private String name;
    private String sku;
    private BigDecimal price;
    private Integer quantity;
    private Long categoryId;
    private String categoryName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ProductResponse() {
    }

    public static ProductResponse fromEntity(Product product) {
        ProductResponse dto = new ProductResponse();
        dto.id = product.getId();
        dto.name = product.getName();
        dto.sku = product.getSku();
        dto.price = product.getPrice();
        dto.quantity = product.getQuantity();
        dto.categoryId = product.getCategory().getId();
        dto.categoryName = product.getCategory().getName();
        dto.createdAt = product.getCreatedAt();
        dto.updatedAt = product.getUpdatedAt();
        return dto;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSku() {
        return sku;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}