package com.nhom12.validator.impl;

import com.nhom12.services.UserService;
import com.nhom12.validator.UniqueEmail;
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
public class UniqueEmailValidator implements ConstraintValidator<UniqueEmail, String>{
    @Autowired
    private UserService userService;

    @Override
    public void initialize(UniqueEmail constraintAnnotation) {
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return userService.getUserByUsername(value) == null;
    }
    
}
