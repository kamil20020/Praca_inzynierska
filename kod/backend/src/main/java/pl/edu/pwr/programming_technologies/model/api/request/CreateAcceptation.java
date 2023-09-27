package pl.edu.pwr.programming_technologies.model.api.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAcceptation {

    private String opinionId;
    private Integer userId;
    private Integer value;
}
