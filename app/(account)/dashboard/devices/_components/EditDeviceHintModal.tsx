import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface HintStep {
  targetId: string;
  title: string;
  message: string;
  buttonText?: string;
  showPreview?: boolean;
  previewType?: "resize" | "drag" | "add";
}

interface HintModalProps {
  steps: HintStep[];
  currentStep: number;
  onNext: () => void;
  onBack?: () => void;
  onClose: () => void;
  onComplete?: () => void;
}

const EditDeviceHintModal = ({
  steps,
  currentStep,
  onNext,
  onBack,
  onClose,
  onComplete,
}: HintModalProps) => {
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    arrowPosition: "top" as "top" | "bottom" | "left" | "right",
  });
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const updatePosition = () => {
      const currentStepData = steps[currentStep - 1];
      if (!currentStepData) return;

      const targetElement = document.getElementById(currentStepData.targetId);

      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const modalWidth = 380;
        const modalHeight = 280;
        const arrowSize = 12;
        const padding = 10;

        // Always center horizontally and use only top/bottom positioning
        const viewportCenterX = window.innerWidth / 2;
        const viewportCenterY = window.innerHeight / 2;
        
        let top: number, left: number, arrowPosition: "top" | "bottom" | "left" | "right";
        
        // Always center horizontally
        left = viewportCenterX - modalWidth / 2;
        
        // Try to position relative to target element if visible
        if (rect.width > 0 && rect.height > 0) {
          const spaceTop = rect.top;
          const spaceBottom = window.innerHeight - rect.bottom;
          
          if (spaceBottom >= modalHeight + arrowSize + padding) {
            // Position below target
            top = rect.bottom + arrowSize;
            arrowPosition = "top";
          } else if (spaceTop >= modalHeight + arrowSize + padding) {
            // Position above target
            top = rect.top - modalHeight - arrowSize;
            arrowPosition = "bottom";
          } else {
            // Not enough space, center vertically
            top = viewportCenterY - modalHeight / 2;
            arrowPosition = "top";
          }
        } else {
          // Element not visible, center vertically
          top = viewportCenterY - modalHeight / 2;
          arrowPosition = "top";
        }

        // Ensure modal stays within viewport bounds
        if (top < padding) top = padding;
        if (top + modalHeight > window.innerHeight - padding) {
          top = window.innerHeight - modalHeight - padding;
        }
        if (left < padding) left = padding;
        if (left + modalWidth > window.innerWidth - padding) {
          left = window.innerWidth - modalWidth - padding;
        }

        if (arrowPosition === "top" || arrowPosition === "bottom") {
          if (left < padding) left = padding;
          if (left + modalWidth > window.innerWidth - padding) {
            left = window.innerWidth - modalWidth - padding;
          }
        } else {
          if (top < padding) top = padding;
          if (top + modalHeight > window.innerHeight - padding) {
            top = window.innerHeight - modalHeight - padding;
          }
        }

        setPosition({ top, left, arrowPosition });
      }
    };

    const timer = setTimeout(updatePosition, 100);
    window.addEventListener("resize", updatePosition);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updatePosition);
    };
  }, [currentStep, steps]);

  const currentStepData = steps[currentStep - 1];
  if (!currentStepData) return null;

  const ResizePreview = () => {
    const [resizeState, setResizeState] = useState({ isResizing: false, width: 16, height: 12 });

    useEffect(() => {
      const sequence = async () => {
        setResizeState({ isResizing: false, width: 16, height: 12 });
        await new Promise(resolve => setTimeout(resolve, 500));
        setResizeState({ isResizing: true, width: 16, height: 12 });
        await new Promise(resolve => setTimeout(resolve, 300));
        setResizeState({ isResizing: true, width: 24, height: 16 });
        await new Promise(resolve => setTimeout(resolve, 800));
        setResizeState({ isResizing: false, width: 24, height: 16 });
        await new Promise(resolve => setTimeout(resolve, 1000));
      };
      
      sequence();
      const interval = setInterval(sequence, 3000);
      return () => clearInterval(interval);
    }, [currentStep]);

    return (
      <div className="mt-3 p-3 bg-gray-50 rounded border">
        <div className="text-xs text-gray-500 mb-2">Preview:</div>
        <div className="relative h-20 bg-white rounded border overflow-hidden">
          <div 
            className={`bg-blue-100 border-2 border-blue-300 rounded transition-all duration-500 relative ${
              resizeState.isResizing ? 'shadow-lg' : 'shadow-sm'
            }`}
            style={{ width: `${resizeState.width * 4}px`, height: `${resizeState.height * 4}px`, left: '10px', top: '10px', position: 'absolute' }}
          >
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize"></div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-se-resize"></div>
            <div className="p-1 text-xs text-blue-700">Widget</div>
          </div>
          {resizeState.isResizing && (
            <div 
              className="absolute pointer-events-none transition-all duration-500 z-20 animate-pulse"
              style={{ left: `${10 + resizeState.width * 4 - 2}px`, top: `${10 + resizeState.height * 4 - 2}px` }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" className="text-gray-700 drop-shadow-lg">
                <path fill="currentColor" d="M13.5 6.5C13.5 5.67 12.83 5 12 5s-1.5.67-1.5 1.5v4.5h-1c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h1v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V14h1c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5h-1V6.5z"/>
                <circle cx="12" cy="18" r="2" fill="currentColor" opacity="0.7"/>
                <path fill="currentColor" d="M8 12c-.55 0-1 .45-1 1v5c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-5c0-.55-.45-1-1H8z" opacity="0.8"/>
                <path fill="currentColor" d="M16 16l2-2m0 0l2 2m-2-2v4m0-4h4" stroke="currentColor" strokeWidth="1" opacity="0.9"/>
              </svg>
            </div>
          )}
          <div className="absolute bottom-1 left-2 text-xs text-gray-400">Drag corners to resize</div>
        </div>
      </div>
    );
  };

  const DragPreview = () => {
    const [dragState, setDragState] = useState({ isDragging: false, x: 10, y: 30 });

    useEffect(() => {
      const sequence = async () => {
        setDragState({ isDragging: false, x: 10, y: 30 });
        await new Promise(resolve => setTimeout(resolve, 500));
        setDragState({ isDragging: true, x: 10, y: 30 });
        await new Promise(resolve => setTimeout(resolve, 300));
        setDragState({ isDragging: true, x: 70, y: 10 });
        await new Promise(resolve => setTimeout(resolve, 800));
        setDragState({ isDragging: false, x: 70, y: 10 });
        await new Promise(resolve => setTimeout(resolve, 1000));
      };
      
      sequence();
      const interval = setInterval(sequence, 3000);
      return () => clearInterval(interval);
    }, [currentStep]);

    return (
      <div className="mt-3 p-3 bg-gray-50 rounded border">
        <div className="text-xs text-gray-500 mb-2">Preview:</div>
        <div className="relative h-20 bg-white rounded border overflow-hidden">
          <div 
            className={`absolute w-16 h-12 bg-green-100 border-2 border-green-300 rounded transition-all duration-500 ${
              dragState.isDragging ? 'shadow-lg scale-105 z-10' : 'shadow-sm'
            }`}
            style={{ left: `${dragState.x}px`, top: `${dragState.y}px` }}
          >
            <div className="p-1 text-xs text-green-700">Chart</div>
          </div>
          {dragState.isDragging && (
            <div 
              className="absolute pointer-events-none transition-all duration-500 z-20 animate-pulse"
              style={{ left: `${dragState.x + 8}px`, top: `${dragState.y + 6}px` }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" className="text-gray-700 drop-shadow-lg">
                <path fill="currentColor" d="M13.5 6.5C13.5 5.67 12.83 5 12 5s-1.5.67-1.5 1.5v4.5h-1c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h1v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V14h1c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5h-1V6.5z"/>
                <circle cx="12" cy="18" r="2" fill="currentColor" opacity="0.7"/>
                <path fill="currentColor" d="M8 12c-.55 0-1 .45-1 1v5c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-5c0-.55-.45-1-1-1H8z" opacity="0.8"/>
              </svg>
            </div>
          )}
          <div className="absolute bottom-1 left-2 text-xs text-gray-400">Click and drag to reposition</div>
        </div>
      </div>
    );
  };

  const AddPreview = () => {
    const [dragState, setDragState] = useState({ isDragging: false, x: 10, y: 10 });

    useEffect(() => {
      const sequence = async () => {
        setDragState({ isDragging: false, x: 10, y: 10 });
        await new Promise(resolve => setTimeout(resolve, 500));
        setDragState({ isDragging: true, x: 10, y: 10 });
        await new Promise(resolve => setTimeout(resolve, 300));
        setDragState({ isDragging: true, x: 60, y: 30 });
        await new Promise(resolve => setTimeout(resolve, 800));
        setDragState({ isDragging: false, x: 60, y: 30 });
        await new Promise(resolve => setTimeout(resolve, 1000));
      };
      
      sequence();
      const interval = setInterval(sequence, 3000);
      return () => clearInterval(interval);
    }, [currentStep]);

    return (
      <div className="mt-3 p-3 bg-gray-50 rounded border">
        <div className="text-xs text-gray-500 mb-2">Preview:</div>
        <div className="relative h-20 bg-white rounded border overflow-hidden">
          <div 
            className={`absolute w-14 h-10 bg-blue-100 border-2 border-blue-300 rounded transition-all duration-500 ${
              dragState.isDragging ? 'shadow-lg scale-105 z-10' : 'shadow-sm'
            }`}
            style={{ left: `${dragState.x}px`, top: `${dragState.y}px` }}
          >
            <div className="p-1 text-xs text-blue-700">Chart</div>
          </div>
          {dragState.isDragging && (
            <div 
              className="absolute pointer-events-none transition-all duration-500 z-20 animate-pulse"
              style={{ left: `${dragState.x + 7}px`, top: `${dragState.y + 5}px` }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" className="text-gray-700 drop-shadow-lg">
                <path fill="currentColor" d="M13.5 6.5C13.5 5.67 12.83 5 12 5s-1.5.67-1.5 1.5v4.5h-1c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h1v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V14h1c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5h-1V6.5z"/>
                <circle cx="12" cy="18" r="2" fill="currentColor" opacity="0.7"/>
                <path fill="currentColor" d="M8 12c-.55 0-1 .45-1 1v5c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2v-5c0-.55-.45-1-1H8z" opacity="0.8"/>
              </svg>
            </div>
          )}
          <div className="absolute bottom-1 left-2 text-xs text-gray-400">Click and drag from widget box</div>
        </div>
      </div>
    );
  };

  const getArrowStyles = () => {
    const targetElement = document.getElementById(currentStepData.targetId);
    if (!targetElement) return {};

    const rect = targetElement.getBoundingClientRect();

    switch (position.arrowPosition) {
      case "top":
        const arrowLeft = rect.left + rect.width / 2 - position.left - 6;
        return {
          position: "absolute" as const,
          top: -6,
          left: Math.max(12, Math.min(arrowLeft, 360)),
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderBottom: "6px solid white",
        };
      case "bottom":
        const arrowLeftBottom = rect.left + rect.width / 2 - position.left - 6;
        return {
          position: "absolute" as const,
          bottom: -6,
          left: Math.max(12, Math.min(arrowLeftBottom, 360)),
          width: 0,
          height: 0,
          borderLeft: "6px solid transparent",
          borderRight: "6px solid transparent",
          borderTop: "6px solid white",
        };
      case "left":
        const arrowTop = rect.top + rect.height / 2 - position.top - 6;
        return {
          position: "absolute" as const,
          left: -6,
          top: Math.max(12, Math.min(arrowTop, 260)),
          width: 0,
          height: 0,
          borderTop: "6px solid transparent",
          borderBottom: "6px solid transparent",
          borderRight: "6px solid white",
        };
      case "right":
        const arrowTopRight = rect.top + rect.height / 2 - position.top - 6;
        return {
          position: "absolute" as const,
          right: -6,
          top: Math.max(12, Math.min(arrowTopRight, 260)),
          width: 0,
          height: 0,
          borderTop: "6px solid transparent",
          borderBottom: "6px solid transparent",
          borderLeft: "6px solid white",
        };
      default:
        return {};
    }
  };

  const handleNext = () => {
    if (currentStep >= steps.length) {
      onComplete?.();
    } else {
      onNext();
    }
  };

  const handleBack = () => {
    if (onBack && currentStep > 1) {
      onBack();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-30 z-40" />
      <div
        className="fixed z-50 bg-white rounded-lg shadow-lg p-4 border"
        style={{ 
          top: position.top, 
          left: position.left,
          width: '380px'
        }}
      >
        <div style={getArrowStyles()} />
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-gray-900">
              {currentStepData.title}
            </h3>
            <span className="text-xs text-gray-500">
              {currentStep} of {steps.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="mb-4">
          <p className="text-sm text-gray-600">{currentStepData.message}</p>
          {currentStepData.showPreview && currentStepData.previewType === "resize" && <ResizePreview />}
          {currentStepData.showPreview && currentStepData.previewType === "drag" && <DragPreview />}
          {currentStepData.showPreview && currentStepData.previewType === "add" && <AddPreview />}
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={() => onBack?.()}
            disabled={currentStep === 1}
            className={`flex items-center gap-1 px-3 py-1 text-sm rounded ${
              currentStep === 1
                ? 'text-gray-300 cursor-not-allowed' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700"
            >
              Skip
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              {currentStepData.buttonText ||
                (currentStep >= steps.length ? "Finish" : "Next")}
              {currentStep < steps.length && <ChevronRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditDeviceHintModal;