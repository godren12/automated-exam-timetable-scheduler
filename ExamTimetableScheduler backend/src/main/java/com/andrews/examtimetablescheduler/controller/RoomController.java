package com.andrews.examtimetablescheduler.controller;

import com.andrews.examtimetablescheduler.model.Room;
import com.andrews.examtimetablescheduler.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class RoomController {
    private final RoomRepository repo;

    @GetMapping
    public List<Room> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Room create(@RequestBody Room r) {
        return repo.save(r);
    }
}