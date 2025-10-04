package com.example.expense_management.service;

import com.example.expense_management.entity.Expense;
import com.example.expense_management.entity.ExpenseStatus;
import com.example.expense_management.repository.ExpenseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExpenseService {

    private final ExpenseRepository repo;

    public ExpenseService(ExpenseRepository repo) {
        this.repo = repo;
    }

    public Expense submitExpense(Expense expense, String submitterUsername) {
        expense.setEmployeeName(submitterUsername);
        expense.setStatus(ExpenseStatus.PENDING);
        return repo.save(expense);
    }

    @Transactional
    public Expense approveExpense(Long id, String approverUsername) {
        Expense e = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Expense not found: " + id));
        e.setStatus(ExpenseStatus.APPROVED);
        e.setApprovedBy(approverUsername);
        return repo.save(e);
    }

    @Transactional
    public Expense rejectExpense(Long id, String approverUsername, String comment) {
        Expense e = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Expense not found: " + id));
        e.setStatus(ExpenseStatus.REJECTED);
        e.setApprovedBy(approverUsername);
        e.setComment(comment);
        return repo.save(e);
    }

    public List<Expense> getAllExpenses() {
        return repo.findAll();
    }

    public List<Expense> getExpensesForUser(String username) {
        return repo.findByEmployeeName(username);
    }

    public Expense getById(Long id) {
        return repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Expense not found: " + id));
    }

    public List<Expense> getPendingExpenses() {
        return repo.findByStatus(ExpenseStatus.PENDING);
    }

    @Transactional
    public Expense updateExpense(Long id, Expense expense) {
        Expense e = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Expense not found: " + id));
        e.setDescription(expense.getDescription());
        e.setAmount(expense.getAmount());
        e.setCurrency(expense.getCurrency());
        e.setDateSpent(expense.getDateSpent());
        return repo.save(e);
    }

    public void deleteExpense(Long id) {
        repo.deleteById(id);
    }
}
