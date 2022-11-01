package pl.edu.pwr.programming_technologies.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import org.springframework.data.mongodb.core.mapping.FieldType;
import org.springframework.data.mongodb.core.mapping.MongoId;

import javax.persistence.Id;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document("comments")
public class CommentEntity {

    @Id
    @MongoId(FieldType.OBJECT_ID)
    @Field(name = "_id")
    private ObjectId id;

    @NotNull(message = "Nie podano id artykułu")
    @Field(name = "articleId")
    private ObjectId articleId;

    @Field(name = "parentCommentId")
    private ObjectId parentCommentId;

    @NotNull(message = "Nie podano id autora")
    @Field(name = "authorId")
    private Integer authorId;

    @NotNull(message = "Nie podano zawartości komentarza")
    @Field(name = "content")
    private String content;

    @NotNull
    @Field(name = "creationDate")
    private LocalDateTime creationDate;

    @NotNull
    @Field(name = "modificationDate")
    private LocalDateTime modificationDate;
}
