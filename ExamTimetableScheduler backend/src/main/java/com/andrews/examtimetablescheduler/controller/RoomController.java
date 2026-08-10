package com.andrews.examtimetablescheduler.controller;

import com.andrews.examtimetablescheduler.model.Room;
import com.andrews.examtimetablescheduler.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

    @PutMapping("/{id}")
    public ResponseEntity<Room> update(@PathVariable Long id, @RequestBody Room updated) {
        return repo.findById(id).map(existing -> {
            existing.setRoomName(updated.getRoomName());
            existing.setCapacity(updated.getCapacity());
            return ResponseEntity.ok(repo.save(existing));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!repo.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        repo.deleteById(id);
        return ResponseEntity.ok().build();
    }
}