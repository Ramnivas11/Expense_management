package com.example.expense_management.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class OcrService {

    public String extractTextFromFile(MultipartFile file) throws IOException {
        // In a real application, you would use a library like Tesseract to perform OCR.
        // For this example, we'll just return a dummy string.
        return "This is a dummy response from the OCR service.";
    }
}
