import React, { useState } from 'react';
import { Clock } from 'lucide-react';

interface TimePickerProps {
  selectedTime: string;
  onTimeChange: (time: string) => void;
  className?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({ selectedTime, onTimeChange, className = '' }) => {
  const [hours, minutes] = selectedTime.split(':').map(Number);
  
  const handleHourChange = (hour: number) => {
    const newTime = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    onTimeChange(newTime);
  };

  const handleMinuteChange = (minute: number) => {
    const newTime = `${hours.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    onTimeChange(newTime);
  };

  const generateTimeOptions = (type: 'hour' | 'minute') => {
    const options = [];
    const max = type === 'hour' ? 23 : 59;
    const step = type === 'minute' ? 5 : 1;
    
    for (let i = 0; i <= max; i += step) {
      options.push(i);
    }
    return options;
  };

  return (
    <div className={`flex items-center justify-center space-x-4 ${className}`}>
      {/* Hours */}
      <div className="flex flex-col items-center">
        <div className="h-32 overflow-y-auto scrollbar-hide">
          {generateTimeOptions('hour').map((hour) => (
            <div
              key={hour}
              onClick={() => handleHourChange(hour)}
              className={`w-16 h-8 flex items-center justify-center cursor-pointer transition-colors ${
                hour === hours
                  ? 'text-green-600 font-bold text-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {hour.toString().padStart(2, '0')}
            </div>
          ))}
        </div>
      </div>

      {/* Colon */}
      <div className="text-2xl font-bold text-gray-400">:</div>

      {/* Minutes */}
      <div className="flex flex-col items-center">
        <div className="h-32 overflow-y-auto scrollbar-hide">
          {generateTimeOptions('minute').map((minute) => (
            <div
              key={minute}
              onClick={() => handleMinuteChange(minute)}
              className={`w-16 h-8 flex items-center justify-center cursor-pointer transition-colors ${
                minute === minutes
                  ? 'text-green-600 font-bold text-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {minute.toString().padStart(2, '0')}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimePicker;

