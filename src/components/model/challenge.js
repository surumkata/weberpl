//Módulo dos Desafios (Challenges)

import {WIDTH, HEIGHT, HEIGHT_INV, Position} from './utils'

//Classe abstracta de Desafio
class Challenge {
    //Todos os desafios tem um sucess (actions caso o desafio seja bem sucedido) e um fail (actions caso o desafio seja falhado)
    constructor(sucess, fail) {
        this.sucess = sucess;
        this.fail = fail;

        //Variáveis auxiliares no desenho dos desafios.
        this.background = [WIDTH / 4, HEIGHT/4 +HEIGHT_INV, WIDTH / 2, HEIGHT / 2];
        this.bigBackground = [WIDTH/8, HEIGHT/8+HEIGHT_INV, 3*WIDTH/4, 3*HEIGHT/4];

        this.WHITE = 255
        this.GRAY = 128
        this.BLACK = 0

        this.padding = 10
        
        this.backgroundColor = this.GRAY
        this.backgroundStrokeColor = this.BLACK
        this.backgroundStrokeWeight = 2
        
        this.textSize = 32
        this.textColor = this.WHITE
        this.textStrokeColor = this.BLACK
        this.textStrokeWeight = 1
    }
  
    draw(p5) {
        // Abstract method to be implemented in subclasses
    }

    mousePressed(mX, mY) {}
    mouseReleased() {}
    mouseDragged(mX, mY) {}
    mouseMoved(mX, mY){}

    drawBigBackground(p5) {
        p5.fill(this.backgroundColor);
        p5.stroke(this.backgroundStrokeColor);
        p5.strokeWeight(this.backgroundStrokeWeight);
        p5.rect(this.bigBackground[0],this.bigBackground[1],this.bigBackground[2],this.bigBackground[3]);
    }

    drawBackground(p5) {
        p5.fill(this.backgroundColor);
        p5.stroke(this.backgroundStrokeColor);
        p5.strokeWeight(this.backgroundStrokeWeight);
        p5.rect(this.background[0],this.background[1],this.background[2],this.background[3]);
    }


    //Função auxiliar para detetar colisão com um retângulo
    rectCollision(mx,my,rect){
        let rectx = rect[0];
        let recty = rect[1];
        let rectw = rect[2];
        let recth = rect[3];
        if(rectx <= mx && mx <= rectx + rectw && recty <= my && my <= recty  + recth){
            return true;
        }
        return false;
    }

    // Função auxiliar para detetar colisão com um retângulo, considerando 75% da área
    rectCollisionRect(rect1, rect2) {
        // Extrai as coordenadas e dimensões dos retângulos
        const [x1, y1, w1, h1] = rect1;
        const [x2, y2, w2, h2] = rect2;

        // Calcula os limites dos retângulos para verificar sobreposição
        const xOverlap = Math.max(0, Math.min(x1 + w1, x2 + w2) - Math.max(x1, x2));
        const yOverlap = Math.max(0, Math.min(y1 + h1, y2 + h2) - Math.max(y1, y2));

        // Calcula a área de interseção
        const overlapArea = xOverlap * yOverlap;

        // Calcula 75% da área do retângulo menor para comparar
        const area1 = w1 * h1;
        const area2 = w2 * h2;
        const minArea = Math.min(area1, area2);
        const requiredOverlap = 0.75 * minArea;

        // Verifica se a área de interseção é pelo menos 75% da área do menor retângulo
        return overlapArea >= requiredOverlap;
    }

    //Função auxiliar para detetar colisão com um triângulo
    triangleCollision(px, py, triangle) {
        let x1 = triangle[0]
        let y1 = triangle[1]
        let x2 = triangle[2]
        let y2 = triangle[3]
        let x3 = triangle[4]
        let y3 = triangle[5]
        // get the area of the triangle
        var areaOrig = Math.floor(Math.abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)));
        //console.log("totalArea: " + areaOrig);
      
        // get the area of 3 triangles made between the point and the corners of the triangle
        var area1 = Math.floor(Math.abs((x1 - px) * (y2 - py) - (x2 - px) * (y1 - py)));
        var area2 = Math.floor(Math.abs((x2 - px) * (y3 - py) - (x3 - px) * (y2 - py)));
        var area3 = Math.floor(Math.abs((x3 - px) * (y1 - py) - (x1 - px) * (y3 - py)));
        //console.log("areaSum: " + (area1 + area2 + area3));
      
        // if the sum of the three areas equals the original, we're inside the triangle
        if (area1 + area2 + area3 <= areaOrig) {
          return true;
        }
        
        return false;
    }
  }

