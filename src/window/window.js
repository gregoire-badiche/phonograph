'use strict';

class Element {
    constructor(window, { width = 1, height = 1, x = 1, y = 1 } = {}) {
        this._width = width;
        this._height = height;
        this._x = x;
        this._y = y;
        this.window = window;
    }

    get x() {
        return this._x;
    }

    set x(x) {
        this._x = x;
        this.move();
    }

    get y() {
        return this._y;
    }

    set y(y) {
        this._x = y;
        this.move();
    }

    move() { }

    get width() {
        return this._width;
    }

    set width(w) {
        this._width = w;
        this.resize();
    }

    get height() {
        return this._height;
    }

    set height(h) {
        this._height = h;
        this.resize();
    }

    resize() { }

    draw() { }

    focus() { }

    unfocus() {}
}

class Cursor {
    _visible = true;
    _x = 1;
    _y = 1;

    _write(t) {
        let esc = '\u001b[';
        process.stdout.write(`${esc}${t}`);
    }

    get x() {
        return this._x;
    }
    set x(pos) {
        if(!(pos < process.stdout.columns && pos >= 0)) return;
        this._x = pos;
        this._write(`${this._y + 1};${this._x + 1}H`);
    }

    get y() {
        return this._y;
    }
    set y(pos) {
        if(!(pos < process.stdout.rows && pos >= 0)) return;
        this._y = pos;
        this._write(`${this._y + 1};${this._x + 1}H`);
    }

    setpos(x, y) {
        if(!(x < process.stdout.columns && x >= 0)) return;
        if(!(y < process.stdout.rows && y >= 0)) return;
        this._y = y;
        this._x = x;
        this._write(`${this._y + 1};${this._x + 1}H`);
    }

    get visible() {
        return this._visible;
    }
    set visible(v) {
        this._visible = v;
        let code = this._visible ? 'h' : 'l';
        this._write(`?25${code}`);
    }

    setbar() {
        this._write('5 q');
    }
}
class Window {
    static Element = Element;

    constructor() {
        this.width = process.stdout.columns;
        this.height = process.stdout.rows;
        this.escapecode = '\u001b[';

        this._init();

        this.childs = [];

        this.interval;

        this.cursor = new Cursor();
        this.cursor.visible = false;

        this.dummyelement = new Element(this);
        this.focusedElement = this.dummyelement;
    }

    _init() {
        this.savestate();

        process.on('SIGWINCH', () => {
            console.log("resized!");
            if (this.width !== process.stdout.columns || this.height !== process.stdout.rows) {
                this.width = process.stdout.columns;
                this.height = process.stdout.rows;
                this.onresize();
            }
        });

        process.stdin.on("data", (key, _data) => {
            if (key === '\u0003') {
                this.terminate();
            } else {
                this.onkeydown(key);
            }
        });

        process.stdout.on('SIGINT', () => {
            this.terminate();
        });
        process.on('exit', (code) => {
            this._end(code);
        });

        process.stdin.setRawMode(true);

        process.stdin.resume();

        process.stdin.setEncoding('utf8');
    }

    onkeydown = (_e) => { };
    onresize = () => { };
    onquit = () => { };

    focus(e) {
        this.focusedElement.unfocus();
        this.focusedElement = e;
        e.focus();
    }

    write(t) {
        t = t.toString();
        this.cursor._y += Math.floor((this.cursor.x + t.length) / (this.width + 2));
        this.cursor._x += t.length;
        this.cursor._x %= this.width;
        process.stdout.write(t);
    }

    setfg(c) {
        process.stdout.write(`${this.escapecode}38;5;${c}m`);
    }

    setbg(c) {
        process.stdout.write(`${this.escapecode}48;5;${c}m`);
    }

    resetcolor() {
        process.stdout.write(`${this.escapecode}0m`);
    }

    setbold() {
        process.stdout.write(`${this.escapecode}1m`);
    }

    resetdecoration() {
        process.stdout.write(`${this.escapecode}0m`);
    }

    clear() {
        process.stdout.write(`${this.escapecode}2J${this.escapecode}3J`);
    }

    savestate() {
        process.stdout.write(`${this.escapecode}?1049h`);
    }

    restorestate() {
        process.stdout.write(`${this.escapecode}?1049l`);
    }

    _end(code) {
        // this.resetcolor();
        // this.clear();
        // this.cursor.visible = true;
        // this.cursor.setpos(1, 1);
        this.restorestate();
        this.write(`Program exited with code ${code}\n`);
    }

    terminate() {
        process.exit(0);
    };

    log(m, end='\n') {
        process.stderr.write(m + end);
    }
}

module.exports = Window;