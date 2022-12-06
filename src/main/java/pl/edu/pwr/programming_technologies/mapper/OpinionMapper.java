package pl.edu.pwr.programming_technologies.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import pl.edu.pwr.programming_technologies.model.dto.OpinionDTO;
import pl.edu.pwr.programming_technologies.model.entity.OpinionEntity;
import pl.edu.pwr.programming_technologies.repository.UserRepository;

import java.util.List;

@Mapper(uses = {DateTimeMapper.class, UserMapper.class, MongoObjectIDMapper.class})
public interface OpinionMapper {

    OpinionMapper INSTANCE = Mappers.getMapper(OpinionMapper.class);

    @Mapping(
            source = "creationDate",
            target = "creationDate",
            qualifiedByName = "localDateTimeToOffsetDateTime"
    )
    @Mapping(
            source = "modificationDate",
            target = "modificationDate",
            qualifiedByName = "localDateTimeToOffsetDateTime"
    )
    @Mapping(source = "authorId", target = "author", qualifiedByName = "userIdToUserDTO")
    @Mapping(source = "id", target="id", qualifiedByName = "objectIdToHexString")
    @Mapping(source = "articleId", target="articleId", qualifiedByName = "objectIdToHexString")
    OpinionDTO opinionEntityToOpinionDTO(OpinionEntity opinionEntity, @Context UserRepository userRepository);

    List<OpinionDTO> opinionEntityListToOpinionListDTO(
        List<OpinionEntity> opinionEntityList, @Context UserRepository userRepository
    );
}
