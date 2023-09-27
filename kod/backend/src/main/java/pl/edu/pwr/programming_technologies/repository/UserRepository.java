package pl.edu.pwr.programming_technologies.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.pwr.programming_technologies.model.entity.UserEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    Optional<UserEntity> findByUserAccountId(String userAccountId);
    List<UserEntity> findAllByNicknameContainsIgnoreCase(String nickname);
    boolean existsByUserAccountId(String userAccountId);
    boolean existsByNickname(String nickname);
    List<UserEntity> findAllByIsReviewerIsTrueAndUserAvailabilityEntityIsNull();
}
