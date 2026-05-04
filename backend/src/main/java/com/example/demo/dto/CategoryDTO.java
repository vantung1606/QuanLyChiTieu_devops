package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryDTO {
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Icon is required")
    private String icon;

    @NotBlank(message = "Color is required")
    private String color;

    @NotNull(message = "Budget is required")
    private Double budget;
    
    private Double spent; // Trường tính toán để trả về frontend
}
