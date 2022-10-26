package pl.edu.pwr.programming_technologies.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleSearchCriteriaDTO {

    private String title;
    private String authorNickname;
    private Integer technologyCategoryId;
    private Integer technologyId;
    private String technologyProvider;
    private OffsetDateTime fromCreationDate;
    private OffsetDateTime toCreationDate;
    private OffsetDateTime fromModificationDate;
    private OffsetDateTime toModificationDate;
}
