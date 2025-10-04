package com.example.expense_management.service;

import net.sourceforge.tess4j.ITesseract;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class OCRService {

    public String extractTextFromImage(File imageFile) throws TesseractException {
        ITesseract tesseract = new Tesseract();
        tesseract.setDatapath("com/example/expense_management/tessdata"); // path to tessdata folder
        tesseract.setLanguage("eng");
        return tesseract.doOCR(imageFile);
    }
}
