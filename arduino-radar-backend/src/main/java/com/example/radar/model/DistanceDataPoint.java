package com.example.radar.model;

public class DistanceDataPoint {
    private long timestamp;
    private double distance;

    public DistanceDataPoint() {}

    public DistanceDataPoint(long timestamp, double distance) {
        this.timestamp = timestamp;
        this.distance = distance;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }
}