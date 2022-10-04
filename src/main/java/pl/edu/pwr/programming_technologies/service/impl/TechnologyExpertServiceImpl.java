package pl.edu.pwr.programming_technologies.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import pl.edu.pwr.programming_technologies.exceptions.EntityConflictException;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyEntity;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyExpertEntity;
import pl.edu.pwr.programming_technologies.model.entity.UserEntity;
import pl.edu.pwr.programming_technologies.repository.TechnologyCategoryRepository;
import pl.edu.pwr.programming_technologies.repository.TechnologyExpertRepository;
import pl.edu.pwr.programming_technologies.repository.TechnologyRepository;
import pl.edu.pwr.programming_technologies.repository.UserRepository;
import pl.edu.pwr.programming_technologies.service.TechnologyExpertService;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TechnologyExpertServiceImpl implements TechnologyExpertService {

    private final TechnologyExpertRepository technologyExpertRepository;
    private final TechnologyRepository technologyRepository;
    private final TechnologyCategoryRepository technologyCategoryRepository;
    private final UserRepository userRepository;

    @Override
    public List<TechnologyExpertEntity> getTechnologyExpertEntityListByUserIdAndTechnologyName(
            Integer userId, String technologyName
    ) throws EntityNotFoundException
    {
        if(!userRepository.existsById(userId)){
            throw new EntityNotFoundException("Nie istnieje użytkownik o takim id");
        }

        return technologyExpertRepository.findAllByUserEntityIdAndTechnologyEntityNameContainsIgnoreCase(
                userId, technologyName
        );
    }

    private List<TechnologyEntity> getTechnologiesWhichUserHave(Integer userId) {

       return getTechnologyExpertEntityListByUserIdAndTechnologyName(
                userId, ""
        ).stream()
                .map(TechnologyExpertEntity::getTechnologyEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<TechnologyEntity> getTechnologiesWhichUserDoesNotHave(Integer userId) throws EntityNotFoundException {

        if(!userRepository.existsById(userId)){
            throw new EntityNotFoundException("Nie istnieje użytkownik o takim id");
        }

        List<TechnologyEntity> foundTechnologyEntityList = technologyRepository.findAll();
        List<TechnologyEntity> userTechnologyEntityList = getTechnologiesWhichUserHave(userId);

        return foundTechnologyEntityList.stream()
                .filter(t -> !userTechnologyEntityList.contains(t))
                .collect(Collectors.toList());
    }

    @Override
    public List<TechnologyEntity> getTechnologiesByTechnologyCategoryIdWhichUserDoesNotHave(
            Integer userId, Integer technologyCategoryId
    ) throws EntityNotFoundException
    {
        if(!userRepository.existsById(userId)){
            throw new EntityNotFoundException("Nie istnieje użytkownik o takim id");
        }

        if(!technologyCategoryRepository.existsById(technologyCategoryId)){
            throw new EntityNotFoundException("Nie istnieje kategoria technologii o takim id");
        }

        List<TechnologyEntity> foundByTechnologyCategoryIdTechnologyEntityList
                = technologyRepository.findAllByTechnologyCategoryEntityId(technologyCategoryId);

        List<TechnologyEntity> userTechnologyEntityList = getTechnologiesWhichUserHave(userId);

        return foundByTechnologyCategoryIdTechnologyEntityList.stream()
            .filter(t -> !userTechnologyEntityList.contains(t))
            .collect(Collectors.toList());
    }

    @Override
    public TechnologyExpertEntity createTechnologyExpert(Integer userId, Integer technologyId)
            throws EntityNotFoundException, EntityConflictException
    {
        Optional<UserEntity> userEntityOpt = userRepository.findById(userId);

        if(userEntityOpt.isEmpty()){
            throw new EntityNotFoundException("Nie istnieje użytkownik o takim id");
        }

        Optional<TechnologyEntity> technologyEntityOpt = technologyRepository.findById(technologyId);

        if(technologyEntityOpt.isEmpty()){
            throw new EntityNotFoundException("Nie istnieje technologia o takim id");
        }

        if(technologyExpertRepository.existsByUserEntityIdAndTechnologyEntityId(userId, technologyId)){
            throw new EntityConflictException("Istnieje już takie przypisanie technologii");
        }

        TechnologyExpertEntity newTechnologyExpert = new TechnologyExpertEntity(
            null,
            technologyEntityOpt.get(),
            userEntityOpt.get()
        );

        return technologyExpertRepository.save(newTechnologyExpert);
    }

    @Override
    public void deleteTechnologyExpertById(Integer technologyExpertId) throws EntityNotFoundException {

        if(!technologyExpertRepository.existsById(technologyExpertId)){
            throw new EntityNotFoundException("Nie istnieje przypisanie technologii o takim id");
        }

        technologyExpertRepository.deleteById(technologyExpertId);
    }
}
