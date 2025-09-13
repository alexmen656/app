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
  // Floating white panel like in the reference image - with margins from all edges
  const margin = 60; // Distance from edges
  const panelWidth = canvas.width - (margin * 2);
  const panelHeight = 200; // Smaller, more compact panel
  const panelX = margin;
  const panelY = canvas.height - panelHeight - margin; // Float above bottom with margin
  const cornerRadius = 24;
  
  // White background with rounded corners and shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 15;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
  roundRect(ctx, panelX, panelY, panelWidth, panelHeight, cornerRadius);
  ctx.fill();
  
  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
  
  // Create nutrition data with larger text
  const totalCalories = Math.round(nutritionData.calories * amount);
  const totalProtein = Math.round(nutritionData.protein * amount);
  const totalCarbs = Math.round(nutritionData.carbs * amount);
  const totalFats = Math.round(nutritionData.fats * amount);
  
  // Main nutrition text - very large like in reference image
  ctx.fillStyle = '#1a1a1a';
  ctx.font = 'bold 48px system-ui, -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.textAlign = 'center';
  
  // Center all text vertically in the panel
  const textY = panelY + panelHeight / 2;
  
  // Format text exactly like in reference image: "2000kcal 100g Protein 300g Carbs 100g fats"
  const nutritionText = `${totalCalories}kcal  ${totalProtein}g Protein  ${totalCarbs}g Carbs  ${totalFats}g fats`;
  
  // Check if text fits, if not make it smaller
  let fontSize = 48;
  ctx.font = `bold ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
  let textWidth = ctx.measureText(nutritionText).width;
  
  while (textWidth > panelWidth - 40 && fontSize > 24) {
    fontSize -= 2;
    ctx.font = `bold ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, sans-serif`;
    textWidth = ctx.measureText(nutritionText).width;
  }
  
  ctx.fillText(nutritionText, canvas.width / 2, textY + 10);
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
