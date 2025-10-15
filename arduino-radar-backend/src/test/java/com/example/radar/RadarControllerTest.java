package com.example.radar;

import com.example.radar.controller.RadarController;
import com.example.radar.model.DistanceDataPoint;
import com.example.radar.model.RadarPoint;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class RadarControllerTest {

    @Test
    void testGetDistanceData() {
        RadarController controller = new RadarController();
        List<DistanceDataPoint> data = controller.getDistanceData();
        
        // Check that we get some data points
        assertNotNull(data);
        assertFalse(data.isEmpty());
        
        // Check that each data point has valid values
        for (DistanceDataPoint point : data) {
            assertTrue(point.getTimestamp() > 0);
            assertTrue(point.getDistance() >= 50 && point.getDistance() <= 250);
        }
    }

    @Test
    void testGetSweepData() {
        RadarController controller = new RadarController();
        RadarController.RadarSweepData sweepData = controller.getSweepData();
        
        // Check that we get valid sweep data
        assertNotNull(sweepData);
        assertTrue(sweepData.getAngle() >= 0 && sweepData.getAngle() <= 360);
        
        // Check that points list is not null
        assertNotNull(sweepData.getPoints());
        
        // Check that each point has valid values
        for (RadarPoint point : sweepData.getPoints()) {
            assertTrue(point.getTimestamp() > 0);
            assertTrue(point.getAngle() >= 0 && point.getAngle() <= 360);
            assertTrue(point.getDistance() >= 0 && point.getDistance() <= 1);
        }
    }
}