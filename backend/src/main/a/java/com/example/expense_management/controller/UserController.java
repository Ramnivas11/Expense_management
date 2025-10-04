package com.example.expense_management.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @GetMapping("/me/role")
    public ResponseEntity<?> getUserRole(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).body("User not authenticated");
        }
        Map<String, String> response = new HashMap<>();
        Collection<? extends GrantedAuthority> authorities = authentication.getAuthorities();
        String role = authorities.stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse(null);
        // a more robust way would be to check for a specific role prefix if any
        if (role != null && role.startsWith("ROLE_")) {
            role = role.substring(5); // strip "ROLE_"
        }

        response.put("role", role);
        return ResponseEntity.ok(response);
    }
}
