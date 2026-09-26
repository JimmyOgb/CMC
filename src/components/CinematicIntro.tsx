import React, { useState, useEffect, useRef } from 'react';
import { ShieldCheck, Play, Pause, SkipForward, Volume2, VolumeX, Sparkles, ChevronRight, Activity, Terminal, ArrowRight, Zap, Globe, Layers } from 'lucide-react';

interface CinematicIntroProps {
  onComplete: () => void;
}

// Procedural Web Audio Synth for Anime Sci-Fi Sound Effects (Zero external audio files needed!)
class SciFiAudio {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playBlip(freq: number = 880, type: OscillatorType = 'sine') {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch (_) {}
  }

  public playWarp() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.45);
    } catch (_) {}
  }

  public playAlarm() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.setValueAtTime(420, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.21);
    } catch (_) {}
  }
}

const sfx = new SciFiAudio();

interface StoryAct {
  actNumber: string;
  kanjiTitle: string;
  title: string;
  subtitle: string;
  description: string;
  badge: string;
  themeColor: string;
  stats: { label: string; val: string }[];
  highlightAsset: string;
}

const ACTS: StoryAct[] = [
  {
    actNumber: 'ACT 01',
    kanjiTitle: '『断片化された世界』 // THE FRAGMENTATION',
    title: 'THE TOKENIZED FRONTIER',
    subtitle: '$12,000,000,000+ IN PHYSICAL CAPITAL MIGRATES ON-CHAIN',
    description: 'BlackRock, Ondo, and Securitize bring US Treasuries, Gold, and Equities into the decentralized world. But assets are scattered across isolated chains with zero unified visibility.',
    badge: 'STAGE: FRAGMENTED ASSETS',
    themeColor: '#3861FB',
    stats: [
      { label: 'GLOBAL RWA TVL', val: '$12.4B+' },
      { label: 'DISCONNECTED CHAINS', val: '15+ CHAINS' },
      { label: 'TRACKED ENTITIES', val: 'ISOLATED' },
    ],
    highlightAsset: 'BUIDL / USDY / PAXG',
  },
  {
    actNumber: 'ACT 02',
    kanjiTitle: '『価格乖離の危機』 // THE DE-PEG PERIL',
    title: 'THE LIQUIDITY ANOMALY',
    subtitle: 'SECONDARY DEX POOLS DEVIATE FROM NET ASSET VALUE',
    description: 'When secondary market traders panic, tokenized treasuries plunge below $1.0000 par. Without real-time spread detection, treasury managers face catastrophic slippage.',
    badge: 'ALERT: NAV SPREAD DETECTED',
    themeColor: '#EA3943',
    stats: [
      { label: 'SECONDARY SLIPPAGE', val: '-1.84% DIVERGENCE' },
      { label: 'PAR SPREAD SENSITIVITY', val: '±0.5% TOLERANCE' },
      { label: 'RISK DETECTION', val: 'CRITICAL' },
    ],
    highlightAsset: 'NAV vs DEX ARBITRAGE',
  },
  {
    actNumber: 'ACT 03',
    kanjiTitle: '『プロトコル覚醒』 // PROTOCOL AWAKENING',
    title: 'ENTER COINMARKETCAP V5',
    subtitle: 'NATIVE REAL-WORLD ASSET PRO API CONVERGENCE',
    description: 'CoinMarketCap unleashes the dedicated /v5/real-world-assets/* suite. Mapping stable RWA-IDs, real-time aggregate quotes, verified issuer compliance dossiers, and DEX market pairs.',
    badge: 'DEPLOYING: CMC PRO ENGINE',
    themeColor: '#00F0FF',
    stats: [
      { label: 'CMC API ENDPOINTS', val: '7 DEDICATED V5' },
      { label: 'ZERO-MOCK PIPELINE', val: '100% LIVE DATA' },
      { label: 'AI MCP COMPATIBLE', val: 'ENABLED' },
    ],
    highlightAsset: '/v5/real-world-assets/*',
  },
  {
    actNumber: 'ACT 04',
    kanjiTitle: '『機関投資家用端末』 // INSTITUTIONAL ORACLE',
    title: 'RWASENTRY INITIALIZED',
    subtitle: 'INTELLIGENCE TERMINAL & MODEL CONTEXT PROTOCOL (MCP)',
    description: 'Full institutional transparency unlocked. Universal RWA multi-asset screener, real-time NAV de-peg radar, issuer transparency dossiers, and an autonomous AI Due Diligence Copilot.',
    badge: 'SYSTEM STATUS: 100% ONLINE',
    themeColor: '#16C784',
    stats: [
      { label: 'AI TEAR SHEETS', val: 'INSTANT GENERATION' },
      { label: 'DEX POOL DEPTH', val: 'REAL-TIME UNISWAP/CURVE' },
      { label: 'HACKATHON TRACK', val: 'REAL WORLD ASSETS' },
    ],
    highlightAsset: 'RWASENTRY v5.0 PRO',
  },
];

