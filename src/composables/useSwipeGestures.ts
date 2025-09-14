import { useRouter } from 'vue-router'

export interface SwipeHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
}

export function useSwipeGestures(handlers: SwipeHandlers = {}) {
  const router = useRouter()
  
  let touchStartX = 0
  let touchStartY = 0
  const swipeThreshold = 50

  const handleTouchStart = (event: TouchEvent) => {
    touchStartX = event.touches[0].clientX
    touchStartY = event.touches[0].clientY
  }

  const handleTouchMove = (event: TouchEvent) => {
    // Prevent default to avoid scrolling issues during swipe
    const currentX = event.touches[0].clientX
    const currentY = event.touches[0].clientY
    const deltaX = Math.abs(currentX - touchStartX)
    const deltaY = Math.abs(currentY - touchStartY)

    if (deltaX > deltaY && deltaX > 10) {
      event.preventDefault()
    }
  }

  const handleTouchEnd = (event: TouchEvent) => {
    const touchEndX = event.changedTouches[0].clientX
    const touchEndY = event.changedTouches[0].clientY
    
    const deltaX = touchEndX - touchStartX
    const deltaY = touchEndY - touchStartY
    
    // Check if it's more horizontal than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX > swipeThreshold) {
        // Swipe right
        if (handlers.onSwipeRight) {
          handlers.onSwipeRight()
        } else {
          router.push('/')
        }
      } else if (deltaX < -swipeThreshold) {
        // Swipe left  
        if (handlers.onSwipeLeft) {
          handlers.onSwipeLeft()
        } else {
          router.push('/settings')
        }
      }
    } else {
      if (deltaY > swipeThreshold) {
        // Swipe down
        handlers.onSwipeDown?.()
      } else if (deltaY < -swipeThreshold) {
        // Swipe up
        handlers.onSwipeUp?.()
      }
    }
  }

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    swipeThreshold
  }
}
