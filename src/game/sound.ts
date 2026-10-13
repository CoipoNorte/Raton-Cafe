/**
 * Motor de sonido ASMR de cafetería — 100 % sintetizado con WebAudio.
 * No hay archivos de audio: cada efecto se genera al vuelo con osciladores,
 * ruido filtrado y envolventes. Todo es tolerante a fallos (nunca lanza).
 */

/* Notas musicales (Hz) usadas en arpegios y fanfarrias. */
const N = {
  C5: 523.25, D5: 587.33, E5: 659.25, G5: 783.99, A5: 880, C6: 1046.5, E6: 1318.5,
};

class MotorSonido {
  private ctx: AudioContext | null = null;
  private maestro: GainNode | null = null;
  private ruidoBuffer: AudioBuffer | null = null;
  private silenciado = false;

  /** Fija el estado de silencio (persistido con storage.ts). */
  setSilenciado(valor: boolean): void {
    this.silenciado = valor;
  }

  /** Crea/reanuda el AudioContext. Debe llamarse tras un gesto del usuario. */
  private asegurar(): AudioContext | null {
    try {
      if (!this.ctx) {
        const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return null;
        this.ctx = new Ctor();
        this.maestro = this.ctx.createGain();
        this.maestro.gain.value = 0.5;
        this.maestro.connect(this.ctx.destination);
      }
      if (this.ctx.state === "suspended") void this.ctx.resume();
      return this.ctx;
    } catch {
      return null;
    }
  }

  /** Buffer de ruido blanco reutilizable (vapor, vertido, molinillo). */
  private ruido(ctx: AudioContext): AudioBuffer {
    if (!this.ruidoBuffer) {
      const len = ctx.sampleRate * 1.5;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      this.ruidoBuffer = buf;
    }
    return this.ruidoBuffer;
  }

  /** Toca una nota con envolvente exponencial suave. */
  private nota(freq: number, inicio: number, dur: number, tipo: OscillatorType = "sine", vol = 0.35): void {
    if (this.silenciado) return;
    const ctx = this.asegurar();
    if (!ctx || !this.maestro) return;
    try {
      const t = ctx.currentTime + inicio;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = tipo;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(vol, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(this.maestro);
      osc.start(t);
      osc.stop(t + dur + 0.05);
    } catch { /* sin audio, sin drama */ }
  }

  /** Ráfaga de ruido filtrado con barrido (vapor, vertido, molinillo). */
  private ruidoFiltrado(opts: {
    inicio?: number; dur: number; tipo: BiquadFilterType; fInicio: number; fFin?: number;
    q?: number; vol?: number; temblor?: boolean;
  }): void {
    if (this.silenciado) return;
    const ctx = this.asegurar();
    if (!ctx || !this.maestro) return;
    try {
      const t = ctx.currentTime + (opts.inicio ?? 0);
      const src = ctx.createBufferSource();
      src.buffer = this.ruido(ctx);
      src.loop = true;
      const filtro = ctx.createBiquadFilter();
      filtro.type = opts.tipo;
      filtro.frequency.setValueAtTime(opts.fInicio, t);
      filtro.frequency.exponentialRampToValueAtTime(opts.fFin ?? opts.fInicio, t + opts.dur);
      filtro.Q.value = opts.q ?? 1;
      const gain = ctx.createGain();
      const vol = opts.vol ?? 0.25;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(vol, t + opts.dur * 0.25);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + opts.dur);
      // Temblor de amplitud para el molinillo (motor intermitente)
      if (opts.temblor) {
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.type = "square";
        lfo.frequency.value = 22;
        lfoGain.gain.value = vol * 0.5;
        lfo.connect(lfoGain).connect(gain.gain);
        lfo.start(t);
        lfo.stop(t + opts.dur);
      }
      src.connect(filtro).connect(gain).connect(this.maestro);
      src.start(t);
      src.stop(t + opts.dur + 0.05);
    } catch { /* silencio elegante */ }
  }

  /* ---------------------------------------------------------------- */
  /* Efectos públicos                                                   */
  /* ---------------------------------------------------------------- */

  /** Clic de interfaz (botones, pestañas). */
  clic(): void {
    this.nota(740, 0, 0.06, "triangle", 0.22);
  }

  /** Pop al añadir topping / soltar ingrediente en la taza. */
  pop(): void {
    const ctx = this.asegurar();
    if (!ctx || this.silenciado) return;
    this.nota(380, 0, 0.1, "sine", 0.3);
    this.nota(620, 0.05, 0.09, "sine", 0.22);
  }

