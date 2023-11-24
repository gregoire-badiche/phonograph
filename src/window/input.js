const Window = require('./window');

class Input {
    /**
     * @param {Window} window 
     */
    constructor(window) {
        this.window = window;
        this._value = '';
        this.x = 1;
        this.y = 1;
        this.width = this.window.width;
        this.placeholder = '';
        this.pretext = '';
        this.bgcolor = 15;
        this.fgcolor = 0;
        // Secondary foreground color
        this.sfgcolor = 8;

        this.onselect = _ => { };
    }

    get value() {
        return this._value;
    }

    set value(v) {
        this._value = v;
        this.window.cursor.setpos(this.x, this.y);
        this.window.write(v);
    }

    draw() {
        this.window.cursor.setpos(this.x, this.y);
        this.window.setbg(this.bgcolor);
        this.window.setfg(this.fgcolor);
        this.window.write(this.pretext);
        this.window.write(' '.repeat(this.width - this.pretext.length));
        this.window.cursor.setpos(this.x + this.pretext.length, this.y);
        if (this.value == '') {
            this.window.setfg(this.sfgcolor);
            this.window.write(this.placeholder);
            this.window.setfg(this.fgcolor);
            this.window.cursor.setpos(this.x + this.pretext.length, this.y);
        } else {
            this.window.write(this.value);
        }
    }

    onkeydown(k) {
        if ((this.window.cursor.x != this.x + this.pretext.length + this.value.length) || (this.window.cursor.y != this.y)) {
            this.window.cursor.setpos(this.x + this.pretext.length + this.value.length, this.y)
        }
        var kc = k.charCodeAt(0);
        if (kc == '127') {
            if (this._value.length > 0 && this._value.length < this.width - this.pretext.length) {
                this.window.cursor.x -= 1;
                this.window.write(' ');
                this.window.cursor.x -= 1;
                this._value = this._value.substring(0, this._value.length - 1);
            }
            if (this._value.length > 0 && this._value.length >= this.width - this.pretext.length) {
                this._value = this._value.substring(0, this._value.length - 1);
                this.window.cursor.setpos(this.x + this.pretext.length, this.y);
                this.window.write(this._value.substring(this._value.length - this.width + this.pretext.length + 1));
            }
            if (this._value.length == 0) {
                this.window.setfg(this.sfgcolor);
                this.window.write(this.placeholder);
                this.window.setfg(this.fgcolor);
                this.window.cursor.setpos(this.x + this.pretext.length, this.y);
            }
        }
        else {
            if (kc > 31) {
                if (this.x + this.pretext.length + this._value.length < this.width) {
                    if (this._value.length == 0) {
                        this.window.write(" ".repeat(this.placeholder.length));
                        this.window.cursor.setpos(this.x + this.pretext.length, this.y);
                    }
                    this.window.write(k);
                    this._value += k;
                } else {
                    this._value += k;
                    this.window.cursor.setpos(this.x + this.pretext.length, this.y);
                    this.window.write(this._value.substring(this._value.length - this.width + this.pretext.length + 1));
                }
            }
            if (kc == 13) {
                this.onselect(this._value);
            }
        }
    }

    focus() {
        this.window.onkeydown = e => { this.onkeydown(e) };
    }
}

module.exports = Input;