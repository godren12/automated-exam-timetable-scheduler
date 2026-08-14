package com.andrews.examtimetablescheduler.model;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "app_user")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String email;

    private String password;

    private String resetCode;
    private java.time.LocalDateTime resetCodeExpiry;

    private boolean twoFactorEnabled = false;
}