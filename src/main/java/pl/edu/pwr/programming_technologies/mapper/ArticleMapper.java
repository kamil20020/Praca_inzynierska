package pl.edu.pwr.programming_technologies.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import pl.edu.pwr.programming_technologies.model.dto.ArticleDTO;
import pl.edu.pwr.programming_technologies.model.dto.SimpleArticleDTO;
import pl.edu.pwr.programming_technologies.model.entity.ArticleEntity;
import pl.edu.pwr.programming_technologies.repository.TechnologyRepository;
import pl.edu.pwr.programming_technologies.repository.UserRepository;
import java.util.List;

@Mapper(uses = {DateTimeMapper.class, UserMapper.class, TechnologyMapper.class, MongoObjectIDMapper.class})
public interface ArticleMapper {

    ArticleMapper INSTANCE = Mappers.getMapper(ArticleMapper.class);

    @Mapping(source = "_id", target = "id", qualifiedByName = "objectIdToHexString")
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

    @Mapping(
            source = "creationDate",
            target = "creationDate",
            qualifiedByName = "offsetDateTimeToLocalDateTime"
    )
    @Mapping(
            source = "modificationDate",
            target = "modificationDate",
            qualifiedByName = "offsetDateTimeToLocalDateTime"
    )
    ArticleEntity simpleArticleDTOToArticleEntity(SimpleArticleDTO simpleArticleDTO);
}
