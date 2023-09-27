package pl.edu.pwr.programming_technologies.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import pl.edu.pwr.programming_technologies.model.entity.ArticleEntity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import java.time.OffsetDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleDTO {

    private String id;
    private String title;
    private UserDTO authorDTO;
    private TechnologyDTO technologyDTO;
    private String content;
    private String status;
    private OffsetDateTime creationDate;
    private OffsetDateTime modificationDate;
    private Double averageRating;
}
