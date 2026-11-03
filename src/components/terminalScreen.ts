import { sound } from '../audio';

export interface TerminalScreenOptions {
  onComplete: () => void;
}

export class TerminalScreen {
  private container: HTMLElement;
  private isCancelled: boolean = false;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public render(options: TerminalScreenOptions) {
    this.isCancelled = false;
    this.container.innerHTML = `
      <div class="w-full max-w-lg mx-auto flex flex-col items-center justify-center min-h-[70vh] p-4 font-mono select-none">
        <!-- Terminal Outer Window -->
        <div class="w-full bg-[#08090d] border-2 border-emerald-500 rounded-lg shadow-[0_0_35px_rgba(34,197,94,0.25)] overflow-hidden">
          <!-- Terminal Titlebar -->
          <div class="bg-emerald-950/80 border-b border-emerald-500/50 px-3 py-2 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-red-500"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span class="text-xs text-emerald-300 font-bold ml-1 tracking-wider">NEURO_DIAGNOSTICS_V3.SH</span>
            </div>
            <div class="text-[10px] text-emerald-400 font-bold animate-pulse">
              [ANALYZING ROT]
            </div>
          </div>

          <!-- Terminal Content Area -->
          <div class="p-4 sm:p-5 text-xs text-emerald-400 space-y-2 h-72 overflow-y-auto" id="terminal-log-output">
            <!-- Dynamic logs will be appended here -->
          </div>

          <!-- Bottom Status Bar -->
          <div class="p-3 bg-black/80 border-t border-emerald-500/30 flex flex-col gap-2">
            <div class="flex justify-between text-[11px] text-emerald-300 font-bold">
              <span id="terminal-status-phase">INITIALIZING TELEMETRY...</span>
              <span id="terminal-percent">0%</span>
            </div>
            <div class="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-emerald-500/40">
              <div id="terminal-progress-bar" class="h-full bg-emerald-400 w-0 transition-all duration-150"></div>
            </div>
          </div>
        </div>

        <p class="text-xs text-slate-500 mt-4 text-center">
          Preparing existential reality check. Do not close browser.
        </p>
      </div>
    `;

    this.runDiagnosticSequence(options.onComplete);
  }

  private async runDiagnosticSequence(onComplete: () => void) {
    const logsContainer = document.getElementById('terminal-log-output');
    const statusPhase = document.getElementById('terminal-status-phase');
    const percentEl = document.getElementById('terminal-percent');
    const progressBar = document.getElementById('terminal-progress-bar');

    const steps = [
      { text: '>> INITIATING BIOMETRIC & TELEMETRY HANDSHAKE...', delay: 200, pct: 15 },
      { text: '>> PARSING SHORT-FORM DOPAMINE LOOPS (REELS / TIKTOK)...', delay: 350, pct: 30 },
      { text: '>> CALCULATING PREFRONTAL CORTEX ATROPHY COEFFICIENT...', delay: 350, pct: 50 },
      { text: '>> ANALYZING CHRONIC NEUROTICISM & RABBIT HOLE VECTOR...', delay: 400, pct: 68 },
      { text: '>> ESTIMATING SQUANDERED WAKING DAYS (75-YR LIFESPAN)...', delay: 400, pct: 85 },
      { text: '>> SYNTHESIZING UNFILTERED LETHALITY ROAST PAYLOAD...', delay: 350, pct: 98 },
      { text: '>> DIAGNOSIS COMPILED. UNMASKING ARCHETYPE...', delay: 250, pct: 100 },
    ];

    for (const step of steps) {
      if (this.isCancelled) return;

      await new Promise((r) => setTimeout(r, step.delay));
      sound.playTerminalTick();

      if (logsContainer) {
        const line = document.createElement('div');
        line.className = 'font-mono leading-relaxed';
        if (step.pct >= 85) {
          line.classList.add('text-amber-300', 'font-bold');
        } else if (step.pct === 100) {
          line.classList.add('text-white', 'font-black');
        }
        line.textContent = step.text;
        logsContainer.appendChild(line);
        logsContainer.scrollTop = logsContainer.scrollHeight;
      }

      if (statusPhase) statusPhase.textContent = step.text.replace('>> ', '');
      if (percentEl) percentEl.textContent = `${step.pct}%`;
      if (progressBar) progressBar.style.width = `${step.pct}%`;
    }

    await new Promise((r) => setTimeout(r, 300));
    sound.playRevealFanfare();
    onComplete();
  }

  public destroy() {
    this.isCancelled = true;
  }
}
