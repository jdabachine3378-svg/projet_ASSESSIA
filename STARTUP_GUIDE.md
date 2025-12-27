# AssessAI - Startup Guide

## Services Startup Order

1. **Eureka Server** (Port 8761)
   ```bash
   cd "eureka-server (2)/eureka-server"
   mvn spring-boot:run
   ```

2. **Gateway** (Port 8081)
   ```bash
   cd "gateway (2)/gateway"
   mvn spring-boot:run
   ```

3. **OCR Service** (Port 8082)
   ```bash
   cd "ocr-service/ocr-service"
   mvn spring-boot:run
   ```

4. **NLP Service** (Port 8083)
   ```bash
   cd "nlp-service/nlp-service"
   mvn spring-boot:run
   ```

5. **Scoring Service** (Port 8084)
   ```bash
   cd "SCORING-SERVICE/SCORING-SERVICE"
   mvn spring-boot:run
   ```

6. **Frontend React** (Port 3000)
   ```bash
   cd assessai-frontend
   npm start
   ```

## Service URLs

- **Eureka Dashboard**: http://localhost:8761
- **Gateway**: http://localhost:8081
- **OCR Service Direct**: http://localhost:8082
- **NLP Service Direct**: http://localhost:8083
- **Scoring Service Direct**: http://localhost:8084
- **Frontend**: http://localhost:3000

## API Endpoints (via Gateway)

- **POST** http://localhost:8081/ocr/process (multipart/form-data)
- **GET** http://localhost:8081/ocr/health
- **POST** http://localhost:8081/nlp/analyze (application/json)
- **POST** http://localhost:8081/scoring/evaluate (application/json)

## Verification Steps

1. Check Eureka: http://localhost:8761 - All services should be registered
2. Check Gateway Health: http://localhost:8081/actuator/health
3. Check OCR Health: http://localhost:8081/ocr/health
4. Test Frontend: http://localhost:3000 - Upload a PDF/JPG/PNG file


