package pl.edu.pwr.programming_technologies.model.api.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateComment {

    private String id;
    private String articleId;
    private String parentCommentId;
    private Integer authorId;
    private String content;
}
