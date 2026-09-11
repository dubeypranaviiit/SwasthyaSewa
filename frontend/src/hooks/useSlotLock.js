import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

export const useSlotLock = (backendurl, token) => {
  const [heldSlot, setHeldSlot] = useState(null);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [isHolding, setIsHolding] = useState(false);
  const [lockError, setLockError] = useState(null);
  const timerRef = useRef(null);

  const clearHoldTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const releaseSlot = useCallback(async (docId, slotDate, slotTime) => {
    clearHoldTimer();
    setHeldSlot(null);
    setIsHolding(false);
    setRemainingSeconds(0);
    setLockError(null);

    if (!token || !backendurl || !docId || !slotDate || !slotTime) return;

    try {
      await axios.post(
        `${backendurl}/api/user/release-slot`,
        { docId, slotDate, slotTime },
        { headers: { token } }
      );
    } catch (err) {
      console.warn('[useSlotLock] Release slot failed (likely expired):', err.message);
    }
  }, [backendurl, token, clearHoldTimer]);

  const holdSlot = useCallback(async (docId, slotDate, slotTime, ttlSeconds = 300) => {
    if (!token || !backendurl) return { success: false, message: 'Authentication required' };

    if (heldSlot && (heldSlot.docId !== docId || heldSlot.slotDate !== slotDate || heldSlot.slotTime !== slotTime)) {
      await releaseSlot(heldSlot.docId, heldSlot.slotDate, heldSlot.slotTime);
    }

    setLockError(null);
    try {
      const { data } = await axios.post(
        `${backendurl}/api/user/hold-slot`,
        { docId, slotDate, slotTime, ttlSeconds },
        { headers: { token } }
      );

      if (data.success) {
        const expiresAt = Date.now() + (data.ttlSeconds || ttlSeconds) * 1000;
        setHeldSlot({ docId, slotDate, slotTime, expiresAt });
        setIsHolding(true);
        setRemainingSeconds(data.ttlSeconds || ttlSeconds);

        clearHoldTimer();
        timerRef.current = setInterval(() => {
          const diff = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));
          setRemainingSeconds(diff);
          if (diff <= 0) {
            clearHoldTimer();
            setIsHolding(false);
            setHeldSlot(null);
            setLockError('Reservation expired. Please select the slot again.');
          }
        }, 1000);

        return { success: true, ttlSeconds: data.ttlSeconds || ttlSeconds };
      } else {
        setLockError(data.message || 'Slot currently held by another user');
        return { success: false, message: data.message };
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Failed to hold slot';
      setLockError(message);
      return { 
        success: false, 
        status: err.response?.status,
        message 
      };
    }
  }, [backendurl, token, heldSlot, releaseSlot, clearHoldTimer]);

  useEffect(() => {
    return () => {
      clearHoldTimer();
    };
  }, [clearHoldTimer]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  return {
    heldSlot,
    isHolding,
    remainingSeconds,
    timeLeftFormatted: formatTime(remainingSeconds),
    lockError,
    setLockError,
    holdSlot,
    releaseSlot,
  };
};

export default useSlotLock;
