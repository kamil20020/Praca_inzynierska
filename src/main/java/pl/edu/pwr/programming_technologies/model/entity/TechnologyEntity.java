package pl.edu.pwr.programming_technologies.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Builder
@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name="TECHNOLOGIES")
public class TechnologyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "technology_id")
    private Integer id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "creation_date_time", nullable = false)
    private LocalDateTime creationDateTime;

    @Column(name = "modification_date_time", nullable = false)
    private LocalDateTime modificationDateTime;

    @Column(name = "provider")
    private String provider;

    @Column(name = "icon")
    private Byte[] icon;

    @Column(name = "first_release_date_time")
    private LocalDateTime firstReleaseDateTime;

    @Column(name = "last_release_date_time")
    private LocalDateTime lastReleaseDateTime;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "technology_category_id")
    private TechnologyCategoryEntity technologyCategoryEntity;
}
