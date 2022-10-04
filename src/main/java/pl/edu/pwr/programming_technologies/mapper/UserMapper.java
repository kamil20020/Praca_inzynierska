package pl.edu.pwr.programming_technologies.mapper;

import org.apache.commons.lang3.ArrayUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;
import pl.edu.pwr.programming_technologies.model.dto.UserDTO;
import pl.edu.pwr.programming_technologies.model.entity.UserEntity;

import java.util.Base64;

@Mapper(uses = {ByteArrayMapper.class})
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Mapping(source = "avatar", target = "avatar", qualifiedByName = "byteArrayToBase64")
    UserDTO userEntityToUserDTO(UserEntity userEntity);

    @Mapping(source = "avatar", target = "avatar", qualifiedByName = "base64ToByteArray")
    UserEntity userDTOToUserEntity(UserDTO userDTO);
}
