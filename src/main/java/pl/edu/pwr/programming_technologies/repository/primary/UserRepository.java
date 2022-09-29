package pl.edu.pwr.programming_technologies.repository.primary;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.pwr.programming_technologies.model.entity.primary.UserEntity;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Integer> {

    Optional<UserEntity> findByUserAccountId(String userAccountId);
    boolean existsByUserAccountId(String userAccountId);
    boolean existsByNickname(String nickname);
}
