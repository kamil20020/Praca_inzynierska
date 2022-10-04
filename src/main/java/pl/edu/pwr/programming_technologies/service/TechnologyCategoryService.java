package pl.edu.pwr.programming_technologies.service;

import pl.edu.pwr.programming_technologies.model.entity.TechnologyCategoryEntity;

import java.util.List;

public interface TechnologyCategoryService {

    List<TechnologyCategoryEntity> getTreeOfTechnologyCategories();
    TechnologyCategoryEntity getTechnologyCategoryById(Integer technologyCategoryId);
}
