import React, { useEffect, useRef } from 'react';

const LineChartComponent: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size to match its display size
    const devicePixelRatio = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * devicePixelRatio;
    canvas.height = rect.height * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);
    
    // Reset canvas transform and clear
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Data for the line chart
    const safeData = [12, 19, 15, 17, 22, 24, 18];
    const phishingData = [5, 8, 10, 14, 18, 24, 29];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Set dimensions
    const chartWidth = rect.width - 60;
    const chartHeight = rect.height - 60;
    const startX = 50;
    const startY = 20;
    const maxValue = Math.max(...safeData, ...phishingData) * 1.2;
    
    // Helper function to convert data point to coordinates
    const getCoordinates = (value: number, index: number) => {
      const x = startX + (index / (labels.length - 1)) * chartWidth;
      const y = startY + chartHeight - (value / maxValue) * chartHeight;
      return { x, y };
    };
    
    // Draw grid lines
    for (let i = 0; i <= 5; i++) {
      const y = startY + chartHeight - (i / 5) * chartHeight;
      const value = Math.round((i / 5) * maxValue);
      
      // Grid line
      ctx.beginPath();
      ctx.moveTo(startX - 10, y);
      ctx.lineTo(startX + chartWidth, y);
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      
      // Label
      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = '#9CA3AF';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.fillText(value.toString(), startX - 14, y);
    }
    
    // Draw x-axis labels
    labels.forEach((label, index) => {
      const x = startX + (index / (labels.length - 1)) * chartWidth;
      
      // Vertical grid line
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, startY + chartHeight);
      ctx.strokeStyle = '#374151';
      ctx.lineWidth = 0.5;
      ctx.stroke();
      
      // Label
      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = '#9CA3AF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(label, x, startY + chartHeight + 8);
    });
    
    // Function to draw a line
    const drawLine = (data: number[], color: string, fillColor: string) => {
      // Draw line
      ctx.beginPath();
      data.forEach((value, index) => {
        const { x, y } = getCoordinates(value, index);
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // Draw area under the line
      ctx.beginPath();
      data.forEach((value, index) => {
        const { x, y } = getCoordinates(value, index);
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.lineTo(startX + chartWidth, startY + chartHeight);
      ctx.lineTo(startX, startY + chartHeight);
      ctx.closePath();
      ctx.fillStyle = fillColor;
      ctx.fill();
      
      // Draw points
      data.forEach((value, index) => {
        const { x, y } = getCoordinates(value, index);
        
        // Outer circle
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        
        // Inner circle
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, 2 * Math.PI);
        ctx.fillStyle = '#1F2937';
        ctx.fill();
      });
    };
    
    // Draw safe links line
    drawLine(safeData, '#10B981', 'rgba(16, 185, 129, 0.1)');
    
    // Draw phishing links line
    drawLine(phishingData, '#EF4444', 'rgba(239, 68, 68, 0.1)');
    
    // Draw legend
    const legendY = rect.height - 20;
    
    // Safe legend
    ctx.beginPath();
    ctx.arc(startX + 10, legendY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#10B981';
    ctx.fill();
    
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#D1D5DB';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Safe Links', startX + 20, legendY);
    
    // Phishing legend
    ctx.beginPath();
    ctx.arc(startX + 110, legendY, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#EF4444';
    ctx.fill();
    
    ctx.font = '12px Inter, sans-serif';
    ctx.fillStyle = '#D1D5DB';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('Phishing Links', startX + 120, legendY);
    
  }, []);
  
  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default LineChartComponent;