package pl.edu.pwr.programming_technologies.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import pl.edu.pwr.programming_technologies.model.entity.OpinionEntity;

public interface OpinionRepository extends MongoRepository <OpinionEntity, String> {

}
