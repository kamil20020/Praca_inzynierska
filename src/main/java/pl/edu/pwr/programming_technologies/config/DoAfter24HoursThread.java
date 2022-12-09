package pl.edu.pwr.programming_technologies.config;

import org.bson.types.ObjectId;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import pl.edu.pwr.programming_technologies.model.entity.*;
import pl.edu.pwr.programming_technologies.repository.*;
import pl.edu.pwr.programming_technologies.service.ArticleVerificationService;
import pl.edu.pwr.programming_technologies.service.UserInaccessibilityService;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.time.chrono.ChronoLocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Configuration
public class DoAfter24HoursThread {

    @Transactional
    @Bean
    public ApplicationRunner init(
        ArticleVerificationService articleVerificationService,
        UserInaccessibilityService userInaccessibilityService
    ) {

        return args -> {
            new Thread(() -> {
                while(true){
                    articleVerificationService.updateArticlesVerification();
                    userInaccessibilityService.updateReviewersInaccessibility();
                    articleVerificationService.tryAssignArticlesToVerification();
                    try {
                        TimeUnit.SECONDS.sleep(10);
                        System.out.println("Refreshed");
                    }
                    catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
            });//.run();
        };
    }
}