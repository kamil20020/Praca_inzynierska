FROM quay.io/keycloak/keycloak:latest as builder

WORKDIR /opt/keycloak

# Enable health and metrics support
ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true

ENV KEYCLOAK_ADMIN=admin
ENV KEYCLOAK_ADMIN_PASSWORD=admin
 
ENV KC_DB=postgres
ENV KC_DB_URL=jdbc:postgresql://postgresdb/programming_technologies
ENV KC_DB_USERNAME=programming_technologies
ENV KC_DB_PASSWORD=postgres
ENV KC_HOSTNAME=localhost

EXPOSE 8080

ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev", "--import-realm"]