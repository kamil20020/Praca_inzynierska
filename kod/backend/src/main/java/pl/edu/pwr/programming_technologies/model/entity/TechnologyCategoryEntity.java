package pl.edu.pwr.programming_technologies.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;

@Builder
@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name="TECHNOLOGY_CATEGORIES")
public class TechnologyCategoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "technology_category_id")
    private Integer id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="parent_technology_category_id")
    private TechnologyCategoryEntity parentTechnologyCategoryEntity;

    @OneToMany(mappedBy = "parentTechnologyCategoryEntity", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval=true)
    private List<TechnologyCategoryEntity> childrenTechnologyCategoryEntityList;

    @Transient
    @OneToMany(mappedBy="technologyCategoryEntity", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval=true)
    private List<TechnologyEntity> technologyEntityList;
}
