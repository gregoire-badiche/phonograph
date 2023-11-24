# phonograph

A console-based music player

## Features

The main goal is to create a fully console-based client for Deezer, focused primarily on Linux.
It will have an online and offline mode, and also a way to add custom / mp3 tracks with album image, and authors.
I also want to improve the playlist system by using tags instead of playlist, and add shared queue features

## Installing

### External dependencies

Make sure you have Node.JS, NPM, Lame, GCC, GCC-C++ installed, and on Linux the alsa dev libraries

On Fedora :
```bash
sudo dnf update
sudo dnf install lame gcc gcc-c++ make alsa-lib alsa-lib-devel -y
```

On Ubuntu :
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install lame gcc gcc-c++ make libasound2-dev -y
```

### NPM dependencies

On the project directory :
```bash
npm install
```

### Build the lancher

```bash
gcc -o phonograph launcher/launcher.c
```

Depedencies :
 - [Speaker](https://www.npmjs.com/package/speaker)
 - [Node Lame](https://www.npmjs.com/package/node-lame)

## Run

On the project directory, run :

```bash
./phonograph
```

## Contributing

### Why did you make this?

I wanted to have a "native" support of Deezer

### Do I need to be a senior 10x developer to help and contribute?

Nope, anybody can contribute to this torture machine, skill level does not matter. I made this project with no knowledge about making console apps

### How do I help and improve phonograph?

Read our [CONTRIBUTING.md](https://github.com/gregoire-badiche/phonograph/blob/main/CONTRIBUTING.md) file to learn how to help make this app more useful / pretty

### I don't even know where to start

That's perfectly fine, take some time and read the code to understand what's going on. You don't have to make super big changes, they can be as small as fixing my dumb typos on these files or adding helpful comments to the code.

For further guidance, visit our Documentation

## Special thanks

 - to The Coding Sloth for his fun README template

Made with ❤️ by Grégoire 
