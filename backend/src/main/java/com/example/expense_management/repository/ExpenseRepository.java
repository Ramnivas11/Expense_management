package com.example.expense_management.repository;


import com.example.expense_management.entity.Expense;
import com.example.expense_management.entity.ExpenseStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findBySubmittedBy(String submittedBy);
    List<Expense> findByStatus(ExpenseStatus status);
}