package com.andrews.examtimetablescheduler.model;
import jakarta.persistence.*; import lombok.Data;
@Entity @Data
public class Lecturer {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String name; @Column(unique = true) private String email;
}