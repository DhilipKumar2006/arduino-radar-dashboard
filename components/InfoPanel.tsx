
import React from 'react';
import { RadarPoint } from '../types';

interface InfoPanelProps {
  sweepAngle: number;
  pointsCount: number;
  latestDetection: RadarPoint | null;
}

const InfoCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="border border-green-600 bg-green-500 bg-opacity-10 p-4 rounded">
    <h3 className="text-lg text-green-300 border-b border-green-600 pb-1 mb-2">{title}</h3>
    <div className="text-xl">{children}</div>
  </div>
);

const InfoPanel: React.FC<InfoPanelProps> = ({ sweepAngle, pointsCount, latestDetection }) => {
  return (
    <div className="flex flex-col space-y-4 h-full">
      <InfoCard title="SYSTEM LOG">
        <p className="text-base h-40 overflow-y-auto pr-2">
            [SYS] Initializing scanner...<br/>
            [SYS] Core systems nominal.<br/>
            [API] Simulation mode active.<br/>
            [SCAN] Sweep initiated.<br/>
            {latestDetection && `[DETECT] Object at ${latestDetection.angle.toFixed(0)}° / ${(latestDetection.distance * 100).toFixed(0)}%`}<br/>
            <span className="animate-pulse">_</span>
        </p>
      </InfoCard>

      <InfoCard title="SWEEP ANGLE">
        <p>{sweepAngle.toString().padStart(3, '0')}&deg;</p>
      </InfoCard>

      <InfoCard title="OBJECTS DETECTED">
        <p>{pointsCount}</p>
      </InfoCard>

      <InfoCard title="LATEST DETECTION">
        {latestDetection ? (
          <div>
            <p>Angle: {latestDetection.angle.toFixed(1)}&deg;</p>
            <p>Distance: {(latestDetection.distance * 100).toFixed(1)}%</p>
          </div>
        ) : (
          <p>None</p>
        )}
      </InfoCard>
      
      <div className="border border-green-600 bg-green-500 bg-opacity-10 p-4 rounded text-sm text-green-300">
        <h3 className="text-lg border-b border-green-600 pb-1 mb-2">Backend Connection</h3>
        <p>This frontend simulates sensor data. To connect to your Spring Boot backend:</p>
        <ol className="list-decimal list-inside mt-2">
          <li>Use `useEffect` in `App.tsx`.</li>
          <li>Fetch data from `/api/radar`.</li>
          <li>Update state with `setPoints` and `setAngle` from the fetched data.</li>
        </ol>
      </div>
    </div>
  );
};

export default InfoPanel;
