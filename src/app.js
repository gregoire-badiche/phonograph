'use strict';

const connexion = require('./api/api');
const player = require('./player/player');
const Window  = require('./window/window');
const Input = require('./window/input');
const Selector = require('./window/selector');
const Loader = require('./window/loader');
const imgtoascii = require('./imgtoascii/imgtoascii')

const window = new Window();
// const window = 0;

/**
 * @param {Window} window
 */
const main = (window) => {
    window.clear();
    var selector = new Selector(window, { choices: [
        'choice 1 AZERTYUIOPQSDKLMWXCBN?AZERTYUIOPQSDFJLMWXCVBN', 
        'choice 2 AZERTYUIOPQSDKLMWXCBN?AZERTYUIOPQSDFJLMWXCVBN', 
        'choice 3 AZERTYUIOPQSDKLMWXCBN?AZERTYUIOPQSDFJLMWXCVBN'
    ], width: window.width, x: 0, y:1 });
    window.focus(selector);
    selector.draw();
    var input = new Input(window, {
        placeholder: 'search for track',
        pretext: '  🔎  ',
        x: 0,
        y: 0,
        width: window.width - 1,
    });
    input.onselect = v => {
        window.cursor.x = 1;
        window.cursor.y = 2;
        window.resetcolor();
        selector.choices[0] = v;
        selector.setoptions();
        window.focus(selector);
    }
    window.focus(input);
    input.draw();
    // const loader = new Loader(window);
    // loader.x = window.width - 2
    // loader.visible = true;
    // imgtoascii('/home/gregoire/Pictures/Webcam/2023-11-30-131206.jpg', 40).then(arr => {
    //     let res = ""
    //     for(let i = 0; i < arr.length; i++) {
    //         res += arr[i]
    //         if(i != arr.length - 1) {
    //             res += "\n"
    //         }
    //     }
    //     console.log(res)
    // })
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

main(window);
