// Slot Machine Counter Animation Utility
export class SlotCounterAnimation {
  private element: HTMLElement;
  private finalValue: number;
  private duration: number;
  private isRunning: boolean = false;

  constructor(element: HTMLElement, finalValue: number, duration: number = 2000) {
    this.element = element;
    this.finalValue = finalValue;
    this.duration = duration;
  }

  start(): Promise<void> {
    if (this.isRunning) return Promise.resolve();
    
    return new Promise((resolve) => {
      this.isRunning = true;
      const startTime = Date.now();
      const startValue = 0;
      const valueRange = this.finalValue - startValue;

      // Create individual digit elements if they don't exist
      this.setupDigitElements();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / this.duration, 1);

        // Easing function for slot machine effect
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        if (progress < 1) {
          // During animation, show random numbers that gradually approach final value
          const currentValue = Math.floor(startValue + (valueRange * easeOut));
          const randomOffset = Math.floor(Math.random() * (100 - (progress * 100)));
          const displayValue = Math.max(0, currentValue + (progress < 0.9 ? randomOffset : 0));
          
          this.updateDisplay(displayValue);
          requestAnimationFrame(animate);
        } else {
          // Animation complete
          this.updateDisplay(this.finalValue);
          this.isRunning = false;
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }

  private setupDigitElements() {
    // Create wrapper for individual digits
    this.element.style.display = 'inline-block';
    this.element.style.fontVariantNumeric = 'tabular-nums';
  }

  private updateDisplay(value: number) {
    const formattedValue = Math.floor(value).toLocaleString();
    
    // Add slight blur during rapid changes for slot machine effect
    const blur = this.isRunning && Math.random() > 0.7 ? 'blur(0.5px)' : 'none';
    this.element.style.filter = blur;
    
    this.element.textContent = formattedValue;
  }

  static animateElement(element: HTMLElement, finalValue: number, duration: number = 2000): Promise<void> {
    const animation = new SlotCounterAnimation(element, finalValue, duration);
    return animation.start();
  }
}

// Enhanced version with digit-by-digit animation
export class DigitSlotAnimation {
  private element: HTMLElement;
  private finalValue: number;

  constructor(element: HTMLElement, finalValue: number, _duration: number = 2000) {
    this.element = element;
    this.finalValue = finalValue;
    // _duration parameter is kept for API compatibility but not used internally
  }

  start(): Promise<void> {
    return new Promise((resolve) => {
      const finalString = this.finalValue.toString();
      const digitElements: HTMLElement[] = [];

      // Clear and setup digit elements
      this.element.innerHTML = '';
      this.element.style.display = 'flex';
      this.element.style.alignItems = 'center';
      this.element.style.justifyContent = 'center';

      // Create individual digit containers
      for (let i = 0; i < finalString.length; i++) {
        const digitContainer = document.createElement('div');
        digitContainer.style.display = 'inline-block';
        digitContainer.style.width = '1ch';
        digitContainer.style.textAlign = 'center';
        digitContainer.style.overflow = 'hidden';
        digitContainer.style.height = '1.2em';
        digitContainer.style.position = 'relative';
        digitContainer.style.fontVariantNumeric = 'tabular-nums';
        
        const digitElement = document.createElement('div');
        digitElement.style.transition = 'transform 0.1s ease';
        digitElement.textContent = '0';
        
        digitContainer.appendChild(digitElement);
        this.element.appendChild(digitContainer);
        digitElements.push(digitElement);
      }

      // Animate each digit with staggered timing
      const promises: Promise<void>[] = [];
      
      digitElements.forEach((digitElement, index) => {
        const finalDigit = parseInt(finalString[index]);
        const delay = index * 100; // Stagger each digit by 100ms
        
        const promise = new Promise<void>((digitResolve) => {
          setTimeout(() => {
            this.animateDigit(digitElement, finalDigit, 800).then(digitResolve);
          }, delay);
        });
        
        promises.push(promise);
      });

      Promise.all(promises).then(() => resolve());
    });
  }

  private animateDigit(element: HTMLElement, finalDigit: number, duration: number): Promise<void> {
    return new Promise((resolve) => {
      const startTime = Date.now();
      let currentDigit = 0;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        if (progress < 1) {
          // Show random digits during animation
          if (Math.random() > 0.3) {
            currentDigit = Math.floor(Math.random() * 10);
          }
          
          // Gradually bias towards final digit
          if (progress > 0.7 && Math.random() > (1 - progress)) {
            currentDigit = finalDigit;
          }

          element.textContent = currentDigit.toString();
          
          // Add slight shake effect
          const shake = Math.sin(elapsed * 0.05) * (1 - progress) * 2;
          element.style.transform = `translateY(${shake}px)`;

          requestAnimationFrame(animate);
        } else {
          element.textContent = finalDigit.toString();
          element.style.transform = 'translateY(0)';
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }

  static animateElement(element: HTMLElement, finalValue: number, duration: number = 2000): Promise<void> {
    const animation = new DigitSlotAnimation(element, finalValue, duration);
    return animation.start();
  }
}
