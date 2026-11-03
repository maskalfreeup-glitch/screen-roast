import { sound } from '../audio';
import { StoryCardRenderer } from '../engines/canvasRenderer';
import { RoastResult } from '../types';
import { MockAdModal } from './mockAdModal';

export interface RoastScreenOptions {
  roast: RoastResult;
  onReset: () => void;
}

export class RoastScreen {
  private container: HTMLElement;
  private roast: RoastResult;
  private onReset: () => void;
  private adModal: MockAdModal = new MockAdModal();
  private isExporting: boolean = false;

  constructor(container: HTMLElement, options: RoastScreenOptions) {
    this.container = container;
    this.roast = options.roast;
    this.onReset = options.onReset;
  }

  public async render() {
    this.container.innerHTML = `
      <div class="w-full max-w-xl mx-auto px-4 py-6 font-mono select-none space-y-6 animate-fade-in">
        <!-- Top Status Bar / Reset -->
        <div class="flex items-center justify-between">
          <button id="btn-back-reset" class="text-xs text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors">
            <span>←</span>
            <span>ROAST ANOTHER VICTIM</span>
          </button>
          <div class="flex items-center gap-2">
            <span class="inline-block w-2 h-2 rounded-full ${this.roast.isUnlocked ? 'bg-amber-400' : 'bg-emerald-400'} animate-pulse"></span>
            <span class="text-[11px] font-bold ${this.roast.isUnlocked ? 'text-amber-400' : 'text-emerald-400'}">
              ${this.roast.isUnlocked ? 'VIP UNFILTERED DOSSIER' : 'PUBLIC DIAGNOSTIC CARD'}
            </span>
          </div>
        </div>

        <!-- The Roast Card Preview Section -->
        <div class="relative group">
          <!-- Live Canvas Container (Scaled down for mobile screen display) -->
          <div
            id="canvas-preview-wrapper"
            class="w-full rounded-xl overflow-hidden border-2 ${
              this.roast.isUnlocked ? 'border-amber-400 shadow-[0_0_35px_rgba(234,179,8,0.25)]' : 'border-emerald-500/60 shadow-[0_0_35px_rgba(34,197,94,0.2)]'
            } bg-[#0a0a0c] flex items-center justify-center p-1 sm:p-2 relative"
          >
            <div id="canvas-loading" class="text-xs text-emerald-400 py-20 flex flex-col items-center gap-2">
              <span class="animate-spin text-2xl">⚙️</span>
              <span>RENDERING 1080x1920 CANVAS STORY CARD...</span>
            </div>
          </div>
        </div>

        <!-- Monetization / Unlock Banner -->
        ${
          !this.roast.isUnlocked
            ? `
          <div class="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border-2 border-amber-400/80 rounded-xl p-4 text-center space-y-2.5">
            <div class="flex items-center justify-center gap-2 text-amber-400 font-black text-xs sm:text-sm uppercase tracking-wide">
              <span>🔥 WANT THE BRUTAL TRUTH?</span>
            </div>
            <p class="text-xs text-slate-300">
              The AI was polite. Unlock the <strong class="text-amber-300">Deep Unfiltered Forensic Roast</strong> & remove the watermark by enduring a 15-second sponsor test.
            </p>
            <button
              id="btn-trigger-ad"
              class="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-xs sm:text-sm py-3 px-4 rounded-lg uppercase tracking-wider shadow-lg active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>⚡ UNLOCK DEEP ROAST + REMOVE WATERMARK (15s AD)</span>
            </button>
          </div>
        `
            : `
          <div class="bg-amber-950/30 border border-amber-400/60 rounded-xl p-3 text-center flex items-center justify-between text-xs text-amber-300">
            <span class="flex items-center gap-1.5 font-bold">
              <span>★ VIP UNFILTERED ROAST ACTIVE</span>
            </span>
            <span class="font-mono text-[10px] text-amber-200/70">
              SSV VERIFIED: ${this.roast.ssvProof?.txId || 'tx_verified'}
            </span>
          </div>
        `
        }

        <!-- Primary Social Actions Bar -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <!-- Save Canvas Image Button -->
          <button
            id="btn-save-card"
            class="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm py-3 px-4 rounded-lg uppercase tracking-wider shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>📥 SAVE 9:16 STORY CARD</span>
          </button>

          <!-- Share Button (Web Share API) -->
          <button
            id="btn-share-social"
            class="w-full bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/50 font-bold text-sm py-3 px-4 rounded-lg uppercase tracking-wider active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <span>🚀 SHARE TO IG / TIKTOK</span>
          </button>
        </div>

        <!-- Copy Roast Text Snippet -->
        <div class="bg-black/60 border border-slate-800 rounded-lg p-3 flex items-center justify-between gap-3">
          <div class="truncate text-xs text-slate-400 flex-1 font-mono">
            "${this.roast.primaryRoast.substring(0, 75)}..."
          </div>
          <button
            id="btn-copy-roast"
            class="flex-shrink-0 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-1.5 rounded border border-slate-700 active:scale-95 transition-all"
          >
            📋 COPY TEXT
          </button>
        </div>

        <!-- Toast Notification Area -->
        <div id="toast-message" class="hidden text-center text-xs text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-500 p-2 rounded-lg animate-fade-in"></div>
      </div>
    `;

    // Render Canvas in background and inject into view
    await this.renderCanvasPreview();
    this.bindEvents();
  }

