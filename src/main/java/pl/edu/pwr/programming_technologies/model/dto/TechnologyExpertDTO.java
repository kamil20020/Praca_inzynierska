package pl.edu.pwr.programming_technologies.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TechnologyExpertDTO {

    private Integer id;
    private TechnologyDTO technologyDTO;
}
