package com.andrews.examtimetablescheduler.controller;

import com.andrews.examtimetablescheduler.db.DBError;
import com.andrews.examtimetablescheduler.db.User;
import com.andrews.examtimetablescheduler.db.UserHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class UserController {
    private final UserHandler handler;

    @GetMapping("/find")
    public ResponseEntity<User> get(@RequestParam String email) {
        return handler.find(email).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestBody User u) {
        try {
            DBError status = handler.addUser(u);
            return ResponseEntity.ok(status);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        DBError status = handler.removeUserById(id);
        if (status == DBError.SUCCESS)
            return ResponseEntity.ok().build();
        else
            return ResponseEntity.notFound().build();
    }

    @GetMapping("/new")
    public ResponseEntity<User> create(@RequestParam String email, @RequestParam String password) {
        return ResponseEntity.ok().body(new User(handler.getIdCounter(), email, password));
    }
}