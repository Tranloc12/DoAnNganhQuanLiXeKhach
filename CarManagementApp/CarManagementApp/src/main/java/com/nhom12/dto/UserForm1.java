/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.nhom12.dto;

/**
 *
 * @author admin
 */
public class UserForm1 { 
     private String username;
    private String password;
    private String email;
    private String dob; // String ngày tháng dạng "yyyy-MM-dd"
    private String goal;
    private String height;
    private String weight;
     // Getter và Setter cho username
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }

    // Getter và Setter cho password
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    // Getter và Setter cho email
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    // Getter và Setter cho dob
    public String getDob() {
        return dob;
    }
    public void setDob(String dob) {
        this.dob = dob;
    }

    // Getter và Setter cho goal
    public String getGoal() {
        return goal;
    }
    public void setGoal(String goal) {
        this.goal = goal;
    }

    // Getter và Setter cho height
    public String getHeight() {
        return height;
    }
    public void setHeight(String height) {
        this.height = height;
    }

    // Getter và Setter cho weight
    public String getWeight() {
        return weight;
    }
    public void setWeight(String weight) {
        this.weight = weight;
    }
}
