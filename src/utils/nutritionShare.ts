import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { getLocalizedName } from './localization';

interface NutritionData {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  image?: string;
  name?: string;
  name_en?: string;
  names?: { [key: string]: string };
  [key: string]: any;
}

// Helper function to convert blob to base64
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1]); // Remove data:image/png;base64, prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Helper function for rounded rectangles
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Create nutrition preview image with improved design
export async function createNutritionPreviewImage(nutritionData: NutritionData, amount: number = 1): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // Set canvas size (Instagram story format)
    canvas.width = 800;
    canvas.height = 1200;
    
    const productImageUrl = nutritionData.image;
    
    if (productImageUrl) {
      // Load and draw product image as background
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Fill canvas with product image (cover style)
        const aspectRatio = img.width / img.height;
        const canvasAspectRatio = canvas.width / canvas.height;
        
        let drawWidth, drawHeight, offsetX, offsetY;
        
        if (aspectRatio > canvasAspectRatio) {
          // Image is wider than canvas
          drawHeight = canvas.height;
          drawWidth = drawHeight * aspectRatio;
          offsetX = (canvas.width - drawWidth) / 2;
          offsetY = 0;
        } else {
          // Image is taller than canvas
          drawWidth = canvas.width;
          drawHeight = drawWidth / aspectRatio;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        }
        
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        
        // Add dark overlay with 0.2 opacity as requested
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        drawNutritionPanel(ctx, canvas, nutritionData, amount);
        resolve(canvas.toDataURL('image/png', 0.9));
      };
      
      img.onerror = () => {
        // Fallback to gradient if image fails to load
        createFallbackImage(ctx, canvas, nutritionData, amount);
        resolve(canvas.toDataURL('image/png', 0.9));
      };
      
      img.src = productImageUrl;
    } else {
      // No image available, use fallback
      createFallbackImage(ctx, canvas, nutritionData, amount);
      resolve(canvas.toDataURL('image/png', 0.9));
    }
  });
}

function drawNutritionPanel(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, nutritionData: NutritionData, amount: number) {
  // Bottom rounded panel like in the reference image
  const panelHeight = 380;
  const panelY = canvas.height - panelHeight;
  const cornerRadius = 32;
  
  // White background with rounded top corners
  ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
  roundRect(ctx, 0, panelY, canvas.width, panelHeight, cornerRadius);
  ctx.fill();
  
  // Subtle shadow at the top of the panel
  const shadowGradient = ctx.createLinearGradient(0, panelY - 15, 0, panelY + 15);
  shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
  shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.08)');
  ctx.fillStyle = shadowGradient;
  ctx.fillRect(0, panelY - 15, canvas.width, 30);
  
  // Product name - large and bold
  ctx.fillStyle = '#1a1a1a';
  ctx.font = 'bold 32px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';
  const title = getLocalizedName(nutritionData);
  
  // Handle long text by wrapping or truncating
  const maxWidth = canvas.width - 80;
  const titleMetrics = ctx.measureText(title);
  if (titleMetrics.width > maxWidth) {
    ctx.font = 'bold 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
  }
  ctx.fillText(title, canvas.width / 2, panelY + 50);
  
  // Amount info with better styling
  ctx.font = '20px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#666666';
  ctx.fillText(`${amount} Portion${amount !== 1 ? 'en' : ''}`, canvas.width / 2, panelY + 85);
  
  // Nutrition values in a clean grid layout
  const nutritionBoxY = panelY + 120;
  const nutritionData2 = [
    { 
      label: `${Math.round(nutritionData.calories * amount)}kcal`, 
      sublabel: 'Kalorien', 
      color: '#ff6b35',
      bgColor: '#fff5f2'
    },
    { 
      label: `${Math.round(nutritionData.protein * amount)}g`, 
      sublabel: 'Protein', 
      color: '#e74c3c',
      bgColor: '#fdf2f2'
    },
    { 
      label: `${Math.round(nutritionData.carbs * amount)}g`, 
      sublabel: 'Carbs', 
      color: '#f39c12',
      bgColor: '#fffbf2'
    },
    { 
      label: `${Math.round(nutritionData.fats * amount)}g`, 
      sublabel: 'Fats', 
      color: '#3498db',
      bgColor: '#f2f9ff'
    }
  ];
  
  // Draw nutrition cards in 2x2 grid
  const cardWidth = 160;
  const cardHeight = 100;
  const spacing = 20;
  const startX = (canvas.width - (2 * cardWidth + spacing)) / 2;
  
  nutritionData2.forEach((item, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;
    const x = startX + col * (cardWidth + spacing);
    const y = nutritionBoxY + row * (cardHeight + spacing);
    
    // Card background with rounded corners
    ctx.fillStyle = item.bgColor;
    roundRect(ctx, x, y, cardWidth, cardHeight, 16);
    ctx.fill();
    
    // Border
    ctx.strokeStyle = item.color + '20';
    ctx.lineWidth = 2;
    roundRect(ctx, x, y, cardWidth, cardHeight, 16);
    ctx.stroke();
    
    // Color accent line at top
    ctx.fillStyle = item.color;
    roundRect(ctx, x, y, cardWidth, 4, 2);
    ctx.fill();
    
    // Main value (large)
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 28px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(item.label, x + cardWidth / 2, y + 45);
    
    // Label (smaller)
    ctx.fillStyle = '#666666';
    ctx.font = '16px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillText(item.sublabel, x + cardWidth / 2, y + 70);
  });
  
  // Kalbuddy branding at bottom
  ctx.fillStyle = '#333333';
  ctx.font = 'bold 18px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Kalbuddy - Dein Kalorien-Tracker', canvas.width / 2, canvas.height - 30);
}

