package com.blog.Blog_Backend.controller;

import com.blog.Blog_Backend.entity.StockPriceEntry;
import com.blog.Blog_Backend.service.StockService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class StockController {
    @Autowired
    private StockService stockService;

    @GetMapping("/stocks/{ticker}")
    public Map<String, Object> getAverageStockPrice(
            @PathVariable String ticker,
            @RequestParam int minutes,
            @RequestParam String aggregation) {
        if (!"average".equals(aggregation)) {
            throw new IllegalArgumentException("Unsupported aggregation type: " + aggregation);
        }
        List<StockPriceEntry> priceHistory = stockService.getStockPriceHistory(ticker, minutes);
        if (priceHistory.isEmpty()) {
            throw new IllegalStateException("No price history available for ticker: " + ticker);
        }
        double average = calculateAverage(priceHistory);
        return Map.of(
                "averageStockPrice", average,
                "priceHistory", priceHistory
        );
    }

    @GetMapping("/stockcorrelation")
    public Map<String, Object> getStockCorrelation(
            @RequestParam int minutes,
            @RequestParam List<String> ticker) {
        if (ticker.size() != 2) {
            throw new IllegalArgumentException("Exactly two tickers required");
        }
        String t1 = ticker.get(0), t2 = ticker.get(1);
        List<StockPriceEntry> ph1 = stockService.getStockPriceHistory(t1, minutes);
        List<StockPriceEntry> ph2 = stockService.getStockPriceHistory(t2, minutes);

        // Align timestamps
        List<StockPriceEntry> alignedPh1 = new ArrayList<>();
        List<StockPriceEntry> alignedPh2 = new ArrayList<>();
        for (StockPriceEntry entry1 : ph1) {
            Instant time1 = entry1.getLastUpdatedAt();
            StockPriceEntry closest = null;
            long minDiff = Long.MAX_VALUE;
            for (StockPriceEntry entry2 : ph2) {
                Instant time2 = entry2.getLastUpdatedAt();
                long diff = Math.abs(Duration.between(time1, time2).toMillis());
                if (diff < minDiff) {
                    minDiff = diff;
                    closest = entry2;
                }
            }
            if (minDiff <= 60_000) {
                alignedPh1.add(entry1);
                alignedPh2.add(closest);
            }
        }

        List<Double> p1 = alignedPh1.stream().map(StockPriceEntry::getPrice).collect(Collectors.toList());
        List<Double> p2 = alignedPh2.stream().map(StockPriceEntry::getPrice).collect(Collectors.toList());
        double avg1 = p1.stream().mapToDouble(d -> d).average().orElse(0);
        double avg2 = p2.stream().mapToDouble(d -> d).average().orElse(0);
        double cov = calculateCovariance(p1, p2, avg1, avg2);
        double std1 = calculateStdDev(p1, avg1);
        double std2 = calculateStdDev(p2, avg2);
        double corr = (std1 == 0 || std2 == 0) ? 0 : cov / (std1 * std2);
        return Map.of(
                "correlation", corr,
                "stocks", Map.of(
                        t1, createStockResponse(avg1, ph1),
                        t2, createStockResponse(avg2, ph2)
                ));
    }

    private double calculateAverage(List<StockPriceEntry> priceHistory) {
        return priceHistory.stream()
                .mapToDouble(StockPriceEntry::getPrice)
                .average()
                .orElse(0);
    }

    private double calculateCovariance(List<Double> p1, List<Double> p2, double avg1, double avg2) {
        double sum = 0;
        int n = p1.size();
        for (int i = 0; i < n; i++) {
            sum += (p1.get(i) - avg1) * (p2.get(i) - avg2);
        }
        return sum / (n - 1);
    }

    private double calculateStdDev(List<Double> prices, double avg) {
        double sum = prices.stream().mapToDouble(p -> Math.pow(p - avg, 2)).sum();
        return Math.sqrt(sum / (prices.size() - 1));
    }

    private Map<String, Object> createStockResponse(double avg, List<StockPriceEntry> ph) {
        return Map.of("averagePrice", avg, "priceHistory", ph);
    }
}