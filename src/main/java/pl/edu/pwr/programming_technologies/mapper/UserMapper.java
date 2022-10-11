package pl.edu.pwr.programming_technologies.mapper;

import org.apache.commons.lang3.ArrayUtils;
import org.mapstruct.*;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import pl.edu.pwr.programming_technologies.model.dto.UserDTO;
import pl.edu.pwr.programming_technologies.model.entity.UserEntity;
import pl.edu.pwr.programming_technologies.repository.UserRepository;

import java.lang.annotation.Target;
import java.util.Base64;

@Mapper(uses = {ByteArrayMapper.class})
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Mapping(source = "avatar", target = "avatar", qualifiedByName = "byteArrayToBase64")
    UserDTO userEntityToUserDTO(UserEntity userEntity);

    @Mapping(source = "avatar", target = "avatar", qualifiedByName = "base64ToByteArray")
    UserEntity userDTOToUserEntity(UserDTO userDTO);

    @Named("userIdToUserDTO")
    default UserDTO userIdToUserDTO(Integer userId, @Context UserRepository userRepository){
        return userEntityToUserDTO(userRepository.findById(userId).get());
    }
}
