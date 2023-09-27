package pl.edu.pwr.programming_technologies.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import pl.edu.pwr.programming_technologies.model.dto.ArticleVerificationDTO;
import pl.edu.pwr.programming_technologies.model.entity.ArticleEntity;
import pl.edu.pwr.programming_technologies.model.entity.ArticleVerificationEntity;
import pl.edu.pwr.programming_technologies.repository.ArticleRepository;
import pl.edu.pwr.programming_technologies.repository.TechnologyRepository;
import pl.edu.pwr.programming_technologies.repository.UserRepository;

@Mapper(uses = {DateTimeMapper.class, ArticleMapper.class})
public interface ArticleVerificationMapper {

    ArticleVerificationMapper INSTANCE = Mappers.getMapper(ArticleVerificationMapper.class);

    @Mapping(source = "assignmentDate", target = "assignmentDate", qualifiedByName = "localDateTimeToOffsetDateTime")
    @Mapping(source = "articleId", target = "articleDTO", qualifiedByName = "articleIdToArticleDTO")
    @Mapping(source = "status", target = "status")
    ArticleVerificationDTO articleVerificationEntityToArticleVerificationDTO(
        ArticleVerificationEntity assignedArticleEntity,
        @Context ArticleRepository articleRepository,
        @Context UserRepository userRepository,
        @Context TechnologyRepository technologyRepository
    );

    default String articleVerificationStatus(ArticleVerificationEntity.Status articleVerificationStatus){
        return articleVerificationStatus.toString();
    }
}
