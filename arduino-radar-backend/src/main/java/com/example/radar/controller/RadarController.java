package com.example.radar.controller;

import com.example.radar.model.DistanceDataPoint;
import com.example.radar.model.RadarPoint;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allow all origins for development
public class RadarController {

    private final Random random = new Random();

    // Endpoint for distance data over time (for the chart)
    @GetMapping("/radar/distance")
    public List<DistanceDataPoint> getDistanceData() {
        List<DistanceDataPoint> dataPoints = new ArrayList<>();
        long currentTime = System.currentTimeMillis();
        
        // Generate some sample data points for the last 30 seconds
        for (int i = 30; i >= 0; i--) {
            long timestamp = currentTime - (i * 1000);
            double distance = 50 + random.nextDouble() * 200; // Random distance between 50 and 250 cm
            dataPoints.add(new DistanceDataPoint(timestamp, distance));
        }
        
        return dataPoints;
    }

    // Endpoint for radar sweep data (for the radar display)
    @GetMapping("/radar/sweep")
    public RadarSweepData getSweepData() {
        // Generate a random angle between 0 and 360
        double angle = random.nextDouble() * 360;
        
        // Generate some random radar points
        List<RadarPoint> points = new ArrayList<>();
        int pointsCount = random.nextInt(5); // 0 to 4 points
        
        for (int i = 0; i < pointsCount; i++) {
            long timestamp = System.currentTimeMillis() - random.nextInt(5000); // Within last 5 seconds
            double pointAngle = random.nextDouble() * 360;
            double distance = random.nextDouble(); // 0 to 1 ratio
            points.add(new RadarPoint(timestamp, pointAngle, distance));
        }
        
        return new RadarSweepData(angle, points);
    }

    // Data class for radar sweep response
    public static class RadarSweepData {
        private double angle;
        private List<RadarPoint> points;

        public RadarSweepData() {}

        public RadarSweepData(double angle, List<RadarPoint> points) {
            this.angle = angle;
            this.points = points;
        }

        public double getAngle() {
            return angle;
        }

        public void setAngle(double angle) {
            this.angle = angle;
        }

        public List<RadarPoint> getPoints() {
            return points;
        }

        public void setPoints(List<RadarPoint> points) {
            this.points = points;
        }
    }
}