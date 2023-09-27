package pl.edu.pwr.programming_technologies.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyCategoryEntity;

import java.util.List;

@Repository
public interface TechnologyCategoryRepository extends JpaRepository<TechnologyCategoryEntity, Integer> {

    List<TechnologyCategoryEntity> getAllByParentTechnologyCategoryEntityIsNull();
}
