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
public class CommentDTO {

    private String id;
    private String articleId;
    private String parentCommentId;
    private UserDTO authorDTO;
    private String content;
    private OffsetDateTime creationDate;
    private OffsetDateTime modificationDate;
}
