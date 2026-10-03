import { create } from "zustand";
import { persist } from "zustand/middleware";

export const RESEND_COOLDOWN_SECONDS = 60;

let intervalId: ReturnType<typeof setInterval> | null = null;

function stopInterval() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
}

interface ResendTimerState {
  email: string | null;
  expiresAt: number | null;
  secondsLeft: number;
  start: (email: string, seconds?: number) => void;
  sync: (email: string) => void;
  clear: () => void;
}

export const useResendTimer = create<ResendTimerState>()(
  persist(
    (set, get) => {
      const armInterval = () => {
        stopInterval();
        intervalId = setInterval(() => {
          const { expiresAt } = get();
          if (!expiresAt) {
            stopInterval();
            set({ secondsLeft: 0 });
            return;
          }
          const remaining = Math.max(
            0,
            Math.ceil((expiresAt - Date.now()) / 1000)
          );
          set({ secondsLeft: remaining });
          if (remaining <= 0) stopInterval();
        }, 1000);
      };

      return {
        email: null,
        expiresAt: null,
        secondsLeft: 0,

        // Inicia (ou reinicia) a contagem para o e-mail informado.
        start: (email, seconds = RESEND_COOLDOWN_SECONDS) => {
          set({
            email,
            expiresAt: Date.now() + seconds * 1000,
            secondsLeft: seconds,
          });
          armInterval();
        },

        // Recalcula o tempo restante a partir do horário persistido.
        // Usado ao montar a tela, voltar o foco ou trocar de e-mail.
        sync: (email) => {
          const { email: storedEmail, expiresAt } = get();

          if (!email || !expiresAt || storedEmail !== email) {
            stopInterval();
            set({ secondsLeft: 0 });
            return;
          }

          const remaining = Math.max(
            0,
            Math.ceil((expiresAt - Date.now()) / 1000)
          );
          set({ secondsLeft: remaining });
          if (remaining > 0) armInterval();
          else stopInterval();
        },

        clear: () => {
          stopInterval();
          set({ email: null, expiresAt: null, secondsLeft: 0 });
        },
      };
    },
    {
      name: "resend-timer",
      partialize: (state) => ({
        email: state.email,
        expiresAt: state.expiresAt,
      }),
    }
  )
);
