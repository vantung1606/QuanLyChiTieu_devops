package com.example.demo.service;

import com.example.demo.dto.CategoryDTO;
import com.example.demo.entity.Category;
import com.example.demo.entity.Transaction;
import com.example.demo.entity.User;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.TransactionRepository;

import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;

    private final UserRepository userRepository;

    private User getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<CategoryDTO> getAllCategories() {
        User user = getCurrentUser();
        List<Category> categories = categoryRepository.findByUser(user);
        
        // Calculate current month range
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).with(LocalTime.MIN);
        LocalDateTime endOfMonth = LocalDateTime.now().withDayOfMonth(LocalDateTime.now().toLocalDate().lengthOfMonth()).with(LocalTime.MAX);
        
        List<Transaction> transactions = transactionRepository.findByUserAndDateBetweenOrderByDateAsc(user, startOfMonth, endOfMonth);

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
        User user = getCurrentUser();
        
        // Check if category name already exists for this user
        if (categoryRepository.findByNameAndUser(dto.getName(), user).isPresent()) {
            throw new RuntimeException("Category with name '" + dto.getName() + "' already exists for this user");
        }

        Category category = Category.builder()
                .name(dto.getName())
                .icon(dto.getIcon())
                .color(dto.getColor())
                .budget(dto.getBudget())
                .user(user)
                .build();
        return convertToDTO(categoryRepository.save(category), 0.0);
    }

    @Transactional
    public void deleteCategory(Long id) {
        User user = getCurrentUser();
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        
        // Security check
        if (!category.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: You do not own this category");
        }
        
        // Cascade delete: Delete all transactions with this category name
        transactionRepository.deleteByCategoryAndUser(category.getName(), user);
        
        categoryRepository.delete(category);
    }

    @org.springframework.transaction.annotation.Transactional
    public void createDefaultCategories(User user) {
        String[][] defaults = {
            {"Ăn uống", "Utensils", "#EF4444", "1000000.0"},
            {"Di chuyển", "Car", "#3B82F6", "500000.0"},
            {"Mua sắm", "ShoppingBag", "#8B5CF6", "1000000.0"},
            {"Giải trí", "Gamepad2", "#F59E0B", "500000.0"},
            {"Lương", "Banknote", "#10B981", "0.0"},
            {"Khác", "MoreHorizontal", "#6B7280", "200000.0"}
        };

        for (String[] def : defaults) {
            Category category = Category.builder()
                    .name(def[0])
                    .icon(def[1])
                    .color(def[2])
                    .budget(Double.parseDouble(def[3]))
                    .user(user)
                    .build();
            categoryRepository.save(category);
        }
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
