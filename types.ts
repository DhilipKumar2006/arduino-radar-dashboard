export interface DistanceDataPoint {
  timestamp: number; // Unix timestamp
  distance: number; // in cm
}

// FIX: Add missing RadarPoint interface to resolve import errors in RadarDisplay.tsx and InfoPanel.tsx.
export interface RadarPoint {
  timestamp: number;
  angle: number;
  distance: number; // as a ratio (0 to 1)
}
