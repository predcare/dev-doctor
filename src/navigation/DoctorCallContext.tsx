import React, { createContext, useContext, useEffect, useState } from 'react';
import { AppState, AppStateStatus, NativeEventEmitter, NativeModules } from 'react-native';

const { PiPModule } = NativeModules;
const pipEmitter = PiPModule ? new NativeEventEmitter(PiPModule) : null;

export interface ActiveCallData {
  appointmentId: number;
  patientName: string;
  patientId: string;
  appointmentDate?: string;
  startTime?: string;
}

interface DoctorCallContextType {
  activeCall: ActiveCallData | null;
  isFloatingPiP: boolean;
  callSeconds: number;
  startCall: (data: ActiveCallData) => void;
  minimizeCall: () => void;
  restoreCall: (navigation?: any) => void;
  endCall: () => void;
}

const DoctorCallContext = createContext<DoctorCallContextType>({
  activeCall: null,
  isFloatingPiP: false,
  callSeconds: 0,
  startCall: () => {},
  minimizeCall: () => {},
  restoreCall: () => {},
  endCall: () => {},
});

export const DoctorCallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCall, setActiveCall] = useState<ActiveCallData | null>(null);
  const [isFloatingPiP, setIsFloatingPiP] = useState(false);
  const [callSeconds, setCallSeconds] = useState(0);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (activeCall) {
      interval = setInterval(() => {
        setCallSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setCallSeconds(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeCall]);

  // AppState change listener: triggers PiP when phone/app is minimized to background
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (activeCall && (nextAppState === 'background' || nextAppState === 'inactive')) {
        setIsFloatingPiP(true);
        if (PiPModule?.enterPiP) {
          PiPModule.enterPiP();
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [activeCall]);

  // Native PiP Event Listener
  useEffect(() => {
    if (!pipEmitter) return;
    const subscription = pipEmitter.addListener(
      'onPiPModeChanged',
      (event: { isInPictureInPictureMode: boolean }) => {
        if (!event.isInPictureInPictureMode && activeCall) {
          // Native PiP was closed or expanded back to app -> restore meeting screen
          setIsFloatingPiP(false);
        }
      }
    );
    return () => {
      subscription.remove();
    };
  }, [activeCall]);

  const startCall = (data: ActiveCallData) => {
    setActiveCall(data);
    setIsFloatingPiP(false);
    setCallSeconds(0);
    if (PiPModule?.setCallActive) {
      PiPModule.setCallActive(true);
    }
  };

  const minimizeCall = () => {
    if (activeCall) {
      setIsFloatingPiP(true);
      if (PiPModule?.enterPiP) {
        PiPModule.enterPiP();
      }
    }
  };

  const restoreCall = (navigation?: any) => {
    setIsFloatingPiP(false);
    if (navigation && activeCall) {
      navigation.navigate('DoctorMeeting', {
        appointmentId: activeCall.appointmentId,
        patientId: activeCall.patientId,
      });
    }
  };

  const endCall = () => {
    setActiveCall(null);
    setIsFloatingPiP(false);
    setCallSeconds(0);
    if (PiPModule?.setCallActive) {
      PiPModule.setCallActive(false);
    }
  };

  return (
    <DoctorCallContext.Provider
      value={{
        activeCall,
        isFloatingPiP,
        callSeconds,
        startCall,
        minimizeCall,
        restoreCall,
        endCall,
      }}
    >
      {children}
    </DoctorCallContext.Provider>
  );
};

export const useDoctorCall = () => useContext(DoctorCallContext);
export default DoctorCallContext;
