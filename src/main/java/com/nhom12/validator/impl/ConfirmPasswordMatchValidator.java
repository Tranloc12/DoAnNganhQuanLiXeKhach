/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.validator.impl;

import com.nhom12.validator.ConfirmPasswordMatch;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.lang.reflect.Field;

/**
 *
 * @author HP
 */
public class ConfirmPasswordMatchValidator 
    implements ConstraintValidator<ConfirmPasswordMatch, Object> { // Sử dụng Object thay vì String

    private String passwordField;
    private String confirmPasswordField;

    @Override
    public void initialize(ConfirmPasswordMatch constraintAnnotation) {
        this.passwordField = constraintAnnotation.passwordField();
        this.confirmPasswordField = constraintAnnotation.confirmPasswordField();
    }

    @Override
    public boolean isValid(Object object, ConstraintValidatorContext context) {
        try {
            Object password = getFieldValue(object, passwordField);
            Object confirmPassword = getFieldValue(object, confirmPasswordField);

            if (password == null || !password.equals(confirmPassword)) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate(context.getDefaultConstraintMessageTemplate())
                       .addPropertyNode(confirmPasswordField)
                       .addConstraintViolation();
                return false;
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Hàm hỗ trợ lấy giá trị trường bằng reflection
    private Object getFieldValue(Object object, String fieldName) 
        throws NoSuchFieldException, IllegalAccessException {
        Field field = object.getClass().getDeclaredField(fieldName);
        field.setAccessible(true);
        return field.get(object);
    }
}
