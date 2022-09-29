package pl.edu.pwr.programming_technologies.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.boot.orm.jpa.EntityManagerFactoryBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import javax.persistence.EntityManagerFactory;
import javax.sql.DataSource;

/*@Configuration
@EnableTransactionManagement
@EnableJpaRepositories(
        basePackages = {"pl.edu.pwr.programming_technologies.repository.secondary"},
        entityManagerFactoryRef = "secondaryEntityManagerFactory",
        transactionManagerRef = "secondaryTransactionManager"
)*/
public class SecondaryDatabaseConfig {

    /*@Bean(name = "secondaryDataSource")
    @ConfigurationProperties(prefix="spring.datasource1")
    public DataSource secondaryDataSource() {
        return DataSourceBuilder.create().build();
    }

    @Bean(name = "secondaryEntityManagerFactory")
    public LocalContainerEntityManagerFactoryBean secondaryEntityManagerFactory(
            EntityManagerFactoryBuilder builder,
            @Qualifier("secondaryDataSource") DataSource secondaryDataSource
    ) {
        return builder
                .dataSource(secondaryDataSource)
                .packages("pl.edu.pwr.programming_technologies.repository.secondary")
                .persistenceUnit("secondary")
                .build();
    }

    @Bean(name = "secondaryEntityManagerFactory")
    public PlatformTransactionManager secondaryTransactionManager(
            @Qualifier("secondaryEntityManagerFactory") EntityManagerFactory secondaryEntityManagerFactory
    ) {
        return new JpaTransactionManager(secondaryEntityManagerFactory);
    }*/
}
