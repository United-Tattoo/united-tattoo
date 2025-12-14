import { useEffect, useRef, useState } from 'react';

export const useIntersectionObserver = (options: IntersectionObserverInit = { threshold: 0.1, rootMargin: '0px' }) => {
  const [isIntersecting, setIntersecting] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIntersecting(true);
        if (elementRef.current) {
          observer.unobserve(elementRef.current);
        }
      }
    }, options);

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        // eslint-disable-next-line
        observer.unobserve(elementRef.current);
      }
    };
  }, [options.threshold, options.root, options.rootMargin]);

  return [elementRef, isIntersecting] as const;
};