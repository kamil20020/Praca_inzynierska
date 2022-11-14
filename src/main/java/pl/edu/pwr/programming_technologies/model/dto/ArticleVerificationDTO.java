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
public class ArticleVerificationDTO {

    private Integer id;
    private ArticleDTO articleDTO;
    private String status;
    private String verificationFeedback;
    private OffsetDateTime assignmentDate;
}
