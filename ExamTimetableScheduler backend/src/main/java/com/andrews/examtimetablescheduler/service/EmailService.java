package com.andrews.examtimetablescheduler.service;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender mailSender;

    public void sendResetCode(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your Password Reset Code");
        message.setText("Your password reset code is: " + code + "\n\nThis code expires in 15 minutes.");
        mailSender.send(message);
    }
}