//Classe do desafio questão
class ChallengeQuestion extends Challenge {
    constructor(question,answer,sucess,fail){
        super(sucess,fail);
        this.question = question;
        this.answer = answer;

        //Botão de confirmação de resposta
        this.triangle = [WIDTH / 2 - 25, HEIGHT / 2 + HEIGHT / 8,
                         WIDTH / 2 - 25, HEIGHT / 2 + HEIGHT / 8 + 50,
                         WIDTH / 2 + 25, HEIGHT / 2 + HEIGHT / 8 + 50/2
                        ]
        
        this.hover = false;
    }
    
    draw(p5) {
        //Desenho do retângulo do desafio principal
        this.drawBackground(p5)
        
        if(this.hover) {
            p5.fill(255,0,0);
        }
        else {
            p5.fill(255);
        }
        p5.triangle(this.triangle[0],this.triangle[1],this.triangle[2],this.triangle[3],this.triangle[4],this.triangle[5])
        
        p5.textSize(this.textSize);
        p5.fill(this.textColor);
        p5.stroke(this.textStrokeColor);
        p5.strokeWeight(this.textStrokeWeight);
        p5.text(this.question, this.background[0] + this.padding, this.background[1] + this.textSize);
    }

    mousePressed(mX,mY,gameState) {
        if (mX >= 0 && mY >= 0 && mX <= WIDTH && mY <= HEIGHT) {
            if (super.rectCollision(mX,mY,this.background)){
                if (super.triangleCollision(mX,mY,this.triangle)){
                    if(gameState.inputElem.value() === this.answer) {
                        return this.sucess;
                    }
                    else {
                        return this.fail;
                    }
                }
            }
            else{
                return 0;
            }
            
        }
        return undefined;      
    }

    mouseMoved(mX,mY){
        if (super.triangleCollision(mX,mY,this.triangle)){
            this.hover = true;
            document.documentElement.style.cursor = 'pointer';
        }
        else {
            this.hover = false;
            document.documentElement.style.cursor = 'default';
        }
    }
}

class ChallengeMultipleChoice extends Challenge {
    constructor(question, multipleChoices, answer, sucess, fail){
        super(sucess,fail);
        this.question = question;
        this.multipleChoices = multipleChoices;

        this.shuffleChoices()

        this.answer = answer;

        this.choiceBoxes = [
            [WIDTH/8+10, HEIGHT/8+10 + 2*(3*HEIGHT/4)/6 + HEIGHT_INV, 3*WIDTH/4-20, (3*HEIGHT/4)/6-20],
            [WIDTH/8+10, HEIGHT/8+10 + 3*(3*HEIGHT/4)/6 + HEIGHT_INV, 3*WIDTH/4-20, (3*HEIGHT/4)/6-20],
            [WIDTH/8+10, HEIGHT/8+10 + 4*(3*HEIGHT/4)/6 + HEIGHT_INV, 3*WIDTH/4-20, (3*HEIGHT/4)/6-20],
            [WIDTH/8+10, HEIGHT/8+10 + 5*(3*HEIGHT/4)/6 + HEIGHT_INV, 3*WIDTH/4-20, (3*HEIGHT/4)/6-20]
        ]

        this.choiceHover = undefined;
    }

    shuffleChoices() {
        for (var i = this.multipleChoices.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.multipleChoices[i];
            this.multipleChoices[i] = this.multipleChoices[j];
            this.multipleChoices[j] = temp;
        }
    }

