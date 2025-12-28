import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface DeviceHintModalProps {
  step: number;
  onNext: () => void;
  onClose: () => void;
}

const DeviceHintModal = ({ step, onNext, onClose }: DeviceHintModalProps) => {
  const [position, setPosition] = useState({ top: 0, left: 0, arrowPosition: 'top' });

  useEffect(() => {
    const updatePosition = () => {
      let targetElement: HTMLElement | null = null;
      
      if (step === 1) {
        targetElement = document.getElementById('config-button');
      } else if (step === 2) {
        targetElement = document.getElementById('edit-button');
      }

      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const modalWidth = 320;
        const modalHeight = 160;
        const arrowSize = 12;
        
        let top = rect.bottom + arrowSize;
        let left = rect.left + rect.width / 2 - modalWidth / 2;
        let arrowPosition = 'top';
        
        if (left < 10) left = 10;
        if (left + modalWidth > window.innerWidth - 10) {
          left = window.innerWidth - modalWidth - 10;
        }
        
        if (top + modalHeight > window.innerHeight - 10) {
          top = rect.top - modalHeight - arrowSize;
          arrowPosition = 'bottom';
        }
        
        setPosition({ top, left, arrowPosition });
      }
    };

    const timer = setTimeout(updatePosition, 100);
    window.addEventListener('resize', updatePosition);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updatePosition);
    };
  }, [step]);

  const getHintContent = () => {
    switch (step) {
      case 1:
        return {
          title: "Device Configuration",
          message: "Click the Config button to access your device settings and copy configuration codes.",
          buttonText: "Next"
        };
      case 2:
        return {
          title: "Edit Dashboard",
          message: "Use the Edit button to customize your device dashboard and add widgets.",
          buttonText: "Got it!"
        };
      default:
        return null;
    }
  };

  const content = getHintContent();
  if (!content) return null;

  const getArrowStyles = () => {
    const targetElement = step === 1 
      ? document.getElementById('config-button')
      : document.getElementById('edit-button');
    
    if (!targetElement) return {};
    
    const rect = targetElement.getBoundingClientRect();
    const arrowLeft = rect.left + rect.width / 2 - position.left - 6;
    
    if (position.arrowPosition === 'top') {
      return {
        position: 'absolute' as const,
        top: -6,
        left: Math.max(12, Math.min(arrowLeft, 300)),
        width: 0,
        height: 0,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderBottom: '6px solid white',
      };
    } else {
      return {
        position: 'absolute' as const,
        bottom: -6,
        left: Math.max(12, Math.min(arrowLeft, 300)),
        width: 0,
        height: 0,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderTop: '6px solid white',
      };
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 z-40" />
      <div 
        className="fixed z-50 bg-white rounded-lg shadow-lg p-4 w-80 border"
        style={{ top: position.top, left: position.left }}
      >
        <div style={getArrowStyles()} />
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-gray-900">{content.title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-600">{content.message}</p>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
          >
            Skip
          </button>
          <button
            onClick={onNext}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            {content.buttonText}
          </button>
        </div>
      </div>
    </>
  );
};

export default DeviceHintModal;