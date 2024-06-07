import React from 'react';
import Sketch from 'react-p5';
import { EscapeRoom } from './model/escape_room.js';
import { load } from './model/load.js';
import test_json from "./test.json"

function P5Sketch(json) {
    console.log(test_json);
    var escape_room;

    const preload = (p5) => {
        escape_room = load(p5,test_json);
      }

    const setup = (p5, canvasParentRef) => {
        p5.createCanvas(1300, 700);
    }

    const draw = (p5) => {
        p5.background(0);
        if(escape_room != undefined){
          escape_room.draw(p5);
        }
    }

    return (
        <Sketch setup={setup} draw={draw} preload={preload} />
    )
}

export default P5Sketch;