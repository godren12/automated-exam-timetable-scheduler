package com.andrews.examtimetablescheduler.model;
import jakarta.persistence.*; import lombok.Data;
@Entity @Data
public class Room {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    @Column(unique = true) private String roomName; private int capacity;
}