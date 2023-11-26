const Window = require('./window');

class Selector {
    /**
     * @param {Window} window 
     */
    constructor(window) {
        this.window = window;
        this._value = '';
        this.choices = {};
        this.x = 1;
        this.y = 1;
        this.width = this.window.width;
        this.height = this.window.height;
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

    }

    onkeydown(k) {
        let keycodes = [];
        for(let i = 0; i < k.length; i++) {
            keycodes.push(k.charCodeAt(i));
        }
        switch (keycodes.join(' ')) {
            case '27 91 65':
                // Up arrow
                break;
            
            case '27 91 66':
                // Down arrow
                break;
            
            case '27 91 54 126':
                // Previous arrow
                break
            
            case '27 91 53 126':
                // Next arrow
                break

            default:
                break;
        }
    }

    focus() {
        this.window.focusedElement = this;
        this.window.onkeydown = e => { this.onkeydown(e) };
        
    }
}

module.exports = Selector;