package pl.edu.pwr.programming_technologies.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.edu.pwr.programming_technologies.model.entity.OpinionEntity;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OpinionDTO {

    private String id;
    private UserDTO author;
    private String articleId;
    private Integer rating;
    private String content;
    private OffsetDateTime creationDate;
    private OffsetDateTime modificationDate;
    private Integer positiveAcceptancesCount;
    private Integer negativeAcceptancesCount;
    private Integer loggedUserAcceptance; //1 - positive, -1 - negative, 0 - not given
}
