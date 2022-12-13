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
public class TechnologySearchCriteria {

    private String name;
    private Integer technologyCategoryId;
    private String provider;
    private OffsetDateTime creationDateTime;
    private OffsetDateTime modificationDateTime;
}