    draw(p5) {
        // Fundo colorido
        this.drawBigBackground(p5)

        let i = 0
        this.choiceBoxes.forEach(box => {
            if(this.choiceHover != undefined && this.choiceHover === i){  
                p5.fill(255,0,0);
            }
            else {
                p5.fill(this.backgroundColor);
            }

            p5.stroke(this.backgroundStrokeColor);
            p5.strokeWeight(this.backgroundStrokeWeight);
            p5.rect(box[0],box[1],box[2],box[3])
            
            p5.textSize(this.textSize);
            p5.fill(this.textColor)
            p5.stroke(this.textStrokeColor);
            p5.strokeWeight(this.textStrokeWeight);
            p5.text(this.multipleChoices[i],box[0] + 10, box[1] + box[3]/2 + 10);
            i+=1
        })
        
        // Fonte e cor do texto
        p5.textSize(this.textSize);
        p5.fill(this.textColor)
        p5.stroke(this.textStrokeColor);
        p5.strokeWeight(this.textStrokeWeight);
        p5.text(this.question, WIDTH/8 + 10, HEIGHT/8 + 32 + HEIGHT_INV);
    }


    mousePressed(mX,mY,gameState) {
        if (mX >= 0 && mY >= 0 && mX <= WIDTH && mY <= HEIGHT) {
            if (super.rectCollision(mX,mY,this.bigBackground)){
                var i = 0;
                var event = undefined;
                this.choiceBoxes.forEach(box => {
                    if(super.rectCollision(mX,mY,box)){
                        if(this.multipleChoices[i] === this.answer){
                            event = this.sucess;
                        }
                        else {
                            event = this.fail;
                        }
                    }
                    i+=1;
                })
                return event;
            }
            else{
                return 0;
            }
            
        }
        return undefined;      
    }

    mouseMoved(mX,mY){
        var i = 0
        var choiceHover = undefined
        this.choiceBoxes.forEach(box => {
            if(super.rectCollision(mX,mY,box)){
                choiceHover = i;
                document.documentElement.style.cursor = 'pointer';
            }
            i+=1;
        })
        this.choiceHover = choiceHover;
        if (choiceHover == undefined){
            document.documentElement.style.cursor = 'default';
        }
    }

}


class ChallengeSequence extends Challenge {
    constructor(question, sequence, sucess, fail){
        super(sucess,fail);
        this.question = question;
        this.sequence = sequence;
        this.shuffledSequence = [...sequence];
        this.shuffleSequence()

        console.log(this.sequence)
        console.log(this.shuffledSequence)

        this.choice = 0
        this.dones = []


        this.choiceBoxes = [
            [WIDTH/8+10, HEIGHT/8+10 + 2*(3*HEIGHT/4)/6 + HEIGHT_INV, 3*WIDTH/4-20, (3*HEIGHT/4)/6-20],
            [WIDTH/8+10, HEIGHT/8+10 + 3*(3*HEIGHT/4)/6 + HEIGHT_INV, 3*WIDTH/4-20, (3*HEIGHT/4)/6-20],
            [WIDTH/8+10, HEIGHT/8+10 + 4*(3*HEIGHT/4)/6 + HEIGHT_INV, 3*WIDTH/4-20, (3*HEIGHT/4)/6-20],
            [WIDTH/8+10, HEIGHT/8+10 + 5*(3*HEIGHT/4)/6 + HEIGHT_INV, 3*WIDTH/4-20, (3*HEIGHT/4)/6-20]
        ]

        this.choiceHover = undefined;
    }

    shuffleSequence() {
        for (var i = this.shuffledSequence.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.shuffledSequence[i];
            this.shuffledSequence[i] = this.shuffledSequence[j];
            this.shuffledSequence[j] = temp;
        }
    }

