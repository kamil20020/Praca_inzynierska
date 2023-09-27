package pl.edu.pwr.programming_technologies.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;
import pl.edu.pwr.programming_technologies.model.dto.TechnologyCategoryDTO;
import pl.edu.pwr.programming_technologies.model.dto.TechnologyDTO;
import pl.edu.pwr.programming_technologies.model.entity.ArticleEntity;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyEntity;
import pl.edu.pwr.programming_technologies.repository.TechnologyCategoryRepository;
import pl.edu.pwr.programming_technologies.repository.TechnologyRepository;

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

    @Mapping(
            source = "creationDateTime",
            target = "creationDateTime",
            qualifiedByName = "offsetDateTimeToLocalDateTime"
    )
    @Mapping(
            source = "modificationDateTime",
            target = "modificationDateTime",
            qualifiedByName = "offsetDateTimeToLocalDateTime"
    )
    @Mapping(
            source = "firstReleaseDateTime",
            target = "firstReleaseDateTime",
            qualifiedByName = "offsetDateTimeToLocalDateTime"
    )
    @Mapping(
            source = "lastReleaseDateTime",
            target = "lastReleaseDateTime",
            qualifiedByName = "offsetDateTimeToLocalDateTime"
    )
    @Mapping(source = "icon", target = "icon", qualifiedByName = "base64ToByteArray")
    @Mapping(source = "technologyCategoryDTO", target = "technologyCategoryEntity")
    TechnologyEntity technologyDTOToTechnologyEntity(TechnologyDTO technologyDTO);

    List<TechnologyEntity> technologyDTOListToTechnologyEntityList(List<TechnologyDTO> technologyDTOList);

    @Named("technologyIdToTechnologyDTO")
    default TechnologyDTO technologyIdToTechnologyDTO(
            Integer technologyId, @Context TechnologyRepository technologyRepository
    ){
        if(technologyId == null)
            return null;
        return technologyEntityToTechnologyDTO(
                technologyRepository.findById(technologyId).get()
        );
    }

}
