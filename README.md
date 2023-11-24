# phonograph

A console-based music player

## Installing

### External dependencies

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
