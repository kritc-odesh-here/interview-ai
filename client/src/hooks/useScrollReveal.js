import { useEffect, useRef, useState } from "react";

/**
 * A custom hook to handle scroll reveal animations using IntersectionObserver.
 * Returns a ref to attach to the element and a boolean indicating visibility.
 */
export function useScrollReveal(options = {}) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        if (options.triggerOnce !== false) {
          observer.unobserve(entry.target);
        }
      } else if (options.triggerOnce === false) {
        setIsVisible(false);
      }
    }, {
      threshold: 0.1,
      ...options,
    });

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [options.triggerOnce, options.threshold]);

  return [ref, isVisible];
}
