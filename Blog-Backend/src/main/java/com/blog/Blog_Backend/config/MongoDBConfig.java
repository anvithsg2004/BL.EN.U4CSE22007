package com.blog.Blog_Backend.config;

import com.blog.Blog_Backend.entity.StockPriceEntry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.Index;
import org.springframework.data.mongodb.core.index.IndexOperations;
import org.springframework.data.domain.Sort;

@Configuration
public class MongoDBConfig {
    @Bean
    public IndexOperations stockPriceEntryIndexOperations(MongoTemplate mongoTemplate) {
        IndexOperations indexOps = mongoTemplate.indexOps(StockPriceEntry.class);
        indexOps.ensureIndex(new Index().on("expiresAt", Sort.Direction.ASC).expire(3600L));
        indexOps.ensureIndex(new Index().on("ticker", Sort.Direction.ASC).on("lastUpdatedAt", Sort.Direction.ASC));
        return indexOps;
    }
}
