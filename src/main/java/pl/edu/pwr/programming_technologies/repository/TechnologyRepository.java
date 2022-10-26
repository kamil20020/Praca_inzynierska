package pl.edu.pwr.programming_technologies.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyCategoryEntity;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyEntity;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public interface TechnologyRepository extends JpaRepository<TechnologyEntity, Integer> {

    List<TechnologyEntity> findAllByTechnologyCategoryEntityId(Integer technologyCategoryId);
    List<TechnologyEntity> findAllByProviderContainsIgnoreCase(String provider);

    default List<TechnologyEntity> findAllHavingTechnologyCategoryIdInTree(Integer technologyCategoryId){
        return findAll()
            .stream()
            .filter(t -> {
                Optional<TechnologyCategoryEntity> opt = Optional.ofNullable(t.getTechnologyCategoryEntity());
                while(opt.isPresent()) {
                    if(opt.get().getId() == technologyCategoryId){
                        return true;
                    }
                    opt = Optional.ofNullable(opt.get().getParentTechnologyCategoryEntity());
                }
                return false;
            })
            .collect(Collectors.toList());
    }
}
