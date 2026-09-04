# ================================
# Stage 1: Build Spring Boot App
# ================================

FROM eclipse-temurin:17-jdk-jammy AS builder

WORKDIR /app

# Copy Maven wrapper and project configuration
COPY .mvn/ .mvn
COPY mvnw pom.xml ./

# Make Maven wrapper executable
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy application source
COPY src ./src

# Build Spring Boot application
RUN ./mvnw clean package -DskipTests


# ================================
# Stage 2: Run Spring Boot App
# ================================

FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

# Copy generated JAR from build stage
COPY --from=builder /app/target/*.jar app.jar

# Application port
EXPOSE 8080

# Start Spring Boot application
ENTRYPOINT ["java", "-jar", "app.jar"]