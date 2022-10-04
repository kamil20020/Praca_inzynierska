package pl.edu.pwr.programming_technologies.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import pl.edu.pwr.programming_technologies.model.dto.TechnologyDTO;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyEntity;

import java.util.List;

@Mapper(uses = {DateTimeMapper.class, ByteArrayMapper.class, TechnologyCategoryMapper.class})
public interface TechnologyMapper {

    TechnologyMapper INSTANCE = Mappers.getMapper(TechnologyMapper.class);

    @Mapping(
            source = "creationDateTime",
            target = "creationDateTime",
            qualifiedByName = "localDateTimeToOffsetDateTime"
    )
    @Mapping(
            source = "modificationDateTime",
            target = "modificationDateTime",
            qualifiedByName = "localDateTimeToOffsetDateTime"
    )
    @Mapping(
            source = "firstReleaseDateTime",
            target = "firstReleaseDateTime",
            qualifiedByName = "localDateTimeToOffsetDateTime"
    )
    @Mapping(
            source = "lastReleaseDateTime",
            target = "lastReleaseDateTime",
            qualifiedByName = "localDateTimeToOffsetDateTime"
    )
    @Mapping(source = "icon", target = "icon", qualifiedByName = "byteArrayToBase64")
    @Mapping(source = "technologyCategoryEntity", target = "technologyCategoryDTO")
    TechnologyDTO technologyEntityToTechnologyDTO(TechnologyEntity technologyEntity);

    List<TechnologyDTO> technologyEntityListToTechnologyDTOList(List<TechnologyEntity> technologyEntityList);

}
