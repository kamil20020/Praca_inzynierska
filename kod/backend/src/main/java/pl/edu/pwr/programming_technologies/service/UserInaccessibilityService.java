package pl.edu.pwr.programming_technologies.service;

import pl.edu.pwr.programming_technologies.model.api.request.CreateUserInaccessibility;
import pl.edu.pwr.programming_technologies.model.entity.UserInaccessibilityEntity;

import java.time.LocalDateTime;

public interface UserInaccessibilityService {

    UserInaccessibilityEntity getUserInaccessibilityByUserId(Integer userId);
    UserInaccessibilityEntity createUserInaccessibility(Integer userId, LocalDateTime toDate);
    void updateReviewersInaccessibility();
    void deleteUserInaccessibilityById(Integer userInaccessibilityId);
}
