package com.andrews.examtimetablescheduler.repository;

import com.andrews.examtimetablescheduler.model.Lecturer;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LecturerRepository extends JpaRepository<Lecturer, Long> {
}