    draw(p5) {
        // Fundo colorido
        this.drawBigBackground(p5)

        let i = 0
        this.choiceBoxes.forEach(box => {
            if (this.dones.includes(this.shuffledSequence[i])) {
                p5.fill(0,255,0);
            }
            else if(this.choiceHover != undefined && this.choiceHover === i){  
                p5.fill(255,0,0);
            }
            else {
                p5.fill(this.backgroundColor);
            }

            p5.stroke(this.backgroundStrokeColor);
            p5.strokeWeight(this.backgroundStrokeWeight);
            p5.rect(box[0],box[1],box[2],box[3])
            
            p5.textSize(this.textSize);
            p5.fill(this.textColor)
            p5.stroke(this.textStrokeColor);
            p5.strokeWeight(this.textStrokeWeight);
            p5.text(this.shuffledSequence[i],box[0] + 10, box[1] + box[3]/2 + 10);
            i+=1
        })
        
        // Fonte e cor do texto
        p5.textSize(this.textSize);
        p5.fill(this.textColor)
        p5.stroke(this.textStrokeColor);
        p5.strokeWeight(this.textStrokeWeight);
        p5.text(this.question, WIDTH/8 + 10, HEIGHT/8 + 32 + HEIGHT_INV);
    }

    mousePressed(mX,mY,gameState) {
        if (mX >= 0 && mY >= 0 && mX <= WIDTH && mY <= HEIGHT) {
            if (super.rectCollision(mX,mY,this.bigBackground)){
                var i = 0;
                var event = undefined
                this.choiceBoxes.forEach(box => {
                    if(super.rectCollision(mX,mY,box)){
                        if(!this.dones.includes(this.shuffledSequence[i])) {
                            if(this.sequence[this.choice] !== this.shuffledSequence[i]) {
                                event = this.fail
                            }
                            else {
                                this.choice += 1
                                this.dones.push(this.shuffledSequence[i])
                                if (this.choice === 4){
                                    event = this.sucess
                                }
                            }
                        }
                    }
                    i+=1;
                })
                return event
            }
            else{
                return 0;
            }
            
        }
        return undefined;      
    }

    mouseMoved(mX,mY){
        var i = 0
        var choiceHover = undefined
        this.choiceBoxes.forEach(box => {
            if(!this.dones.includes(this.shuffledSequence[i]) && super.rectCollision(mX,mY,box)){
                choiceHover = i;
                document.documentElement.style.cursor = 'pointer';
            }
            i+=1;
        })
        this.choiceHover = choiceHover;
        if (choiceHover == undefined){
            document.documentElement.style.cursor = 'default';
        }
    }
}

class ChallengePuzzle extends Challenge{
    constructor(imageSrc, sucess) {
        super(sucess,null);
        this.imageSrc = imageSrc;
        this.maskSrcs = [];
        for(let i = 0; i < 12; i++){
            this.maskSrcs.push(process.env.PUBLIC_URL + `/assets/masks/mask${i}.png`);
        }
        this.loadedImage = false;

        this.scale = 0.7;

        this.mask_width=557 * this.scale;
        this.mask_height=419 * this.scale;

        this.correct_x = WIDTH/2 - this.mask_width/2;
        this.correct_y = HEIGHT/2 - this.mask_height/2 + HEIGHT_INV;
        
        this.piece_width = this.mask_width/4;
        this.piece_height = this.mask_height/3;

        this.pieces = [];

        
        this.rect1 = [this.bigBackground[0]+25,this.bigBackground[1],this.bigBackground[2]/4-25,this.bigBackground[3]];
        this.rect2 = [this.bigBackground[0] + this.bigBackground[2]/4*3,this.bigBackground[1],this.bigBackground[2]/4-25,this.bigBackground[3]];

        this.pecasPosicoes = this.distribuirPecasAleatoriamente(this.rect1,this.rect2,this.piece_width,this.piece_height); 
        console.log(this.pecasPosicoes)
    
        this.initPieces();

        

        this.pressed = false;
        this.lastPosition = new Position(0,0);

        this.piecesDones = 0;

    }

    loadImages(p5){
        console.log("loading")
        this.imgs = []
        this.masks = []
        this.img = p5.loadImage(this.imageSrc);
        for (let i = 0; i < 12; i++) {
            console.log("loading ",i)
            this.masks.push(p5.loadImage(this.maskSrcs[i]));
        }
        this.loadedImage = true;
    }

