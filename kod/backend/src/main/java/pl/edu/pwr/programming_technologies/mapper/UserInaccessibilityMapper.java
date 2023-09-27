package pl.edu.pwr.programming_technologies.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import pl.edu.pwr.programming_technologies.model.dto.UserInaccessibilityDTO;
import pl.edu.pwr.programming_technologies.model.entity.UserInaccessibilityEntity;
import pl.edu.pwr.programming_technologies.repository.UserRepository;

@Mapper(uses = {DateTimeMapper.class, UserMapper.class})
public interface UserInaccessibilityMapper {

    UserInaccessibilityMapper INSTANCE = Mappers.getMapper(UserInaccessibilityMapper.class);

    @Mapping(source = "toDate", target = "toDate",  qualifiedByName = "localDateTimeToOffsetDateTime")
    @Mapping(source = "userEntity.id", target = "userId")
    UserInaccessibilityDTO userInaccessibilityEntityToUserInaccessibilityDTO(
        UserInaccessibilityEntity userInaccessibilityEntity
    );

    @Mapping(source = "toDate", target = "toDate",  qualifiedByName = "offsetDateTimeToLocalDateTime")
    @Mapping(source = "userId", target = "userEntity", qualifiedByName = "userIdToUserDTO")
    UserInaccessibilityEntity userInaccessibilityDTOToUserInaccessibilityEntity(
        UserInaccessibilityDTO inaccessibilityDTO,
        @Context UserRepository userRepository
    );
}
