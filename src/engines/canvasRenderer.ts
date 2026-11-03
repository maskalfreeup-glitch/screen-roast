import { RoastResult } from '../types';

export interface RenderCardOptions {
  width?: number;
  height?: number;
}

export class StoryCardRenderer {
  private static readonly CARD_WIDTH = 1080;
  private static readonly CARD_HEIGHT = 1920;

  /**
   * Renders the complete 1080x1920 visual Roast Card to an offscreen HTML5 Canvas.
   */
  public static async renderToCanvas(
    roast: RoastResult,
    options: RenderCardOptions = {}
  ): Promise<HTMLCanvasElement> {
    const width = options.width || this.CARD_WIDTH;
    const height = options.height || this.CARD_HEIGHT;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { alpha: false });

    if (!ctx) {
      throw new Error('Failed to obtain 2D canvas context');
    }

    // High quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // 1. Draw Deep Cyber/Brutalist Dark Background & Grid
    this.drawBackground(ctx, width, height, roast.isUnlocked);

    // 2. Header & Dossier Identification
    this.drawHeader(ctx, roast);

    // 3. User Archetype Badge & Title
    this.drawArchetype(ctx, roast);

    // 4. Metric Gauges (Brain-Rot Score & Lifetime Days Wasted)
    this.drawMetricsGrid(ctx, roast);

    // 5. App Usage Breakdown Bars
    this.drawAppBreakdown(ctx, roast);

    // 6. Brutal Roast Statement Box
    this.drawRoastBox(ctx, roast);

    // 7. Footer: Watermark / VIP SSV Badge
    this.drawFooter(ctx, roast);

