import debounce from './debounce.js'

export default class Slide {
    constructor(slide, wrapper) {
      this.slide = document.querySelector(slide);
      this.wrapper = document.querySelector(wrapper);
      this.dist = {
        final: 0,
        startX: 0,
        movement: 0
      };
      this.activeClass = 'active'
      this.changeEvent = new Event('changeEvent');
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
      this.transition(false);
    }
  
    transition(active){
       this.slide.style.transition = active ? 'transform .3s' : '';
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
      this.activePrevSlide = this.activePrevSlide.bind(this)
      this.activeNextSlide = this.activeNextSlide.bind(this)
    }
  
    onEnd(e) {
      const moveType = e.type === 'mouseup' ? 'mousemove' : 'touchmove';
      this.wrapper.removeEventListener(moveType, this.onMove);
      this.dist.final = this.dist.movePosition;
      this.transition(true);
      this.changeSlideOnEnd();
    }

    changeSlideOnEnd(){
      if(this.dist.movement > 120 && this.index.next !== undefined){
        this.activeNextSlide()
      }else if(this.dist.movement < 120  && this.index.prev !== undefined){
        this.activePrevSlide()
      }else{
        this.changeSlide(this.index.active)
      }
    }
  
    bindEvents() {
      this.onStart = this.onStart.bind(this);
      this.onMove = this.onMove.bind(this);
      this.onEnd = this.onEnd.bind(this);
      this.onResize = this.onResize.bind(this);
      this.onResize = debounce(this.onResize.bind(this), 200)
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
        this.dist.final = activeSlide.position;
        this.changeActiveClass();
        this.wrapper.dispatchEvent(this.changeEvent);
    }
  
    activePrevSlide(){
      if(this.index.prev !== undefined){
        this.changeSlide(this.index.prev);
      }
    }

    activeNextSlide(){
      if(this.index.next !== undefined){
        this.changeSlide(this.index.next);
      }
    }

    changeActiveClass(){
      this.slideArray.forEach((item)=>{
        item.element.classList.remove(this.activeClass)
      });
      this.slideArray[this.index.active].element.classList.add(this.activeClass);
    }

    onResize(){
      setTimeout(() =>{
        this.slideConfig();
      this.changeSlide(this.index.active);
      }, 1000)
      
    }

    addReziseEvent(){
      window.addEventListener('resize', this.onResize)
    }

    init() {
      this.bindEvents();
      this.transition(true);
      this.addSlideEvents();
      this.slideConfig();
      this.addReziseEvent();
      this.changeSlide(0)
      return this;
    }
  }



 export class SlideNav extends Slide {
  constructor(slide, wrapper){
    super(slide, wrapper);
    this.bindControlEvents()
  }
  addArrow(prev, next){
    this.prevElement = document.querySelector(prev);
    this.nextElement = document.querySelector(next);
    this.addArrowEvents();
  }

  addArrowEvents(){
    this.prevElement.addEventListener('click', this.activePrevSlide);
    this.nextElement.addEventListener('click', this.activeNextSlide);
  }

  createControl(){
    const control = document.createElement('ul');
    control.dataset.control = 'slide'
    this.slideArray.forEach((item, index)=>{
      control.innerHTML += `<li><a href=#slide${index + 1}>${index + 1}</a></li>`
    })
    this.wrapper.appendChild(control)
    return control

  }

  eventControl(item, index){
    item.addEventListener('click', (e)=>{
      e.preventDefault();
      this.changeSlide(index);
    });
    this.wrapper.addEventListener('changeEvent', this.activeControlItem)
  }

  addControlEvent(customControl){
    this.control = document.querySelector(customControl) || this.createControl(); 
    this.controlArray = [...this.control.children]; 
    this.activeControlItem()
    this.controlArray.forEach(this.eventControl);
  } 

  activeControlItem(){
    this.controlArray.forEach((item)=>{
      item.classList.remove(this.activeClass);
    })
    this.controlArray[this.index.active].classList.add(this.activeClass);
  }

  bindControlEvents(){
    this.eventControl = this.eventControl.bind(this);
    this.activeControlItem = this.activeControlItem.bind(this);
  }

  }