const ACT_DURATION_MS = 5000;

export const CinematicIntro: React.FC<CinematicIntroProps> = ({ onComplete }) => {
  const [currentAct, setCurrentAct] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isWarping, setIsWarping] = useState(false);
  const [glitchText, setGlitchText] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const act = ACTS[currentAct];

  // 3D Canvas Cyberpunk Particle Constellation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes representing RWA tokens
    const nodeCount = 65;
    const nodes: {
      x: number;
      y: number;
      z: number;
      vx: number;
      vy: number;
      vz: number;
      label?: string;
      color: string;
      size: number;
    }[] = [];

    const tokenLabels = ['BUIDL', 'OUSG', 'USDY', 'USTB', 'PAXG', 'XAUT', 'bIB01', 'bNVDA', 'REALT'];

    for (let i = 0; i < nodeCount; i++) {
      const hasLabel = i < tokenLabels.length;
      nodes.push({
        x: (Math.random() - 0.5) * width * 1.2,
        y: (Math.random() - 0.5) * height * 1.2,
        z: Math.random() * 800 + 100,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        vz: -0.6,
        label: hasLabel ? tokenLabels[i] : undefined,
        color: hasLabel ? '#00F0FF' : i % 3 === 0 ? '#3861FB' : '#1E2548',
        size: hasLabel ? 4 : 2,
      });
    }

    let angle = 0;

    const render = () => {
      ctx.fillStyle = 'rgba(8, 11, 26, 0.35)';
      ctx.fillRect(0, 0, width, height);

      // Cyberpunk 3D perspective grid lines
      const cx = width / 2;
      const cy = height / 2;
      angle += 0.003;

      // Draw 3D nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.z += node.vz;
        node.x += node.vx;
        node.y += node.vy;

        if (node.z < 50) node.z = 900;
        if (node.x < -width) node.x = width;
        if (node.x > width) node.x = -width;
        if (node.y < -height) node.y = height;
        if (node.y > height) node.y = -height;

        // 3D projection
        const fov = 400;
        const scale = fov / (fov + node.z);
        const px = cx + node.x * scale;
        const py = cy + node.y * scale;

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dist = Math.hypot(node.x - other.x, node.y - other.y, node.z - other.z);
          if (dist < 180) {
            const otherScale = fov / (fov + other.z);
            const opx = cx + other.x * otherScale;
            const opy = cy + other.y * otherScale;
            const alpha = (1 - dist / 180) * 0.35;
            ctx.strokeStyle = node.label || other.label ? `rgba(56, 97, 251, ${alpha * 1.5})` : `rgba(30, 37, 72, ${alpha})`;
            ctx.lineWidth = node.label ? 1.5 : 0.8;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(opx, opy);
            ctx.stroke();
          }
        }

        // Draw node point
        const radius = node.size * scale * 2;
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = node.label ? 12 : 4;
        ctx.beginPath();
        ctx.arc(px, py, Math.max(1, radius), 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw floating token labels in 3D space
        if (node.label && scale > 0.4) {
          ctx.font = `bold ${Math.max(9, Math.floor(12 * scale))}px "JetBrains Mono", monospace`;
          ctx.fillStyle = '#FFFFFF';
          ctx.fillText(`[ ${node.label} ]`, px + 8, py - 4);
          ctx.font = `normal ${Math.max(7, Math.floor(9 * scale))}px "JetBrains Mono", monospace`;
          ctx.fillStyle = '#00F0FF';
          ctx.fillText(`CMC_RWA_${1000 + i}`, px + 8, py + 8);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleLaunchTerminal = () => {
    sfx.playWarp();
    setIsWarping(true);
    setTimeout(() => {
      onComplete();
    }, 700);
  };

  // Automatic progression timer: moves every 4.8 seconds automatically through acts and then into terminal
  useEffect(() => {
    if (!isAutoPlaying || isWarping) return;

    const intervalTime = 50;
    const increment = (intervalTime / ACT_DURATION_MS) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev + increment >= 100) {
          if (currentAct < ACTS.length - 1) {
            sfx.playBlip(750 + (currentAct + 1) * 120, 'sine');
            setCurrentAct((a) => a + 1);
            return 0;
          } else {
            // Act 4 completed: automatically launch terminal!
            clearInterval(timer);
            handleLaunchTerminal();
            return 100;
          }
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [currentAct, isAutoPlaying, isWarping]);

  const handleNextAct = () => {
    sfx.playBlip(900, 'sine');
    setProgress(0);
    if (currentAct < ACTS.length - 1) {
      setCurrentAct((a) => a + 1);
    } else {
      handleLaunchTerminal();
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sfx.enabled = next;
    if (next) sfx.playBlip(880);
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-[#080B1A] transition-all duration-700 ${
        isWarping ? 'scale-125 opacity-0 blur-xl' : 'scale-100 opacity-100'
      }`}
    >
      {/* Background 3D Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Cyberpunk Vignette & Scanlines */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#080B1A]/40 to-[#080B1A]/95 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,23,46,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-30" />

      {/* Top Anime HUD Bar */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        {/* Left: App Identity & System Code */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#3861FB] to-[#00F0FF] p-0.5 flex items-center justify-center shadow-lg shadow-[#3861FB]/30">
            <div className="w-full h-full bg-[#080B1A] rounded-[7px] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#3861FB]" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-extrabold tracking-wider text-white font-mono">
                RWA<span className="text-[#3861FB]">SENTRY</span>
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#3861FB]/20 text-[#3861FB] border border-[#3861FB]/40">
                PRO-V5 // 2026
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              COINMARKETCAP API SURVEILLANCE MATRIX
            </p>
          </div>
        </div>

        {/* Center: Kanji / Tactical Title */}
        <div className="hidden md:flex flex-col items-center font-mono">
          <span className="text-xs font-bold text-[#00F0FF] tracking-widest animate-pulse">
            {act.kanjiTitle}
          </span>
          <span className="text-[10px] text-slate-400">
            SYSTEM BOOT: SEQUENCE {currentAct + 1} OF 4
          </span>
        </div>

        {/* Right: Audio Toggle, Auto-Play Toggle & Skip */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`p-2 rounded-lg border text-xs flex items-center space-x-1.5 font-mono transition-all ${
              isAutoPlaying
                ? 'bg-[#3861FB]/20 border-[#3861FB]/50 text-[#00F0FF]'
                : 'bg-[#12172E] border-[#1E2548] text-slate-400 hover:text-white'
            }`}
            title="Toggle Automatic Sequence Playback"
          >
            {isAutoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="hidden sm:inline">{isAutoPlaying ? 'AUTO ON' : 'PAUSED'}</span>
          </button>

          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-[#12172E] border border-[#1E2548] text-slate-300 hover:text-white transition-all text-xs flex items-center space-x-1.5 font-mono"
            title="Toggle Synthesizer Sound"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
            <span className="hidden sm:inline">{soundEnabled ? 'SFX ON' : 'MUTED'}</span>
          </button>

          <button
            onClick={handleLaunchTerminal}
            className="px-3.5 py-1.5 rounded-lg bg-[#1E2548]/80 hover:bg-[#3861FB] text-slate-200 hover:text-white border border-slate-700 text-xs font-mono font-semibold transition-all flex items-center space-x-1 shadow-md"
          >
            <span>SKIP INTRO</span>
            <SkipForward className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>

      {/* Main Cinematic Stage */}
      <div className="relative z-20 max-w-5xl mx-auto px-6 h-[calc(100vh-140px)] flex flex-col justify-center items-center text-center">
        {/* Glowing Anime Crosshair Frame */}
        <div className="relative w-full p-8 sm:p-12 rounded-3xl border border-[#1E2548] bg-[#0C1024]/70 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-500">
          {/* Neon Corner Brackets */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#3861FB]" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#3861FB]" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#3861FB]" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#3861FB]" />

          {/* Holographic Glowing Light Streak */}
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
            style={{ backgroundColor: act.themeColor }}
          />

          {/* Animated Auto-Advance Progress Line */}
          <div className="w-full bg-[#1E2548]/60 h-1.5 rounded-full overflow-hidden mb-6 relative">
            <div
              className="h-full transition-all duration-75 ease-linear rounded-full"
              style={{
                width: `${progress}%`,
                backgroundColor: act.themeColor,
                boxShadow: `0 0 12px ${act.themeColor}`,
              }}
            />
          </div>

          {/* Act Badge & Tag */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
            <span
              className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider border shadow-md"
              style={{
                backgroundColor: `${act.themeColor}15`,
                color: act.themeColor,
                borderColor: `${act.themeColor}40`,
              }}
            >
              {act.actNumber} • {act.badge}
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-[#080B1A] px-2.5 py-1 rounded-full border border-[#1E2548]">
              TARGET: {act.highlightAsset}
            </span>
          </div>

          {/* Giant Anime Hero Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase font-sans drop-shadow-lg">
            {act.title}
          </h1>

          {/* Subtitle with High-Tech Font */}
          <p className="mt-2 text-xs sm:text-sm font-mono font-bold tracking-widest text-[#00F0FF] uppercase">
            // {act.subtitle}
          </p>

          {/* Cinematic Narrative Body */}
          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
            {act.description}
          </p>

          {/* High-Impact Stat Blocks */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto">
            {act.stats.map((st, i) => (
              <div
                key={i}
                className="p-3.5 bg-[#080B1A]/80 rounded-xl border border-[#1E2548] text-left transform transition-transform hover:-translate-y-0.5"
              >
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider truncate">
                  {st.label}
                </div>
                <div className="text-base sm:text-lg font-mono font-extrabold text-white mt-0.5">
                  {st.val}
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Action Controls */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {currentAct < ACTS.length - 1 ? (
              <button
                onClick={handleNextAct}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#3861FB] to-[#00F0FF] hover:opacity-90 text-white font-bold text-xs sm:text-sm font-mono tracking-wider shadow-lg shadow-[#3861FB]/30 transition-all flex items-center space-x-2"
              >
                <span>ADVANCE SEQUENCE</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleLaunchTerminal}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#16C784] via-[#00F0FF] to-[#3861FB] text-white font-extrabold text-sm sm:text-base font-mono tracking-wider shadow-2xl shadow-emerald-500/30 transition-all flex items-center space-x-2 animate-pulse hover:scale-105"
              >
                <Zap className="w-5 h-5 fill-current" />
                <span>INITIALIZE RWASENTRY TERMINAL</span>
                <ArrowRight className="w-5 h-5 ml-1" />
              </button>
            )}

            <button
              onClick={handleLaunchTerminal}
              className="px-5 py-3 rounded-xl bg-[#12172E] hover:bg-[#1E2548] border border-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-mono transition-all"
            >
              DIRECT TERMINAL ACCESS →
            </button>
          </div>
        </div>

        {/* Step Timeline Indicator */}
        <div className="mt-6 flex items-center space-x-2">
          {ACTS.map((a, idx) => (
            <button
              key={idx}
              onClick={() => {
                sfx.playBlip(700 + idx * 100);
                setCurrentAct(idx);
                setProgress(0);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                currentAct === idx
                  ? 'w-10 bg-[#3861FB]'
                  : currentAct > idx
                  ? 'w-4 bg-emerald-400'
                  : 'w-4 bg-slate-700'
              }`}
              title={a.title}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
