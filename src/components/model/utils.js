export const debugMode = true;
export let WIDTH = 1280;
export let HEIGHT = 720;
export let HEIGHT_INV = HEIGHT * 0.15;
export let SCALE_EDIT = 0.5;

export function setWIDTH(value) {
    WIDTH = value;
}

export function setHEIGHT(value) {
    HEIGHT = value;
}

export function setHEIGHT_INV(value) {
    HEIGHT_INV = value;
}

export function setSCALE_EDIT(value){
    SCALE_EDIT = value;
}


export const Color = {
    WHITE: [255, 255, 255],
    GREEN: [0, 255, 0],
    RED: [255, 0, 0],
    BLACK: [0, 0, 0],
    BLUE: [0, 0, 255],
    GRAY: [89, 89, 89]
};

// CLASSES AUXILIARES
export class Position {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

export class Size {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

// Classe para representar mensagens de balão de fala
export class BalloonMessage {
    constructor(text, x, y) {
        this.text = text;
        this.x = x;
        this.y = y;
    }

    display(p5) {        
        // Mede o texto para determinar a posição e tamanho do retângulo
        let textWidth = p5.textWidth(this.text);
        let textHeight = p5.textAscent() + p5.textDescent();
        
        // Desenha o retângulo vermelho
        p5.fill(0, 0, 0);
        p5.rect(this.x-10, this.y-textHeight-2, textWidth + 20, textHeight + 10);
        
        // Desenha o texto branco
        p5.fill(255);  // Cor branca
        p5.text(this.text, this.x, this.y);
    }
}

export function debug(message) {
    console.log(message);
}