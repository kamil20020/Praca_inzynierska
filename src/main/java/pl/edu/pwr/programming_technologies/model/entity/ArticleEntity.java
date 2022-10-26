package pl.edu.pwr.programming_technologies.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.*;

import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document("articles")
public class ArticleEntity {

    public enum Status {
        _new,
        assigning_to_verification,
        verification,
        expired_verification,
        refused,
        published,
        editing;
    }

    @Id
    @MongoId(FieldType.OBJECT_ID)
    @Field(name = "_id")
    private ObjectId id;

    @NotNull
    @Field(name = "authorId")
    private Integer authorId;

    @NotNull
    @Field(name = "technologyId")
    private Integer technologyId;

    @NotNull
    @Indexed(unique = true)
    @Field(name = "title")
    private String title;

    @NotNull
    @Field(name = "content")
    private String content;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Field(name = "status")
    private Status status;

    @NotNull
    @Field(name = "creationDate")
    private LocalDateTime creationDate;

    @NotNull
    @Field(name = "modificationDate")
    private LocalDateTime modificationDate;

    @Min(0)
    @Field(name = "averageRating")
    private Double averageRating;
}
