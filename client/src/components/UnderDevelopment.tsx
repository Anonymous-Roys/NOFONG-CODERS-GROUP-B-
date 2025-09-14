import React from 'react';
import { Wrench } from 'lucide-react';

interface UnderDevelopmentProps {
  title: string;
  description?: string;
}

const UnderDevelopment: React.FC<UnderDevelopmentProps> = ({ 
  title, 
  description = "This feature is currently being developed and will be available soon." 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 pb-20" style={{backgroundColor: 'var(--color-white)'}}>
      <div className="text-center max-w-md">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6" style={{backgroundColor: 'var(--color-light-green)'}}>
          <Wrench className="w-12 h-12" style={{color: 'var(--color-brand)'}} />
        </div>
        
        <h1 className="text-2xl font-semibold mb-4" style={{color: 'var(--color-text-strong)'}}>
          {title}
        </h1>
        
        <p className="text-lg mb-6" style={{color: 'var(--color-medium-gray)'}}>
          {description}
        </p>
        
        <div className="flex items-center justify-center gap-2 text-sm" style={{color: 'var(--color-brand)'}}>
          <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          <span className="ml-2">Coming Soon</span>
        </div>
      </div>
    </div>
  );
};

export default UnderDevelopment;