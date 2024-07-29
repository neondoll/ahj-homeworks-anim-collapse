const CLASS_NAME_COLLAPSE = 'collapse';
const CLASS_NAME_COLLAPSED = 'collapsed';
const CLASS_NAME_COLLAPSING = 'collapsing';
const CLASS_NAME_SHOW = 'show';
const SELECTOR_DATA_TOGGLE = '[data-toggle="collapse"]';

export class Collapse {
  constructor(element) {
    this._element = element;
    this._isTransitioning = false;
    this._triggerArray = [];

    for (const trigger of document.querySelectorAll(SELECTOR_DATA_TOGGLE)) {
      const controls = trigger.getAttribute('aria-controls');

      if (controls && controls.split(' ').includes(element.id)) {
        this._triggerArray.push(trigger);
      }
    }
  }

  _addAriaAndCollapsedClass(triggerArray, isOpen) {
    if (!triggerArray.length) {
      return;
    }

    for (const element of triggerArray) {
      element.classList.toggle(CLASS_NAME_COLLAPSED, !isOpen);
      element.setAttribute('aria-expanded', isOpen);
    }
  }

  _isShown(element = this._element) {
    return element.classList.contains(CLASS_NAME_SHOW);
  }

  hide() {
    if (this._isTransitioning || !this._isShown()) {
      return;
    }

    this._element.style.height = `${this._element.getBoundingClientRect().height}px`;
    this._element.classList.remove(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);
    this._element.classList.add(CLASS_NAME_COLLAPSING);
    this._addAriaAndCollapsedClass(this._triggerArray, false);
    this._isTransitioning = true;

    setTimeout(() => {
      this._isTransitioning = false;
      this._element.classList.remove(CLASS_NAME_COLLAPSING);
      this._element.classList.add(CLASS_NAME_COLLAPSE);
      this._element.style.height = '';
    }, 355);

    this._element.style.height = '0';
  }

  show() {
    if (this._isTransitioning || this._isShown()) {
      return;
    }

    this._element.classList.remove(CLASS_NAME_COLLAPSE);
    this._element.classList.add(CLASS_NAME_COLLAPSING);
    this._element.style.height = '0';
    this._addAriaAndCollapsedClass(this._triggerArray, true);
    this._isTransitioning = true;

    setTimeout(() => {
      this._isTransitioning = false;
      this._element.classList.remove(CLASS_NAME_COLLAPSING);
      this._element.classList.add(CLASS_NAME_COLLAPSE, CLASS_NAME_SHOW);
      this._element.style.height = '';
    }, 355);

    this._element.style.height = `${this._element.scrollHeight}px`;
  }

  toggle() {
    if (this._isShown()) {
      this.hide();
    }
    else {
      this.show();
    }
  }
}

export class CollapsePlugin {
  constructor() {
    this._collapses = new Map();

    window.addEventListener('click', (event) => {
      const trigger = event.target.closest(SELECTOR_DATA_TOGGLE);

      if (trigger) {
        for (const element of document.querySelectorAll(trigger.dataset.target)) {
          this.getOrCreateInstance(element).toggle();
        }
      }
    });
  }

  getOrCreateInstance(element) {
    if (!this._collapses.get(element.id)) {
      this._collapses.set(element.id, new Collapse(element));
    }

    return this._collapses.get(element.id);
  }
}