  private async renderCanvasPreview() {
    try {
      const canvas = await StoryCardRenderer.renderToCanvas(this.roast);

      // Adapt canvas style for mobile responsive containment
      canvas.style.maxWidth = '100%';
      canvas.style.height = 'auto';
      canvas.style.maxHeight = '65vh';
      canvas.style.borderRadius = '8px';
      canvas.style.display = 'block';

      const wrapper = document.getElementById('canvas-preview-wrapper');
      const loader = document.getElementById('canvas-loading');
      if (wrapper) {
        if (loader) loader.remove();
        // Remove prior canvas if any
        const prior = wrapper.querySelector('canvas');
        if (prior) prior.remove();
        wrapper.appendChild(canvas);
      }
    } catch {
      const loader = document.getElementById('canvas-loading');
      if (loader) loader.textContent = 'Failed to generate visual card.';
    }
  }

  private bindEvents() {
    // Reset / Roast another victim
    const resetBtn = document.getElementById('btn-back-reset');
    if (resetBtn) {
      resetBtn.onclick = () => {
        sound.playClick();
        this.onReset();
      };
    }

    // Trigger rewarded ad
    const adBtn = document.getElementById('btn-trigger-ad');
    if (adBtn) {
      adBtn.onclick = () => {
        this.adModal.show((ssvPayload) => {
          this.roast.isUnlocked = true;
          this.roast.ssvProof = ssvPayload;
          this.render(); // Re-render card with unlocked content
        });
      };
    }

    // Download Story Card PNG Blob
    const saveBtn = document.getElementById('btn-save-card');
    if (saveBtn) {
      saveBtn.onclick = async () => {
        await this.handleSaveCard();
      };
    }

    // Web Share API
    const shareBtn = document.getElementById('btn-share-social');
    if (shareBtn) {
      shareBtn.onclick = async () => {
        await this.handleSocialShare();
      };
    }

    // Copy Roast text
    const copyBtn = document.getElementById('btn-copy-roast');
    if (copyBtn) {
      copyBtn.onclick = () => {
        this.handleCopyText();
      };
    }
  }

  private async handleSaveCard() {
    if (this.isExporting) return;
    this.isExporting = true;
    sound.playClick(700);
    this.showToast('Generating 1080x1920 HD Story Card...');

    try {
      const blob = await StoryCardRenderer.exportToBlob(this.roast);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ScreenRoast-${this.roast.archetype.id}-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      sound.playSuccess();
      this.showToast('✓ Story Card saved to device!');
    } catch {
      this.showToast('Error saving image. Try again.');
    } finally {
      this.isExporting = false;
    }
  }

  private async handleSocialShare() {
    sound.playClick();
    const shareText = `💀 Screen Roast AI Diagnosed Me: "${this.roast.archetype.title}"\nBrain-Rot Rating: ${this.roast.brainRotScore}/100\nProjected Glass Time: ${this.roast.daysWastedLifetime} Days (${this.roast.yearsWastedLifetime} yrs of waking life!)\n\nRoast yourself at https://screenroast.app`;

    try {
      const blob = await StoryCardRenderer.exportToBlob(this.roast);
      const file = new File([blob], 'screen-roast-story.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `Screen Roast: ${this.roast.archetype.title}`,
          text: shareText,
          files: [file],
        });
        this.showToast('✓ Shared successfully!');
        return;
      }
    } catch {
      // Fallback to text share
    }

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Screen Roast: ${this.roast.archetype.title}`,
          text: shareText,
          url: window.location.href,
        });
        this.showToast('✓ Shared successfully!');
      } catch {
        // User cancelled share
      }
    } else {
      this.handleCopyText();
    }
  }

  private handleCopyText() {
    sound.playClick(600);
    const text = `💀 Screen Roast AI Diagnosis: ${this.roast.archetype.title}\nBrain-Rot: ${this.roast.brainRotScore}/100 | Wasted: ${this.roast.daysWastedLifetime} Days\n\n"${this.roast.primaryRoast}"\n\n#ScreenRoast #Brainrot`;

    navigator.clipboard.writeText(text).then(
      () => {
        sound.playTerminalTick();
        this.showToast('✓ Roast text copied to clipboard!');
      },
      () => {
        this.showToast('Failed to copy to clipboard.');
      }
    );
  }

  private showToast(msg: string) {
    const toast = document.getElementById('toast-message');
    if (toast) {
      toast.textContent = msg;
      toast.classList.remove('hidden');
      setTimeout(() => {
        toast.classList.add('hidden');
      }, 3500);
    }
  }
}
