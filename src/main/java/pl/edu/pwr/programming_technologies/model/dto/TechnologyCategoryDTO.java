package pl.edu.pwr.programming_technologies.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TechnologyCategoryDTO {

    private Integer id;
    private String name;
    private TechnologyCategoryDTO parentTechnologyCategoryDTO;
}
