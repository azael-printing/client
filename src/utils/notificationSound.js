let lastPlayAt = 0;

function createBeep(ctx, startAt, duration = 0.34, peak = 0.12, fromHz = 1046, toHz = 784) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(fromHz, startAt);
  oscillator.frequency.exponentialRampToValueAtTime(toHz, startAt + duration * 0.85);

  gainNode.gain.setValueAtTime(0.0001, startAt);
  gainNode.gain.exponentialRampToValueAtTime(Math.max(0.08, peak), startAt + 0.03);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);
  oscillator.start(startAt);
  oscillator.stop(startAt + duration);
}

export function playNotificationSound({ durationMs = 3000, loud = true } = {}) {
  if (typeof window === "undefined") return;

  const now = Date.now();
  if (now - lastPlayAt < 4000) return;
  lastPlayAt = now;

  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  const ctx = new AudioCtx();
  const totalSeconds = Math.max(1.5, Math.min(3, durationMs / 1000));
  const step = 0.62;
  const beeps = Math.max(3, Math.floor(totalSeconds / step));
  const base = ctx.currentTime + 0.02;
  const peak = loud ? 0.14 : 0.09;

  for (let i = 0; i < beeps; i += 1) {
    const start = base + i * step;
    createBeep(ctx, start, 0.22, peak, 1318, 1174);
    createBeep(ctx, start + 0.28, 0.18, peak * 0.82, 988, 880);
  }

  window.setTimeout(() => {
    ctx.close().catch(() => {});
  }, durationMs + 900);
}

export function vibrateNotification() {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function") return;
  try {
    navigator.vibrate([110, 70, 170, 70, 110, 70, 170]);
  } catch {}
}

export function speakNotification(text) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.92;
    utter.pitch = 1;
    utter.volume = 1;
    window.speechSynthesis.speak(utter);
  } catch {}
}

export function emitAppToast(message, tone = "info") {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("app-toast", { detail: { message, tone } }));
}

export function triggerNotificationAlert({ direction = "received", message = "" } = {}) {
  const spoken = direction === "sent"
    ? "One notification has been sent."
    : "One notification has been received. Please check out.";

  playNotificationSound({ durationMs: 3000, loud: true });
  vibrateNotification();
  speakNotification(spoken);
  emitAppToast(message || spoken, "info");
}
