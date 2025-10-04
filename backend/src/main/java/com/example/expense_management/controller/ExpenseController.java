package com.example.expense_management.controller;

import com.example.expense_management.controller.request.CommentRequest;
import com.example.expense_management.entity.Expense;
import com.example.expense_management.service.ExpenseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:3000")
public class ExpenseController {

    private final ExpenseService service;

    public ExpenseController(ExpenseService service) {
        this.service = service;
    }

    // Employee submits an expense
    @PostMapping("/submit")
    @PreAuthorize("hasRole('EMPLOYEE')")
    public ResponseEntity<Expense> submitExpense(@RequestBody Expense expense, Authentication authentication) {
        String username = authentication.getName();
        Expense saved = service.submitExpense(expense, username);
        return ResponseEntity.ok(saved);
    }

    // Manager approves
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<Expense> approveExpense(@PathVariable Long id, Authentication authentication) {
        String approver = authentication.getName();
        Expense updated = service.approveExpense(id, approver);
        return ResponseEntity.ok(updated);
    }

    // Manager rejects
    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<Expense> rejectExpense(@PathVariable Long id,
                                                 @RequestBody CommentRequest commentRequest,
                                                 Authentication authentication) {
        String approver = authentication.getName();
        Expense updated = service.rejectExpense(id, approver, commentRequest.getComment());
        return ResponseEntity.ok(updated);
    }

    // Get all expenses - for admin
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Expense>> getAllExpenses() {
        List<Expense> all = service.getAllExpenses();
        return ResponseEntity.ok(all);
    }

    // Get expenses for current user
    @GetMapping("/me")
    @PreAuthorize("hasRole('EMPLOYEE')")
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

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<List<Expense>> getPendingExpenses() {
        return ResponseEntity.ok(service.getPendingExpenses());
    }

    @PutMapping("/{id}")
    @PreAuthorize("#expense.employeeName == authentication.name")
    public ResponseEntity<Expense> updateExpense(@PathVariable Long id, @RequestBody Expense expense, Authentication authentication) {
        Expense updated = service.updateExpense(id, expense);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("#expense.employeeName == authentication.name")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id, @RequestBody Expense expense, Authentication authentication) {
        service.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }
}
