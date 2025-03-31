import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`glass rounded-xl mt-8 hover-card ${className}`}>
      {children}
    </div>
  );
} 