  /** Chorrito del vertido (siropes y leche). */
  vertido(): void {
    this.ruidoFiltrado({ dur: 0.55, tipo: "lowpass", fInicio: 1400, fFin: 320, vol: 0.22 });
    this.nota(220, 0.05, 0.35, "sine", 0.1);
  }

  /** Vapor de la vaporizadora (leches). */
  vapor(): void {
    this.ruidoFiltrado({ dur: 0.7, tipo: "bandpass", fInicio: 2600, fFin: 3400, q: 2.5, vol: 0.16 });
  }

  /** Molinillo de café (bases de espresso). */
  molinillo(): void {
    this.ruidoFiltrado({ dur: 0.45, tipo: "lowpass", fInicio: 900, fFin: 500, vol: 0.2, temblor: true });
    this.nota(90, 0, 0.3, "sawtooth", 0.06);
  }

  /** Ding brillante de "algo quedó listo". */
  ding(): void {
    this.nota(1318.5, 0, 0.14, "triangle", 0.2);
    this.nota(1760, 0.06, 0.16, "sine", 0.16);
  }

  /** Campana de cocina: un ingrediente está LISTO para recoger. */
  campana(): void {
    this.nota(1046.5, 0, 0.5, "sine", 0.22);
    this.nota(1568, 0.02, 0.4, "triangle", 0.12);
  }

  /** Campanilla de la puerta: ha entrado un cliente. */
  campanilla(): void {
    this.nota(1760, 0, 0.18, "sine", 0.14);
    this.nota(2349, 0.09, 0.22, "sine", 0.1);
  }

  /** Chisporroteo de sartén / tostadora al arrancar. */
  sarten(): void {
    this.ruidoFiltrado({ dur: 0.6, tipo: "highpass", fInicio: 2800, fFin: 4200, vol: 0.12 });
  }

  /** Alarma grave: algo SE QUEMÓ. */
  quemado(): void {
    this.nota(160, 0, 0.3, "square", 0.12);
    this.nota(120, 0.14, 0.34, "square", 0.12);
    this.ruidoFiltrado({ dur: 0.5, tipo: "lowpass", fInicio: 700, fFin: 200, vol: 0.14 });
  }

  /** Cliente que se marcha enfadado. */
  clienteSeVa(): void {
    this.nota(392, 0, 0.22, "triangle", 0.18);
    this.nota(294, 0.16, 0.3, "triangle", 0.16);
    this.nota(220, 0.34, 0.4, "sine", 0.14);
  }

  /** Tirar algo a la basura. */
  basura(): void {
    this.ruidoFiltrado({ dur: 0.35, tipo: "bandpass", fInicio: 1800, fFin: 500, q: 1.2, vol: 0.16 });
  }

  /** Clic cerámico de la taza (deshacer / limpiar). */
  taza(): void {
    this.nota(1900, 0, 0.05, "square", 0.06);
    this.nota(2540, 0.01, 0.07, "sine", 0.12);
  }

  /** Arpegio de éxito (pedido perfecto). */
  exito(): void {
    const seq = [N.C5, N.E5, N.G5, N.A5, N.C6];
    seq.forEach((f, i) => {
      this.nota(f, i * 0.07, 0.28, "sine", 0.26);
      this.nota(f * 2, i * 0.07, 0.15, "triangle", 0.07);
    });
  }

  /** Zumbido suave de error (combo roto, pero la bebida se conserva). */
  error(): void {
    this.nota(150, 0, 0.22, "sawtooth", 0.12);
    this.nota(110, 0.1, 0.28, "sawtooth", 0.1);
  }

  /** Fanfarria de récord histórico. */
  fanfarria(): void {
    const melodia: Array<[number, number]> = [
      [N.C5, 0], [N.C5, 0.12], [N.E5, 0.24], [N.G5, 0.36],
      [N.C6, 0.5], [N.G5, 0.66], [N.C6, 0.78], [N.E6, 0.96],
    ];
    melodia.forEach(([f, d]) => {
      this.nota(f, d, 0.3, "triangle", 0.26);
      this.nota(f / 2, d, 0.3, "sine", 0.12);
    });
    this.ruidoFiltrado({ inicio: 0.5, dur: 0.8, tipo: "highpass", fInicio: 5000, vol: 0.05 });
  }

  /** Tic tenue de los últimos 10 segundos. */
  tic(): void {
    this.nota(1250, 0, 0.03, "square", 0.08);
  }
}

/** Instancia única y perezosa del motor de sonido. */
export const sonido = new MotorSonido();
