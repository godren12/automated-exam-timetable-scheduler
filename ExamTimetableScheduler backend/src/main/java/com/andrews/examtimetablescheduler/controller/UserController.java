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

    public record SafeUser(Long id, String email) {
        static SafeUser from(User u) {
            return new SafeUser(u.getId(), u.getEmail());
        }
    }

    @GetMapping("/find")
    public ResponseEntity<SafeUser> get(@RequestParam String email) {
        return handler.find(email)
                .map(u -> ResponseEntity.ok(SafeUser.from(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestBody User u) {
        try {
            DBError status = handler.addUser(u);
            if (status == DBError.USER_EXISTS) {
                return ResponseEntity.badRequest().body("A user with this email already exists.");
            }
            return ResponseEntity.ok(status);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        return handler.login(req.email(), req.password())
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(SafeUser.from(u)))
                .orElse(ResponseEntity.status(401).body("Invalid email or password."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        DBError status = handler.removeUserById(id);
        if (status == DBError.SUCCESS)
            return ResponseEntity.ok().build();
        else
            return ResponseEntity.notFound().build();
    }

    public record LoginRequest(String email, String password) {}
}