    return canvas;
  }

  /**
   * Converts the card to a PNG Blob for download or Web Share.
   */
  public static async exportToBlob(roast: RoastResult): Promise<Blob> {
    const canvas = await this.renderToCanvas(roast);
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas blob generation failed'));
        },
        'image/png',
        1.0
      );
    });
  }

  // --- Rendering subroutines ---

  private static drawBackground(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    isUnlocked: boolean
  ) {
    // Pitch black carbon
    ctx.fillStyle = '#08080a';
    ctx.fillRect(0, 0, w, h);

    // Ambient radial glow from top center
    const glowGrad = ctx.createRadialGradient(
      w / 2,
      250,
      50,
      w / 2,
      350,
      600
    );
    if (isUnlocked) {
      glowGrad.addColorStop(0, 'rgba(234, 179, 8, 0.18)');
      glowGrad.addColorStop(1, 'rgba(8, 8, 10, 0)');
    } else {
      glowGrad.addColorStop(0, 'rgba(34, 197, 94, 0.16)');
      glowGrad.addColorStop(1, 'rgba(8, 8, 10, 0)');
    }
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, w, h);

    // Grid dots
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    const spacing = 45;
    for (let x = 30; x < w; x += spacing) {
      for (let y = 30; y < h; y += spacing) {
        ctx.fillRect(x, y, 2, 2);
      }
    }

    // Outer Brutalist Framing Border
    ctx.lineWidth = 6;
    ctx.strokeStyle = isUnlocked ? '#eab308' : '#22c55e';
    ctx.strokeRect(36, 36, w - 72, h - 72);

    // Inner subtle hairline
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.strokeRect(48, 48, w - 96, h - 96);

    // Corner crosshairs
    this.drawCornerCrosshairs(ctx, 36, 36, w - 72, h - 72);
  }

  private static drawCornerCrosshairs(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffffff';
    const len = 20;

    // Top-left
    ctx.beginPath();
    ctx.moveTo(x - 6, y);
    ctx.lineTo(x + len, y);
    ctx.moveTo(x, y - 6);
    ctx.lineTo(x, y + len);

    // Top-right
    ctx.moveTo(x + w - len, y);
    ctx.lineTo(x + w + 6, y);
    ctx.moveTo(x + w, y - 6);
    ctx.lineTo(x + w, y + len);

    // Bottom-left
    ctx.moveTo(x - 6, y + h);
    ctx.lineTo(x + len, y + h);
    ctx.moveTo(x, y + h - len);
    ctx.lineTo(x, y + h + 6);

    // Bottom-right
    ctx.moveTo(x + w - len, y + h);
    ctx.lineTo(x + w + 6, y + h);
    ctx.moveTo(x + w, y + h - len);
    ctx.lineTo(x + w, y + h + 6);
    ctx.stroke();
  }

  private static drawHeader(ctx: CanvasRenderingContext2D, roast: RoastResult) {
    // System tag pill
    ctx.fillStyle = roast.isUnlocked ? '#eab308' : '#22c55e';
    this.fillRoundedRect(ctx, 80, 80, 240, 36, 6);

    ctx.fillStyle = '#000000';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SCREEN ROAST // AI', 200, 104);

    // Dossier label
    ctx.textAlign = 'right';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.font = '600 18px monospace';
    ctx.fillText('REF #SR-' + Math.abs(roast.dopamineDebtDollars % 99999).toString().padStart(5, '0'), 1000, 104);

    // Subheader hazard bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(80, 136, 920, 2);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px monospace';
    ctx.fillText('DOSSIER: NEURO-DOPAMINE AUTOPSY', 80, 168);

    ctx.textAlign = 'right';
    const now = new Date().toISOString().split('T')[0];
    ctx.fillText(`TIMESTAMP: ${now}`, 1000, 168);
  }

  private static drawArchetype(ctx: CanvasRenderingContext2D, roast: RoastResult) {
    const arch = roast.archetype;

    // Archetype Badge Pill
    const badgeY = 215;
    ctx.fillStyle = 'rgba(236, 72, 153, 0.15)';
    this.fillRoundedRect(ctx, 80, badgeY, 260, 40, 8);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#ec4899';
    ctx.strokeRect(80, badgeY, 260, 40);

    ctx.fillStyle = '#ec4899';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(`⚡ ${arch.badge}`, 210, badgeY + 26);

    // Title text
    ctx.textAlign = 'left';
    ctx.font = 'bold 56px "Space Grotesk", sans-serif';
    ctx.fillStyle = '#ffffff';

    const titleLines = this.wrapText(ctx, arch.title.toUpperCase(), 920);
    let titleY = 320;
    titleLines.forEach((line) => {
      ctx.fillText(line, 80, titleY);
      titleY += 66;
    });

    // Subtitle tagline
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'italic 24px monospace';
    ctx.fillText(`"${arch.tagline}"`, 80, titleY + 15);
  }

  private static drawMetricsGrid(ctx: CanvasRenderingContext2D, roast: RoastResult) {
    const gridY = 480;
    const cardW = 445;
    const cardH = 260;

    // --- Box 1: Brain-Rot Score ---
    const box1X = 80;
    ctx.fillStyle = '#11141a';
    this.fillRoundedRect(ctx, box1X, gridY, cardW, cardH, 12);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ef4444';
    ctx.strokeRect(box1X, gridY, cardW, cardH);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('BRAIN-ROT INDEX', box1X + 28, gridY + 45);

    // Big score
    ctx.fillStyle = '#ef4444';
    ctx.font = '900 88px "Space Grotesk", monospace';
    ctx.fillText(`${roast.brainRotScore}`, box1X + 28, gridY + 140);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px monospace';
    ctx.fillText('/100', box1X + 175, gridY + 130);

    // Rot Tier indicator
    ctx.fillStyle = '#fee2e2';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`TIER: ${roast.brainRotTier.toUpperCase()}`, box1X + 28, gridY + 205);

    // Visual Meter bar
    ctx.fillStyle = '#1e293b';
    this.fillRoundedRect(ctx, box1X + 28, gridY + 225, cardW - 56, 12, 6);
    ctx.fillStyle = '#ef4444';
    this.fillRoundedRect(
      ctx,
      box1X + 28,
      gridY + 225,
      (cardW - 56) * (roast.brainRotScore / 100),
      12,
      6
    );

    // --- Box 2: Lifetime Days Wasted ---
    const box2X = 555;
    ctx.fillStyle = '#11141a';
    this.fillRoundedRect(ctx, box2X, gridY, cardW, cardH, 12);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#eab308';
    ctx.strokeRect(box2X, gridY, cardW, cardH);

    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('DAYS WASTED (LIFETIME)', box2X + 28, gridY + 45);

    ctx.fillStyle = '#eab308';
    ctx.font = '900 84px "Space Grotesk", monospace';
    ctx.fillText(
      `${roast.daysWastedLifetime.toLocaleString()}`,
      box2X + 28,
      gridY + 140
    );

    ctx.fillStyle = '#cbd5e1';
    ctx.font = 'bold 20px monospace';
    ctx.fillText(`≈ ${roast.yearsWastedLifetime} YRS OF WAKING LIFE`, box2X + 28, gridY + 205);

    // Percent conscious life gauge
    ctx.fillStyle = '#1e293b';
    this.fillRoundedRect(ctx, box2X + 28, gridY + 225, cardW - 56, 12, 6);
    ctx.fillStyle = '#eab308';
    this.fillRoundedRect(
      ctx,
      box2X + 28,
      gridY + 225,
      (cardW - 56) * (roast.percentWakingLifeLost / 100),
      12,
      6
    );

    // --- Sub-metrics Strip ---
    const stripY = gridY + cardH + 25;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    this.fillRoundedRect(ctx, 80, stripY, 920, 65, 8);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.strokeRect(80, stripY, 920, 65);

    ctx.font = '600 18px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.textAlign = 'left';
    ctx.fillText('⚡ DAILY: ', 110, stripY + 40);
    ctx.fillStyle = '#22c55e';
    ctx.fillText(`${roast.dailyHours} HRS`, 200, stripY + 40);

    ctx.fillStyle = '#94a3b8';
    ctx.fillText('⏱ ATTENTION SPAN: ', 360, stripY + 40);
    ctx.fillStyle = '#ef4444';
    ctx.fillText(`${roast.attentionSpanSeconds}s`, 560, stripY + 40);

    ctx.fillStyle = '#94a3b8';
    ctx.fillText('💸 DOPAMINE DEBT: ', 660, stripY + 40);
    ctx.fillStyle = '#38bdf8';
    ctx.fillText(`$${roast.dopamineDebtDollars.toLocaleString()}`, 860, stripY + 40);
  }

  private static drawAppBreakdown(ctx: CanvasRenderingContext2D, roast: RoastResult) {
    const startY = 880;

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px monospace';
    ctx.fillText('TOP NEURAL HIJACKERS:', 80, startY);

    let rowY = startY + 30;
    roast.topApps.forEach((app) => {
      // App icon + Name
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '600 20px monospace';
      ctx.fillText(`${app.icon} ${app.name}`, 80, rowY + 25);

      // Hours tag
      ctx.textAlign = 'right';
      ctx.fillStyle = app.color;
      ctx.font = 'bold 20px monospace';
      ctx.fillText(`${app.hours}h / day`, 1000, rowY + 25);

      // Progress bar track
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      this.fillRoundedRect(ctx, 80, rowY + 38, 920, 10, 5);

      // Active bar
      const fillW = Math.min(920, (app.hours / Math.max(0.1, roast.dailyHours)) * 920);
      ctx.fillStyle = app.color;
      this.fillRoundedRect(ctx, 80, rowY + 38, fillW, 10, 5);

      rowY += 60;
      ctx.textAlign = 'left';
    });
  }

  private static drawRoastBox(ctx: CanvasRenderingContext2D, roast: RoastResult) {
    const boxY = 1110;
    const boxH = roast.isUnlocked ? 480 : 410;

    // Glowing container
    ctx.fillStyle = roast.isUnlocked ? 'rgba(234, 179, 8, 0.06)' : 'rgba(34, 197, 94, 0.05)';
    this.fillRoundedRect(ctx, 80, boxY, 920, boxH, 16);

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = roast.isUnlocked ? '#eab308' : '#22c55e';
    ctx.strokeRect(80, boxY, 920, boxH);

    // Box header label
    const headerTitle = roast.isUnlocked
      ? '🔥 UNFILTERED FORENSIC VERDICT (UNLOCKED)'
      : '💀 OFFICIAL AI DIAGNOSIS';
    ctx.fillStyle = roast.isUnlocked ? '#eab308' : '#22c55e';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(headerTitle, 115, boxY + 48);

    // Primary roast text
    const textToRender = roast.isUnlocked
      ? `${roast.primaryRoast}\n\n${roast.unfilteredRoast}`
      : `${roast.primaryRoast}\n\n${roast.secondaryRoast}`;

    ctx.fillStyle = '#ffffff';
    ctx.font = roast.isUnlocked ? '500 23px "Inter", sans-serif' : '500 25px "Inter", sans-serif';

    const lines = this.wrapText(ctx, textToRender, 850);
    let textY = boxY + 95;
    lines.forEach((line) => {
      if (textY < boxY + boxH - 25) {
        ctx.fillText(line, 115, textY);
        textY += roast.isUnlocked ? 34 : 38;
      }
    });
  }

  private static drawFooter(ctx: CanvasRenderingContext2D, roast: RoastResult) {
    const footerY = 1750;

    if (roast.isUnlocked) {
      // Clean VIP / SSV verified footer
      ctx.fillStyle = '#eab308';
      this.fillRoundedRect(ctx, 80, footerY, 920, 80, 10);

      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.font = 'bold 22px monospace';
      ctx.fillText('★ VIP UNFILTERED ROAST // WATERMARK REMOVED // SSV CERTIFIED ★', 540, footerY + 36);

      ctx.font = '14px monospace';
      const sig = roast.ssvProof?.signature || '0x4f89d3810a9c8b74e1d...';
      ctx.fillText(`ECDSA SSV PROOF: ${sig} // NONCE #${Math.abs(roast.daysWastedLifetime * 7)}`, 540, footerY + 62);
    } else {
      // Standard Watermarked Footer
      // Barcode simulation
      this.drawBarcode(ctx, 80, footerY, 320, 45);

      // Watermark text
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px "Space Grotesk", monospace';
      ctx.fillText('SCREENROAST.APP', 1000, footerY + 32);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px monospace';
      ctx.fillText('MIRROR YOUR BRAINROT // SCAN TO ROAST YOURSELF', 1000, footerY + 60);

      // Hazard warning bar at very bottom
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(80, 1845, 920, 6);
    }
  }

  private static drawBarcode(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    ctx.fillStyle = '#ffffff';
    let currX = x;
    const barWidths = [2, 5, 2, 8, 3, 4, 10, 2, 6, 3, 2, 7, 4, 2, 9, 3, 5, 3];
    let i = 0;
    while (currX < x + w) {
      const bw = barWidths[i % barWidths.length];
      if (i % 2 === 0) {
        ctx.fillRect(currX, y, bw, h);
      }
      currX += bw + 3;
      i++;
    }
  }

  private static wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] {
    const paragraphs = text.split('\n');
    const result: string[] = [];

    paragraphs.forEach((p) => {
      if (p.trim() === '') {
        result.push('');
        return;
      }
      const words = p.split(' ');
      let currentLine = words[0] || '';

      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth) {
          result.push(currentLine);
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }
      result.push(currentLine);
    });

    return result;
  }

  private static fillRoundedRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    radius: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius);
    ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  }
}
