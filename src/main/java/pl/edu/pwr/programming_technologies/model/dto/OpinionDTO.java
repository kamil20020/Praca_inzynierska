package pl.edu.pwr.programming_technologies.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.edu.pwr.programming_technologies.model.entity.OpinionEntity;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OpinionDTO {

    private String id;
    private UserDTO authorId;
    private Integer rating;
    private String content;
    private LocalDateTime creationDate;
    private LocalDateTime modificationDate;
    private List<OpinionEntity.Acceptance> acceptanceList;
}
