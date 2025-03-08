
import { useState, useEffect } from 'react';

export const useVisibilityObserver = (sectionIds: string[]) => {
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>(
    sectionIds.reduce((acc, id) => ({ ...acc, [id]: false }), {})
  );

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.15  // Slightly increased threshold to ensure better visibility detection
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    sectionIds.forEach(section => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return isVisible;
};
