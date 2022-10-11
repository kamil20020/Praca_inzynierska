package pl.edu.pwr.programming_technologies.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import javax.persistence.*;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document("opinions")
public class OpinionEntity {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class Acceptance {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Field(name = "_id")
        private String id;

        @NotNull
        @Field(name = "authorId")
        private Integer authorId;

        @NotNull
        @Min(-1)
        @Max(1)
        private Integer value;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Field(name = "_id")
    private String id;

    @NotNull
    @Field(name = "authorId")
    private Integer authorId;

    @Min(1)
    @Max(2)
    @NotNull
    @Field(name = "rating")
    private Integer rating;

    @NotNull
    @Field(name = "content")
    private String content;

    @NotNull
    @Field(name = "creationDate")
    private LocalDateTime creationDate;

    @NotNull
    @Field(name = "modificationDate")
    private LocalDateTime modificationDate;

    @NotNull
    @Field(name = "acceptances")
    private List<Acceptance> acceptanceList;

    @Min(0)
    @NotNull
    @Field(name = "positiveAcceptancesCount")
    private Integer positiveAcceptancesCount;

    @Min(0)
    @NotNull
    @Field(name = "negativeAcceptancesCount")
    private Integer negativeAcceptancesCount;
}
