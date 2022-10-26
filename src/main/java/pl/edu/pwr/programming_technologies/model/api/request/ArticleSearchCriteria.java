package pl.edu.pwr.programming_technologies.model.api.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleSearchCriteria {

    private String title;
    private String authorNickname;
    private Integer technologyCategoryId;
    private Integer technologyId;
    private String technologyProvider;
    private LocalDateTime fromCreationDate;
    private LocalDateTime toCreationDate;
    private LocalDateTime fromModificationDate;
    private LocalDateTime toModificationDate;
}
