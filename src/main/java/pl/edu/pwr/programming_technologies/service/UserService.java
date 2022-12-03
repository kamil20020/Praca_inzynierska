package pl.edu.pwr.programming_technologies.service;

import pl.edu.pwr.programming_technologies.model.entity.UserEntity;

import java.util.List;

public interface UserService {

    boolean existsById(Integer id);
    boolean existsUserByNickname(String nickname);
    UserEntity getUserByUserAccountId(String userAccountId);
    List<UserEntity> getAvailableReviewers();
    UserEntity createUser(UserEntity userEntity);
    UserEntity updateUser(Integer userId, UserEntity userEntity);
}
