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
        e.preventDefault();
        this.dist.startX = e.clientX;
        this.wrapper.addEventListener('mousemove', this.onMove)

    }

    moveSlide(distX){
        this.dist.movePosition = distX;
        this.slide.style.transform = `translate3d(${distX}px, 0, 0)`
    }

    onMove(e){
    const finalPosition = this.updatePosition(e.clientX)
    this.moveSlide(finalPosition);
    }
   
    addSlideEvents(){
        this.wrapper.addEventListener('mousedown', this.onStart);
        this.wrapper.addEventListener('mouseup', this.onEnd);
    }

    onEnd(){
        this.wrapper.removeEventListener('mousemove', this.onMove)
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