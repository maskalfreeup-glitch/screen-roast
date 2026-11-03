import { sound } from '../audio';

export interface AdCompletedPayload {
  txId: string;
  signature: string;
  timestamp: string;
}

export class MockAdModal {
  private container: HTMLElement | null = null;
  private timerInterval: number | null = null;
  private secondsLeft: number = 15;
  private onCompleteCallback: ((payload: AdCompletedPayload) => void) | null = null;
  private isVerifying: boolean = false;

  public show(onComplete: (payload: AdCompletedPayload) => void) {
    this.onCompleteCallback = onComplete;
    this.secondsLeft = 15;
    this.isVerifying = false;
    sound.playClick(440);
    this.render();
    this.startTimer();
  }

  public close() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    this.container = null;
  }

  private startTimer() {
    const timerEl = document.getElementById('ad-timer-countdown');
    const progressBar = document.getElementById('ad-progress-bar');
    const closeBtn = document.getElementById('ad-close-btn') as HTMLButtonElement;

    this.timerInterval = window.setInterval(() => {
      this.secondsLeft--;
      sound.playTerminalTick();

      if (timerEl) {
        timerEl.textContent = `${this.secondsLeft}s`;
      }
      if (progressBar) {
        const percent = ((15 - this.secondsLeft) / 15) * 100;
        progressBar.style.width = `${percent}%`;
      }

      if (this.secondsLeft <= 0) {
        if (this.timerInterval) {
          clearInterval(this.timerInterval);
          this.timerInterval = null;
        }
        this.runSSVVerification(closeBtn);
      }
    }, 1000);
  }

  private async runSSVVerification(closeBtn: HTMLButtonElement | null) {
    this.isVerifying = true;
    const terminalLog = document.getElementById('ad-terminal-log');
    if (terminalLog) {
      terminalLog.classList.remove('hidden');
      terminalLog.innerHTML = `
        <div class="text-amber-400 font-mono text-xs animate-pulse">
          ⚡ TRANSMITTING SSV REWARD PAYLOAD TO VERIFICATION SERVER...
        </div>
      `;
    }

    sound.playGlitch();

    // Emulate server round-trip SSV validation (500ms)
    await new Promise((r) => setTimeout(r, 600));

    const mockTx = 'tx_' + Math.random().toString(36).substring(2, 10);
    const mockSig = '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const timestamp = new Date().toISOString();

    if (terminalLog) {
      terminalLog.innerHTML = `
        <div class="text-emerald-400 font-mono text-xs">
          ✓ SSV SERVER VERIFIED [HTTP 200 OK]<br>
          SIGNATURE: ${mockSig.substring(0, 18)}...<br>
          WATERMARK STRIPPED & UNFILTERED ROAST UNLOCKED!
        </div>
      `;
    }

    sound.playUnlockJingle();

    if (closeBtn) {
      closeBtn.disabled = false;
      closeBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      closeBtn.classList.add('bg-emerald-500', 'text-black', 'hover:bg-emerald-400');
      closeBtn.innerHTML = 'CLAIM UNFILTERED ROAST ✕';
      closeBtn.onclick = () => {
        const payload: AdCompletedPayload = {
          txId: mockTx,
          signature: mockSig,
          timestamp,
        };
        this.close();
        if (this.onCompleteCallback) {
          this.onCompleteCallback(payload);
        }
      };
    }
  }

  private render() {
    this.container = document.createElement('div');
    this.container.id = 'mock-ad-modal-overlay';
    this.container.className =
      'fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-fade-in';

    this.container.innerHTML = `
      <div class="relative w-full max-w-sm bg-[#0e1017] border-2 border-amber-400 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.25)] flex flex-col">
        <!-- Top Ad Unit Banner -->
        <div class="bg-amber-400 text-black px-3 py-2 flex items-center justify-between font-mono text-xs font-bold tracking-wider">
          <div class="flex items-center gap-1.5">
            <span class="inline-block w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span>SPONSORED REWARD AD // SSV PROTECTED</span>
          </div>
          <div class="flex items-center gap-2">
            <span>REWARD IN:</span>
            <span id="ad-timer-countdown" class="bg-black text-amber-400 px-2 py-0.5 rounded font-black text-sm">15s</span>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="w-full bg-slate-800 h-1.5">
          <div id="ad-progress-bar" class="bg-amber-400 h-full w-0 transition-all duration-1000 ease-linear"></div>
        </div>

        <!-- Fake Interactive Playable Mobile Game / Brainrot Parody Video -->
        <div class="relative h-80 bg-gradient-to-b from-[#180829] to-[#0a0512] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
          <!-- Animated Background Elements -->
          <div class="absolute inset-0 opacity-20 pointer-events-none">
            <div class="absolute -top-10 -left-10 w-40 h-40 bg-pink-500 rounded-full blur-3xl animate-pulse"></div>
            <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-cyan-500 rounded-full blur-3xl animate-pulse"></div>
          </div>

          <!-- Parody Game Characters -->
          <div class="relative z-10 flex items-center justify-center gap-6 mb-4">
            <div class="flex flex-col items-center">
              <span class="text-4xl animate-bounce">🧟‍♂️</span>
              <span class="text-[10px] font-mono bg-red-950 border border-red-500 text-red-300 px-1.5 py-0.5 rounded mt-1">LVL 1 ROT</span>
            </div>
            <span class="text-2xl font-black text-amber-400 italic">VS</span>
            <div class="flex flex-col items-center">
              <span class="text-4xl animate-pulse">👑</span>
              <span class="text-[10px] font-mono bg-emerald-950 border border-emerald-500 text-emerald-300 px-1.5 py-0.5 rounded mt-1">LVL 99 MONK</span>
            </div>
          </div>

          <h3 class="relative z-10 text-xl font-black text-white uppercase tracking-tight mb-1 font-mono">
            BRAINROT SLAPPER 3D
          </h3>
          <p class="relative z-10 text-xs text-amber-200/80 font-mono mb-4">
            "Only 0.01% with 10+ hours screen time can beat this level!"
          </p>

          <!-- Interactive Clicker Target -->
          <button id="ad-interactive-slap" class="relative z-10 bg-gradient-to-r from-amber-500 to-pink-500 hover:from-amber-400 hover:to-pink-400 text-black font-black font-mono text-sm px-6 py-2.5 rounded-full shadow-lg active:scale-95 transition-all">
            👋 TAP TO SLAP DOPAMINE
          </button>
          <div id="slap-counter" class="text-[11px] font-mono text-emerald-400 mt-2">Dopamine Hits: 0</div>
        </div>

        <!-- Terminal Verification Log -->
        <div id="ad-terminal-log" class="hidden px-4 py-2 bg-black/90 border-t border-slate-800 text-[11px]"></div>

        <!-- Footer Action Area -->
        <div class="p-3 bg-[#0a0a0f] border-t border-slate-800 flex items-center justify-between">
          <div class="text-[11px] text-slate-400 font-mono">
            Watch complete ad to verify token
          </div>
          <button id="ad-close-btn" disabled class="px-4 py-2 rounded text-xs font-mono font-bold uppercase transition-all opacity-50 cursor-not-allowed bg-slate-800 text-slate-400">
            Wait for Reward...
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.container);

    // Mini interactive dopamine clicker to keep user entertained during the 15s
    const slapBtn = document.getElementById('ad-interactive-slap');
    const slapCountEl = document.getElementById('slap-counter');
    let hits = 0;
    if (slapBtn && slapCountEl) {
      slapBtn.onclick = () => {
        hits++;
        slapCountEl.textContent = `Dopamine Hits: ${hits} (Synthesizing...)`;
        sound.playClick(600 + hits * 30);
      };
    }

    // Attempting to close early shows alert toast
    const closeBtn = document.getElementById('ad-close-btn') as HTMLButtonElement;
    closeBtn.onclick = () => {
      if (!this.isVerifying && this.secondsLeft > 0) {
        sound.playGlitch();
        alert(`You must watch the full 15s to verify SSV reward! (${this.secondsLeft}s remaining)`);
      }
    };
  }
}
