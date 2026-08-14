package com.yugant.backend.security;

import com.yugant.backend.entity.User;
import com.yugant.backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        // No token present -> let the request continue.
        // Spring Security will reject it later if the endpoint requires auth.
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7); // strip "Bearer "

        if (jwtService.isTokenValid(token)) {
            String email = jwtService.extractEmail(token);

            Optional<User> userOpt = userRepository.findByEmail(email);

            if (userOpt.isPresent()) {
                User user = userOpt.get();

                var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole()));

                var authToken = new UsernamePasswordAuthenticationToken(
                        user, null, authorities
                );

                // This is the key line: it tells Spring Security
                // "this request is authenticated as this user"
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}