function createFallbackImage(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, nutritionData: NutritionData, amount: number) {
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(0.5, '#764ba2');
  gradient.addColorStop(1, '#5b4397');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Add subtle pattern overlay
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  for (let i = 0; i < canvas.width; i += 60) {
    for (let j = 0; j < canvas.height; j += 60) {
      ctx.fillRect(i, j, 30, 2);
      ctx.fillRect(i, j, 2, 30);
    }
  }
  
  // Large product name at top
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 48px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 2;
  
  const productName = getLocalizedName(nutritionData);
  const maxWidth = canvas.width - 80;
  const nameMetrics = ctx.measureText(productName);
  if (nameMetrics.width > maxWidth) {
    ctx.font = 'bold 36px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
  }
  ctx.fillText(productName, canvas.width / 2, 150);
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  
  drawNutritionPanel(ctx, canvas, nutritionData, amount);
}

// Main share function
export async function shareNutrition(
  nutritionData: NutritionData, 
  amount: number = 1, 
  setSharing: (value: boolean) => void
) {
  if (!nutritionData || !nutritionData.calories) return;
  
  setSharing(true);
  
  try {
    // Create preview image as data URL
    const imageDataUrl = await createNutritionPreviewImage(nutritionData, amount);
    
    // Convert data URL to blob and save as temporary file
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();
    
    // Convert blob to base64 for Filesystem API
    const base64Data = await blobToBase64(blob);
    
    // Generate unique filename
    const fileName = `nutrition-share-${Date.now()}.png`;
    
    // Write file to temporary directory
    const result = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Cache
    });
    
    // Share the nutrition data with the image file
    await Share.share({
      title: `${getLocalizedName(nutritionData)} - Kalbuddy`,
      text: `🥗 ${getLocalizedName(nutritionData)}\n\n📊 Nährwerte pro ${amount} Portion:\n🔥 ${Math.round(nutritionData.calories * amount)} kcal\n🥩 ${Math.round(nutritionData.protein * amount)}g Protein\n🍞 ${Math.round(nutritionData.carbs * amount)}g Kohlenhydrate\n🥑 ${Math.round(nutritionData.fats * amount)}g Fett\n\n📱 Verfolge deine Ernährung mit Kalbuddy`,
      files: [result.uri],
      dialogTitle: 'Nährwerte teilen'
    });
    
    // Track analytics (optional - could be added later)
    console.log('Nutrition shared:', {
      product_name: getLocalizedName(nutritionData),
      amount: amount
    });
    
    // Clean up the temporary file after sharing
    setTimeout(async () => {
      try {
        await Filesystem.deleteFile({
          path: fileName,
          directory: Directory.Cache
        });
      } catch (error) {
        console.log('Could not delete temporary file:', error);
      }
    }, 5000);
    
  } catch (error) {
    console.error('Error sharing nutrition:', error);
    // You might want to show a user-friendly error message here
  } finally {
    setSharing(false);
  }
}