    distribuirPecasAleatoriamente(rect1, rect2, pecasW, pecasH) {
        const pecasPosicoes = [];
      
        // Função para gerar uma posição aleatória dentro dos limites de um retângulo
        function gerarPosicaoAleatoria(rect) {
            const x = rect[0] + Math.random() * (rect[2] - pecasW);
            const y = rect[1] + Math.random() * (rect[3] - pecasH);
            return { x: Math.floor(x), y: Math.floor(y) };
        }
    
        // Colocar 6 peças no primeiro retângulo
        for (let i = 0; i < 6; i++) {
            const posicao = gerarPosicaoAleatoria(rect1);
            pecasPosicoes.push(posicao);
        }
    
        // Colocar 6 peças no segundo retângulo
        for (let i = 0; i < 6; i++) {
            const posicao = gerarPosicaoAleatoria(rect2);
            pecasPosicoes.push(posicao);
        }
    
        return pecasPosicoes;
    }

    // Inicializa as peças recortando-as usando as máscaras
    initPieces() {
        for (let j = 0; j < 3 ; j++){
            for (let i = 0; i < 4; i++) {
                const index = i + j*4;
                this.pieces.push({
                    x: this.pecasPosicoes[index].x - this.piece_width * i,
                    y: this.pecasPosicoes[index].y - this.piece_height * j,
                    hitbox_x : this.piece_width * i,
                    hitbox_y : this.piece_height * j,
                    isPlaced: false,
                    startBoard : Math.floor(Math.random() * 2) + 1
                });
            }
        }
    }

    draw(p5) {
        // Fundo colorido
        this.drawBigBackground(p5)

        if (!this.loadedImage) {
            this.loadImages(p5);
        }

        if(this.loadedImage){
                for (let i = 0; i < 12; i++) {
                    const image = this.img.get()
                    const piece = this.pieces[i]
                    image.resize(this.mask_width,this.mask_height);
                    this.masks[i].resize(this.mask_width,this.mask_height);
                    image.mask(this.masks[i]);
                    p5.image(image,piece.x,piece.y);
                    let c = p5.color(255, 128, 128);
                    c.setAlpha(0);
                    p5.fill(c);
                    if(!piece.isPlaced){
                        p5.rect(this.correct_x + piece.hitbox_x, this.correct_y + piece.hitbox_y, this.piece_width , this.piece_height);
                        //p5.rect(this.pecasPosicoes[i].x, this.pecasPosicoes[i].y, this.piece_width , this.piece_height);
                    }
                }
                let c = p5.color(255, 128, 128);
                c.setAlpha(10);
                p5.fill(c);
                //p5.rect(this.rect1[0],this.rect1[1],this.rect1[2],this.rect1[3]);
                //p5.rect(this.rect2[0],this.rect2[1],this.rect2[2],this.rect2[3]);
        }
    }

    mouseDragged(mx, my) {
        if (this.pressed){
            let changeX = this.lastPosition.x - mx;
            let changeY = this.lastPosition.y - my;
            
            this.pieces[this.piecePressed].x -= changeX;
            this.pieces[this.piecePressed].y -= changeY;
            console.log("moved", this.pieces[this.piecePressed].x,this.pieces[this.piecePressed].y)
            this.lastPosition = new Position(mx,my);
        } 
    }

    mouseReleased(){
        console.log("unpressed")
        if(this.pressed){
            this.pressed = false;
            let piece = this.pieces[this.piecePressed]
            if(super.rectCollisionRect([piece.x,piece.y,this.piece_width,this.piece_height],[this.correct_x,this.correct_y,this.piece_width,this.piece_height])){
                piece.isPlaced = true;
                piece.x = this.correct_x;
                piece.y = this.correct_y;
                this.piecesDones++;
                if(this.piecesDones == 12){
                    return this.sucess;
                }
            }
        }
        return undefined;
        
    }

    mousePressed(mX, mY) {
        if (super.rectCollision(mX,mY,this.bigBackground)){
            for (let i = 0; i < 12; i++) {
                const piece = this.pieces[i];
                const rect = [piece.x + piece.hitbox_x, piece.y + piece.hitbox_y, this.piece_width , this.piece_height];
                if(super.rectCollision(mX,mY,rect) && !piece.isPlaced){
                    console.log("pressed",i)
                    this.pressed = true;
                    this.piecePressed = i;
                    this.lastPosition = new Position(mX,mY);
    
                }
            }
            return undefined;
        }
        else{
            return 0;
        }
        
    }
}




