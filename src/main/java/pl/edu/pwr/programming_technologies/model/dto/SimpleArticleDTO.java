package pl.edu.pwr.programming_technologies.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.edu.pwr.programming_technologies.model.entity.ArticleEntity;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import java.time.OffsetDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SimpleArticleDTO {

    private String title;
    private Integer authorId;
    private Integer technologyCategoryId;
    private String content;

    @Enumerated(EnumType.STRING)
    private ArticleEntity.Status status;

    private OffsetDateTime creationDate;
    private OffsetDateTime modificationDate;
}
