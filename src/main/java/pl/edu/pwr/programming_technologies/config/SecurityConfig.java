package pl.edu.pwr.programming_technologies.config;

import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.BeanIds;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
public class SecurityConfig {

    private JwtAuthenticationConverter jwtAuthenticationConverter() {
        Converter<Jwt, Collection<GrantedAuthority>> jwtGrantedAuthoritiesConverter = jwt -> {
            Map<String, Collection<String>> realmAccess = jwt.getClaim("realm_access");
            Collection<String> roles = realmAccess.get("roles");
            return roles.stream()
                    .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                    .collect(Collectors.toList());
        };

        var jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(jwtGrantedAuthoritiesConverter);

        return jwtAuthenticationConverter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000", "https://technologie-programistyczne.azurewebsites.net")
        );
        configuration.setAllowedMethods(Collections.singletonList("*"));
        configuration.setAllowedHeaders(Collections.singletonList("*"));

        http.csrf().disable().cors().configurationSource(request -> configuration);
        http.authorizeRequests(authz -> authz
                .antMatchers(HttpMethod.GET, "/user/**")
                .permitAll()
                .antMatchers(HttpMethod.POST, "/user")
                .permitAll()
                .antMatchers(HttpMethod.PUT, "/user/*")
                .hasRole("logged_user")

                .antMatchers(HttpMethod.GET, "/comment/**")
                .permitAll()
                .antMatchers(HttpMethod.POST, "/comment")
                .hasRole("logged_user")
                .antMatchers(HttpMethod.PUT, "/comment/*")
                .hasRole("logged_user")
                .antMatchers(HttpMethod.DELETE, "/comment/*")
                .hasRole("logged_user")
                
                .antMatchers(HttpMethod.GET, "/opinions/**")
                .permitAll()
                
                .antMatchers(HttpMethod.GET, "/article/**")
                .permitAll()
                .antMatchers(HttpMethod.POST, "/article/search")
                .permitAll()
                .antMatchers(HttpMethod.POST, "/article")
                .hasRole("logged_user")
                .antMatchers(HttpMethod.PUT, "/article/*")
                .hasRole("logged_user")
                .antMatchers(HttpMethod.DELETE, "/article/*")
                .hasRole("logged_user")

                .antMatchers(HttpMethod.GET, "/article-verification/*")
                .hasRole("logged_user")
                .antMatchers(HttpMethod.PUT, "/article-verification/**")
                .hasRole("reviewer")
                .antMatchers(HttpMethod.GET, "/article-verification/to/**")
                .hasRole("reviewer")

                .antMatchers("/user-inaccessibility/**")
                .hasRole("reviewer")

                .antMatchers(HttpMethod.GET, "/technology/**")
                .permitAll()

                .antMatchers(HttpMethod.GET, "/technology-category/**")
                .permitAll()

                .anyRequest()
                .authenticated())
            .oauth2ResourceServer()
                .jwt()
                .jwtAuthenticationConverter(jwtAuthenticationConverter());
        return http.build();
    }
}