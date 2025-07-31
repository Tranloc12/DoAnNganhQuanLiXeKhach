/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.nhom12.services;

/**
 *
 * @author HP
 */
public interface EmailService {
    void sendHtmlEmail(String to, String subject, String htmlBody);
    void sendSimpleEmail(String to, String subject, String text);
}
