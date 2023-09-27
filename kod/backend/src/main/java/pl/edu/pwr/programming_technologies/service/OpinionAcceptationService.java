package pl.edu.pwr.programming_technologies.service;

import org.bson.types.ObjectId;

public interface OpinionAcceptationService {

    void createAcceptance(ObjectId opinionId, Integer userId, Integer value);
    void deleteAcceptanceByOpinionIdAndUserId(ObjectId opinionId, Integer userId);
}
