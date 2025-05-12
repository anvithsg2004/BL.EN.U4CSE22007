package com.blog.Blog_Backend.service;

import com.blog.Blog_Backend.entity.StockPriceEntry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class StockService {
    private static final Logger logger = LoggerFactory.getLogger(StockService.class);
    private final MongoTemplate mongoTemplate;

    @Autowired
    public StockService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public List<StockPriceEntry> getStockPriceHistory(String ticker, int minutes) {
        Instant cutoff = Instant.now().minus(minutes, ChronoUnit.MINUTES);
        Query query = new Query();
        query.addCriteria(Criteria.where("ticker").is(ticker)
                .and("lastUpdatedAt").gte(cutoff));
        List<StockPriceEntry> entries = mongoTemplate.find(query, StockPriceEntry.class, "stock_prices");
        logger.info("Retrieved {} entries for ticker {} within {} minutes", entries.size(), ticker, minutes);
        return entries;
    }
}
