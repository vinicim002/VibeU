# =============================================================================
# Build context: raiz do repositório (docker compose build)
# =============================================================================

# Stage 1: Build
FROM eclipse-temurin:21-jdk-alpine AS build

WORKDIR /app

COPY backend/mvnw backend/mvnw
COPY backend/.mvn backend/.mvn
COPY backend/pom.xml backend/pom.xml
RUN chmod +x backend/mvnw

COPY backend/src backend/src
COPY database/migrations database/migrations

WORKDIR /app/backend

RUN ./mvnw package -DskipTests -B

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine AS runtime

RUN apk add --no-cache wget && \
    addgroup -S vibeu && adduser -S vibeu -G vibeu

WORKDIR /app

COPY --from=build /app/backend/target/*.jar app.jar

RUN chown -R vibeu:vibeu /app
USER vibeu

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
