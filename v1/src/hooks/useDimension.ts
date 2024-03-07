import React, { useCallback, useState, useLayoutEffect } from 'react';

const getSize = (el?: HTMLElement | null) =>
  el ? { width: el.clientWidth, height: el.clientHeight } : null;

export function useDimension(ref: React.RefObject<HTMLElement>) {
  const [componentSize, setComponentSize] = useState(getSize(ref ? ref.current : undefined));

  const handleResize = useCallback(() => {
    if (ref.current) {
      setComponentSize(getSize(ref.current));
    }
  }, [ref]);

  useLayoutEffect(() => {
    if (!ref.current) {
      return;
    }
    handleResize();
    window.addEventListener('resize', handleResize);
    return function () {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize, ref]);
  return componentSize;
}
