package pl.edu.pwr.programming_technologies.model.api.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserInaccessibility {

    private OffsetDateTime toDate;
    private Integer userId;
}
