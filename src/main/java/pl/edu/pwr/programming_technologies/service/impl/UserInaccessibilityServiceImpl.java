package pl.edu.pwr.programming_technologies.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pl.edu.pwr.programming_technologies.exceptions.EntityConflictException;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.model.api.request.CreateUserInaccessibility;
import pl.edu.pwr.programming_technologies.model.entity.UserEntity;
import pl.edu.pwr.programming_technologies.model.entity.UserInaccessibilityEntity;
import pl.edu.pwr.programming_technologies.repository.UserInaccessibilityRepository;
import pl.edu.pwr.programming_technologies.repository.UserRepository;
import pl.edu.pwr.programming_technologies.service.UserInaccessibilityService;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserInaccessibilityServiceImpl implements UserInaccessibilityService {

    private final UserInaccessibilityRepository userInaccessibilityRepository;
    private final UserRepository userRepository;

    @Override
    public UserInaccessibilityEntity getUserInaccessibilityByUserId(Integer userId) throws EntityNotFoundException {

        if(!userRepository.existsById(userId)){
            throw new EntityNotFoundException("Nie istnieje użytkownik o takim id");
        }

        Optional<UserInaccessibilityEntity> foundUserInaccessibilityEntityOpt =
                userInaccessibilityRepository.findByUserEntityId(userId);

        if(foundUserInaccessibilityEntityOpt.isEmpty()){
            return null;
        }

        return foundUserInaccessibilityEntityOpt.get();
    }

    @Override
    public UserInaccessibilityEntity createUserInaccessibility(Integer userId, LocalDateTime toDate)
        throws EntityNotFoundException, EntityConflictException
    {
        Optional<UserEntity> foundUserEntity = userRepository.findById(userId);

        if(foundUserEntity.isEmpty()){
            throw new EntityNotFoundException("Nie istnieje użytkownik o takim id");
        }

        if(userInaccessibilityRepository.existsByUserEntityId(userId)){
            throw new EntityConflictException("Użytkownik o podanym id jest już nieobecny");
        }

        return userInaccessibilityRepository.save(
            UserInaccessibilityEntity.builder()
                .userEntity(foundUserEntity.get())
                .toDate(toDate)
                .build()
        );
    }

    @Override
    public void deleteUserInaccessibilityById(Integer userInaccessibilityId) throws EntityNotFoundException {

        if(!userInaccessibilityRepository.existsById(userInaccessibilityId)){
            throw new EntityConflictException("Nie istnieje nieobecność o takim id");
        }

        userInaccessibilityRepository.deleteById(userInaccessibilityId);
    }
}
