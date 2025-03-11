
import { useState } from "react";

export function useFullscreenState(defaultValue: boolean = false) {
  const [isFullscreen, setIsFullscreen] = useState(defaultValue);
  
  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };
  
  const enableFullscreen = () => {
    setIsFullscreen(true);
  };
  
  const disableFullscreen = () => {
    setIsFullscreen(false);
  };

  return {
    isFullscreen,
    toggleFullscreen,
    enableFullscreen,
    disableFullscreen
  };
}
