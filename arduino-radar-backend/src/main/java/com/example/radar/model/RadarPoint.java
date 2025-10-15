package com.example.radar.model;

public class RadarPoint {
    private long timestamp;
    private double angle;
    private double distance; // as a ratio (0 to 1)

    public RadarPoint() {}

    public RadarPoint(long timestamp, double angle, double distance) {
        this.timestamp = timestamp;
        this.angle = angle;
        this.distance = distance;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public double getAngle() {
        return angle;
    }

    public void setAngle(double angle) {
        this.angle = angle;
    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }
}