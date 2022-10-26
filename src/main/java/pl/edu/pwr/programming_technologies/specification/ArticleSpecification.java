package pl.edu.pwr.programming_technologies.specification;

import org.springframework.data.jpa.domain.Specification;
import pl.edu.pwr.programming_technologies.model.entity.ArticleEntity;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Root;
import javax.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ArticleSpecification {

    /*private Specification<ArticleEntity> titleLike(String title){
        return (root, query, criteriaBuilder) ->
            criteriaBuilder.like(
                criteriaBuilder.upper(root.get("title")), "%" + title.toUpperCase() + "%"
            );
    }

    private Specification<ArticleEntity> authorNickname(String authorNickname){
        return (root, query, criteriaBuilder) ->
            criteriaBuilder.equal(
                root.get("authorNickname"), authorNickname
            );
    }

    private Specification<ArticleEntity> technologyCategoryId(Integer technologyCategoryId){
        return (root, query, criteriaBuilder) ->
            criteriaBuilder.equal(
                root.get("technologyId"), technologyCategoryId
            );
    }

    private Specification<ArticleEntity> technologyId(Integer technologyId){
        return (root, query, criteriaBuilder) ->
            criteriaBuilder.equal(
                root.get("technologyId"), technologyId
            );
    }

    private Specification<ArticleEntity> technologySupplierLike(String technologySupplier){
        return (root, query, criteriaBuilder) ->
            criteriaBuilder.like(
                criteriaBuilder.upper(root.get("title")), "%" + technologySupplier.toUpperCase() + "%"
            );
    }

    private Specification<ArticleEntity> creationDate(LocalDateTime fromCreationDate, LocalDateTime toCreationDate){
        return (root, query, criteriaBuilder) -> {

            List<Predicate> predicates = new ArrayList<>();

            if(fromCreationDate != null){
                predicates.add(
                    criteriaBuilder.greaterThanOrEqualTo(
                        root.get("creationDate"), fromCreationDate
                    )
                );
            }

            if(toCreationDate != null){
                predicates.add(
                    criteriaBuilder.lessThanOrEqualTo(
                        root.get("creationDate"), toCreationDate
                    )
                );
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    private Specification<ArticleEntity> modificationDate(
            LocalDateTime fromModificationDate, LocalDateTime toModificationDate
    ){
        return (root, query, criteriaBuilder) -> {

            List<Predicate> predicates = new ArrayList<>();

            if(fromModificationDate != null){
                predicates.add(
                    criteriaBuilder.greaterThanOrEqualTo(
                        root.get("modificationDate"), fromModificationDate
                    )
                );
            }

            if(toModificationDate != null){
                predicates.add(
                    criteriaBuilder.lessThanOrEqualTo(
                        root.get("modificationDate"), toModificationDate
                    )
                );
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }*/
}
