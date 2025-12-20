import { useEffect, useRef, useCallback } from "react";

interface IntersectionObserverOptions {
  root?: Element | Document | null;
  rootMargin?: string;
  scrollMargin?: string;
  threshold?: number | number[];
}

interface UseIntersectionObserverProps {
  onVisibilityChange?: (
    itemId: string,
    isVisible: boolean,
    entry: IntersectionObserverEntry
  ) => void;
  options?: IntersectionObserverOptions;
  debounceDelay?: number;
}

interface UseIntersectionObserverReturn {
  observe: (element: Element, itemId: string) => void;
  unobserve: (itemId: string) => void;
  disconnect: () => void;
}

const useIntersectionObserver = ({
  onVisibilityChange,
  options = {},
  debounceDelay = 100,
}: UseIntersectionObserverProps): UseIntersectionObserverReturn => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const observedElements = useRef<Map<Element, string>>(new Map());
  const visibilityCache = useRef<Map<string, boolean>>(new Map());
  const pendingCallbacks = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const cleanup = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    observedElements.current.clear();
    visibilityCache.current.clear();

    pendingCallbacks.current.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    pendingCallbacks.current.clear();
  }, []);

  const handleVisibilityChange = useCallback(
    (itemId: string, isVisible: boolean, entry: IntersectionObserverEntry) => {
      const existingTimeoutId = pendingCallbacks.current.get(itemId);
      if (existingTimeoutId) {
        clearTimeout(existingTimeoutId);
      }

      const timeoutId = setTimeout(() => {
        pendingCallbacks.current.delete(itemId);
        if (onVisibilityChange) {
          onVisibilityChange(itemId, isVisible, entry);
        }
      }, debounceDelay);

      pendingCallbacks.current.set(itemId, timeoutId);
    },
    [onVisibilityChange, debounceDelay]
  );

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") {
      console.warn("IntersectionObserver is not supported in this browser");
      return cleanup;
    }

    observerRef.current = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        entries.forEach((entry: IntersectionObserverEntry) => {
          const element = entry.target;
          const itemId = observedElements.current.get(element);

          if (!itemId) return;

          const wasVisible = visibilityCache.current.get(itemId) || false;
          const isVisible = entry.isIntersecting;

          if (wasVisible !== isVisible) {
            visibilityCache.current.set(itemId, isVisible);

            handleVisibilityChange(itemId, isVisible, entry);
          }
        });
      },
      {
        root: null,
        rootMargin: "100px",
        threshold: 0.1,
        ...options,
      }
    );
    return cleanup;
  }, []);

  const observe = useCallback((element: Element, itemId: string) => {
    if (!element || !observerRef.current || !itemId) return;

    observedElements.current.set(element, itemId);

    if (!visibilityCache.current.has(itemId)) {
      visibilityCache.current.set(itemId, false);
    }

    observerRef.current.observe(element);
  }, []);

  const unobserve = useCallback((itemId: string) => {
    if (!itemId) return;

    let elementToUnobserve: Element | null = null;
    observedElements.current.forEach((storedId: string, element: Element) => {
      if (storedId === itemId) {
        elementToUnobserve = element;
      }
    });

    if (elementToUnobserve && observerRef.current) {
      observerRef.current.unobserve(elementToUnobserve);
      observedElements.current.delete(elementToUnobserve);
      visibilityCache.current.delete(itemId);

      const pendingTimeoutId = pendingCallbacks.current.get(itemId);
      if (pendingTimeoutId) {
        clearTimeout(pendingTimeoutId);
        pendingCallbacks.current.delete(itemId);
      }
    }
  }, []);

  return {
    observe,
    unobserve,
    disconnect: cleanup,
  };
};

export default useIntersectionObserver;
