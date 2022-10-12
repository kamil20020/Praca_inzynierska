package pl.edu.pwr.programming_technologies.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyEntity;
import pl.edu.pwr.programming_technologies.repository.TechnologyCategoryRepository;
import pl.edu.pwr.programming_technologies.repository.TechnologyRepository;
import pl.edu.pwr.programming_technologies.repository.UserRepository;
import pl.edu.pwr.programming_technologies.service.TechnologyService;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class TechnologyServiceImpl implements TechnologyService {

    private final TechnologyRepository technologyRepository;
    private final TechnologyCategoryRepository technologyCategoryRepository;

    @Override
    public List<TechnologyEntity> getAll() {
        return technologyRepository.findAll();
    }

    @Override
    public List<TechnologyEntity> getAllByTechnologyCategoryId(Integer technologyCategoryId)
            throws EntityNotFoundException
    {
        if(!technologyCategoryRepository.existsById(technologyCategoryId)){
            throw new EntityNotFoundException("Nie istnieje kategoria technologii o takim id");
        }

        return technologyRepository.findAllByTechnologyCategoryEntityId(technologyCategoryId);
    }
}
