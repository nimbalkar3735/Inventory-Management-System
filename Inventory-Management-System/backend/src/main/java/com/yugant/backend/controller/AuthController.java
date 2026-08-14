package com.yugant.backend.controller;

import com.yugant.backend.dto.LoginRequest;
import com.yugant.backend.dto.LoginResponse;
import com.yugant.backend.dto.RegisterRequest;
import com.yugant.backend.dto.UserResponse;
import com.yugant.backend.entity.User;
import com.yugant.backend.security.JwtService;
import com.yugant.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody RegisterRequest request) {

        if (userService.emailExists(request.getEmail())) {
            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(Map.of("status", 409, "message", "Email is already registered"));
        }

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        User savedUser = userService.registerUser(user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(UserResponse.fromEntity(savedUser));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request) {

        Optional<User> userByEmail = userService.findByEmail(request.getEmail());

        if (userByEmail.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", 404, "message", "Account does not exist. Please register first."));
        }

        Optional<User> userOpt = userService.authenticate(
                request.getEmail(), request.getPassword()
        );

        if (userOpt.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("status", 401, "message", "Invalid email or password"));
        }

        User user = userOpt.get();
        String token = jwtService.generateToken(user.getEmail());

        LoginResponse response = new LoginResponse(
                token,
                UserResponse.fromEntity(user)
        );

        return ResponseEntity.ok(response);
    }
}