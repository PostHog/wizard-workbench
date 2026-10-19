# syntax=docker/dockerfile:1

FROM eclipse-temurin:17-jdk AS build
WORKDIR /workspace

COPY gradlew settings.gradle.kts build.gradle.kts ./
COPY gradle gradle
RUN ./gradlew --no-daemon dependencies > /dev/null

COPY src src
RUN ./gradlew --no-daemon bootJar \
    && cp build/libs/*.jar app.jar

FROM eclipse-temurin:17-jre
WORKDIR /app

RUN groupadd --system app && useradd --system --gid app app
USER app

COPY --from=build /workspace/app.jar app.jar

ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75"
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
