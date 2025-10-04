package com.example.expense_management.controller;

import com.example.expense_management.service.OCRService;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

@RestController
@RequestMapping("/api/ocr")
public class OCRController {

    @Autowired
    private OCRService ocrService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadReceipt(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return new ResponseEntity<>("File is empty!", HttpStatus.BAD_REQUEST);
        }

        File tempFile = null;
        try {
            tempFile = File.createTempFile("receipt-", ".png");
            file.transferTo(tempFile);

            String text = ocrService.extractTextFromImage(tempFile);
            return new ResponseEntity<>(text, HttpStatus.OK);
        } catch (IOException | TesseractException e) {
            // Log the exception
            return new ResponseEntity<>("Error processing file: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            if (tempFile != null) {
                tempFile.delete();
            }
        }
    }
}
