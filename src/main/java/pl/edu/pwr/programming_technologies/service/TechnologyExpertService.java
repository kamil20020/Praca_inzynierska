package pl.edu.pwr.programming_technologies.service;

import pl.edu.pwr.programming_technologies.model.entity.TechnologyEntity;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyExpertEntity;

import java.util.List;

public interface TechnologyExpertService {

    List<TechnologyExpertEntity> getTechnologyExpertEntityListByUserIdAndTechnologyName(
            Integer userId, String technologyName
    );
    List<TechnologyEntity> getTechnologiesWhichUserDoesNotHave(Integer userId);
    List<TechnologyEntity> getTechnologiesByTechnologyCategoryIdWhichUserDoesNotHave(
            Integer userId, Integer technologyCategoryId
    );
    void deleteTechnologyExpertById(Integer technologyExpertId);

    TechnologyExpertEntity createTechnologyExpert(Integer userId, Integer technologyId);
}
