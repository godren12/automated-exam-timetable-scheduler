package com.andrews.examtimetablescheduler.db;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;
import tools.jackson.core.JacksonException;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.io.File;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserHandler {
    private final File db = new File("users.json");
    private final ObjectMapper objectMapper = new ObjectMapper();
    private List<User> users = new ArrayList<>();
    private long idCounter = 0;

    public long getIdCounter() {
        return idCounter++;
    }

    @PostConstruct
    public void init() {
        loadDB();
    }

    public Optional<User> find(String email) {
        return users.stream().filter(user -> user.getEmail().equalsIgnoreCase(email)).findFirst();
    }

    private Optional<User> findById(long id) {
        return users.stream().filter(user -> user.getId() == id).findFirst();
    }

    public DBError addUser(User u) {
        if (find(u.getEmail()).isPresent())
            return DBError.USER_EXISTS;

        users.add(u);
        saveDB();
        return DBError.SUCCESS;
    }

    public DBError removeUserByEmail(String email) {
        Optional<User> optionalUser = find(email);
        if (optionalUser.isPresent()) {
            User u = optionalUser.get();
            users.removeIf(user -> user.getId() == u.getId());
            saveDB();
            return DBError.SUCCESS;
        } else {
            return DBError.USER_DOES_NOT_EXIST;
        }
    }

    public DBError removeUserById(long id) {
        Optional<User> optionalUser = findById(id);
        if (optionalUser.isPresent()) {
            User u = optionalUser.get();
            users.removeIf(user -> user.getId() == id);
            saveDB();
            return DBError.SUCCESS;
        } else {
            return DBError.USER_DOES_NOT_EXIST;
        }
    }

    public synchronized void loadDB() {
        if (!db.exists())
            saveDB();

        try {
            users = objectMapper.readValue(db, new TypeReference<List<User>>() {});
        } catch (JacksonException e) {
            System.err.println("Got Jackson exception: " + e.getMessage() + "\nThis error requires immediate attention.");
        }
    }

    public synchronized void saveDB() {
        try {
            objectMapper.writerWithDefaultPrettyPrinter().writeValue(db, users);
        } catch (JacksonException e) {
            System.err.println("Got Jackson exception: " + e.getMessage() + "\nThis error requires immediate attention.");
        }
    }
}