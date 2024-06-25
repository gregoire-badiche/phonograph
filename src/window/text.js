'use strict';

const Window = require('./window');

class Text {
    /**
     * @param {Window} window 
     */
    constructor(window, text, { width, scroll = 0 } = {}) {
        this.window = window;
        this._text = text;
        this.result = ' '.repeat(this.width);
        this.height = 1;
        this._scroll = scroll;
        this.maxscroll = 0;
        this.width = width ? width : this.window.width;
    }

    get scroll() {
        return this._scroll;
    }

    set scroll(s) {
        if(s < this.maxscroll) {
            this._scroll = s;
        } else if(s < 0) {
            this._scroll = 0;
        } else {
            this._scroll = this.maxscroll;
        }
        this.compute();
    }

    get width() {
        return this._width;
    }

    set width(w) {
        this._width = w;
        this.maxscroll = this.text.length > this.width ? this.text.length - this.width : 0;
        this.compute();
    }

    get text() {
        return this._text;
    }

    set text(t) {
        this._text = t;
        this.maxscroll = this.text.length > this.width ? this.text.length - this.width : 0;
        this.compute();
    }

    compute() {
        if(this.text.length > this.width) {
            this.result = this.text.slice(this.scroll, this.width + this.scroll);
        } else {
            this.result = this.text +  ' '.repeat(this.width - this.text.length);
        }
    }
}

module.exports = Text;