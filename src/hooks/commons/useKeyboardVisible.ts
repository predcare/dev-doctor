import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

/** Returns true while the software keyboard is open. */
export const useKeyboardVisible = (): boolean => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, () => setIsVisible(true));
    const hideSub = Keyboard.addListener(hideEvent, () => setIsVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return isVisible;
};

export default useKeyboardVisible;
