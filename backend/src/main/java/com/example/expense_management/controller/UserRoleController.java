package com.example.expense_management.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class UserRoleController {

    @GetMapping("/api/users/me/role")
    public Map<String, String> getCurrentUserRole(Authentication authentication) {
        if (authentication == null) {
            return Map.of("role", "UNKNOWN");
        }

        String role = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("UNKNOWN");

        // remove "ROLE_" prefix if exists
        if (role.startsWith("ROLE_")) {
            role = role.substring(5);
        }

        return Map.of("role", role); // returns JSON: { "role": "EMPLOYEE" }
    }
}
