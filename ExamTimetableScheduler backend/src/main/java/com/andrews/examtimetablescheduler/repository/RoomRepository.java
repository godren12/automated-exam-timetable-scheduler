package com.andrews.examtimetablescheduler.repository;

import com.andrews.examtimetablescheduler.model.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByCapacityGreaterThanEqual(int capacity);
}