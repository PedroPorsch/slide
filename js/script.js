import {SlideNav} from './slide.js';

const slide = new SlideNav('.slide', '.wrapper');
slide.init();
slide.addControlEvent()
slide.addArrow('.prev', '.next')
