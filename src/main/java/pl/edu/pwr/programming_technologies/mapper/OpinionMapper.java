package pl.edu.pwr.programming_technologies.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import pl.edu.pwr.programming_technologies.model.dto.OpinionDTO;
import pl.edu.pwr.programming_technologies.model.entity.OpinionEntity;

import java.util.List;

@Mapper(uses = {DateTimeMapper.class})
public interface OpinionMapper {

    OpinionMapper INSTANCE = Mappers.getMapper(OpinionMapper.class);

    /*@Mapping(
            source = "creationDate",
            target = "creationDate",
            qualifiedByName = "localDateTimeToOffsetDateTime"
    )
    @Mapping(
            source = "modificationDate",
            target = "modificationDate",
            qualifiedByName = "localDateTimeToOffsetDateTime"
    )
    @Mapping(source = "authorId", target = "authorDTO", qualifiedByName = "userIdToUserDTO")
    OpinionDTO opinionEntityToOpinionDTO(OpinionEntity opinionEntity);

    List<OpinionDTO> opinionEntityListToOpinionListDTO(List<OpinionEntity> opinionEntityList);*/
}