class ChallengeConnections extends Challenge{
    constructor(question, list1, list2, sucess, fail){
        super(sucess,fail);
        this.question = question;
        this.list1 = [...list1];
        this.list2 = [...list2];

        this.connections = {}
        for (var i = 0; i <= this.list1.length - 1; i++) {
            this.connections[this.list1[i]] = this.list2[i]
        }
        this.padding = 10

        this.shuffleLists();

        this.leftBoxes = [
            [WIDTH/8+this.padding, HEIGHT_INV+HEIGHT/8+this.padding + 2*(3*HEIGHT/4)/6, 3*WIDTH/8-this.padding*2, (3*HEIGHT/4)/6-this.padding*2],
            [WIDTH/8+this.padding, HEIGHT_INV+HEIGHT/8+this.padding + 3*(3*HEIGHT/4)/6, 3*WIDTH/8-this.padding*2, (3*HEIGHT/4)/6-this.padding*2],
            [WIDTH/8+this.padding, HEIGHT_INV+HEIGHT/8+this.padding + 4*(3*HEIGHT/4)/6, 3*WIDTH/8-this.padding*2, (3*HEIGHT/4)/6-this.padding*2],
            [WIDTH/8+this.padding, HEIGHT_INV+HEIGHT/8+this.padding + 5*(3*HEIGHT/4)/6, 3*WIDTH/8-this.padding*2, (3*HEIGHT/4)/6-this.padding*2]
        ]

        this.rightBoxes = [
            [WIDTH/2+this.padding, HEIGHT_INV+HEIGHT/8+this.padding + 2*(3*HEIGHT/4)/6, 3*WIDTH/8-this.padding*2, (3*HEIGHT/4)/6-this.padding*2],
            [WIDTH/2+this.padding, HEIGHT_INV+HEIGHT/8+this.padding + 3*(3*HEIGHT/4)/6, 3*WIDTH/8-this.padding*2, (3*HEIGHT/4)/6-this.padding*2],
            [WIDTH/2+this.padding, HEIGHT_INV+HEIGHT/8+this.padding + 4*(3*HEIGHT/4)/6, 3*WIDTH/8-this.padding*2, (3*HEIGHT/4)/6-this.padding*2],
            [WIDTH/2+this.padding, HEIGHT_INV+HEIGHT/8+this.padding + 5*(3*HEIGHT/4)/6, 3*WIDTH/8-this.padding*2, (3*HEIGHT/4)/6-this.padding*2]
        ]

        this.dones = []

        this.leftChoice = undefined
        this.rightChoice = undefined
    }

    shuffleLists() {
        for (var i = this.list1.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.list1[i];
            this.list1[i] = this.list1[j];
            this.list1[j] = temp;
        }
        for (i = this.list2.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = this.list2[i];
            this.list2[i] = this.list2[j];
            this.list2[j] = temp;
        }
    }

