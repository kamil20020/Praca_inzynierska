package pl.edu.pwr.programming_technologies.service;

import org.springframework.http.ResponseEntity;
import pl.edu.pwr.programming_technologies.model.entity.UserEntity;

public interface UserService {

    UserEntity getUserByUserAccountId(String userAccountId);
    UserEntity createUser(UserEntity userEntity);
    boolean existsUserByNickname(String nickname);
}
