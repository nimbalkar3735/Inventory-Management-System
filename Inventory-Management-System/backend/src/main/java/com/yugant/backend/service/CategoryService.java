package com.yugant.backend.service;

import com.yugant.backend.entity.Category;
import com.yugant.backend.exception.DuplicateResourceException;
import com.yugant.backend.exception.ResourceNotFoundException;
import com.yugant.backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }

    public Category createCategory(String name) {
        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new DuplicateResourceException("Category already exists: " + name);
        }

        Category category = new Category();
        category.setName(name);
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, String newName) {
        Category category = getCategoryById(id);

        // Only enforce uniqueness if the name is actually changing
        if (!category.getName().equalsIgnoreCase(newName)
                && categoryRepository.existsByNameIgnoreCase(newName)) {
            throw new DuplicateResourceException("Category already exists: " + newName);
        }

        category.setName(newName);
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        categoryRepository.delete(category);
    }
}