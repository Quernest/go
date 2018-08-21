import './index.css';

export default class ScrollBar {
  static get defaultOptions() {
    return {
      autoHide: false,
      easing: false,
    };
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
    this.wrapper = null;
    this.content = null;
    this.scrollbar = null;
    this.handle = null;
    this.mouseDown = false;
    this.init();
  }

  addScrollBar = () => {
    this.handle = document.createElement('div');
    this.scrollbar = document.createElement('div');

    this.scrollbar.classList.add('go__scrollbar');
    this.handle.classList.add('go__scrollbar-handle');

    this.scrollbar.appendChild(this.handle);
    this.element.appendChild(this.scrollbar);
  }

  addWrapper = () => {
    this.wrapper = document.createElement('div');
    this.content = document.createElement('div');
    this.wrapper.classList.add('go__wrapper');
    this.content.classList.add('go__content');
  
    ;[...this.element.childNodes].forEach(child => this.content.appendChild(child));
  
    this.wrapper.appendChild(this.content);
    this.element.appendChild(this.wrapper);

    return this.wrapper;
  }

  addEventListeners = () => {
    window.addEventListener('resize', this.onResize, false);
    document.addEventListener('mousemove', this.onMouseMove, false);
    document.addEventListener('mouseup', this.onMouseUp, false);
    this.wrapper.addEventListener('scroll', this.onScrollY, false);
    this.handle.addEventListener('mousedown', this.onMouseDown, false);
  }

  onScrollY = (e) => {
    this.update();
  }

  onResize = (e) => {
    this.update();
  }

  onMouseDown = (e) => {
    this.mouseDown = true;
  }

  onMouseUp = (e) => {
    this.mouseDown = false;
  }

  onMouseMove = (e) => {
    if (!this.mouseDown) {
      return;
    }

    this.scrolled = this.scrolled + (e.movementY / this.content.offsetHeight);

    if (this.scrolled < 0) {
      this.scrolled = 0;
    }

    if (this.scrolled > this.totalScroll) {
      this.scrolled = this.totalScroll;
    }
    
    this.handle.style.marginTop = this.scrolled * this.content.clientHeight + 'px';
    this.wrapper.scrollTop = this.scrolled * this.content.clientHeight;
  }

  hideNativeScrollBar = () => {
    this.wrapper.style.width = `${this.element.clientWidth + 50}px`;
    this.content.style.width = this.element.clientWidth + 'px';
  };

  hideScrollBar = () => {
    // if content is smaller than the container
    if (this.wrapper.clientHeight > this.content.clientHeight){
      this.scrollbar.style.display = 'none';
    } else {
      this.scrollbar.style.display = 'block';
    }
  }

  update = () => {
    this.hideNativeScrollBar();
    this.hideScrollBar();

    this.scrolled = this.wrapper.scrollTop / this.wrapper.scrollHeight;
    this.totalScroll = (this.wrapper.scrollHeight - this.wrapper.clientHeight) / this.wrapper.scrollHeight;

    // dynamic scroll handle height
    this.handle.style.height = this.wrapper.clientHeight * (this.wrapper.clientHeight / this.content.clientHeight) + 'px';
    
    // updating scroll bar position and ratio
    this.handle.style.marginTop = this.scrolled * this.wrapper.clientHeight + 'px';
  }

  init = () => {
    this.element.classList.add('go');

    this.addWrapper();
    this.addScrollBar();
    this.update();
    this.addEventListeners();
  };
};

const sb = new ScrollBar('.scroll');