const Window = require('./window');
const Text = require('./text');

class Input extends Window.Element {
    /**
     * @param {Window} window 
     */
    constructor(window, { width, height, x, y, value = '', placeholder = '', pretext = '', onselect = _ => {} }) {
        super(window, { width, height: 1, x, y })
        this._value = value;
        this.placeholder = placeholder;
        this.pretext = pretext;
        this.bgcolor = 15;
        this.fgcolor = 0;
        // Secondary foreground color
        this.sfgcolor = 8;

        this.text = new Text(this.window, this.value, { width: this.width - this.pretext.length });

        this.onselect = onselect;
    }

    get value() {
        return this._value;
    }

    set value(v) {
        this._value = v;
        this.text.text = this._value;
        this.text.scroll = this.text.maxscroll;
        this.window.log(this.text.maxscroll);
        this.draw();
    }

    draw() {
        if(this.isfocused) {
            this.window.setbg(this.bgcolor);
            this.window.setfg(this.fgcolor);
        } else {
            this.window.resetcolor();
        }
        this.window.cursor.setpos(this.x, this.y);
        this.window.write(this.pretext);
        this.window.write(' '.repeat(this.width - this.pretext.length));
        this.window.cursor.setpos(this.x + this.pretext.length, this.y);
        if (this.value == '') {
            this.window.setfg(this.sfgcolor);
            this.window.write(this.placeholder.slice(0, this.width - this.pretext.length));
            if(this.isfocused) {
                this.window.setfg(this.fgcolor);
            } else {
                this.window.resetcolor();
            }
            this.window.cursor.setpos(this.x + this.pretext.length, this.y);
        } else {
            this.window.write(this.text.result);
        }
    }

    onkeydown(k) {
        if ((this.window.cursor.x != this.x + this.pretext.length + this.value.length) || (this.window.cursor.y != this.y)) {
            this.window.cursor.setpos(this.x + this.pretext.length + this.value.length, this.y)
        }
        var kc = k.charCodeAt(0);
        if (kc == '127') {
            this.value = this.value.slice(0, this.value.length - 1)
        }
        else {
            if (kc > 31) {
                this.value += k;
            }
            if (kc == 13) {
                this.onselect(this._value);
            }
        }
    }

    focus() {
        this.isfocused = true;
        this.window.onkeydown = e => { this.onkeydown(e) };
        // this.window.cursor.visible = true;
        this.draw();
    }

    unfocus() {
        this.isfocused = false;
        this.window.onkeydown = _ => { };
        // this.window.cursor.visible = false;
        this.draw();
    }
}

module.exports = Input;