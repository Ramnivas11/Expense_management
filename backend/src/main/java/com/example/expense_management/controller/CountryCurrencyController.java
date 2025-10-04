package com.example.expense_management.controller;

import com.example.expense_management.service.CountryCurrencyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/currency")
public class CountryCurrencyController {

    @Autowired
    private CountryCurrencyService service;

    @GetMapping("/countries")
    public String getCountries() {
        return service.getAllCountriesAndCurrencies();
    }

    @GetMapping("/convert/{base}")
    public String getConversion(@PathVariable String base) {
        return service.getCurrencyConversion(base);
    }
}

