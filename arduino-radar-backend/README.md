# Arduino Radar Backend

This is the backend service for the Arduino Radar Dashboard frontend application.

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher

## Getting Started

1. Clone or download this repository
2. Navigate to the project directory
3. Build the project:
   ```
   mvn clean install
   ```

4. Run the application:
   ```
   mvn spring-boot:run
   ```
   
   Or alternatively:
   ```
   java -jar target/arduino-radar-backend-0.0.1-SNAPSHOT.jar
   ```

## API Endpoints

The backend exposes the following REST endpoints:

### Get Distance Data
```
GET /api/radar/distance
```
Returns an array of [DistanceDataPoint](#distancedatapoint) objects for the chart display.

### Get Radar Sweep Data
```
GET /api/radar/sweep
```
Returns a [RadarSweepData](#radarsweepdata) object containing the current sweep angle and detected points.

## Data Models

### DistanceDataPoint
```json
{
  "timestamp": 1634567890123,
  "distance": 123.45
}
```

### RadarPoint
```json
{
  "timestamp": 1634567890123,
  "angle": 45.6,
  "distance": 0.75
}
```

### RadarSweepData
```json
{
  "angle": 123.45,
  "points": [
    {
      "timestamp": 1634567890123,
      "angle": 45.6,
      "distance": 0.75
    }
  ]
}
```

## Integration with Frontend

To connect the frontend to this backend:

1. Make sure both the frontend and backend are running
2. The frontend should make requests to `http://localhost:8080/api/radar/*`
3. Update the frontend code to fetch real data instead of using simulated data

## Configuration

The application runs on port 8080 by default. You can change this in `application.properties`:

```properties
server.port=8080
```