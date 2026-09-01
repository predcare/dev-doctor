import React from 'react';

/**
 * Higher-Order Component (HOC) wrapper for screen components.
 */
export function withScreenFocus<P extends object>(Component: React.ComponentType<P>): React.FC<P> {
  const WrappedScreen: React.FC<P> = props => {
    return <Component {...props} />;
  };

  WrappedScreen.displayName = `WithScreenFocus(${
    Component.displayName || Component.name || 'Screen'
  })`;
  return WrappedScreen;
}

export default withScreenFocus;
