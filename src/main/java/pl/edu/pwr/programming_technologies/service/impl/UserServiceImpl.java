package pl.edu.pwr.programming_technologies.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pl.edu.pwr.programming_technologies.exceptions.EntityConflictException;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.model.dto.UserDTO;
import pl.edu.pwr.programming_technologies.model.entity.UserEntity;
import pl.edu.pwr.programming_technologies.repository.UserRepository;
import pl.edu.pwr.programming_technologies.service.UserService;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserEntity getUserByUserAccountId(String userAccountId)
            throws IllegalArgumentException, EntityNotFoundException
    {
        if(userAccountId == null || userAccountId.isBlank()){
            throw new IllegalArgumentException("Podano nieprawidlowe id konta");
        }

        Optional<UserEntity> foundUserAccountId = userRepository.findByUserAccountId(userAccountId);

        if(foundUserAccountId.isEmpty()){
            throw new EntityNotFoundException("Nie istnieje konto o takim id");
        }

        return foundUserAccountId.get();
    }

    @Override
    public boolean existsUserByNickname(String nickname){

        if(nickname == null || nickname.isBlank()){
            throw new IllegalArgumentException("Nie podano pseudonimu");
        }

        return userRepository.existsByNickname(nickname);
    }

    @Override
    public UserEntity createUser(UserEntity userEntity) throws IllegalArgumentException, EntityConflictException{

        if(userEntity == null) {
            throw new IllegalArgumentException("Nie poddano danych");
        }

        if(userEntity.getUserAccountId() == null){
            throw new IllegalArgumentException("Nie podano id konta");
        }

        if(userEntity.getNickname() == null){
            throw new IllegalArgumentException("Nie podano pseudonimu");
        }

        System.out.println(userEntity.getUserAccountId());
        System.out.println(userEntity);

        if(userRepository.existsByUserAccountId(userEntity.getUserAccountId())){
            throw new EntityConflictException("Istnieje już użytkownik o takim id konta");
        }

        if(userRepository.existsByNickname(userEntity.getNickname())){
            throw new EntityConflictException("Istnieje już użytkownik o takim pseudonimie");
        }

        return userRepository.save(userEntity);
    }
}
