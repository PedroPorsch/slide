import {SlideNav} from './slide.js';

const slide = new SlideNav('.slide', '.wrapper');
slide.init();
slide.addControlEvent('.custom-control')
slide.addArrow('.prev', '.next')
