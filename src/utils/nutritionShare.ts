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
  // Floating white panel with premium design - much larger for readability
  const margin = 60;
  const panelWidth = canvas.width - (margin * 2);
  const panelHeight = 400; // Much bigger for readability
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
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  
  // Calculate nutrition values
  const totalCalories = Math.round(nutritionData.calories * amount);
  const totalProtein = Math.round(nutritionData.protein * amount);
  const totalCarbs = Math.round(nutritionData.carbs * amount);
  const totalFats = Math.round(nutritionData.fats * amount);
  
  // Nutrition data with proper colors and no emojis
  const nutritionItems = [
    { 
      value: totalCalories, 
      unit: 'kcal', 
      label: 'Kalorien',
      color: '#ff6b35',
      bgColor: 'rgba(255, 107, 53, 0.15)'
    },
    { 
      value: totalProtein, 
      unit: 'g', 
      label: 'Protein',
      color: '#ff6b6b',
      bgColor: 'rgba(255, 107, 107, 0.15)'
    },
    { 
      value: totalCarbs, 
      unit: 'g', 
      label: 'Carbs',
      color: '#ffa726',
      bgColor: 'rgba(255, 167, 38, 0.15)'
    },
    { 
      value: totalFats, 
      unit: 'g', 
      label: 'Fats',
      color: '#42a5f5',
      bgColor: 'rgba(66, 165, 245, 0.15)'
    }
  ];
  
  // Create 2x2 grid layout with bigger cards
  const cardWidth = (panelWidth - 120) / 2; // More space for margins
  const cardHeight = 140; // Much bigger cards
  const gap = 30; // Bigger gap
  const startX = panelX + 60; // More left margin
  const startY = panelY + 50; // More top margin
  
  nutritionItems.forEach((item, index) => {
    const row = Math.floor(index / 2);
    const col = index % 2;
    const x = startX + col * (cardWidth + gap);
    const y = startY + row * (cardHeight + gap);
    
    // Card background with subtle gradient
    const cardGradient = ctx.createLinearGradient(x, y, x, y + cardHeight);
    cardGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    cardGradient.addColorStop(1, item.bgColor);
    ctx.fillStyle = cardGradient;
    roundRect(ctx, x, y, cardWidth, cardHeight, 20);
    ctx.fill();
    
    // Subtle border
    ctx.strokeStyle = item.color + '40';
    ctx.lineWidth = 2;
    roundRect(ctx, x, y, cardWidth, cardHeight, 20);
    ctx.stroke();
    
    // Color accent bar at top - thicker
    ctx.fillStyle = item.color;
    roundRect(ctx, x, y, cardWidth, 8, 4);
    ctx.fill();
    
    // Draw proper SVG-style icons (simplified versions)
    ctx.fillStyle = item.color;
    ctx.strokeStyle = item.color;
    ctx.lineWidth = 3;
    
    const iconX = x + 20;
    const iconY = y + 35;
    
    if (index === 0) { // Calories - flame icon
      ctx.beginPath();
      ctx.moveTo(iconX + 12, iconY);
      ctx.bezierCurveTo(iconX + 8, iconY + 8, iconX + 16, iconY + 12, iconX + 12, iconY + 20);
      ctx.bezierCurveTo(iconX + 8, iconY + 16, iconX + 4, iconY + 8, iconX + 12, iconY);
      ctx.fill();
    } else if (index === 1) { // Protein - dumbbell simplified
      ctx.fillRect(iconX + 2, iconY + 10, 20, 4);
      ctx.fillRect(iconX, iconY + 6, 4, 12);
      ctx.fillRect(iconX + 20, iconY + 6, 4, 12);
    } else if (index === 2) { // Carbs - wheat simplified
      ctx.beginPath();
      ctx.moveTo(iconX + 12, iconY);
      ctx.lineTo(iconX + 12, iconY + 20);
      ctx.stroke();
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.arc(iconX + 8 + (i % 2) * 8, iconY + 4 + i * 3, 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    } else { // Fats - avocado simplified
      ctx.beginPath();
      ctx.ellipse(iconX + 12, iconY + 12, 10, 12, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(iconX + 12, iconY + 12, 4, 6, 0, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = item.color;
    }
    
    // Main value with much larger font
    ctx.fillStyle = item.color;
    ctx.font = 'bold 42px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${item.value}${item.unit}`, x + cardWidth - 20, y + 80);
    
    // Label with bigger font
    ctx.fillStyle = '#666666';
    ctx.font = '20px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(item.label, x + 55, y + 105);
  });
  
  // Premium branding at bottom - correct green color and spelling
  ctx.fillStyle = '#007052'; // Correct green color from HomeView
  ctx.font = 'bold 24px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('KalBuddy', canvas.width / 2, panelY + panelHeight - 30); // Correct spelling
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
