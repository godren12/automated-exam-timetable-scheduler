package com.andrews.examtimetablescheduler.controller;
import com.andrews.examtimetablescheduler.db.DBError;
import com.andrews.examtimetablescheduler.model.User;
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
    private final com.andrews.examtimetablescheduler.service.EmailService emailService;

    public record SafeUser(Long id, String email, boolean twoFactorEnabled) {
        static SafeUser from(User u) {
            return new SafeUser(u.getId(), u.getEmail(), u.isTwoFactorEnabled());
        }
    }

    @GetMapping("/find")
    public ResponseEntity<SafeUser> get(@RequestParam String email) {
        return handler.find(email)
                .map(u -> ResponseEntity.ok(SafeUser.from(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SafeUser> getById(@PathVariable Long id) {
        return handler.findById(id)
                .map(u -> ResponseEntity.ok(SafeUser.from(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> add(@RequestBody User u) {
        if (u.getEmail() == null || !u.getEmail().toLowerCase().endsWith("@gmail.com")) {
            return ResponseEntity.badRequest().body("Only @gmail.com email addresses are allowed.");
        }
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

    public record ChangePasswordRequest(String currentPassword, String newPassword) {}

    @PutMapping("/{id}/password")
    public ResponseEntity<?> changePassword(@PathVariable Long id, @RequestBody ChangePasswordRequest req) {
        boolean success = handler.changePassword(id, req.currentPassword(), req.newPassword());
        if (success) return ResponseEntity.ok().build();
        return ResponseEntity.badRequest().body("Incorrect current password.");
    }
    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody java.util.Map<String, String> body) {
        String idToken = body.get("idToken");
        try {
            String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
            org.springframework.web.client.RestTemplate rt = new org.springframework.web.client.RestTemplate();
            java.util.Map<?, ?> result = rt.getForObject(url, java.util.Map.class);
            String email = (String) result.get("email");
            if (email == null || !email.toLowerCase().endsWith("@gmail.com")) {
                return ResponseEntity.badRequest().body("Only @gmail.com accounts are allowed.");
            }
            User u = handler.find(email).orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setPassword(java.util.UUID.randomUUID().toString());
                handler.addUser(newUser);
                return handler.find(email).get();
            });
            return ResponseEntity.ok(SafeUser.from(u));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Google sign-in failed.");
        }
    }

    @PutMapping("/{id}/2fa")
    public ResponseEntity<?> toggle2FA(@PathVariable Long id, @RequestBody java.util.Map<String, Boolean> body) {
        boolean enabled = Boolean.TRUE.equals(body.get("enabled"));
        boolean success = handler.setTwoFactorEnabled(id, enabled);
        if (success) return ResponseEntity.ok().build();
        return ResponseEntity.notFound().build();
    }

    public record LoginResult(boolean twoFactorRequired, String email, SafeUser user) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {
        return handler.login(req.email(), req.password())
                .<ResponseEntity<?>>map(u -> {
                    if (u.isTwoFactorEnabled()) {
                        handler.generateResetCode(u.getEmail());
                        String code = handler.getResetCode(u.getEmail());
                        emailService.sendResetCode(u.getEmail(), code);
                        return ResponseEntity.ok(new LoginResult(true, u.getEmail(), null));
                    }
                    return ResponseEntity.ok(new LoginResult(false, u.getEmail(), SafeUser.from(u)));
                })
                .orElse(ResponseEntity.status(401).body("Invalid email or password."));
    }

    public record VerifyLoginRequest(String email, String code) {}

    @PostMapping("/verify-login")
    public ResponseEntity<?> verifyLogin(@RequestBody VerifyLoginRequest req) {
        boolean ok = handler.verifyCode(req.email(), req.code());
        if (!ok) return ResponseEntity.status(401).body("Invalid or expired code.");
        return handler.find(req.email())
                .<ResponseEntity<?>>map(u -> ResponseEntity.ok(SafeUser.from(u)))
                .orElse(ResponseEntity.status(404).body("User not found."));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody java.util.Map<String, String> body) {
        String email = body.get("email");
        boolean found = handler.generateResetCode(email);
        if (!found) {
            return ResponseEntity.ok().body("If that email exists, a reset code has been sent.");
        }
        String code = handler.getResetCode(email);
        emailService.sendResetCode(email, code);
        return ResponseEntity.ok().body("If that email exists, a reset code has been sent.");
    }

    public record ResetPasswordRequest(String email, String code, String newPassword) {}

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest req) {
        boolean success = handler.resetPassword(req.email(), req.code(), req.newPassword());
        if (success) return ResponseEntity.ok().build();
        return ResponseEntity.badRequest().body("Invalid or expired reset code.");
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