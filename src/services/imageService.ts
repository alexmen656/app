import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

export interface ImageSelectionOptions {
  allowEditing?: boolean
  quality?: number
  width?: number
  height?: number
}

export class ImageService {
  static async isAvailable(): Promise<boolean> {
    try {
      // Check if Camera plugin is available
      return 'Camera' in window && typeof Camera !== 'undefined'
    } catch {
      return false
    }
  }

  static async selectFromGallery(options: ImageSelectionOptions = {}): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: options.quality || 90,
        allowEditing: options.allowEditing !== false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
        width: options.width || 300,
        height: options.height || 300
      })

      return image.dataUrl || null
    } catch (error) {
      console.error('Error selecting image from gallery:', error)
      return null
    }
  }

  static async takePhoto(options: ImageSelectionOptions = {}): Promise<string | null> {
    try {
      const image = await Camera.getPhoto({
        quality: options.quality || 90,
        allowEditing: options.allowEditing !== false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: options.width || 300,
        height: options.height || 300
      })

      return image.dataUrl || null
    } catch (error) {
      console.error('Error taking photo:', error)
      return null
    }
  }

  static async showImageSelectionDialog(): Promise<string | null> {
    return new Promise((resolve) => {
      const dialog = document.createElement('div')
      dialog.className = 'image-selection-modal'
      dialog.innerHTML = `
        <div class="image-selection-overlay">
          <div class="image-selection-content">
            <h3>Profile Picture</h3>
            <p>Choose how you'd like to add your profile picture:</p>
            <div class="image-selection-buttons">
              <button class="image-btn camera-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 15.2l3.2-2.7L12 9.8l-3.2 2.7L12 15.2zM9 2l-1.8 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.2L15 2H9zm3 15c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"/>
                </svg>
                Take Photo
              </button>
              <button class="image-btn gallery-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                </svg>
                Choose from Gallery
              </button>
              <button class="image-btn cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      `

      // Add styles
      const style = document.createElement('style')
      style.textContent = `
        .image-selection-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 10000;
        }
        .image-selection-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          backdrop-filter: blur(5px);
        }
        .image-selection-content {
          background: linear-gradient(135deg, #1e1e2e 0%, #2a2d37 100%);
          border-radius: 16px;
          padding: 24px;
          color: white;
          max-width: 300px;
          width: 100%;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .image-selection-content h3 {
          margin: 0 0 8px 0;
          font-size: 20px;
          font-weight: 600;
        }
        .image-selection-content p {
          margin: 0 0 20px 0;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
        }
        .image-selection-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .image-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 16px;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .camera-btn, .gallery-btn {
          background: rgba(0, 112, 82, 0.2);
          color: #00a86b;
          border: 1px solid rgba(0, 112, 82, 0.4);
        }
        .camera-btn:hover, .gallery-btn:hover {
          background: rgba(0, 112, 82, 0.3);
          border-color: rgba(0, 112, 82, 0.6);
        }
        .cancel-btn {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .cancel-btn:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      `
      document.head.appendChild(style)
      document.body.appendChild(dialog)

      const cleanup = () => {
        document.body.removeChild(dialog)
        document.head.removeChild(style)
      }

      dialog.querySelector('.camera-btn')?.addEventListener('click', async () => {
        cleanup()
        const result = await ImageService.takePhoto()
        resolve(result)
      })

      dialog.querySelector('.gallery-btn')?.addEventListener('click', async () => {
        cleanup()
        const result = await ImageService.selectFromGallery()
        resolve(result)
      })

      dialog.querySelector('.cancel-btn')?.addEventListener('click', () => {
        cleanup()
        resolve(null)
      })

      // Close on overlay click
      dialog.querySelector('.image-selection-overlay')?.addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
          cleanup()
          resolve(null)
        }
      })
    })
  }
}
