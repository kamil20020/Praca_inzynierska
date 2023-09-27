package pl.edu.pwr.programming_technologies.mapper;

import org.bson.types.ObjectId;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;
import pl.edu.pwr.programming_technologies.model.dto.ArticleDTO;
import pl.edu.pwr.programming_technologies.model.entity.ArticleEntity;
import pl.edu.pwr.programming_technologies.repository.ArticleRepository;
import pl.edu.pwr.programming_technologies.repository.TechnologyRepository;
import pl.edu.pwr.programming_technologies.repository.UserRepository;
import java.util.List;
import java.util.Optional;

@Mapper(uses = {DateTimeMapper.class, UserMapper.class, TechnologyMapper.class, MongoObjectIDMapper.class})
public interface ArticleMapper {

    ArticleMapper INSTANCE = Mappers.getMapper(ArticleMapper.class);

    @Named("articleIdToArticleDTO")
    default ArticleDTO articleIdToArticleDTO(
            String articleId,
            @Context ArticleRepository articleRepository,
            @Context UserRepository userRepository,
            @Context TechnologyRepository technologyRepository
    ){
        if(!ObjectId.isValid(articleId)) {
            return null;
        }

        Optional<ArticleEntity> foundArticleEntity = articleRepository.findById(new ObjectId(articleId));

        if(foundArticleEntity.isEmpty()){
            return null;
        }

        return articleEntityToArticleDTO(foundArticleEntity.get(), userRepository, technologyRepository);
    }

    @Mapping(source = "id", target = "id", qualifiedByName = "objectIdToHexString")
    @Mapping(
            source = "creationDate",
            target = "creationDate",
            qualifiedByName = "localDateTimeToOffsetDateTime"
    )
    @Mapping(
            source = "modificationDate",
            target = "modificationDate",
            qualifiedByName = "localDateTimeToOffsetDateTime"
    )
    @Mapping(source = "authorId", target = "authorDTO", qualifiedByName = "userIdToUserDTO")
    @Mapping(
            source = "technologyId",
            target = "technologyDTO",
            qualifiedByName = "technologyIdToTechnologyDTO"
    )
    @Mapping(source = "status", target = "status")
    @Mapping(source = "averageRating", target = "averageRating", ignore = true)
    ArticleDTO articleEntityToArticleDTO(
            ArticleEntity articleEntity,
            @Context UserRepository userRepository,
            @Context TechnologyRepository technologyRepository
    );

    List<ArticleDTO> articleEntityListToArticleDTOList(
            List<ArticleEntity> articleEntityList,
            @Context UserRepository userRepository,
            @Context TechnologyRepository technologyRepository
    );

    default String articleStatusToString(ArticleEntity.Status articleStatus){
        return articleStatus.toString();
    }
}
