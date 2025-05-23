import React, { useEffect, useRef } from 'react';

const BarChartComponent: React.FC = () => {
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
    
    // Data for the bar chart
    const data = [
      { label: 'account', value: 76 },
      { label: 'verify', value: 68 },
      { label: 'login', value: 62 },
      { label: 'bank', value: 54 },
      { label: 'secure', value: 48 },
      { label: 'update', value: 42 },
    ];
    
    // Set dimensions
    const chartWidth = rect.width - 60;
    const chartHeight = rect.height - 60;
    const barSpacing = chartWidth / data.length;
    const barWidth = barSpacing * 0.6;
    const startX = 40;
    const startY = 30;
    
    // Draw bars
    data.forEach((item, index) => {
      const barHeight = (item.value / 100) * chartHeight;
      const x = startX + index * barSpacing + (barSpacing - barWidth) / 2;
      const y = startY + chartHeight - barHeight;
      
      // Create gradient
      const gradient = ctx.createLinearGradient(x, y, x, startY + chartHeight);
      gradient.addColorStop(0, '#06B6D4');  // Cyan-500
      gradient.addColorStop(1, '#0891B2');  // Cyan-600
      
      // Draw bar with rounded top
      ctx.beginPath();
      ctx.moveTo(x, startY + chartHeight);
      ctx.lineTo(x, y + 4);
      ctx.arcTo(x, y, x + 4, y, 4);
      ctx.lineTo(x + barWidth - 4, y);
      ctx.arcTo(x + barWidth, y, x + barWidth, y + 4, 4);
      ctx.lineTo(x + barWidth, startY + chartHeight);
      ctx.closePath();
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Draw value on top of bar
      ctx.font = 'bold 12px Inter, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.fillText(item.value.toString(), x + barWidth / 2, y - 6);
      
      // Draw label below bar
      ctx.font = '12px Inter, sans-serif';
      ctx.fillStyle = '#D1D5DB';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(item.label, x + barWidth / 2, startY + chartHeight + 8);
    });
    
    // Draw y-axis
    ctx.beginPath();
    ctx.moveTo(startX - 10, startY);
    ctx.lineTo(startX - 10, startY + chartHeight);
    ctx.strokeStyle = '#4B5563';
    ctx.lineWidth = 1;
    ctx.stroke();
    
    // Draw y-axis labels and grid lines
    for (let i = 0; i <= 10; i += 2) {
      const y = startY + chartHeight - (i / 10) * chartHeight;
      const value = i * 10;
      
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
    
  }, []);
  
  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default BarChartComponent;