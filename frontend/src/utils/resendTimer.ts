import { useEffect, useState } from "react";

export const RESEND_COOLDOWN_SECONDS = 60;

const timerKey = (email: string) => `bookhub_resend_timer_${email}`;

export function getResendEndTime(email: string): number {
  if (!email) return 0;
  const raw = localStorage.getItem(timerKey(email));
  const end = Number(raw);
  return Number.isFinite(end) && end > 0 ? end : 0;
}

export function startResendTimer(
  email: string,
  seconds = RESEND_COOLDOWN_SECONDS
): void {
  localStorage.setItem(timerKey(email), String(Date.now() + seconds * 1000));
}

export function clearResendTimer(email: string): void {
  localStorage.removeItem(timerKey(email));
}

export function useResendTimer(
  email: string,
  durationSeconds = RESEND_COOLDOWN_SECONDS
) {
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const end = getResendEndTime(email);
    return end ? Math.max(0, Math.ceil((end - Date.now()) / 1000)) : 0;
  });

  useEffect(() => {
    const end = getResendEndTime(email);
    setSecondsLeft(end ? Math.max(0, Math.ceil((end - Date.now()) / 1000)) : 0);
  }, [email]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  useEffect(() => {
    const sync = () => {
      const end = getResendEndTime(email);
      setSecondsLeft(end ? Math.max(0, Math.ceil((end - Date.now()) / 1000)) : 0);
    };
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [email]);

  const restart = (seconds = durationSeconds) => {
    startResendTimer(email, seconds);
    setSecondsLeft(seconds);
  };

  return { secondsLeft, canResend: secondsLeft <= 0, restart };
}