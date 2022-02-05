import React from 'react';
export default function useEffectAsync(
  effect: React.EffectCallback,
  deps?: React.DependencyList | undefined
) {
  React.useEffect(() => {
    effect();
  }, deps);
}
