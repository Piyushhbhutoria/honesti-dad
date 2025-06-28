// Image generation utility for feedback cards
export const generateFeedbackImage = async (message: string, isDarkTheme: boolean = false): Promise<Blob | null> => {
  try {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas context not available');
    }

    // Set canvas dimensions - making it more social media friendly
    const width = 1080;
    const height = 1080;
    canvas.width = width;
    canvas.height = height;

    // Theme colors with better contrast
    const colors = isDarkTheme ? {
      background: '#0F172A', // Dark slate
      gradientStart: '#1E293B', // Lighter slate
      gradientEnd: '#0F172A',
      cardBackground: 'rgba(255, 255, 255, 0.08)',
      cardBorder: 'rgba(16, 185, 129, 0.2)', // Emerald with opacity
      primaryColor: '#10B981', // Emerald
      primaryGradient: '#059669', // Darker emerald
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      accentBar: '#10B981'
    } : {
      background: '#F8FAFC', // Very light gray
      gradientStart: '#FFFFFF',
      gradientEnd: '#F1F5F9',
      cardBackground: 'rgba(255, 255, 255, 0.95)',
      cardBorder: 'rgba(20, 184, 166, 0.15)', // Teal with opacity
      primaryColor: '#14B8A6', // Teal
      primaryGradient: '#0D9488', // Darker teal
      textPrimary: '#1F2937',
      textSecondary: '#6B7280',
      accentBar: '#14B8A6'
    };

    // Helper function for rounded rectangle - simplified approach
    const drawRoundedRect = (x: number, y: number, w: number, h: number, radius: number) => {
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
    };

    // Create background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, colors.gradientStart);
    bgGradient.addColorStop(1, colors.gradientEnd);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Add decorative background elements
    if (isDarkTheme) {
      // Dark theme decorative circles
      ctx.fillStyle = 'rgba(16, 185, 129, 0.03)';
      ctx.beginPath();
      ctx.arc(width * 0.2, height * 0.2, 150, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(16, 185, 129, 0.05)';
      ctx.beginPath();
      ctx.arc(width * 0.8, height * 0.8, 200, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Light theme decorative circles
      ctx.fillStyle = 'rgba(20, 184, 166, 0.08)';
      ctx.beginPath();
      ctx.arc(width * 0.15, height * 0.15, 180, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(20, 184, 166, 0.05)';
      ctx.beginPath();
      ctx.arc(width * 0.85, height * 0.85, 220, 0, Math.PI * 2);
      ctx.fill();
    }

    // Card dimensions and positioning
    const cardPadding = 80;
    const cardX = cardPadding;
    const cardY = cardPadding + 100;
    const cardWidth = width - (cardPadding * 2);
    const cardHeight = height - (cardPadding * 2) - 200;
    const borderRadius = 32;

    // Draw card shadow
    ctx.shadowColor = isDarkTheme ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.15)';
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 20;
    ctx.fillStyle = colors.cardBackground;
    drawRoundedRect(cardX, cardY, cardWidth, cardHeight, borderRadius);
    ctx.fill();

    // Reset shadow for other elements
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Card border
    ctx.strokeStyle = colors.cardBorder;
    ctx.lineWidth = 2;
    drawRoundedRect(cardX, cardY, cardWidth, cardHeight, borderRadius);
    ctx.stroke();

    // Header section with gradient background
    const headerHeight = 140;
    const headerGradient = ctx.createLinearGradient(cardX, cardY, cardX + cardWidth, cardY + headerHeight);
    headerGradient.addColorStop(0, colors.primaryColor);
    headerGradient.addColorStop(1, colors.primaryGradient);

    ctx.fillStyle = headerGradient;
    drawRoundedRect(cardX + 2, cardY + 2, cardWidth - 4, headerHeight, borderRadius - 2);
    ctx.fill();

    // HonestyBox title
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 64px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('HonestyBox', width / 2, cardY + 50);

    // Tagline
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    ctx.fillText('Anonymous Feedback', width / 2, cardY + 100);

    // Message content area
    const contentY = cardY + headerHeight + 60;
    const contentPadding = 80;
    const messageWidth = cardWidth - (contentPadding * 2);
    const maxMessageHeight = cardHeight - headerHeight - 160;

    // Dynamic font size based on message length
    const getDynamicFontSize = (text: string) => {
      const baseSize = 48;
      const minSize = 28;
      const maxSize = 72;

      if (text.length < 50) return maxSize;
      if (text.length < 100) return baseSize;
      if (text.length < 200) return 36;
      return minSize;
    };

    const fontSize = getDynamicFontSize(message);
    const lineHeight = fontSize * 1.4;

    // Wrap text function with better handling for center alignment
    const wrapText = (text: string, maxWidth: number) => {
      const words = text.split(' ');
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine !== '') {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      return lines;
    };

    // Message text styling with dynamic size and center alignment
    ctx.fillStyle = colors.textPrimary;
    ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const lines = wrapText(message, messageWidth);

    // Center the text vertically in available space
    const totalTextHeight = lines.length * lineHeight;
    const startY = contentY + (maxMessageHeight - totalTextHeight) / 2;

    // Draw message lines centered
    lines.forEach((line, index) => {
      const y = startY + (index * lineHeight);
      ctx.fillText(line, width / 2, y);
    });

    // Bottom signature with decorative line
    const signatureY = height - 120;

    // Decorative line
    const lineY = signatureY - 40;
    const lineWidth = 200;
    const lineX = (width - lineWidth) / 2;

    const lineGradient = ctx.createLinearGradient(lineX, lineY, lineX + lineWidth, lineY);
    lineGradient.addColorStop(0, 'transparent');
    lineGradient.addColorStop(0.5, colors.primaryColor);
    lineGradient.addColorStop(1, 'transparent');

    ctx.strokeStyle = lineGradient;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(lineX, lineY);
    ctx.lineTo(lineX + lineWidth, lineY);
    ctx.stroke();

    // Signature text
    ctx.fillStyle = colors.textSecondary;
    ctx.font = '28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Shared with gratitude 🙏', width / 2, signatureY);

    // Convert canvas to blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/png', 0.95);
    });

  } catch (error) {
    console.error('Error generating feedback image:', error);
    return null;
  }
};

// Copy image to clipboard
export const copyImageToClipboard = async (blob: Blob): Promise<boolean> => {
  try {
    if (!navigator.clipboard || !window.ClipboardItem) {
      throw new Error('Clipboard API not supported');
    }

    const clipboardItem = new ClipboardItem({
      'image/png': blob
    });

    await navigator.clipboard.write([clipboardItem]);
    return true;
  } catch (error) {
    console.error('Error copying image to clipboard:', error);
    return false;
  }
}; 
