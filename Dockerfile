ARG PROFILE
FROM maven:3.8.4-openjdk-17
WORKDIR /backend
COPY . .
EXPOSE $PORT
CMD mvn spring-boot:run -Dspring.profiles.active=${PROFILE}