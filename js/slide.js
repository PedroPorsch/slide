export default class slide {
    constructor(slide, wrapper){
        this.slide = document.querySelector(slide);
        this.wrapper = document.querySelector(wrapper);
        this.dist = {
            final: 0,
            startX: 0,
            movement: 0
        }
    }

    updatePosition(clientX){
        this.dist.movement = (this.dist.startX - clientX) * 1.5;
        return this.dist.final - this.dist.movement;
    }

    onStart(e){
        let moveType;
        if(e.type === 'mousedown'){
            e.preventDefault();
            this.dist.startX = e.clientX;
            moveType = 'mousedown';
        }else{
            this.dist.startX = e.changedTouches[0].clientX;   
            moveType = 'touchmove';
        }
        this.wrapper.addEventListener(moveType, this.onMove)
       
    }

    moveSlide(distX){
        this.dist.movePosition = distX;
        this.slide.style.transform = `translate3d(${distX}px, 0, 0)`
    }

    onMove(e){
    const pointerPosition = (e.type === 'mousemove') ? e.clientX : e.changedTouches[0].clientX;
    const finalPosition = this.updatePosition(pointerPosition)
    this.moveSlide(finalPosition);
    }
   
    addSlideEvents(){
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd);
        this.wrapper.addEventListener('touchstart', this.onStart);
        this.wrapper.addEventListener('touchend', this.onEnd);
   
    }

    onEnd(e){
        const moveType = (e.type === 'mouseup') ? 'mousemove' : 'touchmove';
        this.wrapper.removeEventListener(moveType, this.onMove)
        this.dist.final = this.dist.movePosition;
    }

    bindEvents(){
        this.onStart = this.onStart.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onEnd = this.onEnd.bind(this);
    }

    init(){
        this.bindEvents();
        this.addSlideEvents();
        return this;
    }
}