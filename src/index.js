import './index.css';
import { getOffsetY } from './helpers';

/**
 * TODO: 
 * 
 * 1) create mutation observer or image preloader
 * 
 */

export default class ScrollBar {
  static get defaultOptions() {
    return {
      speed: 1,
    }
  }

  constructor(element = null, options = {}) {
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }

    if (!element || !element.nodeName) {
      throw new Error('no element is specified to initialize scrollbar');
    }

    this.options = Object.assign({}, options, ScrollBar.defaultOptions);
    this.element = element;
    this.element.classList.add('go');
    this.content = null;
    this.scrollbar = null;
    this.scrollbox = null;
    this.handle = null;
    this.init();
  }

  addScrollBar = () => {
    this.handle = document.createElement('div');
    this.handle.classList.add('go__scrollbar-handle');
    this.scrollbar = document.createElement('div');
    this.scrollbar.classList.add('go__scrollbar');

    this.scrollbar.appendChild(this.handle);
    this.element.appendChild(this.scrollbar);
  }

  addScrollBox = () => {
    this.scrollbox = document.createElement('div');
    this.scrollbox.classList.add('go__scrollbox');
    this.content = document.createElement('div');
    this.content.classList.add('go__scrollbox-content');

    ;[...this.element.childNodes].forEach(child => this.content.appendChild(child));
    
    this.scrollbox.appendChild(this.content);
    this.element.appendChild(this.scrollbox);
  }

  hideBrowserScrollBar = () => {
    const browserScrollBarSize = 20;

    this.scrollbox.style.width = `${this.element.clientWidth + browserScrollBarSize}px`;
    this.content.style.width = `${this.element.clientWidth}px`;
  }

  update = () => {
    this.calculateScrollRatio();

    if (this.scrollbox.clientHeight > this.content.clientHeight){
      this.scrollbar.classList.remove('go__scrollbar-visible');
      this.scrollbar.classList.add('go__scrollbar-hidden');
    } else {
      this.scrollbar.classList.remove('go__scrollbar-hidden');
      this.scrollbar.classList.add('go__scrollbar-visible');
    }

    // dynamic scroll handle height
    this.handle.style.height = `${this.element.clientHeight * (this.element.clientHeight / this.content.clientHeight)}px`;
  }

  addEventListeners = () => {
    window.addEventListener('resize', this.onResize, false);
    document.addEventListener('mouseup', this.onHandleMouseUp, false);
    document.addEventListener('mousemove', this.onHandleMouseMove, false);
    this.scrollbox.addEventListener('scroll', this.onScroll, { passive: false });
    this.scrollbar.addEventListener('click', this.onScrollBarClick, false);
    this.handle.addEventListener('click', this.onHandleClick, false);
    this.handle.addEventListener('mousedown', this.onHandleMouseDown, false);
  }

  calculateScrollRatio = () => {
    this.totalScrollable = this.content.clientHeight - this.scrollbox.clientHeight;
    this.totalHandle = this.scrollbar.clientHeight - this.handle.clientHeight;
    this.ratio = this.totalHandle / this.totalScrollable;
  }

  onScroll = (e) => {
    this.calculateScrollRatio();
    this.handle.style.marginTop = `${this.ratio * this.scrollbox.scrollTop}px`;
  }

  onResize = (e) => {
    this.hideBrowserScrollBar();
    this.update();
  }

  onHandleClick = (e) => {
    e.stopPropagation();
  }

  onHandleMouseDown = (e) => {
    e.stopPropagation();

    this.content.classList.add('unselectable');
    this.handle.clientY = e.clientY;
    this.handle.scrollTop = this.scrollbox.scrollTop;
    this.mouseDown = true;
  }

  onHandleMouseUp = (e) => {
    this.content.classList.remove('unselectable');
    this.mouseDown = false;
  }

  onHandleMouseMove = (e) => {
    if (!this.mouseDown) {
      return;
    }

    this.scrollbox.scrollTop = (((e.clientY - (this.handle.clientHeight / 2)) - this.element.scrollTop) / this.ratio) + this.element.scrollTop;
  }

  onScrollBarClick = (e) => {
    e.stopPropagation();

    let layerY = getOffsetY(e) - this.handle.clientHeight / 2;

    this.scrollbox.scrollTop = layerY / this.totalHandle * this.totalScrollable;
  }

  init = () => {
    this.addScrollBox();
    this.hideBrowserScrollBar();
    this.addScrollBar();
    this.update();
    this.addEventListeners();
  }
};

new ScrollBar('.scroll');