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
}