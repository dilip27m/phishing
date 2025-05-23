import React, { useEffect, useRef } from 'react';

const PieChartComponent: React.FC = () => {
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
    
    // Data for the pie chart
    const data = [
      { label: 'Safe Links', value: 68, color: '#10B981' }, // Green
      { label: 'Phishing Links', value: 32, color: '#EF4444' }, // Red
    ];
    
    // Calculate total
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    // Draw the pie chart
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const radius = Math.min(centerX, centerY) * 0.8;
    
    let startAngle = 0;
    
    data.forEach(item => {
      const sliceAngle = (item.value / total) * 2 * Math.PI;
      
      // Draw slice
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = item.color;
      ctx.fill();
      
      // Draw slice border
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.strokeStyle = '#1F2937';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Calculate label position
      const labelAngle = startAngle + sliceAngle / 2;
      const labelRadius = radius * 0.7;
      const labelX = centerX + labelRadius * Math.cos(labelAngle);
      const labelY = centerY + labelRadius * Math.sin(labelAngle);
      
      // Draw label
      ctx.font = 'bold 14px Inter, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${item.value}%`, labelX, labelY);
      
      startAngle += sliceAngle;
    });
    
    // Draw legend
    const legendY = rect.height - 30;
    const spacing = 120;
    let currentX = centerX - ((data.length - 1) * spacing) / 2;
    
    data.forEach(item => {
      // Draw color box
      ctx.fillStyle = item.color;
      ctx.fillRect(currentX - 40, legendY, 12, 12);
      
      // Draw label
      ctx.font = '14px Inter, sans-serif';
      ctx.fillStyle = '#D1D5DB';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.label, currentX - 24, legendY + 6);
      
      currentX += spacing;
    });
    
  }, []);
  
  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default PieChartComponent;