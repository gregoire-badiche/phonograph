'use strict';

const Window = require('./window');
const Text = require('./text');

class Selector extends Window.Element {
    /**
     * @param {Window} window 
     */
    constructor(window, { choices = [], onselect = null, width, height, x, y }) {
        super(window, { width, height, x, y });

        this._value = 0;
        this._choices = choices;
        this.options = [];
        this.setoptions();
        this.bgcolor = 15;
        this.fgcolor = 0;
        // Secondary foreground color
        // this.sfgcolor = 8;
        this.isfocused = false;

        this._interval = null;
        this._timeout = null;

        this.onselect = onselect ? onselect : _ => { };
    }

    get width() {
        return this._width;
    }

    set width(w) {
        this._width = w;
        this.resize();
    }

    get value() {
        return this._value;
    }

    set value(v) {
        v = ((v % this.options.length) + this.options.length) % this.options.length;
        this._value = v;
    }

    get choices() {
        return this._choices;
    }

    set choices(c) {
        this._choices = c;
        this.setoptions();
    }

    setoptions() {
        this.options = [];
        for (let i = 0; i < this._choices.length; i++) {
            const e = this._choices[i];
            this.options.push(new Text(this.window, e, { width: this.width - 4 }));
        }
    }

    draw() {
        this.window.cursor.setpos(this.x, this.y);
        this.window.write('╭');
        this.window.write('─'.repeat(this.width - 2));
        this.window.write('╮');
        for (let i = 0; i < this.options.length; i++) {
            this.window.cursor.x = this.x;
            this.window.cursor.y += 1;
            const element = this.options[i];
            this.window.write('│ ');
            if(this.isfocused && this.value == i) {
                this.window.setbg(this.bgcolor);
                this.window.setfg(this.fgcolor);
                this.window.setbold();
            }
            this.window.write(element.result);
            if(this.isfocused && this.value == i) {
                this.window.resetcolor();
                this.window.resetdecoration();
            }
            this.window.write(' │');
        }
        this.window.cursor.x = this.x;
        this.window.cursor.y += 1;
        this.window.write('╰');
        this.window.write('─'.repeat(this.width - 2));
        this.window.write('╯');
    }

    _kd(v) {
        clearTimeout(this._timeout);
        clearInterval(this._interval);
        this.options[this.value].scroll = 0;
        this.value += v;
        this.draw();
        var sfn = this._sfn;
        var self = this;
        this._timeout = setTimeout(() => {
            self._interval = setInterval(() => {
                sfn(self);
            }, 100);
        }, 2000);
    }

    _sfn(self) {
        if(self.options[self.value].scroll == self.options[self.value].maxscroll) {
            clearInterval(self._interval);
        }
        self.options[self.value].scroll += 1;
        self.draw();
    }

    onkeydown(k) {
        let keycodes = [];
        for(let i = 0; i < k.length; i++) {
            keycodes.push(k.charCodeAt(i));
        }
        switch (keycodes.join(' ')) {
            case '27 91 65':
            case '27 91 54 126':
                this._kd(-1);
                break;
            
            case '27 91 66':
            case '27 91 53 126':
                this._kd(1);
                break

            default:
                break;
        }
    }

    focus() {
        this.isfocused = true;
        this.window.onkeydown = e => { this.onkeydown(e) };
        this._kd(0);
    }

    unfocus() {
        this.isfocused = false;
        this.window.onkeydown = _ => {};
        clearTimeout(this._timeout);
        clearInterval(this._interval);
        this.draw();
    }
}

module.exports = Selector;