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
    this.wrapper.addEventListener('scroll', this.onScrollY.bind(this), false);
    window.addEventListener('resize', this.onResize.bind(this), false);
  }

  onScrollY = (e) => this.update();

  onResize = (e) => this.update();

  hideNativeScrollBar = () => {
    this.wrapper.style.width = `${this.element.clientWidth + 60}px`;
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

    // dynamic scroll handle height
    this.handle.style.height = this.wrapper.clientHeight * (this.wrapper.clientHeight / this.content.clientHeight) + 'px';

    // updating scroll bar position and ratio
    this.totalScrollable = this.content.clientHeight - this.wrapper.clientHeight;
    this.totalHandle = this.scrollbar.clientHeight - this.handle.clientHeight;
    this.ratio = this.totalHandle / this.totalScrollable;
    this.handle.style.marginTop = this.ratio * this.wrapper.scrollTop + 'px';
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