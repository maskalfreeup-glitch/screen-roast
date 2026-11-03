import { sound } from '../audio';
import { analyzeScreenshot } from '../engines/ocrAnalyzer';
import { DEFAULT_APPS } from '../engines/roastEngine';
import { AppStat, UserInputData } from '../types';

export interface InputScreenOptions {
  onSubmit: (data: UserInputData) => void;
}

export class InputScreen {
  private container: HTMLElement;
  private apps: AppStat[] = JSON.parse(JSON.stringify(DEFAULT_APPS));
  private age: number = 24;
  private screenshotFile: File | null = null;
  private screenshotPreviewUrl: string | null = null;

  constructor(container: HTMLElement) {
    this.container = container;
  }

  public render(options: InputScreenOptions) {
    const totalDailyHours = Number(
      this.apps.reduce((sum, a) => sum + a.hours, 0).toFixed(1)
    );

    this.container.innerHTML = `
      <div class="w-full max-w-xl mx-auto px-4 py-6 font-mono select-none space-y-6">
        <!-- Hero Header -->
        <div class="text-center space-y-2">
          <div class="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs px-3 py-1 rounded-full font-bold">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            NEURAL SCREEN TIME AUTOPSY
          </div>
          <h1 class="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase glitch-title">
            SCREEN <span class="text-emerald-400">ROAST</span>
          </h1>
          <p class="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
            The AI Screen-Time & Brain-Rot Mirror. Discover your archetype and the exact years of life you’ve donated to tech billionaires.
          </p>
        </div>

        <!-- Quick Presets -->
        <div class="flex items-center justify-center gap-2 flex-wrap text-xs">
          <span class="text-slate-500 text-[11px]">PRESETS:</span>
          <button id="preset-genz" class="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-md text-[11px] active:scale-95 transition-all">
            Gen-Z Doom (7.8h)
          </button>
          <button id="preset-techbro" class="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-md text-[11px] active:scale-95 transition-all">
            Tech Bro Void (10.5h)
          </button>
          <button id="preset-monk" class="bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 px-2.5 py-1 rounded-md text-[11px] active:scale-95 transition-all">
            Digital Monk (2.1h)
          </button>
        </div>

        <!-- Input Mode Tabs / Section -->
        <div class="bg-[#0e1118] border border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xl space-y-5">
          <!-- Screenshot Dropzone -->
          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>METHOD A: UPLOAD SCREEN TIME SCREENSHOT</span>
              <span class="text-[10px] text-emerald-400 font-semibold">AUTO-OCR SCANNER</span>
            </label>

            <div
              id="dropzone-area"
              class="relative border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-lg p-4 text-center cursor-pointer bg-black/40 hover:bg-emerald-950/10 transition-all flex flex-col items-center justify-center min-h-[110px]"
            >
              <input
                type="file"
                id="screenshot-input"
                accept="image/*"
                class="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <div id="dropzone-prompt" class="${this.screenshotPreviewUrl ? 'hidden' : 'flex flex-col items-center gap-1.5'}">
                <span class="text-2xl">📸</span>
                <span class="text-xs text-slate-300 font-semibold">Drop iOS / Android Screen Time image here</span>
                <span class="text-[10px] text-slate-500">or click to browse from device</span>
              </div>

              <!-- OCR Scanning Indicator & Preview -->
              <div id="dropzone-preview" class="${this.screenshotPreviewUrl ? 'flex' : 'hidden'} items-center gap-3 w-full">
                <img
                  id="preview-img"
                  src="${this.screenshotPreviewUrl || ''}"
                  alt="Screenshot"
                  class="w-14 h-14 object-cover rounded border border-emerald-500/50"
                />
                <div class="text-left flex-1">
                  <div id="ocr-status-badge" class="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <span>✓ SCREENSHOT ANALYZED</span>
                  </div>
                  <div id="ocr-status-sub" class="text-[10px] text-slate-400">
                    Sliders auto-populated from visual telemetry
                  </div>
                </div>
                <button
                  id="remove-screenshot-btn"
                  type="button"
                  class="text-xs text-red-400 hover:text-red-300 p-1"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <div class="relative flex py-1 items-center">
            <div class="flex-grow border-t border-slate-800"></div>
            <span class="flex-shrink mx-3 text-[11px] text-slate-500 uppercase font-semibold">OR FINE-TUNE APP SLIDERS</span>
            <div class="flex-grow border-t border-slate-800"></div>
          </div>

          <!-- Age Selector (Crucial for Lifetime math) -->
          <div class="bg-black/50 border border-slate-800/80 p-3 rounded-lg flex items-center justify-between gap-4">
            <div>
              <span class="text-xs font-bold text-slate-200">YOUR CURRENT AGE:</span>
              <p class="text-[10px] text-slate-500">Used to project squandered conscious years</p>
            </div>
            <div class="flex items-center gap-3">
              <input
                id="age-slider"
                type="range"
                min="14"
                max="70"
                value="${this.age}"
                class="w-28 accent-emerald-400"
              />
              <span id="age-display" class="text-emerald-400 font-black text-sm w-10 text-right">${this.age}y</span>
            </div>
          </div>

          <!-- Sliders Container -->
          <div class="space-y-3.5" id="sliders-list">
            ${this.apps
              .map(
                (app) => `
              <div class="space-y-1">
                <div class="flex justify-between items-center text-xs">
                  <span class="flex items-center gap-1.5 text-slate-200 font-semibold">
                    <span>${app.icon}</span>
                    <span>${app.name}</span>
                    <span class="text-[10px] text-slate-500 font-normal">(${app.category})</span>
                  </span>
                  <span class="font-bold text-emerald-400" id="val-${app.id}">
                    ${app.hours}h/day
                  </span>
                </div>
                <div class="relative flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.5"
                    value="${app.hours}"
                    data-app-id="${app.id}"
                    class="app-slider w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            `
              )
              .join('')}
          </div>

          <!-- Total Daily Screen Time Summary Bar -->
          <div class="p-3 bg-black/70 border border-emerald-500/30 rounded-lg flex items-center justify-between">
            <span class="text-xs font-bold text-slate-300">TOTAL DAILY ROT:</span>
            <span id="total-hours-counter" class="text-base font-black text-emerald-400">
              ${totalDailyHours} HOURS / DAY
            </span>
          </div>

          <!-- Main CTA Roast Button -->
          <button
            id="calculate-roast-btn"
            class="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black text-base py-3.5 px-4 rounded-lg tracking-wider uppercase shadow-[0_0_25px_rgba(34,197,94,0.4)] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
          >
            <span>🔥 CALCULATE DOOM // ROAST ME</span>
            <span class="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        <!-- Footer Disclaimers -->
        <div class="text-center text-[10px] text-slate-600 font-mono">
          Screen Roast 100% Client-Side Engine // No personal screen data is sent to external servers.
        </div>
      </div>
    `;

    this.bindEvents(options);
  }

  private bindEvents(options: InputScreenOptions) {
    // Age slider
    const ageSlider = document.getElementById('age-slider') as HTMLInputElement;
    const ageDisplay = document.getElementById('age-display');
    if (ageSlider && ageDisplay) {
      ageSlider.oninput = () => {
        this.age = parseInt(ageSlider.value, 10);
        ageDisplay.textContent = `${this.age}y`;
        sound.playClick(350);
      };
    }

    // App Sliders
    const sliders = document.querySelectorAll('.app-slider') as NodeListOf<HTMLInputElement>;
    sliders.forEach((slider) => {
      slider.oninput = () => {
        const appId = slider.dataset.appId;
        const app = this.apps.find((a) => a.id === appId);
        if (app) {
          app.hours = parseFloat(slider.value);
          const valEl = document.getElementById(`val-${app.id}`);
          if (valEl) valEl.textContent = `${app.hours}h/day`;
          this.updateTotalHours();
          sound.playClick(500 + app.hours * 30);
        }
      };
    });

    // Preset buttons
    const btnGenZ = document.getElementById('preset-genz');
    const btnTechBro = document.getElementById('preset-techbro');
    const btnMonk = document.getElementById('preset-monk');

    btnGenZ?.addEventListener('click', () => {
      this.applyPreset({ tiktok: 3.5, instagram: 2.5, youtube: 1.0, dating: 0.8, reddit: 0.0 });
    });
    btnTechBro?.addEventListener('click', () => {
      this.applyPreset({ twitter: 3.5, reddit: 3.0, youtube: 2.5, tiktok: 1.5 });
    });
    btnMonk?.addEventListener('click', () => {
      this.applyPreset({ youtube: 1.0, reddit: 0.5, twitter: 0.5, tiktok: 0, instagram: 0 });
    });

    // File Dropzone / Screenshot OCR
    const fileInput = document.getElementById('screenshot-input') as HTMLInputElement;
    const dropzone = document.getElementById('dropzone-area');
    const removeBtn = document.getElementById('remove-screenshot-btn');

    if (fileInput) {
      fileInput.onchange = async () => {
        if (fileInput.files && fileInput.files[0]) {
          await this.handleFile(fileInput.files[0]);
        }
      };
    }

    if (dropzone) {
      dropzone.ondragover = (e) => {
        e.preventDefault();
        dropzone.classList.add('border-emerald-400', 'bg-emerald-950/20');
      };
      dropzone.ondragleave = () => {
        dropzone.classList.remove('border-emerald-400', 'bg-emerald-950/20');
      };
      dropzone.ondrop = async (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-emerald-400', 'bg-emerald-950/20');
        if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
          await this.handleFile(e.dataTransfer.files[0]);
        }
      };
    }

    if (removeBtn) {
      removeBtn.onclick = (e) => {
        e.stopPropagation();
        this.screenshotFile = null;
        this.screenshotPreviewUrl = null;
        this.render(options);
      };
    }

    // Submit button
    const calcBtn = document.getElementById('calculate-roast-btn');
    if (calcBtn) {
      calcBtn.onclick = () => {
        sound.playGlitch();
        options.onSubmit({
          age: this.age,
          apps: this.apps,
          screenshotFile: this.screenshotFile,
          screenshotDataUrl: this.screenshotPreviewUrl || undefined,
        });
      };
    }
  }

  private applyPreset(presetMap: Record<string, number>) {
    sound.playClick(650);
    this.apps.forEach((app) => {
      if (presetMap[app.id] !== undefined) {
        app.hours = presetMap[app.id];
      } else {
        app.hours = 0;
      }
      const slider = document.querySelector(`input[data-app-id="${app.id}"]`) as HTMLInputElement;
      const valEl = document.getElementById(`val-${app.id}`);
      if (slider) slider.value = String(app.hours);
      if (valEl) valEl.textContent = `${app.hours}h/day`;
    });
    this.updateTotalHours();
  }

  private async handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG/JPEG/WebP)');
      return;
    }
    sound.playTerminalTick();

    const ocrStatus = document.getElementById('ocr-status-badge');
    const promptEl = document.getElementById('dropzone-prompt');
    const previewEl = document.getElementById('dropzone-preview');
    const previewImg = document.getElementById('preview-img') as HTMLImageElement;

    if (promptEl) promptEl.classList.add('hidden');
    if (previewEl) previewEl.classList.remove('hidden');
    if (ocrStatus) ocrStatus.innerHTML = '<span class="animate-pulse">SCANNING TELEMETRY OCR...</span>';

    try {
      const result = await analyzeScreenshot(file);
      this.screenshotFile = file;
      this.screenshotPreviewUrl = result.sourcePreviewUrl;

      if (previewImg) previewImg.src = result.sourcePreviewUrl;
      if (ocrStatus) {
        ocrStatus.innerHTML = `<span>✓ DETECTED ${result.detectedHours}H DAILY USAGE (${result.confidence}% CONFIDENCE)</span>`;
      }

      // Pre-fill sliders from OCR extraction
      result.detectedApps.forEach((detected) => {
        const target = this.apps.find((a) => a.id === detected.id);
        if (target) {
          target.hours = detected.hours;
          const slider = document.querySelector(`input[data-app-id="${target.id}"]`) as HTMLInputElement;
          const valEl = document.getElementById(`val-${target.id}`);
          if (slider) slider.value = String(target.hours);
          if (valEl) valEl.textContent = `${target.hours}h/day`;
        }
      });

      this.updateTotalHours();
      sound.playSuccess();
    } catch {
      alert('Error parsing screenshot. Sliders remain available.');
    }
  }

  private updateTotalHours() {
    const total = Number(
      this.apps.reduce((sum, a) => sum + a.hours, 0).toFixed(1)
    );
    const counter = document.getElementById('total-hours-counter');
    if (counter) {
      counter.textContent = `${total} HOURS / DAY`;
      if (total >= 8) {
        counter.className = 'text-base font-black text-red-500 animate-pulse';
      } else if (total >= 5) {
        counter.className = 'text-base font-black text-amber-400';
      } else {
        counter.className = 'text-base font-black text-emerald-400';
      }
    }
  }
}
