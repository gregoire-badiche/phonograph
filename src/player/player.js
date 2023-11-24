'use strict';

const stream = require('stream');
const Lame = require('node-lame').Lame;
const Speaker = require('speaker');

class Player {
    constructor() {
        this.speaker = new Speaker();
        this.timecode = 0;
        this.duration = 0;
        this.isPlaying = 0;
        this.stream;
    }

    play(track) {
        const decoder = new Lame({
            "output": "buffer",
        }).setBuffer(track);

        decoder.decode().then(() => {
            const buffer = decoder.getBuffer();
            this.stream = new stream.PassThrough();
            this.stream.end(buffer);
            this.stream.pipe(this.speaker);
        });
    }

    pause() {
        this.stream.pause();
    }

    resume() {
        this.stream.resume();
    }
}

module.exports = new Player;