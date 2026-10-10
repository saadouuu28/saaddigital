/**
 * Web Audio API synthesized notification bell for Kitchen Display System (KDS)
 * Produces a clear, pleasant double chime (ding-dong) when a new order arrives.
 */
export function playOrderChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const now = ctx.currentTime;

    // First tone (high chime: 880Hz / A5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.3, now + 0.04);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.7);

    // Second tone (harmonic bell: 1174Hz / D6)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1174, now + 0.18);
    gain2.gain.setValueAtTime(0, now + 0.18);
    gain2.gain.linearRampToValueAtTime(0.35, now + 0.22);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.18);
    osc2.stop(now + 1.1);
  } catch (err) {
    console.warn('Audio chime could not play:', err);
  }
}
