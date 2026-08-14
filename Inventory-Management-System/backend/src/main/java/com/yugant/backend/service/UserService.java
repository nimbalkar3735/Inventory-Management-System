package com.yugant.backend.service;

import com.yugant.backend.entity.User;
import com.yugant.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean emailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    public User registerUser(User user) {

        user.setPassword(
                passwordEncoder.encode(user.getPassword())
        );

        user.setRole("USER");

        return userRepository.save(user);
    }
    // Returns the User if email exists AND raw password matches the stored hash.
    // Returns empty Optional otherwise (used for login).
    public Optional<User> authenticate(String email, String rawPassword) {
        return userRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(rawPassword, user.getPassword()));
    }
}