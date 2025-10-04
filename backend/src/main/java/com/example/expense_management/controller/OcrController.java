package com.example.expense_management.controller;

import com.example.expense_management.service.OcrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/ocr")
@CrossOrigin(origins = "http://localhost:3000")
public class OcrController {

    @Autowired
    private OcrService ocrService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please select a file to upload.");
        }
        try {
            String text = ocrService.extractTextFromFile(file);
            return ResponseEntity.ok(text);
        } catch (IOException e) {
            return ResponseEntity.status(500).body("Failed to process file: " + e.getMessage());
        }
    }
}
