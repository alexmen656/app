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
    
    // Set canvas size to 1024x1024 as requested
    canvas.width = 1024;
    canvas.height = 1024;
    
    const productImageUrl = nutritionData.image;
    
    if (productImageUrl) {
      // Load and draw product image as background
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        // Fill canvas with product image (cover style) - force to 1024x1024
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
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
  // Floating white panel with premium design
  const margin = 60;
  const panelWidth = canvas.width - (margin * 2);
  const panelHeight = 280; // Increased height for better layout
  const panelX = margin;
  const panelY = canvas.height - panelHeight - margin;
  const cornerRadius = 32;
  
  // Premium white background with shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
  ctx.shadowBlur = 40;
  ctx.shadowOffsetY = 20;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
  roundRect(ctx, panelX, panelY, panelWidth, panelHeight, cornerRadius);
  ctx.fill();
  
  // Subtle inner shadow for depth
  const innerGradient = ctx.createLinearGradient(0, panelY, 0, panelY + 20);
  innerGradient.addColorStop(0, 'rgba(0, 0, 0, 0.02)');
  innerGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = innerGradient;
  roundRect(ctx, panelX, panelY, panelWidth, 20, cornerRadius);
  ctx.fill();
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  
  // Calculate nutrition values
  const totalCalories = Math.round(nutritionData.calories * amount);
  const totalProtein = Math.round(nutritionData.protein * amount);
  const totalCarbs = Math.round(nutritionData.carbs * amount);
  const totalFats = Math.round(nutritionData.fats * amount);
  
  // Nutrition data with beautiful colors
  const nutritionItems = [
    { 
      value: totalCalories, 
      unit: 'kcal', 
      label: 'Kalorien',
      color: '#FF6B35',
      bgColor: 'rgba(255, 107, 53, 0.1)',
      icon: '🔥'
    },
    { 
      value: totalProtein, 
      unit: 'g', 
      label: 'Protein',
      color: '#E74C3C',
      bgColor: 'rgba(231, 76, 60, 0.1)',
      icon: '💪'
    },
    { 
      value: totalCarbs, 
      unit: 'g', 
      label: 'Carbs',
      color: '#F39C12',
      bgColor: 'rgba(243, 156, 18, 0.1)',
      icon: '🍞'
    },
    { 
      value: totalFats, 
      unit: 'g', 
      label: 'Fats',
      color: '#3498DB',
      bgColor: 'rgba(52, 152, 219, 0.1)',
      icon: '🥑'
    }
  ];
  
  // Create 2x2 grid layout
  const cardWidth = (panelWidth - 100) / 2; // Space for margins and gap
  const cardHeight = 100;
  const gap = 20;
  const startX = panelX + 40; // Left margin
  const startY = panelY + 40; // Top margin
  
  nutritionItems.forEach((item, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;
    const x = startX + col * (cardWidth + gap);
    const y = startY + row * (cardHeight + gap);
    
    // Card background with gradient
    const cardGradient = ctx.createLinearGradient(x, y, x, y + cardHeight);
    cardGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    cardGradient.addColorStop(1, item.bgColor);
    ctx.fillStyle = cardGradient;
    roundRect(ctx, x, y, cardWidth, cardHeight, 16);
    ctx.fill();
    
    // Subtle border
    ctx.strokeStyle = item.color + '30';
    ctx.lineWidth = 1.5;
    roundRect(ctx, x, y, cardWidth, cardHeight, 16);
    ctx.stroke();
    
    // Color accent bar at top
    ctx.fillStyle = item.color;
    roundRect(ctx, x, y, cardWidth, 5, 3);
    ctx.fill();
    
    // Icon (emoji)
    ctx.font = '24px system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(item.icon, x + 16, y + 35);
    
    // Main value with color
    ctx.fillStyle = item.color;
    ctx.font = 'bold 32px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${item.value}${item.unit}`, x + cardWidth - 16, y + 45);
    
    // Label
    ctx.fillStyle = '#666666';
    ctx.font = '16px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(item.label, x + 50, y + 70);
  });
  
  // Premium branding at bottom
  ctx.fillStyle = '#8B5CF6';
  ctx.font = 'bold 18px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Kalbuddy', canvas.width / 2, panelY + panelHeight - 20);
  
  // Subtle sparkle effect
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(panelX + panelWidth - 30, panelY + 25, 3, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(panelX + 30, panelY + panelHeight - 40, 2, 0, 2 * Math.PI);
  ctx.fill();
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
  for (let i = 0; i < canvas.width; i += 80) {
    for (let j = 0; j < canvas.height; j += 80) {
      ctx.fillRect(i, j, 40, 2);
      ctx.fillRect(i, j, 2, 40);
    }
  }
  
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
      text: `🥗 ${getLocalizedName(nutritionData)}\n\n📊 Nährwerte:\n🔥 ${Math.round(nutritionData.calories * amount)} kcal\n🥩 ${Math.round(nutritionData.protein * amount)}g Protein\n🍞 ${Math.round(nutritionData.carbs * amount)}g Kohlenhydrate\n🥑 ${Math.round(nutritionData.fats * amount)}g Fett\n\n📱 Verfolge deine Ernährung mit Kalbuddy`,
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
