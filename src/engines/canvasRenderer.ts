import { RoastResult } from '../types';

export interface RenderCardOptions {
  width?: number;
  height?: number;
}

export class StoryCardRenderer {
  private static readonly CARD_WIDTH = 1080;
  private static readonly CARD_HEIGHT = 1920;

  /**
   * Renders the viral 1080x1920 punk/cyber-poster Story Card to an offscreen HTML5 Canvas.
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

    // 1. Palette, Grading & Atmospheric Glow
    this.drawAtmosphericBackground(ctx, width, height, roast.isUnlocked);

    // 2. Top Header Dossier & "DIAGNOSIS: TERMINALLY COOKED"
    this.drawHeroDiagnosisHeader(ctx, roast);

    // 3. Slanted Magenta Cyber-Ribbon
    this.drawSlantedCyberRibbon(ctx, roast);

    // 4. Massive Megastat Callout (e.g. "30.3 YEARS OF CONSCIOUS LIFE WASTED")
    this.drawMegastatCallout(ctx, roast);

    // 5. Visual Accents: Floating Holographic Sticker & App Breakdown
    this.drawAccentsAndStickers(ctx, roast);

    // 6. The Bracketed Roast Box
    this.drawBracketedRoastBox(ctx, roast);

    // 7. Modern Footer Telemetry (Barcode + Brand Info)
    this.drawModernFooter(ctx, roast);

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

  // =========================================================================
  // Canvas Rendering Subroutines
  // =========================================================================

  /**
   * 1. Palette, Grading & Atmospheric Glow
   */
  private static drawAtmosphericBackground(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    isUnlocked: boolean
  ) {
    // Solid dark obsidian
    ctx.fillStyle = '#08080a';
    ctx.fillRect(0, 0, w, h);

    // Screen blend mode for vibrant backlighting blooms
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // Upper-left electric purple aura (x=200, y=300, radius=550)
    const purpleGrad = ctx.createRadialGradient(200, 300, 30, 200, 300, 550);
    purpleGrad.addColorStop(0, 'rgba(139, 92, 246, 0.45)');
    purpleGrad.addColorStop(0.5, 'rgba(124, 58, 237, 0.22)');
    purpleGrad.addColorStop(1, 'rgba(8, 8, 10, 0)');
    ctx.fillStyle = purpleGrad;
    ctx.fillRect(0, 0, w, h);

    // Center-right fluorescent hot lime bloom (x=850, y=900, radius=650)
    const limeGrad = ctx.createRadialGradient(850, 900, 40, 850, 900, 650);
    limeGrad.addColorStop(0, isUnlocked ? 'rgba(234, 179, 8, 0.40)' : 'rgba(163, 230, 53, 0.35)');
    limeGrad.addColorStop(0.5, isUnlocked ? 'rgba(234, 179, 8, 0.18)' : 'rgba(163, 230, 53, 0.15)');
    limeGrad.addColorStop(1, 'rgba(8, 8, 10, 0)');
    ctx.fillStyle = limeGrad;
    ctx.fillRect(0, 0, w, h);

    // Lower-left cyan ambient undertone (x=250, y=1550, radius=500)
    const cyanGrad = ctx.createRadialGradient(250, 1550, 20, 250, 1550, 500);
    cyanGrad.addColorStop(0, 'rgba(6, 182, 212, 0.25)');
    cyanGrad.addColorStop(1, 'rgba(8, 8, 10, 0)');
    ctx.fillStyle = cyanGrad;
    ctx.fillRect(0, 0, w, h);

    ctx.restore();

    // Fine digital scanline grunge overlay on a 4px grid
    ctx.fillStyle = 'rgba(10, 10, 10, 0.18)';
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 1.5);
    }

    // Outer brutalist poster framing border
    ctx.lineWidth = 4;
    ctx.strokeStyle = isUnlocked ? '#eab308' : '#22c55e';
    ctx.strokeRect(36, 36, w - 72, h - 72);

    // Inset hairline
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.strokeRect(46, 46, w - 92, h - 92);

    // Corner crosshairs / tick marks
    this.drawCornerCrosshairs(ctx, 36, 36, w - 72, h - 72);
  }

  /**
   * 2. Hero Typography Header: "DIAGNOSIS: TERMINALLY COOKED"
   */
  private static drawHeroDiagnosisHeader(
    ctx: CanvasRenderingContext2D,
    roast: RoastResult
  ) {
    // Top Dossier Pill
    ctx.fillStyle = roast.isUnlocked ? 'rgba(234, 179, 8, 0.2)' : 'rgba(6, 182, 212, 0.2)';
    this.fillRoundedRect(ctx, 90, 85, 260, 36, 6);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = roast.isUnlocked ? '#eab308' : '#06b6d4';
    ctx.strokeRect(90, 85, 260, 36);

    ctx.fillStyle = roast.isUnlocked ? '#eab308' : '#06b6d4';
    ctx.font = '900 16px "Space Grotesk", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('● LIVE BIO-TELEMETRY', 220, 109);

    // Top Right Reference ID
    ctx.textAlign = 'right';
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(`DOSSIER #SR-${Math.abs(roast.dopamineDebtDollars % 99999).toString().padStart(5, '0')}`, 990, 109);

    // "DIAGNOSIS:" in bold cyber-cyan (#06b6d4) at 44px
    ctx.textAlign = 'left';
    ctx.font = '900 44px "Impact", "Arial Black", "Space Grotesk", sans-serif';
    ctx.fillStyle = '#06b6d4';
    ctx.save();
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 12;
    ctx.fillText('DIAGNOSIS:', 90, 195);
    ctx.restore();

    // "TERMINALLY" & "COOKED" in huge white font (100px) with 15px electric purple shadow
    const headlineWord1 = roast.brainRotScore >= 80 ? 'TERMINALLY' : 'CHRONICALLY';
    const headlineWord2 = roast.brainRotScore >= 80 ? 'COOKED' : 'BRAIN-ROTTED';

    ctx.font = '900 102px "Impact", "Arial Black", "Space Grotesk", sans-serif';
    ctx.fillStyle = '#ffffff';

    ctx.save();
    ctx.shadowColor = '#8b5cf6';
    ctx.shadowBlur = 18;
    ctx.fillText(headlineWord1, 90, 305);
    ctx.fillText(headlineWord2, 90, 410);
    ctx.restore();
  }

  /**
   * 3. Slanted Cyber-Ribbon
   * Tilted punk-sticker ribbon with user's archetype in tight black uppercase
   */
  private static drawSlantedCyberRibbon(
    ctx: CanvasRenderingContext2D,
    roast: RoastResult
  ) {
    const centerY = 495;

    ctx.save();
    // Pivot slightly off-kilter (-0.04 radians) for punk-sticker vibe
    ctx.translate(540, centerY);
    ctx.rotate(-0.04);

    // Full-bleed width to ensure no edge gaps when rotated
    const ribbonW = 1200;
    const ribbonH = 74;
    const ribbonX = -ribbonW / 2;
    const ribbonY = -ribbonH / 2;

    // Drop shadow under ribbon
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(ribbonX + 6, ribbonY + 8, ribbonW, ribbonH);

    // Thick magenta/neon-pink (#ec4899) filled ribbon
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(ribbonX, ribbonY, ribbonW, ribbonH);

    // Black warning borders (top & bottom)
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#000000';
    ctx.strokeRect(ribbonX, ribbonY, ribbonW, ribbonH);

    // Tiny hazard strip pattern on ribbon borders
    ctx.fillStyle = '#000000';
    ctx.fillRect(ribbonX, ribbonY, ribbonW, 5);
    ctx.fillRect(ribbonX, ribbonY + ribbonH - 5, ribbonW, 5);

    // User Archetype in tight uppercase black typography (36px)
    ctx.fillStyle = '#000000';
    ctx.font = '900 36px "Impact", "Arial Black", "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';

    const archetypeText = `⚡ ${roast.archetype.title.toUpperCase()} ⚡`;
    ctx.fillText(archetypeText, 0, 13);

    ctx.restore();
  }

  /**
   * 4. Massive Megastat Callout:
   * "30.3 YEARS" in gargantuan fluorescent lime (#a3e635) at 140px + "OF CONSCIOUS LIFE WASTED"
   */
  private static drawMegastatCallout(
    ctx: CanvasRenderingContext2D,
    roast: RoastResult
  ) {
    const megastatY = 675;

    // Large Stat: e.g. "30.3 YEARS"
    ctx.textAlign = 'center';
    ctx.font = '900 138px "Impact", "Arial Black", "Space Grotesk", sans-serif';
    ctx.fillStyle = '#a3e635';

    ctx.save();
    ctx.shadowColor = 'rgba(163, 230, 53, 0.65)';
    ctx.shadowBlur = 28;
    ctx.fillText(`${roast.yearsWastedLifetime} YEARS`, 540, megastatY);
    ctx.restore();

    // "OF CONSCIOUS LIFE WASTED" sub-label below in bold white (40px)
    ctx.font = '900 38px "Space Grotesk", "Arial Black", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('OF CONSCIOUS LIFE WASTED', 540, megastatY + 54);

    // Supporting telemetry pill strip (7,115 Days • 8.5h/day • Rot: 94/100)
    const pillY = megastatY + 90;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    this.fillRoundedRect(ctx, 130, pillY, 820, 50, 10);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.strokeRect(130, pillY, 820, 50);

    ctx.font = 'bold 20px monospace';
    ctx.fillStyle = '#cbd5e1';
    const pillContent = `💀 ${roast.daysWastedLifetime.toLocaleString()} DAYS  |  ⚡ ${roast.dailyHours}H / DAY  |  🧠 ROT: ${roast.brainRotScore}/100`;
    ctx.fillText(pillContent, 540, pillY + 32);
  }

  /**
   * 5. Visual Accents & Badges:
   * Floating Holographic Circle sticker & Top App Telemetry
   */
  private static drawAccentsAndStickers(
    ctx: CanvasRenderingContext2D,
    roast: RoastResult
  ) {
    // --- Left Side: Top Neural Hijackers Mini Bars (y: 890 to 1080) ---
    const leftX = 90;
    const startY = 895;

    ctx.textAlign = 'left';
    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 20px monospace';
    ctx.fillText('TOP NEURAL HIJACKERS:', leftX, startY);

    let rowY = startY + 28;
    roast.topApps.slice(0, 2).forEach((app) => {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(`${app.icon} ${app.name}`, leftX, rowY + 16);

      ctx.textAlign = 'right';
      ctx.fillStyle = app.color;
      ctx.fillText(`${app.hours}h/d`, 620, rowY + 16);
      ctx.textAlign = 'left';

      // Bar track
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      this.fillRoundedRect(ctx, leftX, rowY + 26, 530, 8, 4);

      // Active fill
      const barW = Math.min(530, (app.hours / Math.max(0.1, roast.dailyHours)) * 530);
      ctx.fillStyle = app.color;
      this.fillRoundedRect(ctx, leftX, rowY + 26, barW, 8, 4);

      rowY += 52;
    });

    // --- Right Side: Floating Holographic Circle Sticker (at x=780, y=980) ---
    ctx.save();
    const stickerX = 790;
    const stickerY = 980;
    ctx.translate(stickerX, stickerY);
    ctx.rotate(0.12); // Slightly tilted for sticker realism

    const radius = 72;

    // Outer sticker glow
    ctx.shadowColor = 'rgba(163, 230, 53, 0.6)';
    ctx.shadowBlur = 18;

    // Fluorescent lime fill
    ctx.fillStyle = '#a3e635';
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fill();

    // Solid black outer border
    ctx.shadowBlur = 0;
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    // Inner dashed circle accent
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(0, 0, radius - 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Dense black uppercase sticker text (18px)
    ctx.fillStyle = '#000000';
    ctx.textAlign = 'center';
    ctx.font = '900 18px "Impact", "Arial Black", monospace';

    const stickerLine1 = roast.archetype.badge || 'STAGE IV';
    const stickerLine2 = 'BRAIN-ROT';

    ctx.fillText(stickerLine1.toUpperCase(), 0, -8);
    ctx.fillText(stickerLine2, 0, 14);

    ctx.font = 'bold 11px monospace';
    ctx.fillText('VERIFIED ROT', 0, 32);

    ctx.restore();
  }

  /**
   * 6. The Roast Box:
   * Semi-transparent, deep blue-grey panel (rgba(15, 23, 42, 0.7)) with cyber-cyan (#06b6d4)
   * bracketed corners and inset padding. Readable bold white 32px font.
   */
  private static drawBracketedRoastBox(
    ctx: CanvasRenderingContext2D,
    roast: RoastResult
  ) {
    const boxX = 90;
    const boxY = 1115;
    const boxW = 900;
    const boxH = roast.isUnlocked ? 510 : 450;

    // Semi-transparent deep blue-grey panel
    ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
    this.fillRoundedRect(ctx, boxX, boxY, boxW, boxH, 12);

    // Subtle container border
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = roast.isUnlocked ? 'rgba(234, 179, 8, 0.4)' : 'rgba(6, 182, 212, 0.3)';
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    // Cyber-cyan bracketed L-corners (or Gold if VIP Unlocked)
    const bracketColor = roast.isUnlocked ? '#eab308' : '#06b6d4';
    this.drawBracketedCorners(ctx, boxX, boxY, boxW, boxH, bracketColor, 28, 5);

    // Panel Header Badge
    const headerTitle = roast.isUnlocked
      ? '★ VIP UNFILTERED FORENSIC VERDICT (UNLOCKED)'
      : '[!] CLINICAL COGNITIVE AUTOPSY';

    ctx.textAlign = 'left';
    ctx.font = 'bold 22px monospace';
    ctx.fillStyle = bracketColor;
    ctx.fillText(headerTitle, boxX + 32, boxY + 48);

    // Roast Text: Readable, bold white 32px font
    const textToRender = roast.isUnlocked
      ? `${roast.primaryRoast}\n\n${roast.unfilteredRoast}`
      : `${roast.primaryRoast}\n\n${roast.secondaryRoast}`;

    ctx.fillStyle = '#ffffff';
    ctx.font = roast.isUnlocked
      ? 'bold 26px "Inter", "Space Grotesk", sans-serif'
      : 'bold 31px "Inter", "Space Grotesk", sans-serif';

    const maxTextW = boxW - 64;
    const lines = this.wrapText(ctx, textToRender, maxTextW);
    let textY = boxY + 98;
    const lineHeight = roast.isUnlocked ? 38 : 46;

    lines.forEach((line) => {
      if (textY < boxY + boxH - 24) {
        ctx.fillText(line, boxX + 32, textY);
        textY += lineHeight;
      }
    });
  }

  /**
   * 7. Modern Footer Telemetry:
   * Sleek horizontal barcode on bottom-left, brand info on bottom-right
   */
  private static drawModernFooter(
    ctx: CanvasRenderingContext2D,
    roast: RoastResult
  ) {
    const footerY = 1715;

    if (roast.isUnlocked) {
      // VIP Golden Unlocked Telemetry
      ctx.fillStyle = '#eab308';
      this.fillRoundedRect(ctx, 90, footerY, 900, 80, 8);

      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.font = '900 22px "Impact", monospace';
      ctx.fillText('★ VIP UNFILTERED ROAST // WATERMARK REMOVED // SSV AUTHENTICATED ★', 540, footerY + 36);

      ctx.font = 'bold 15px monospace';
      const sig = roast.ssvProof?.signature || '0x4f89d3810a9c8b74e1d...';
      ctx.fillText(`ECDSA PROOF: ${sig.substring(0, 32)}... // VERIFIED TRANSACTION`, 540, footerY + 62);
    } else {
      // Sleek Horizontal Barcode on bottom-left
      this.drawBarcode(ctx, 90, footerY + 10, 310, 48);

      ctx.textAlign = 'left';
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 13px monospace';
      ctx.fillText(`#SR-${Math.abs(roast.dopamineDebtDollars * 7).toString().padStart(6, '0')}-BIOHAZARD`, 90, footerY + 76);

      // Brand Info on bottom-right: SCREENROAST.LIVE // ARE YOU COOKED?
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 24px "Space Grotesk", monospace';
      ctx.fillText('SCREENROAST.LIVE', 990, footerY + 30);

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 15px monospace';
      ctx.fillText('ARE YOU COOKED? // SCAN TO MIRROR ROT', 990, footerY + 56);

      ctx.fillStyle = '#06b6d4';
      ctx.font = '12px monospace';
      ctx.fillText('[ 1080x1920 9:16 VERTICAL STORY ]', 990, footerY + 76);
    }

    // High-contrast bottom neon gradient stripe
    const barGrad = ctx.createLinearGradient(90, 1835, 990, 1835);
    barGrad.addColorStop(0, '#06b6d4');
    barGrad.addColorStop(0.5, '#ec4899');
    barGrad.addColorStop(1, '#a3e635');
    ctx.fillStyle = barGrad;
    ctx.fillRect(90, 1835, 900, 6);
  }

  // =========================================================================
  // Geometric & Typography Helpers
  // =========================================================================

  private static drawBracketedCorners(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
    len: number = 24,
    thickness: number = 4
  ) {
    ctx.fillStyle = color;

    // Top-Left L
    ctx.fillRect(x, y, len, thickness);
    ctx.fillRect(x, y, thickness, len);

    // Top-Right L
    ctx.fillRect(x + w - len, y, len, thickness);
    ctx.fillRect(x + w - thickness, y, thickness, len);

    // Bottom-Left L
    ctx.fillRect(x, y + h - thickness, len, thickness);
    ctx.fillRect(x, y + h - len, thickness, len);

    // Bottom-Right L
    ctx.fillRect(x + w - len, y + h - thickness, len, thickness);
    ctx.fillRect(x + w - thickness, y + h - len, thickness, len);
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

  private static drawBarcode(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    ctx.fillStyle = '#ffffff';
    let currX = x;
    const barWidths = [2, 5, 2, 8, 3, 4, 9, 2, 6, 3, 2, 7, 4, 2, 8, 3, 5, 3];
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
