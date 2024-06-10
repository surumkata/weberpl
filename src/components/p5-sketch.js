import React from 'react';
import Sketch from 'react-p5';
import { load } from './model/load.js';
import "./p5-sketch.css"

function P5Sketch(json) {
    var escape_room;

    const preload = (p5) => {
        escape_room = load(p5,json.json);
      }

    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(1300, 700).parent(canvasParentRef);
    }

    const draw = (p5) => {
        p5.background(0);
        if(escape_room != undefined){
          escape_room.draw(p5);
        }
    }

    return (
        <div className="sketch-container">
            <Sketch setup={setup} draw={draw} preload={preload} />
        </div>
    )
}

export default P5Sketch;