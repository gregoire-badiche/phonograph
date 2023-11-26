const sharp = require('sharp');

const imgtoascii = async (img, dimensions = 28) => {
    const data = await sharp(img)
        .resize(dimensions, dimensions, 'cover')
        .raw()
        .toBuffer();

    var matrix = [];
    var result = [];
    for (let i = 0; i < dimensions; i++) {
        matrix.push([]);
        for (let j = 0; j < dimensions; j++) {
            let r = Math.floor(data[i * dimensions * 3 + j * 3 + 0] * 6 / 256);
            if (r >= 6) r = 5;
            let g = Math.floor(data[i * dimensions * 3 + j * 3 + 1] * 6 / 256);
            if (g >= 6) g = 5;
            let b = Math.floor(data[i * dimensions * 3 + j * 3 + 2] * 6 / 256);
            if (b >= 6) b = 5;

            let number = 16 + b + g * 6 + b * 36;

            matrix[i].push(number);
        }
    }

    for (let i_1 = 0; i_1 < dimensions; i_1 += 2) {
        let str = ""
        for (let j_1 = 0; j_1 < dimensions; j_1++) {
            let c1 = matrix[i_1][j_1];
            let c2 = matrix[i_1 + 1][j_1];
            str += `\u001b[38;5;${c1}m\u001b[48;5;${c2}m▀`;
        }
        str += '\u001b[38m\u001b[48m';
        result.push(str);
    }
    return result;
}

module.exports = imgtoascii;
