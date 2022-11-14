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
@Table(name="USERS")
public class UserEntity {

    public enum Role{
        USER("user"),
        LOGGED_USER("logged_user"),
        ADMIN("administrator"),
        REVIEWER("reviewer");

        private String value;

        Role(String value){
            this.value = value;
        }

        @Override
        public String toString(){
            return value;
        }
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", insertable = false, updatable = false)
    private Integer id;

    @Column(name = "user_account_id", nullable = false, unique = true)
    private String userAccountId;

    @Column(name = "nickname", nullable = false, unique = true)
    private String nickname;

    @Column(name = "firstname", nullable = false)
    private String firstname;

    @Column(name = "surname", nullable = false)
    private String surname;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "avatar")
    private Byte[] avatar;

    @Transient
    @OneToMany(mappedBy = "userEntity", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval=true)
    private List<TechnologyExpertEntity> technologyExpertEntityList;

    @Transient
    @OneToOne(mappedBy = "userEntity", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval=true)
    private UserInaccessibilityEntity userAvailabilityEntity;

    @Transient
    @OneToMany(mappedBy = "userEntity", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval=true)
    private List<ArticleVerificationEntity> assignedArticleEntityList;
}
