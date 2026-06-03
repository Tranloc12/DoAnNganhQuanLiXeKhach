/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.nhom12.validator;

import com.nhom12.validator.impl.ConfirmPasswordMatchValidator;
import com.nimbusds.jose.Payload;
import jakarta.validation.Constraint;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 *
 * @author HP
 */
@Constraint(validatedBy = ConfirmPasswordMatchValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ConfirmPasswordMatch {
    String passwordField(); // Tên trường password
    String confirmPasswordField(); // Tên trường confirmPassword
    String message() default "{user.passwordConfirmNotMatch.message}";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
