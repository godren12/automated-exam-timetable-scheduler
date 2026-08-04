package com.andrews.examtimetablescheduler.model;
import jakarta.persistence.*; import lombok.Data;
@Entity @Data
public class Department {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String name; private String code;
}