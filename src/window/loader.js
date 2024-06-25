const Window = require('./window');

class Loader extends Window.Element {
    /**
     * @param {Window} window 
     */
    constructor(window, { width, height, x, y }) {
        super(window, { width, height, x, y });
        this._visible = false;
        this.state = 0;
        this.interval = undefined;
        this.tickspeed = 100;
        this.frames = ['⠋', '⠙', '⠸', '⠴', '⠦', '⠇'];
    }

    get visible() {
        return this._visible;
    }

    set visible(v) {
        if(v) {
            if(this._visible) return;
            this.interval = setInterval(() => { this.update() }, this.tickspeed);
            this._visible = true;
        } else {
            if(!(this._visible)) return;
            clearInterval(this.interval);
            this._visible = false;
            let prevx = this.window.cursor.x;
            let prevy = this.window.cursor.y;
            this.window.cursor.setpos(this.x, this.y);
            this.window.write(" ");
            this.window.cursor.setpos(prevx, prevy);
        }
    };

    update() {
        if(!(this._visible)) return;
        let prevx = this.window.cursor.x;
        let prevy = this.window.cursor.y;
        this.window.cursor.setpos(this.x, this.y);
        this.window.write(this.frames[this.state]);
        this.window.cursor.setpos(prevx, prevy);
        this.state += 1;
        if (this.state == this.frames.length) {
            this.state = 0;
        }
    }
}

module.exports = Loader;