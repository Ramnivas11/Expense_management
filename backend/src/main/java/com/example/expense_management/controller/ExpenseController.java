package com.example.expense_management.controller;

import com.example.expense_management.entity.Expense;
import com.example.expense_management.service.ExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseService service;

    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    // Employee submits an expense
    @PostMapping("/submit")
    // ensure the request is authenticated; role check done in SecurityConfig by methods/HTTP basic
    public ResponseEntity<Expense> submitExpense(@RequestBody Expense expense, Authentication authentication) {
        String username = authentication.getName();
        Expense saved = service.submitExpense(expense, username);
        return ResponseEntity.ok(saved);
    }

    // Manager approves
    @PostMapping("/{id}/approve")
    public ResponseEntity<Expense> approveExpense(@PathVariable Long id, Authentication authentication) {
        String approver = authentication.getName();
        // role restriction applied in SecurityConfig (HTTP paths)
        Expense updated = service.approveExpense(id, approver);
        return ResponseEntity.ok(updated);
    }

    // Manager rejects
    @PostMapping("/{id}/reject")
    public ResponseEntity<Expense> rejectExpense(@PathVariable Long id,
                                                 @RequestParam(required = false) String comment,
                                                 Authentication authentication) {
        String approver = authentication.getName();
        Expense updated = service.rejectExpense(id, approver, comment);
        return ResponseEntity.ok(updated);
    }

    // Get all expenses - for admin (or for demo, returned to any authenticated user)
    @GetMapping
    public ResponseEntity<List<Expense>> getAllExpenses() {
        List<Expense> all = service.getAllExpenses();
        return ResponseEntity.ok(all);
    }

    // Get expenses for current user
    @GetMapping("/me")
    public ResponseEntity<List<Expense>> myExpenses(Authentication authentication) {
        String username = authentication.getName();
        List<Expense> list = service.getExpensesForUser(username);
        return ResponseEntity.ok(list);
    }

    // Get single expense
    @GetMapping("/{id}")
    public ResponseEntity<Expense> getExpense(@PathVariable Long id) {
        Expense e = service.getById(id);
        return ResponseEntity.ok(e);
    }
}
