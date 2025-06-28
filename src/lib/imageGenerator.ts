// Image generation utility for feedback cards
export const generateFeedbackImage = async (message: string, isDarkTheme: boolean = false): Promise<Blob | null> => {
  try {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas context not available');
    }

    // Fixed width for consistency, dynamic height based on content
    const width = 1080;
    const minHeight = 1080;
    const maxWidth = 1080;

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

    // Dynamic font size calculation based on message length
    const getDynamicFontSize = (text: string) => {
      if (text.length <= 100) return 64;
      if (text.length <= 200) return 56;
      if (text.length <= 400) return 48;
      if (text.length <= 600) return 42;
      if (text.length <= 800) return 38;
      if (text.length <= 1000) return 34;
      if (text.length <= 1200) return 32;
      if (text.length <= 1500) return 30;
      if (text.length <= 1800) return 28;
      return 26; // For 1800+ characters
    };

    const fontSize = getDynamicFontSize(message);
    const lineHeight = fontSize * 1.5;

    // Set font for measurement
    ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;

    // Card dimensions and positioning
    const cardPadding = 80;
    const cardX = cardPadding;
    const headerHeight = 140;
    const contentPadding = 80;
    const messageWidth = width - (cardPadding * 2) - (contentPadding * 2);
    const bottomSignatureHeight = 120;

    // Enhanced text wrapping function with better word handling
    const wrapText = (text: string, maxWidth: number) => {
      const words = text.split(/\s+/);
      const lines: string[] = [];
      let currentLine = '';

      for (const word of words) {
        const testLine = currentLine + (currentLine ? ' ' : '') + word;
        const metrics = ctx.measureText(testLine);

        if (metrics.width > maxWidth && currentLine !== '') {
          lines.push(currentLine);
          currentLine = word;

          // Handle very long single words by breaking them
          if (ctx.measureText(currentLine).width > maxWidth) {
            const chars = currentLine.split('');
            let charLine = '';
            for (const char of chars) {
              const testCharLine = charLine + char;
              if (ctx.measureText(testCharLine).width > maxWidth && charLine !== '') {
                lines.push(charLine);
                charLine = char;
              } else {
                charLine = testCharLine;
              }
            }
            if (charLine) {
              currentLine = charLine;
            }
          }
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        lines.push(currentLine);
      }

      return lines;
    };

    // Calculate required text height
    const lines = wrapText(message, messageWidth);
    const totalTextHeight = lines.length * lineHeight;

    // Calculate dynamic canvas height with minimum constraints
    const contentVerticalPadding = 120; // Top and bottom padding for message content
    const calculatedHeight = cardPadding + headerHeight + contentVerticalPadding + totalTextHeight + bottomSignatureHeight + cardPadding;
    const height = Math.max(minHeight, calculatedHeight + 200); // Extra buffer for visual balance

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Create background gradient
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, colors.gradientStart);
    bgGradient.addColorStop(1, colors.gradientEnd);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // Add decorative background elements (scaled for dynamic height)
    if (isDarkTheme) {
      // Dark theme decorative circles
      ctx.fillStyle = 'rgba(16, 185, 129, 0.03)';
      ctx.beginPath();
      ctx.arc(width * 0.2, height * 0.15, 150, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(16, 185, 129, 0.05)';
      ctx.beginPath();
      ctx.arc(width * 0.8, height * 0.85, 200, 0, Math.PI * 2);
      ctx.fill();

      // Additional circle for very tall images
      if (height > 1400) {
        ctx.fillStyle = 'rgba(16, 185, 129, 0.02)';
        ctx.beginPath();
        ctx.arc(width * 0.1, height * 0.5, 120, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Light theme decorative circles
      ctx.fillStyle = 'rgba(20, 184, 166, 0.08)';
      ctx.beginPath();
      ctx.arc(width * 0.15, height * 0.12, 180, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(20, 184, 166, 0.05)';
      ctx.beginPath();
      ctx.arc(width * 0.85, height * 0.88, 220, 0, Math.PI * 2);
      ctx.fill();

      // Additional circle for very tall images
      if (height > 1400) {
        ctx.fillStyle = 'rgba(20, 184, 166, 0.04)';
        ctx.beginPath();
        ctx.arc(width * 0.9, height * 0.4, 160, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Card dimensions (dynamic height)
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
    const availableContentHeight = cardHeight - headerHeight - bottomSignatureHeight - 120;

    // Message text styling with dynamic size and center alignment
    ctx.fillStyle = colors.textPrimary;
    ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // Center the text vertically in available space
    const startY = contentY + Math.max(20, (availableContentHeight - totalTextHeight) / 2);

    // Draw message lines centered
    lines.forEach((line, index) => {
      const y = startY + (index * lineHeight);
      ctx.fillText(line, width / 2, y);
    });

    // Bottom signature with decorative line (positioned relative to card bottom)
    const signatureY = cardY + cardHeight - 60;

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
