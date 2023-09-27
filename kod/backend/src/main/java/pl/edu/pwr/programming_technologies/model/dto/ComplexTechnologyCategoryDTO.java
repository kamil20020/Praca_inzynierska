package pl.edu.pwr.programming_technologies.model.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ComplexTechnologyCategoryDTO {

    private Integer id;
    private String name;
    private List<ComplexTechnologyCategoryDTO> childrenTechnologyCategoryDTOList;
}
