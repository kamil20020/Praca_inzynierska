package pl.edu.pwr.programming_technologies.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyCategoryEntity;

import java.time.OffsetDateTime;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TechnologyDTO {

    private Integer id;
    private String name;
    private String description;
    private OffsetDateTime creationDateTime;
    private OffsetDateTime modificationDateTime;
    private String provider;
    private String icon;
    private OffsetDateTime firstReleaseDateTime;
    private OffsetDateTime lastReleaseDateTime;
    private TechnologyCategoryDTO technologyCategoryDTO;
}
