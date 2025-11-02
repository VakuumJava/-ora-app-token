import React, { useEffect } from 'react';

interface DotLottiePlayerProps {
  src: string;
  className?: string;
  autoplay?: boolean;
  loop?: boolean;
  speed?: number;
  background?: string;
}

/**
 * Safe wrapper for dotlottie-player element
 * Avoids dangerouslySetInnerHTML security issues
 */
export const DotLottiePlayer: React.FC<DotLottiePlayerProps> = ({
  src,
  className = 'w-48 h-48',
  autoplay = true,
  loop = true,
  speed = 1,
  background = 'transparent',
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Create script tag to load dotlottie library if not already loaded
    if (typeof window !== 'undefined' && !(window as any).dotLottie) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@dotlottie/player@latest';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div 
      ref={containerRef}
      className={className}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <dotlottie-player
        src={src}
        background={background}
        speed={speed}
        style={{ width: '100%', height: '100%' }}
        loop={loop}
        autoplay={autoplay}
      />
    </div>
  );
};

// Export as component for use with React.createElement
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'dotlottie-player': any;
    }
  }
}

export default DotLottiePlayer;
