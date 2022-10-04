package pl.edu.pwr.programming_technologies.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyCategoryEntity;
import pl.edu.pwr.programming_technologies.repository.TechnologyCategoryRepository;
import pl.edu.pwr.programming_technologies.service.TechnologyCategoryService;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TechnologyCategoryServiceImpl implements TechnologyCategoryService {

    private final TechnologyCategoryRepository technologyCategoryRepository;

    @Override
    public List<TechnologyCategoryEntity> getTreeOfTechnologyCategories() {
        return technologyCategoryRepository.getAllByParentTechnologyCategoryEntityIsNull();
    }

    @Override
    public TechnologyCategoryEntity getTechnologyCategoryById(Integer technologyCategoryId)
            throws EntityNotFoundException
    {

        return null;
    }
}
