package com.nhom12.validator.impl;

import com.nhom12.services.UserService;
import com.nhom12.validator.UniqueUsername;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

/**
 *
 * @author DELL
 */
public class UniqueUsernameValidator implements ConstraintValidator<UniqueUsername, String>{
    @Autowired
    private UserService userService;

    @Override
    public void initialize(UniqueUsername constraintAnnotation) {
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value != null && !value.matches("^[a-zA-Z0-9]+$")) {
            return false;
        }
        return userService.getUserByUsername(value) == null;
    }
    
}
