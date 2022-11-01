package pl.edu.pwr.programming_technologies.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import pl.edu.pwr.programming_technologies.model.dto.CommentDTO;
import pl.edu.pwr.programming_technologies.model.entity.CommentEntity;
import pl.edu.pwr.programming_technologies.repository.UserRepository;

import java.util.List;

@Mapper(uses = {DateTimeMapper.class, UserMapper.class, MongoObjectIDMapper.class})
public interface CommentMapper {

    CommentMapper INSTANCE = Mappers.getMapper(CommentMapper.class);

    @Mapping(source = "id", target = "id", qualifiedByName = "objectIdToHexString")
    @Mapping(source = "articleId", target = "articleId", qualifiedByName = "objectIdToHexString")
    @Mapping(source = "parentCommentId", target = "parentCommentId", qualifiedByName = "objectIdToHexString")
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
    @Mapping(source = "authorId", target = "authorDTO", qualifiedByName = "userIdToUserDTO")
    CommentDTO commentEntityToCommentDTO(CommentEntity commentEntity, @Context UserRepository userRepository);

    List<CommentDTO> commentEntityListToCommentDTOList(
        List<CommentEntity> commentEntityList, @Context UserRepository userRepository
    );
}