    draw(p5){
        // Fundo colorido
        this.drawBigBackground(p5)
        

        let i = 0
        this.leftBoxes.forEach(leftBox => {
            if (this.dones.includes(this.connections[this.list1[i]])) {
                p5.fill (0,255,0);
            }
            else if(this.leftChoice === this.list1[i]){
                p5.fill (0,0,255);
            }
            else if(this.choiceHover != undefined && this.choiceHover === i){  
                p5.fill(255,0,0);
            }
            else {
                p5.fill(this.backgroundColor);
            }          

            p5.stroke(this.backgroundStrokeColor);
            p5.strokeWeight(this.backgroundStrokeWeight);
            p5.rect(leftBox[0],leftBox[1],leftBox[2],leftBox[3])
            
            p5.textSize(this.textSize);
            p5.fill(this.textColor)
            p5.stroke(this.textStrokeColor);
            p5.strokeWeight(this.textStrokeWeight);
            p5.text(this.list1[i],leftBox[0] + this.padding, leftBox[1] + leftBox[3]/2 + this.padding);
            i+=1
        })
        i = 0
        this.rightBoxes.forEach(rightBox => {            
            if (this.dones.includes(this.list2[i])) {
                p5.fill (0,255,0);
            }
            else if(this.rightChoice === this.list2[i]){
                p5.fill (0,0,255);
            }
            else if(this.choiceHover != undefined && this.choiceHover === i+4){  
                p5.fill(255,0,0);
            }
            else {
                p5.fill(this.backgroundColor);
            }   
            p5.stroke(this.backgroundStrokeColor);
            p5.strokeWeight(this.backgroundStrokeWeight);
            p5.rect(rightBox[0],rightBox[1],rightBox[2],rightBox[3])
            
            p5.textSize(this.textSize);
            p5.fill(this.textColor)
            p5.stroke(this.textStrokeColor);
            p5.strokeWeight(this.textStrokeWeight);
            p5.text(this.list2[i],rightBox[0] + this.padding, rightBox[1] + rightBox[3]/2 + this.padding);
            i+=1
        })
        
        // Fonte e cor do texto
        p5.textSize(this.textSize);
        p5.fill(this.textColor)
        p5.stroke(this.textStrokeColor);
        p5.strokeWeight(this.textStrokeWeight);
        p5.text(this.question, this.bigBackground[0] + this.padding, this.bigBackground[1] + this.textSize + this.padding);

    }
    mousePressed(mX,mY,gameState) {
        document.documentElement.style.cursor = 'default';
        if (mX >= 0 && mY >= 0 && mX <= WIDTH && mY <= HEIGHT) {
            if (super.rectCollision(mX,mY,this.bigBackground)){
                var i = 0;
                var event = undefined
                this.leftBoxes.forEach(box => {
                    if(super.rectCollision(mX,mY,box)){
                        if(!this.dones.includes(this.connections[this.list1[i]])) {
                            this.leftChoice = this.list1[i]
                            if (this.rightChoice != undefined){
                                console.log(this.rightChoice);
                                console.log(this.leftChoice);
                                if(this.rightChoice === this.connections[this.leftChoice]){
                                    this.dones.push(this.rightChoice);
                                    this.rightChoice = undefined;
                                    this.leftChoice = undefined;
                                    if(this.dones.length === 4) {
                                        event = this.sucess;
                                    }
                                }
                                else{
                                    event = this.fail;
                                }
                            }
                        }
                    }
                    i+=1;
                })
                i = 0;
                this.rightBoxes.forEach(box => {
                    if(super.rectCollision(mX,mY,box)){
                        if(!this.dones.includes(this.list2[i])) {
                            this.rightChoice = this.list2[i]
                            if (this.leftChoice != undefined){
                                if(this.rightChoice === this.connections[this.leftChoice]){
                                    this.dones.push(this.rightChoice);
                                    this.rightChoice = undefined;
                                    this.leftChoice = undefined;
                                    if(this.dones.length === 4) {
                                        event = this.sucess;
                                    }
                                }
                                else{
                                    event = this.fail;
                                }
                            }
                        }
                    }
                    i+=1;
                })
                return event
            }
            else{
                return 0;
            }
            
        }
        return undefined;      
    }

    mouseMoved(mX,mY){
        var i = 0
        var choiceHover = undefined
        this.leftBoxes.forEach(box => {
            if(!this.dones.includes(this.connections[this.list1[i]]) && super.rectCollision(mX,mY,box)){
                choiceHover = i;
                document.documentElement.style.cursor = 'pointer';
            }
            i+=1;
        })
        if (choiceHover == undefined){
            i = 0;
            this.rightBoxes.forEach(box => {
                if(!this.dones.includes(this.list2[i]) && super.rectCollision(mX,mY,box)){
                    choiceHover = i+4;
                    document.documentElement.style.cursor = 'pointer';
                }
                i+=1;
            })
        }
        this.choiceHover = choiceHover;

        if (choiceHover == undefined){
            document.documentElement.style.cursor = 'default';
        }
    }
}

export {
    ChallengeQuestion,
    ChallengeMultipleChoice,
    ChallengeSequence,
    ChallengeConnections,
    ChallengePuzzle
};