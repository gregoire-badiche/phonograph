'use strict';

const connexion = require('./api/api');
const player = require('./player/player');
const Window  = require('./window/window');
const Input = require('./window/input')

const window = new Window();

/**
 * @param {Window} window
 */
const main = (window) => {
    window.clear();
    var input = new Input(window);
    input.placeholder = 'search for track';
    input.pretext = '  🔎  ';
    input.onselect = v => {
        window.cursor.x = 1;
        window.cursor.y = 2;
        window.write(v);
    }
    input.draw();
    input.focus();
}

const connecting = (window) => {
    let str = 'Connecting to Deezer';
    let col = parseInt(window.width / 2 - str.length / 2 + 2);
    let row = parseInt(window.height / 2);
    window.clear();
    window.cursor.visible = false;
    window.cursor.x = col;
    window.cursor.y = row;
    window.write(str);
    window.cursor.x = parseInt(window.width / 2 + 1)
    window.cursor.y += 1;
    let x = 1
    window.interval = setInterval(() => {
        window.write(".".repeat(x));
        window.write(" ".repeat(3 - x));
        window.cursor.x -= 3;
        x %= 3;
        x += 1;
    }, 200);

    connexion
        .auth()
        .then(async conn => {
            clearInterval(window.interval);
            main(window);
        });
}

setTimeout(() => {
    main(window);
}, 200)