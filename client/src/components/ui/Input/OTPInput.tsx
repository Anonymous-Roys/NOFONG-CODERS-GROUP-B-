import React, { useEffect, useRef } from 'react';

interface OTPInputProps {
  length?: number;
  onComplete?: (code: string) => void;
}

export const OTPInput: React.FC<OTPInputProps> = ({ length = 6, onComplete }) => {
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 1);
    e.target.value = value;
    if (value && index < length - 1) inputs.current[index + 1]?.focus();
    const code = inputs.current.map(i => i?.value ?? '').join('');
    if (code.length === length) onComplete?.(code);
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !inputs.current[index]?.value && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-3">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          type="text"
          inputMode="numeric"
          maxLength={1}
          aria-label={`OTP digit ${i + 1}`}
          className="w-12 h-12 text-center text-xl rounded-lg border-2 focus:outline-none focus:ring-4 focus:ring-primary-400"
          ref={el => (inputs.current[i] = el)}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
        />
      ))}
    </div>
  );
};

export default OTPInput;


