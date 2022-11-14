package pl.edu.pwr.programming_technologies.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import pl.edu.pwr.programming_technologies.model.dto.TechnologyExpertDTO;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyExpertEntity;

import java.util.List;

@Mapper(uses = {TechnologyMapper.class})
public interface TechnologyExpertMapper {

    TechnologyExpertMapper INSTANCE = Mappers.getMapper(TechnologyExpertMapper.class);

    @Mapping(source = "technologyEntity", target = "technologyDTO")
    TechnologyExpertDTO technologyExpertEntityToTechnologyExpertDTO(TechnologyExpertEntity technologyExpertEntity);

    List<TechnologyExpertDTO> technologyExpertEntityListToTechnologyExpertDTOList(
            List<TechnologyExpertEntity> technologyExpertEntityList
    );

    @Mapping(source = "technologyDTO", target = "technologyEntity")
    TechnologyExpertEntity technologyExpertDTOToTechnologyExpertEntity(TechnologyExpertDTO technologyExpertDTO);

    List<TechnologyExpertEntity> technologyExpertDTOListToTechnologyExpertEntityList(
            List<TechnologyExpertDTO> technologyExpertDTOList
    );
}
