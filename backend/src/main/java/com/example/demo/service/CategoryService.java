package com.example.demo.service;

import com.example.demo.dto.CategoryDTO;
import com.example.demo.entity.Category;
import com.example.demo.entity.Transaction;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;

    public List<CategoryDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        List<Transaction> transactions = transactionRepository.findAll();

        return categories.stream().map(category -> {
            double spent = transactions.stream()
                    .filter(t -> t.getCategory().equalsIgnoreCase(category.getName()) && "expense".equalsIgnoreCase(t.getType()))
                    .mapToDouble(Transaction::getAmount)
                    .sum();

            return CategoryDTO.builder()
                    .id(category.getId())
                    .name(category.getName())
                    .icon(category.getIcon())
                    .color(category.getColor())
                    .budget(category.getBudget())
                    .spent(spent)
                    .build();
        }).collect(Collectors.toList());
    }

    public CategoryDTO createCategory(CategoryDTO dto) {
        Category category = Category.builder()
                .name(dto.getName())
                .icon(dto.getIcon())
                .color(dto.getColor())
                .budget(dto.getBudget())
                .build();
        return convertToDTO(categoryRepository.save(category), 0.0);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    private CategoryDTO convertToDTO(Category entity, Double spent) {
        return CategoryDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .icon(entity.getIcon())
                .color(entity.getColor())
                .budget(entity.getBudget())
                .spent(spent)
                .build();
    }
}
