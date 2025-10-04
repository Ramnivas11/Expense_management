package com.example.expense_management.service;


import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@Service
public class CountryCurrencyService {

    private final RestTemplate restTemplate = new RestTemplate();

    public String getAllCountriesAndCurrencies() {
        String url = "https://restcountries.com/v3.1/all?fields=name,currencies";
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }

    public String getCurrencyConversion(String baseCurrency) {
        String url = "https://api.exchangerate-api.com/v4/latest/" + baseCurrency;
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
        return response.getBody();
    }
}
