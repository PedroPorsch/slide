export default class Slide {
    constructor(slide, wrapper) {
      this.slide = document.querySelector(slide);
      this.wrapper = document.querySelector(wrapper);
      this.dist = {
        final: 0,
        startX: 0,
        movement: 0
      };
    }
  
    updatePosition(clientX) {
      this.dist.movement = (this.dist.startX - clientX) * 1.5;
      return this.dist.final - this.dist.movement;
    }
  
    onStart(e) {
      e.preventDefault();
      const moveType = e.type === 'mousedown' ? 'mousemove' : 'touchmove';
  
      this.dist.startX = e.type === 'mousedown' ? e.clientX : e.changedTouches[0].clientX;
  
      this.wrapper.addEventListener(moveType, this.onMove);
    }
  
    moveSlide(distX) {
      this.dist.movePosition = distX;
      this.slide.style.transform = `translate3d(${distX}px, 0, 0)`;
    }
  
    onMove(e) {
      const pointerPosition = e.type === 'mousemove' ? e.clientX : e.changedTouches[0].clientX;
      const finalPosition = this.updatePosition(pointerPosition);
      this.moveSlide(finalPosition);
    }
  
    addSlideEvents() {
      this.wrapper.addEventListener('mousedown', this.onStart.bind(this));
      this.wrapper.addEventListener('touchstart', this.onStart.bind(this));
      this.wrapper.addEventListener('mouseup', this.onEnd.bind(this));
      this.wrapper.addEventListener('touchend', this.onEnd.bind(this));
    }
  
    onEnd(e) {
      const moveType = e.type === 'mouseup' ? 'mousemove' : 'touchmove';
      this.wrapper.removeEventListener(moveType, this.onMove);
      this.dist.final = this.dist.movePosition;
    }
  
    bindEvents() {
      this.onStart = this.onStart.bind(this);
      this.onMove = this.onMove.bind(this);
      this.onEnd = this.onEnd.bind(this);
    }
  
    slidePosition(slide) {
      const margin = (this.wrapper.offsetWidth - slide.offsetWidth) / 2;
      return -(slide.offsetLeft - margin);
    }
  
    // Slide config
    slideConfig() {
      this.slideArray = [...this.slide.children].map((element) => {
        const position = this.slidePosition(element);
        return {
          position,
          element
        };
      });
    }
  
    slideIndexNav(index) {
        const last = this.slideArray.length -1;

      this.index = {
        prev: index ? index - 1 : undefined,
        active: index,
        next: index === last ? undefined : index + 1
      };
    }
  
    changeSlide(index) {
        const activeSlide = this.slideArray[index];
        this.moveSlide(this.slideArray[index].position);
        this.slideIndexNav(index);
        this.dist.final = activeSlide.position
    }
  
    init() {
      this.bindEvents();
      this.addSlideEvents();
      this.slideConfig();
      return this;
    }
  }
  