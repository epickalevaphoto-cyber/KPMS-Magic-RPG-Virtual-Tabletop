import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        "bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-gold/30 p-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
