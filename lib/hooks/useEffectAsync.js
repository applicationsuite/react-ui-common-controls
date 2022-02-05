import React from 'react';
export default function useEffectAsync(effect, deps) {
    React.useEffect(() => {
        effect();
    }, deps);
}
