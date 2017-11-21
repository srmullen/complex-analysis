import 'tachyons';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import math from 'mathjs';

window.math = math;

const C = math.complex(0, 1);
const R = math.eval(`(1 + sqrt(1 + 4 * ${vectorLength(C)})) / 2`);


class Main extends Component {
    render () {
        return (
            <canvas ref="canvas" width="500" height="500"></canvas>
        );
    }

    componentDidMount () {
        const ctx = this.refs.canvas.getContext('2d');
        // const colors = [{r:255, a: 255}, {g: 255, a: 255}, {b: 255, a: 255}];
        // colors[math.floor(math.random(0, 3))]
        const imageData = ctx.getImageData(0, 0, 500, 500);
        for (let x = 0; x < imageData.width; x++) {
            for (let y = 0; y < imageData.height; y++) {
                const val = vectorLength(iterate(complexPolynomial, 10, createComplexFromGrid(x, y, {
                    xOffset: imageData.width /2,
                    yOffset: imageData.height / 2
                })))
                if (val < R) {
                    setPixel(imageData, x, y, {
                        r: 255,
                        a: 255
                    });
                }
            }
        }
        ctx.putImageData(imageData, 10, 10);
    }
}

function createComplexFromGrid (x, y, {xStep=0.01, yStep=0.01, xOffset=0, yOffset=0}={}) {
    return math.complex((x - xOffset) * xStep, (y - yOffset) * yStep);
}

function setPixel (imageData, x, y, {r=0, g=0, b=0, a=0}) {
    const i = (y * (imageData.width * 4)) + (x * 4);
    imageData.data[i] = r;
    imageData.data[i+1] = g;
    imageData.data[i+2] = b;
    imageData.data[i+3] = a;
}

function getPixel (imageData, x, y) {
    const i = (y * (imageData.width * 4)) + (x * 4);
    return {
        r: imageData.data[i],
        g: imageData.data[i+1],
        b: imageData.data[i+2],
        a: imageData.data[i+3]
    };
}

function vectorLength (complex) {
    return complex.toPolar().r;
}

function complexPolynomial (z) {
    // f(z) = z^2
    return math.pow(z, 2).add(C);
}

// compose the function the given number of times for the
// initial value z
const iterate = (fn, times, z) => {
    let ret = z;
    for (let i = 0; i < times; i++) {
        ret = fn(ret);
    }
    return ret;
}

iterate(complexPolynomial, 5, math.complex(-1, 2));

ReactDOM.render(<Main />, document.getElementById('root'));
