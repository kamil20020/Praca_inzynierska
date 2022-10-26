package pl.edu.pwr.programming_technologies.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.factory.Mappers;
import pl.edu.pwr.programming_technologies.model.api.request.ArticleSearchCriteria;
import pl.edu.pwr.programming_technologies.model.dto.ArticleSearchCriteriaDTO;

@Mapper(uses = {DateTimeMapper.class})
public interface SearchCriteriaMapper {

    SearchCriteriaMapper INSTANCE = Mappers.getMapper(SearchCriteriaMapper.class);

    @Mapping(
            source = "fromCreationDate",
            target = "fromCreationDate",
            qualifiedByName = "offsetDateTimeToLocalDateTime"
    )
    @Mapping(
            source = "toCreationDate",
            target = "toCreationDate",
            qualifiedByName = "offsetDateTimeToLocalDateTime"
    )
    @Mapping(
            source = "fromModificationDate",
            target = "fromModificationDate",
            qualifiedByName = "offsetDateTimeToLocalDateTime"
    )
    @Mapping(
            source = "toModificationDate",
            target = "toModificationDate",
            qualifiedByName = "offsetDateTimeToLocalDateTime"
    )
    ArticleSearchCriteria articleSearchCriteriaDTOToArticleSearchCriteria(
        ArticleSearchCriteriaDTO articleSearchCriteriaDTO
    );
}
