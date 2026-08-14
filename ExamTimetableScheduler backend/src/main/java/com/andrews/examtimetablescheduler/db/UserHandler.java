package com.andrews.examtimetablescheduler.db;
import com.andrews.examtimetablescheduler.model.User;
import com.andrews.examtimetablescheduler.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserHandler {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Optional<User> find(String email) {
        return userRepository.findByEmailIgnoreCase(email);
    }

    public DBError addUser(User u) {
        if (find(u.getEmail()).isPresent())
            return DBError.USER_EXISTS;
        u.setPassword(passwordEncoder.encode(u.getPassword()));
        userRepository.save(u);
        return DBError.SUCCESS;
    }

    public Optional<User> login(String email, String rawPassword) {
        Optional<User> optionalUser = find(email);
        if (optionalUser.isEmpty())
            return Optional.empty();
        User u = optionalUser.get();
        if (passwordEncoder.matches(rawPassword, u.getPassword()))
            return Optional.of(u);
        return Optional.empty();
    }

    public boolean changePassword(Long id, String currentPassword, String newPassword) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) return false;
        User u = optionalUser.get();
        if (!passwordEncoder.matches(currentPassword, u.getPassword())) return false;
        u.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(u);
        return true;
    }

    public Optional<User> findById(long id) {
        return userRepository.findById(id);
    }

    public boolean setTwoFactorEnabled(Long id, boolean enabled) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) return false;
        User u = optionalUser.get();
        u.setTwoFactorEnabled(enabled);
        userRepository.save(u);
        return true;
    }

    public boolean verifyCode(String email, String code) {
        Optional<User> optionalUser = find(email);
        if (optionalUser.isEmpty()) return false;
        User u = optionalUser.get();
        if (u.getResetCode() == null || !u.getResetCode().equals(code)) return false;
        if (u.getResetCodeExpiry() == null || u.getResetCodeExpiry().isBefore(java.time.LocalDateTime.now())) return false;
        u.setResetCode(null);
        u.setResetCodeExpiry(null);
        userRepository.save(u);
        return true;
    }

    public DBError removeUserByEmail(String email) {
        Optional<User> optionalUser = find(email);
        if (optionalUser.isPresent()) {
            userRepository.delete(optionalUser.get());
            return DBError.SUCCESS;
        } else {
            return DBError.USER_DOES_NOT_EXIST;
        }
    }

    public DBError removeUserById(long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            userRepository.delete(optionalUser.get());
            return DBError.SUCCESS;
        } else {
            return DBError.USER_DOES_NOT_EXIST;
        }
    }
    public boolean generateResetCode(String email) {
        Optional<User> optionalUser = find(email);
        if (optionalUser.isEmpty()) return false;
        User u = optionalUser.get();
        String code = String.valueOf((int) (Math.random() * 900000) + 100000);
        u.setResetCode(code);
        u.setResetCodeExpiry(java.time.LocalDateTime.now().plusMinutes(15));
        userRepository.save(u);
        return true;
    }

    public String getResetCode(String email) {
        return find(email).map(User::getResetCode).orElse(null);
    }

    public boolean resetPassword(String email, String code, String newPassword) {
        Optional<User> optionalUser = find(email);
        if (optionalUser.isEmpty()) return false;
        User u = optionalUser.get();
        if (u.getResetCode() == null || !u.getResetCode().equals(code)) return false;
        if (u.getResetCodeExpiry() == null || u.getResetCodeExpiry().isBefore(java.time.LocalDateTime.now())) return false;
        u.setPassword(passwordEncoder.encode(newPassword));
        u.setResetCode(null);
        u.setResetCodeExpiry(null);
        userRepository.save(u);
        return true;
    }
}