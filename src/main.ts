import { sound } from './audio';
import { InputScreen } from './components/inputScreen';
import { RoastScreen } from './components/roastScreen';
import { TerminalScreen } from './components/terminalScreen';
import { calculateRoast } from './engines/roastEngine';
import './style.css';
import { RoastResult, ScreenState, UserInputData } from './types';

class App {
  private currentState: ScreenState = 'input';
  private appRoot: HTMLElement;
  private currentInputData: UserInputData | null = null;
  private currentRoastResult: RoastResult | null = null;

  public getCurrentState(): ScreenState {
    return this.currentState;
  }

  constructor() {
    const root = document.getElementById('app');
    if (!root) throw new Error('Missing #app container in DOM');
    this.appRoot = root;
    this.initHeaderEvents();
    this.transitionTo('input');
  }

  private initHeaderEvents() {
    const muteBtn = document.getElementById('audio-toggle-btn');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        const isMuted = sound.toggleMute();
        muteBtn.textContent = isMuted ? '🔇 SOUND OFF' : '🔊 SOUND ON';
        muteBtn.classList.toggle('text-slate-500', isMuted);
        muteBtn.classList.toggle('text-emerald-400', !isMuted);
      });
    }
  }

  public transitionTo(state: ScreenState) {
    this.currentState = state;
    this.appRoot.innerHTML = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch (state) {
      case 'input': {
        const inputScreen = new InputScreen(this.appRoot);
        inputScreen.render({
          onSubmit: (data) => {
            this.currentInputData = data;
            this.transitionTo('terminal');
          },
        });
        break;
      }

      case 'terminal': {
        const terminalScreen = new TerminalScreen(this.appRoot);
        terminalScreen.render({
          onComplete: () => {
            if (this.currentInputData) {
              this.currentRoastResult = calculateRoast(this.currentInputData);
            }
            this.transitionTo('roast');
          },
        });
        break;
      }

      case 'roast': {
        if (!this.currentRoastResult && this.currentInputData) {
          this.currentRoastResult = calculateRoast(this.currentInputData);
        }
        if (this.currentRoastResult) {
          const roastScreen = new RoastScreen(this.appRoot, {
            roast: this.currentRoastResult,
            onReset: () => {
              this.transitionTo('input');
            },
          });
          roastScreen.render();
        }
        break;
      }
    }
  }
}

// Boot app on DOMContentLoaded
window.addEventListener('DOMContentLoaded', () => {
  new App();
});
