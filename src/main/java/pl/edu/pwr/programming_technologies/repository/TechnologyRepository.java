package pl.edu.pwr.programming_technologies.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyEntity;

import java.util.List;

@Repository
public interface TechnologyRepository extends JpaRepository<TechnologyEntity, Integer> {

    List<TechnologyEntity> findAllByTechnologyCategoryEntityId(Integer technologyCategoryId);
}
