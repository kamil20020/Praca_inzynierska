package pl.edu.pwr.programming_technologies.model.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;

import javax.persistence.*;
import java.time.LocalDateTime;

@Builder
@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name="ARTICLE_VERIFICATIONS")
public class ArticleVerificationEntity {

    public enum Status {
        CREATED("Utworzona weryfikacja"),
        ACCEPTED("Zaakceptowany"),
        REJECTED("Odrzucony"),
        EXPIRED("Przedawniona weryfikacja");

        private String value;

        Status(String value){
            this.value = value;
        }

        @Override
        public String toString(){
            return value;
        }
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "article_verification_id")
    private Integer id;

    @Column(name = "article_id", nullable = false, unique = true)
    private String articleId;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private Status status;

    @Column(name = "assignment_date", nullable = false)
    private LocalDateTime assignmentDate;

    @Column(name = "verification_feedback")
    private String verificationFeedback;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "author_id", nullable = false, unique = true)
    private UserEntity userEntity;
}
