import { HEIGHT_INV } from "./utils";

export class Transition {
    constructor(id,background,story,next_scenario,next_transition) {
        this.id = id;
        this.background = background;
        this.story = story;
        this.nextScenario = next_scenario;
        this.nextTransition = next_transition;

        this.WHITE = 255
        this.GRAY = 128
        this.BLACK = 0

        this.textSize = 32
        this.textColor = this.BLACK
        this.textStrokeColor = this.WHITE
        this.textStrokeWeight = 1

        this.padding = 10
    }

    draw(p5){

        this.background.draw(p5);
        var i = 1;
        let textSize = this.textSize;
        let textColor = this.textColor;
        let textStrokeColor = this.textStrokeColor;
        let textStrokeWeight = this.textStrokeWeight;
        let padding = this.padding;


        this.story.forEach(function(line){
            p5.textSize(textSize);
            p5.fill(textColor);
            p5.stroke(textStrokeColor);
            p5.strokeWeight(textStrokeWeight);
            p5.text(line, padding, HEIGHT_INV+textSize*i);
            i++;
        })
        
    }


}