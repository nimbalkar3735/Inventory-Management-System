package com.yugant.backend.repository;

import com.yugant.backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    boolean existsBySkuIgnoreCase(String sku);

    Optional<Product> findBySkuIgnoreCase(String sku);

    List<Product> findByQuantityLessThan(int threshold);

    // Handles name search, SKU search, and category filter — all optional,
    // any combination can be passed at once via query params.
    @Query("""
            SELECT p FROM Product p
            WHERE (:name IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%')))
              AND (:sku IS NULL OR LOWER(p.sku) LIKE LOWER(CONCAT('%', :sku, '%')))
              AND (:categoryId IS NULL OR p.category.id = :categoryId)
            """)
    List<Product> search(
            @Param("name") String name,
            @Param("sku") String sku,
            @Param("categoryId") Long categoryId
    );
}