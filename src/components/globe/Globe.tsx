
import React, { useEffect, useRef } from 'react';

export const Globe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas dimensions
    const setCanvasSize = () => {
      const size = Math.min(window.innerWidth * 0.8, 600);
      canvas.width = size;
      canvas.height = size;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Globe parameters
    const radius = canvas.width / 2 * 0.8;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Generate random points for connections
    const points: {x: number, y: number, z: number}[] = [];
    for (let i = 0; i < 200; i++) {
      // Generate random spherical coordinates
      const theta = Math.random() * Math.PI * 2; // longitude
      const phi = Math.acos(2 * Math.random() - 1); // latitude
      
      // Convert to cartesian coordinates
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      points.push({ x, y, z });
    }
    
    // Animation variables
    let rotation = 0;
    
    // Draw function
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Increase rotation
      rotation += 0.001;
      
      // Draw globe outline
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(79, 193, 115, 0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw meridians and parallels
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI;
        
        // Meridians
        ctx.beginPath();
        ctx.ellipse(
          centerX, 
          centerY, 
          radius, 
          radius * Math.abs(Math.cos(angle + rotation)), 
          0, 
          0, 
          Math.PI * 2
        );
        ctx.strokeStyle = 'rgba(79, 193, 115, 0.1)';
        ctx.stroke();
        
        // Parallels
        ctx.beginPath();
        ctx.ellipse(
          centerX, 
          centerY, 
          radius * Math.abs(Math.cos(angle)), 
          radius, 
          0, 
          0, 
          Math.PI * 2
        );
        ctx.strokeStyle = 'rgba(79, 193, 115, 0.1)';
        ctx.stroke();
      }
      
      // Rotate and project points
      const visiblePoints = points.map(point => {
        // Apply rotation around Y axis
        const x = point.x * Math.cos(rotation) - point.z * Math.sin(rotation);
        const z = point.z * Math.cos(rotation) + point.x * Math.sin(rotation);
        
        // Project 3D to 2D
        const scale = 400 / (400 + z);
        const projectedX = centerX + x * scale;
        const projectedY = centerY + point.y * scale;
        
        return {
          x: projectedX,
          y: projectedY,
          z: z,
          scale: scale
        };
      });
      
      // Draw connections between nearby points
      ctx.lineWidth = 0.5;
      for (let i = 0; i < visiblePoints.length; i++) {
        for (let j = i + 1; j < visiblePoints.length; j++) {
          const p1 = visiblePoints[i];
          const p2 = visiblePoints[j];
          
          // Calculate distance
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Connect if close enough
          if (distance < radius * 0.4) {
            const opacity = Math.max(0, 1 - distance / (radius * 0.4));
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(79, 193, 115, ${opacity * 0.15})`;
            ctx.stroke();
          }
        }
      }
      
      // Draw points
      visiblePoints.forEach(point => {
        // Only draw points on the visible side
        if (point.z < 0) {
          const size = 1 + point.scale;
          ctx.beginPath();
          ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(79, 193, 115, ${0.3 + 0.7 * (point.scale - 0.6) / 0.4})`;
          ctx.fill();
        }
      });
      
      requestAnimationFrame(draw);
    };
    
    // Start animation
    draw();
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);
  
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-radial from-github-accent/10 to-transparent opacity-50"></div>
      <canvas 
        ref={canvasRef} 
        className="max-w-full max-h-full relative"
      />
    </div>
  );
};
