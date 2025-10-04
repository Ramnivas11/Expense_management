# 💼 Expense Management System

A ** web application** to manage employee expenses efficiently. Streamline **expense submission, approval workflows, and automated receipt processing**. Designed for **hackathons and prototype submissions**, this project demonstrates **full-stack development with Spring Boot (backend) and React (frontend)**.

---

## 🚀 Project Overview

Companies often struggle with manual expense reimbursement processes that are **time-consuming, error-prone, and lack transparency**.  
This system allows:

- Submission of expenses in multiple currencies.
- Multi-level approval workflows with **flexible rules**.
- OCR-based receipt scanning to **auto-generate expenses**.
- Clear role-based access: **Admin, Manager, Employee**.
- Easy integration with **currency conversion APIs**.

---

## 🎯 Core Features

### **Authentication & User Management**
- Auto-create **Company** and **Admin** on first signup.
- Admin can:
  - Create **Employees & Managers**.
  - Assign and change **roles**.
  - Define **manager relationships**.

### **Expense Submission (Employee Role)**
- Submit **expense claims** with:
  - Amount (in any currency)
  - Category
  - Description
  - Date
- View **expense history** (Approved, Rejected).

### **Approval Workflow (Manager/Admin Role)**
- Multi-level approvals (Manager → Finance → Director)
- Conditional Approval Rules:
  - **Percentage Rule:** e.g., 60% of approvers approve → expense approved.
  - **Specific Approver Rule:** e.g., CFO approves → expense auto-approved.
  - **Hybrid Rule:** Combine both (60% OR CFO approves).

### **Additional Features**
- **OCR for receipts:** Scan receipts to automatically extract:
  - Amount
  - Date
  - Description
  - Expense type
  - Merchant/Restaurant name
- **Currency conversion API** integration:  
  - [Countries & Currencies](https://restcountries.com/v3.1/all?fields=name,currencies)  
  - [Currency Conversion](https://api.exchangerate-api.com/v4/latest/{BASE_CURRENCY})

---

## 🛠️ Technology Stack

| Layer           | Technology |
|-----------------|------------|
| Frontend        | ReactJS, Axios, Bootstrap |
| Backend         | Spring Boot, Spring Security, Spring Data JPA |
| Database        | H2 (in-memory for demo) |
| OCR             | Tesseract OCR |
| APIs            | REST API, Currency Conversion |

---

## 📁 Project Structure

