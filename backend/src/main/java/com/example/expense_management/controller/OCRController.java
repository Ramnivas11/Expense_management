package com.example.expense_management.controller;

import com.example.expense_management.service.OCRService;
import com.example.expense_management.service.OCRService;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/ocr")
public class OCRController {

    @Autowired
    private com.example.expense_management.service.OCRService ocrService;

    @PostMapping("/upload")
    public String uploadReceipt(@RequestParam("file") MultipartFile file) throws IOException, TesseractException {
        if (file.isEmpty()) {
            return "File is empty!";
        }

        // Save temp file
        File tempFile = File.createTempFile("receipt-", ".png");
        file.transferTo(tempFile);

        // OCR
        String text = ocrService.extractTextFromImage(tempFile);

        // Delete temp file
        tempFile.delete();

        return text;
    }
}
