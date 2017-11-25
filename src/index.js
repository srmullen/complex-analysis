import 'tachyons';
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import math from 'mathjs';
import dat from 'dat.gui/build/dat.gui';
import {partial} from 'lodash';

window.math = math;

const params = {
    x: 0,
    y: 1
}

class Main extends Component {
    render () {
        return (
            <div>
                <canvas ref="canvas" width="500" height="500"></canvas>
            </div>
        );
    }

    componentDidMount () {
        this.createGUI();
        this.ctx = this.refs.canvas.getContext('2d');
        // this.imageData = this.ctx.getImageData(0, 0, 500, 500);
        this.drawJuliaSet();
    }

    drawJuliaSet () {
        this.ctx.clearRect(0, 0, 500, 500);
        const imageData = this.ctx.getImageData(0, 0, 500, 500);
        const C = math.complex(params.x, params.y);
        const R = math.eval(`(1 + sqrt(1 + 4 * ${vectorLength(C)})) / 2`);

        for (let x = 0; x < imageData.width; x++) {
            for (let y = 0; y < imageData.height; y++) {
                const val = vectorLength(iterate(partial(complexPolynomial, C), 10, createComplexFromGrid(x, y, {
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
        this.ctx.putImageData(imageData, 10, 10);
    }

    createGUI () {
        const gui = new dat.GUI();
        const cxController = gui.add(params, 'x');
        const cyController = gui.add(params, 'y');
        let previous = {
            x: 0,
            y: 1
        }
        cxController.onChange((x) => {
            // console.log(params.x === x);
            if (x != previous.x) {
                previous.x = x;
                this.drawJuliaSet();
            }
        });
        cyController.onChange((y) => {
            // console.log(params.x === x);
            if (y != previous.y) {
                previous.y = y;
                this.drawJuliaSet();
            }
        });
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

function complexPolynomial (C, z) {
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

// iterate(complexPolynomial, 5, math.complex(-1, 2));

ReactDOM.render(<Main />, document.getElementById('root'));
