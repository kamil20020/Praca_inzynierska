package pl.edu.pwr.programming_technologies.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.pwr.programming_technologies.model.entity.UserEntity;
import pl.edu.pwr.programming_technologies.model.entity.UserInaccessibilityEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserInaccessibilityRepository extends JpaRepository <UserInaccessibilityEntity, Integer> {

    Optional<UserInaccessibilityEntity> findByUserEntityId(Integer userId);
    boolean existsByUserEntityId(Integer userId);
}
