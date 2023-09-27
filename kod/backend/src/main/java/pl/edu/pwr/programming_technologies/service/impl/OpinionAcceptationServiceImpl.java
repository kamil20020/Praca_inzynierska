package pl.edu.pwr.programming_technologies.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.types.ObjectId;
import org.springframework.stereotype.Service;
import pl.edu.pwr.programming_technologies.exceptions.EntityNotFoundException;
import pl.edu.pwr.programming_technologies.model.entity.OpinionEntity;
import pl.edu.pwr.programming_technologies.model.entity.UserEntity;
import pl.edu.pwr.programming_technologies.repository.OpinionRepository;
import pl.edu.pwr.programming_technologies.repository.UserRepository;
import pl.edu.pwr.programming_technologies.service.OpinionAcceptationService;
import pl.edu.pwr.programming_technologies.service.OpinionService;

import javax.swing.text.html.parser.Entity;
import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OpinionAcceptationServiceImpl implements OpinionAcceptationService {

    private final OpinionRepository opinionRepository;
    private final UserRepository userRepository;

    @Transactional
    @Override
    public void createAcceptance(ObjectId opinionId, Integer userId, Integer value)
        throws EntityNotFoundException, IllegalArgumentException
    {
        Optional<OpinionEntity> foundOpinionEntityOpt = opinionRepository.findById(opinionId);

        if(foundOpinionEntityOpt.isEmpty()){
            throw new EntityNotFoundException("Nie istnieje opinia o takim id");
        }

        Optional<UserEntity> foundUserEntityOpt = userRepository.findById(userId);

        if(foundUserEntityOpt.isEmpty()){
            throw new EntityNotFoundException("Nie istnieje użytkownik o takim id");
        }

        if(value < -1 || value == 0 || value > 1){
            throw new IllegalArgumentException("Podano akceptację ze złego przedziału");
        }

        OpinionEntity foundOpinionEntity = foundOpinionEntityOpt.get();

        foundOpinionEntity.getAcceptanceList().add(
            new OpinionEntity.Acceptance(userId, value)
        );

        if(value == 1){
            foundOpinionEntity.setPositiveAcceptancesCount(foundOpinionEntity.getPositiveAcceptancesCount() + 1);
        }
        else{
            foundOpinionEntity.setNegativeAcceptancesCount(foundOpinionEntity.getNegativeAcceptancesCount() + 1);
        }

        opinionRepository.save(foundOpinionEntity);
    }

    @Transactional
    @Override
    public void deleteAcceptanceByOpinionIdAndUserId(ObjectId opinionId, Integer userId)
        throws EntityNotFoundException
    {
        Optional<OpinionEntity> foundOpinionEntityOpt = opinionRepository.findById(opinionId);

        if(foundOpinionEntityOpt.isEmpty()){
            throw new EntityNotFoundException("Nie istnieje opinia o takim id");
        }

        Optional<UserEntity> foundUserEntityOpt = userRepository.findById(userId);

        if(foundUserEntityOpt.isEmpty()){
            throw new EntityNotFoundException("Nie istnieje użytkownik o takim id");
        }

        OpinionEntity foundOpinionEntity = foundOpinionEntityOpt.get();

        Integer deletedAcceptanceValue = foundOpinionEntity.getAcceptanceList().stream()
                .filter(acceptance -> acceptance.getAuthorId() == userId)
                .collect(Collectors.toList())
                .get(0).getValue();

        foundOpinionEntityOpt.get().setAcceptanceList(
            foundOpinionEntity.getAcceptanceList().stream()
                .filter(acceptance -> acceptance.getAuthorId() != userId)
                .collect(Collectors.toList())
        );

        if(deletedAcceptanceValue == 1){
            foundOpinionEntity.setPositiveAcceptancesCount(foundOpinionEntity.getPositiveAcceptancesCount() - 1);
        }
        else{
            foundOpinionEntity.setNegativeAcceptancesCount(foundOpinionEntity.getNegativeAcceptancesCount() - 1);
        }

        opinionRepository.save(foundOpinionEntity);
    }
}
