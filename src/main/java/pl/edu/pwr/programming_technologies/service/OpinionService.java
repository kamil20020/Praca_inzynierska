package pl.edu.pwr.programming_technologies.service;

import org.bson.types.ObjectId;
import pl.edu.pwr.programming_technologies.model.api.request.UpdateOpinion;
import pl.edu.pwr.programming_technologies.model.entity.OpinionEntity;

import java.util.List;

public interface OpinionService {

    boolean existsByUserId(Integer userId);
    Integer getUserAcceptance(ObjectId opinionId, Integer useId);
    List<OpinionEntity> getByArticleId(ObjectId id);
    OpinionEntity createOpinion(OpinionEntity opinionEntity);
    OpinionEntity updateOpinionById(ObjectId id, UpdateOpinion updateOpinion);
    void deleteById(ObjectId id);
}
