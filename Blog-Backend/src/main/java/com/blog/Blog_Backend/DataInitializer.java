package com.blog.Blog_Backend;

import com.blog.Blog_Backend.entity.StockPriceEntry;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Configuration
public class DataInitializer {

    @Bean
    public CommandLineRunner initData(MongoTemplate mongoTemplate) {
        return args -> {
            // Clear existing data
            mongoTemplate.dropCollection("stock_prices");

            // Insert sample data with recent timestamps
            Instant now = Instant.now();
            StockPriceEntry[] entries = new StockPriceEntry[]{
                    createEntry("NVDA", 231.95296, now.minus(50, ChronoUnit.MINUTES), now.plus(10, ChronoUnit.MINUTES)),
                    createEntry("NVDA", 124.95156, now.minus(40, ChronoUnit.MINUTES), now.plus(10, ChronoUnit.MINUTES)),
                    createEntry("NVDA", 459.09558, now.minus(30, ChronoUnit.MINUTES), now.plus(10, ChronoUnit.MINUTES)),
                    createEntry("GOOGL", 150.23456, now.minus(45, ChronoUnit.MINUTES), now.plus(10, ChronoUnit.MINUTES)),
                    createEntry("GOOGL", 152.78901, now.minus(35, ChronoUnit.MINUTES), now.plus(10, ChronoUnit.MINUTES)),
                    createEntry("PYPL", 680.59766, now.minus(15, ChronoUnit.MINUTES), now.plus(10, ChronoUnit.MINUTES)),
                    createEntry("PYPL", 652.6387, now.minus(10, ChronoUnit.MINUTES), now.plus(10, ChronoUnit.MINUTES))
            };

            for (StockPriceEntry entry : entries) {
                mongoTemplate.save(entry, "stock_prices");
            }
            System.out.println("Inserted " + entries.length + " stock price entries.");
        };
    }

    private StockPriceEntry createEntry(String ticker, double price, Instant lastUpdatedAt, Instant expiresAt) {
        StockPriceEntry entry = new StockPriceEntry();
        entry.setTicker(ticker);
        entry.setPrice(price);
        entry.setLastUpdatedAt(lastUpdatedAt);
        entry.setExpiresAt(expiresAt);
        return entry;
    }
}
