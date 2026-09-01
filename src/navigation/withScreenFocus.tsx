import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';

export function withScreenFocus<P extends object>(Component: React.ComponentType<P>): React.FC<P> {
  const WrappedScreen: React.FC<P> = props => {
    const isFocused = useIsFocused();
    const [focusKey, setFocusKey] = useState(0);

    useEffect(() => {
      if (isFocused) {
        setFocusKey(prev => prev + 1);
      }
    }, [isFocused]);

    return <Component key={focusKey} {...props} />;
  };

  WrappedScreen.displayName = `WithScreenFocus(${
    Component.displayName || Component.name || 'Screen'
  })`;
  return WrappedScreen;
}

export default withScreenFocus;
