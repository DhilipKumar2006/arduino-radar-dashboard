import React, { useState, useEffect, useRef } from 'react';
import type { Chart } from 'chart.js/auto';
import { DistanceDataPoint } from './types';

// Declare Chart to be available on the window object from the CDN script
declare global {
    interface Window {
        Chart: typeof Chart;
    }
}

const App: React.FC = () => {
    const [arduinoConnected, setArduinoConnected] = useState<boolean>(false);
    const [collectingData, setCollectingData] = useState<boolean>(false);
    const [portName, setPortName] = useState<string>('None');
    const [data, setData] = useState<DistanceDataPoint[]>([]);
    const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString());
    const [objectDetected, setObjectDetected] = useState<boolean>(false); // New state for object detection

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartRef = useRef<Chart | null>(null);

    // Clock effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Data collection simulation effect
    useEffect(() => {
        if (!collectingData) {
            return;
        }

        // --- REAL IMPLEMENTATION ---
        // Replace this interval with a real fetch to your /api/radar endpoint
        // For example:
        // const fetchData = async () => {
        //   try {
        //     const response = await fetch('/api/radar');
        //     const newData = await response.json(); // e.g., { distance: 123, angle: 45 }
        //     if (response.ok) {
        //       setData(prevData => [...prevData, { timestamp: Date.now(), distance: newData.distance }]);
        //     }
        //   } catch (error) {
        //     console.error("Failed to fetch data", error);
        //     // Optionally stop collection on error
        //     setCollectingData(false);
        //   }
        // };
        // const dataInterval = setInterval(fetchData, 1000); // Fetch every second

        // --- SIMULATION FOR DEMO ---
        const simulationInterval = setInterval(() => {
            const newDistance = 50 + Math.random() * 200; // Random distance between 50 and 250 cm
            setData(prevData => [...prevData, { timestamp: Date.now(), distance: newDistance }]);
            
            // Simulate object detection (20% chance of detection)
            const isDetected = Math.random() < 0.2;
            setObjectDetected(isDetected);
        }, 1000); // Add a new point every second

        return () => clearInterval(simulationInterval);
    }, [collectingData]);

    // Chart.js effect
    useEffect(() => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        if (chartRef.current) {
            chartRef.current.destroy();
        }

        // Determine chart color based on object detection
        const chartColor = objectDetected ? 'rgb(255, 0, 0)' : 'rgb(75, 192, 192)'; // Red when object detected, teal otherwise
        const chartBgColor = objectDetected ? 'rgba(255, 0, 0, 0.2)' : 'rgba(75, 192, 192, 0.2)';

        chartRef.current = new window.Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map(p => new Date(p.timestamp).toLocaleTimeString()),
                datasets: [{
                    label: 'Distance (cm)',
                    data: data.map(p => p.distance),
                    borderColor: chartColor,
                    backgroundColor: chartBgColor,
                    tension: 0.1,
                    pointRadius: 2,
                    borderWidth: 1,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                  duration: 200 // smooth transitions
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 400,
                        title: {
                            display: true,
                            text: 'Distance (cm)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Arduino Distance Over Time',
                        font: { size: 16 }
                    },
                    legend: {
                      display: false
                    }
                }
            }
        });

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };

    }, [data, objectDetected]); // Added objectDetected to dependency array


    const handleConnect = () => {
        // Simulate connecting to a port
        setArduinoConnected(true);
        setPortName('COM3');
    };

    const handleDisconnect = () => {
        setArduinoConnected(false);
        setCollectingData(false);
        setPortName('None');
    };

    const handleStart = () => {
        if (arduinoConnected) {
            setCollectingData(true);
        }
    };

    const handleStop = () => {
        setCollectingData(false);
    };

    const handleClear = () => {
        setData([]);
        setObjectDetected(false); // Reset object detection when clearing data
    };

    const latestDistance = data.length > 0 ? data[data.length - 1].distance.toFixed(0) : '--';
    const systemStatus = collectingData ? 'Collecting' : (arduinoConnected ? 'Connected' : 'Ready');
    
    return (
        <div className="container mx-auto p-4 font-sans">
            <div className="space-y-4">
                {/* Controls Panel */}
                <div className="p-4 border rounded-md shadow-sm bg-white">
                    <h2 className="text-lg font-semibold border-b pb-2 mb-4">Controls</h2>
                    <div className="flex flex-wrap gap-2">
                        <ControlButton onClick={handleConnect} disabled={arduinoConnected} color="green">Connect Arduino</ControlButton>
                        <ControlButton onClick={handleDisconnect} disabled={!arduinoConnected} color="red">Disconnect Arduino</ControlButton>
                        <ControlButton onClick={handleStart} disabled={!arduinoConnected || collectingData} color="blue">Start Data Collection</ControlButton>
                        <ControlButton onClick={handleStop} disabled={!collectingData} color="red">Stop Data Collection</ControlButton>
                        <ControlButton onClick={handleClear} color="orange">Clear Data</ControlButton>
                    </div>
                </div>

                {/* Live Information Panel */}
                <div className="p-4 border rounded-md shadow-sm bg-white">
                    <h2 className="text-lg font-semibold border-b pb-2 mb-4">Live Information</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
                        <InfoBox title="Arduino" value={arduinoConnected ? 'Connected' : 'Disconnected'} color={arduinoConnected ? 'text-green-600' : 'text-red-600'} />
                        <InfoBox title="Time" value={currentTime} color="text-blue-600" />
                        <InfoBox title="Distance" value={`${latestDistance} cm`} color="text-green-600" />
                        <InfoBox title="Status" value={systemStatus} color="text-blue-600" />
                        <InfoBox title="Data Points" value={data.length.toString()} color="text-purple-600" />
                        <InfoBox title="Port" value={portName} color="text-gray-600" />
                    </div>
                </div>

                {/* Chart Panel */}
                <div className="p-4 border rounded-md shadow-sm bg-white">
                    <div className="relative h-96">
                        <canvas ref={canvasRef}></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Sub-components for styling ---

interface ControlButtonProps {
    onClick: () => void;
    disabled?: boolean;
    color: 'green' | 'red' | 'blue' | 'orange';
    children: React.ReactNode;
}

const ControlButton: React.FC<ControlButtonProps> = ({ onClick, disabled = false, color, children }) => {
    const colorClasses = {
        green: 'bg-green-500 hover:bg-green-600',
        red: 'bg-red-500 hover:bg-red-600',
        blue: 'bg-blue-500 hover:bg-blue-600',
        orange: 'bg-orange-500 hover:bg-orange-600',
    };
    const baseClasses = 'text-white font-bold py-2 px-4 rounded transition-colors duration-200';
    const disabledClasses = 'disabled:bg-gray-400 disabled:cursor-not-allowed';

    return (
        <button onClick={onClick} disabled={disabled} className={`${baseClasses} ${colorClasses[color]} ${disabledClasses}`}>
            {children}
        </button>
    );
}

interface InfoBoxProps {
    title: string;
    value: string;
    color?: string;
}

const InfoBox: React.FC<InfoBoxProps> = ({ title, value, color = 'text-black' }) => (
    <div className="p-2 bg-gray-50 rounded">
        <p className="text-sm text-gray-500">{title}</p>
        <p className={`text-xl font-semibold ${color}`}>{value}</p>
    </div>
);

export default App;