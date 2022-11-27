package pl.edu.pwr.programming_technologies.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyEntity;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyExpertEntity;
import pl.edu.pwr.programming_technologies.model.entity.UserEntity;

import java.util.List;

@Repository
public interface TechnologyExpertRepository extends JpaRepository<TechnologyExpertEntity, Integer> {

    List<TechnologyExpertEntity> findAllByUserEntityIdAndTechnologyEntityNameContainsIgnoreCase(
            Integer userId, String technologyName
    );
    List<TechnologyExpertEntity> findAllByUserEntityIdNotAndTechnologyEntityTechnologyCategoryEntityId(
            Integer userId, Integer technologyCategoryId
    );
    List<TechnologyExpertEntity> findAllByUserEntityId(Integer userId);
    List<TechnologyExpertEntity> findAllByUserEntityNot(UserEntity userEntity);
    List<TechnologyExpertEntity> findAllByTechnologyEntityIdAndUserEntityIdNot(Integer technologyId, Integer userId);
    List<TechnologyExpertEntity> findAllByTechnologyEntityTechnologyCategoryEntityIdAndUserEntityIdNot(
        Integer technologyCategoryId, Integer userId
    );
    boolean existsByUserEntityIdAndTechnologyEntityId(Integer userId, Integer technologyId);
}
