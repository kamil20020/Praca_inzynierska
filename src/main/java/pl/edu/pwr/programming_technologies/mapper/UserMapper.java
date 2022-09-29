package pl.edu.pwr.programming_technologies.mapper;

import org.apache.commons.lang3.ArrayUtils;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;
import pl.edu.pwr.programming_technologies.model.dto.UserDTO;
import pl.edu.pwr.programming_technologies.model.entity.primary.UserEntity;

import java.util.Base64;

@Mapper
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    @Mapping(source = "avatar", target = "avatar", qualifiedByName = "byteArrayToBase64")
    UserDTO userEntityToUserDTO(UserEntity userEntity);

    @Mapping(source = "avatar", target = "avatar", qualifiedByName = "base64ToByteArray")
    UserEntity userDTOToUserEntity(UserDTO userDTO);

    @Named("byteArrayToBase64")
    default String base64ToByteArray(Byte[] byteArr) {
        if(byteArr == null){
            return null;
        }
        byte[] primitiveByteArr = ArrayUtils.toPrimitive(byteArr);
        System.out.println(Base64.getMimeEncoder().encodeToString(primitiveByteArr));
        return Base64.getMimeEncoder().encodeToString(primitiveByteArr);
    }

    @Named("base64ToByteArray")
    default Byte[] base64ToByteArray(String base64) {
        if(base64 == null){
            return null;
        }
        byte[] byteArr = Base64.getMimeDecoder().decode(base64);
        return ArrayUtils.toObject(byteArr);
    }
}
