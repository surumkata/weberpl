import { HEIGHT, HEIGHT_INV, Position, WIDTH, SCALE_EDIT } from "./utils";
//import { Hitbox, HitboxRect } from "./hitbox";

export class View {
  constructor(p5,id, srcImages, size, position, timeSprite, repeate,turn) {
    this.id = id;
    this.position = position;
    this.size = size;
    this.srcImages = srcImages;
    this.timeSprite = timeSprite;
    this.repeate = repeate;
    this.images = [];
    this.currentSprite = 0;
    this.currentTimeSprite = 0
    this.repeateInit = repeate
    this.repeate = this.repeateInit
    this.isDragging = false
    this.isResizing = false
    this.lastPosition = new Position(0,0);
    this.typeResizing = ""
    this.hover = false
    this.shift = false
    this.turnX = turn.x
    this.turnY = turn.y
    //this.hitbox = new HitboxRect(this.position.x,this.position.y,this.size.x,this.size.y);

    for (let i in this.srcImages){
      //TODO: colocar assets para funcionar :)
      this.images[i] = p5.loadImage(this.srcImages[i]);
    }
  }

  changeSize(size) {
    this.size = size;
  }

  changePosition(position) {
      this.position = position;
  } 

  changeSprite() {
      this.currentTimeSprite += 1;
      if (this.currentTimeSprite === this.timeSprite) {
          this.currentTimeSprite = 0;
          this.currentSprite += 1;
          if (this.currentSprite === this.images.length) {
              this.repeate -= 1;
              this.currentSprite = this.repeate === 0 ? this.currentSprite - 1 : 0;
          }
      }
  }

  viewCollision(mx,my){
    let width = this.size.x;
    let height = this.size.y;
    let posX = this.position.x;
    let posY = this.position.y;
    if (width < 0){
      posX += width;
      width = -width;
    }
    if (height < 0){
      posY += height;
      height = -height;
    }
    if(posX <= mx && mx <= posX + width && posY <= my && my <= posY  + height){
        return true;
    }
    return false;
  }

  circleCollision(x, y, cx, cy, radius) {
    const distance =
        Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
    return distance < radius;
  }

  lineCollision(x,y, lsx,lsy, lex,ley) {
    // Função auxiliar para calcular a distância entre dois pontos
    function distance(p1x,p1y, p2x,p2y) {
        return Math.sqrt(Math.pow(p2x - p1x, 2) + Math.pow(p2y - p1y, 2));
    }

    // Calcula as distâncias
    const d1 = distance(x,y, lsx,lsy);
    const d2 = distance(x,y, lex,ley);
    const lineLength = distance(lsx,lsy,lex,ley);

    // Verifica se a soma das distâncias do ponto ao início e ao fim da linha
    // é igual ao comprimento da linha (com uma pequena margem de erro)
    return Math.abs((d1 + d2) - lineLength) < 1e-2;
  }

  draw(p5){
    if(this.size.x === 0 || this.size.y === 0){
      return
    }

    var posX = this.position.x
    var posY = this.position.y
    var width = this.size.x
    var height = this.size.y
    var scaleX = 1;
    var scaleY = 1;

    if(this.turnX){
      posX *= -1;
      posX -= width;
      scaleX = -1;
    }
    if(this.turnY){
      posY *= -1
      posY -= height
      scaleY = -1;
    }

    p5.push();
    p5.scale(scaleX,scaleY);
    p5.image(this.images[this.currentSprite],posX,posY,width,height);
    p5.pop();
    if(this.hover){
      p5.push();
      p5.stroke(255,0,0);
      p5.strokeWeight(2);
      p5.fill(100,100,100,0);
      p5.rect(this.position.x,this.position.y,this.size.x,this.size.y);
      p5.fill(255,0,0);
      p5.noStroke();
      p5.circle(this.position.x,this.position.y,10);
      p5.circle(this.position.x+this.size.x,this.position.y,10);
      p5.circle(this.position.x,this.position.y+this.size.y,10);
      p5.circle(this.position.x+this.size.x,this.position.y+this.size.y,10);
      p5.pop();
    }
    

  }

  shiftPressed(){
    this.shift = true;
  }

  shiftReleased(){
    this.shift = false;
  }

  mouseMoved(mX,mY) {
    let width = this.size.x;
    let height = this.size.y;
    let posX = this.position.x;
    let posY = this.position.y;
    if (width < 0){
      posX += width;
      width = -width;
    }
    if (height < 0){
      posY += height;
      height = -height;
    }
    if(this.circleCollision(mX,mY,posX,posY,11)){
      this.hover = true
      document.documentElement.style.cursor = 'nwse-resize';
    }
    else if(this.circleCollision(mX,mY,posX+width,posY,11)){
      this.hover = true
      document.documentElement.style.cursor = 'nesw-resize';
    }
    else if(this.circleCollision(mX,mY,posX,posY+height,11)){
      this.hover = true
      document.documentElement.style.cursor = 'nesw-resize';
    }
    else if(this.circleCollision(mX,mY,posX+width,posY+height,11)){
      this.hover = true
      document.documentElement.style.cursor = 'nwse-resize';
    }
    else if(this.lineCollision(mX,mY,posX,posY,posX+width,posY)){
      this.hover = true
      document.documentElement.style.cursor = 'ns-resize';
    }
    else if(this.lineCollision(mX,mY,posX,posY+height,posX+width,posY+height)){
      this.hover = true
      document.documentElement.style.cursor = 'ns-resize';
    }
    else if(this.lineCollision(mX,mY,posX,posY,posX,posY+height)){
      this.hover = true
      document.documentElement.style.cursor = 'ew-resize';
    }
    else if(this.lineCollision(mX,mY,posX+width,posY,posX+width,posY+height)){
      this.hover = true
      document.documentElement.style.cursor = 'ew-resize';
    }
    else if (this.viewCollision(mX,mY)){
      this.hover = true
      document.documentElement.style.cursor = 'move';
    }
    else {
      this.hover = false
      document.documentElement.style.cursor = 'default';
    }
    return this.hover
  }

  mousePressed(mX,mY) {
    if(this.circleCollision(mX,mY,this.position.x,this.position.y,11)){ //CIRCULO ESQUERDO CIMA
      this.isResizing = true
      this.setLastPosition(mX,mY);
      this.typeResizing = "CIRCULO_ESQUERDA_CIMA"
    }
    else if(this.circleCollision(mX,mY,this.position.x+this.size.x,this.position.y,11)){ //CIRCULO DIREITA CIMA
      this.isResizing = true
      this.setLastPosition(mX,mY);
      this.typeResizing = "CIRCULO_DIREITA_CIMA"
    }
    else if(this.circleCollision(mX,mY,this.position.x,this.position.y+this.size.y,11)){ //CIRCULO ESQUERDA BAIXO
      this.isResizing = true
      this.setLastPosition(mX,mY);
      this.typeResizing = "CIRCULO_ESQUERDA_BAIXO"
    }
    else if(this.circleCollision(mX,mY,this.position.x+this.size.x,this.position.y+this.size.y,11)){ //CIRCULO DIREITA BAIXO
      this.isResizing = true
      this.setLastPosition(mX,mY);
      this.typeResizing = "CIRCULO_DIREITA_BAIXO"
    }
    else if(this.lineCollision(mX,mY,this.position.x,this.position.y,this.position.x+this.size.x,this.position.y)){ //RETA CIMA
      this.isResizing = true
      this.setLastPosition(mX,mY);
      this.typeResizing = "RETA_CIMA"
    }
    else if(this.lineCollision(mX,mY,this.position.x,this.position.y+this.size.y,this.position.x+this.size.x,this.position.y+this.size.y)){ //RETA BAIXO
      this.isResizing = true
      this.setLastPosition(mX,mY);
      this.typeResizing = "RETA_BAIXO"
    }
    else if(this.lineCollision(mX,mY,this.position.x,this.position.y,this.position.x,this.position.y+this.size.y)){ //RETA ESQUERDA
      this.isResizing = true
      this.setLastPosition(mX,mY);
      this.typeResizing = "RETA_ESQUERDA"
    }
    else if(this.lineCollision(mX,mY,this.position.x+this.size.x,this.position.y,this.position.x+this.size.x,this.position.y+this.size.y)){ //RETA DIREITA
      this.isResizing = true
      this.setLastPosition(mX,mY);
      this.typeResizing = "RETA_DIREITA"
    }
    else if (this.viewCollision(mX,mY)){
      this.isDragging = true
      this.setLastPosition(mX,mY);
    }
    return this.isDragging || this.isResizing;
  }

  leaningRight(){
    return this.position.x + this.size.x >= WIDTH*SCALE_EDIT;
  }

  leaningLeft(){
    return this.position.x <= 0;
  }

  leaningDown(){
    return this.position.y + this.size.y >= (HEIGHT+HEIGHT_INV)*SCALE_EDIT;
  }

  leaningTop(){
    return this.position.y <= HEIGHT_INV*SCALE_EDIT;
  }

  fixPosition(){
    if(this.size.x >= 0){
      if (this.leaningRight()){
        this.position.x = WIDTH*SCALE_EDIT - this.size.x;
      }
      if (this.leaningLeft()){
        this.position.x = 0;
      }
    }
    else {
      if (this.position.x >= WIDTH*SCALE_EDIT){
        this.position.x = WIDTH*SCALE_EDIT;
      }
      if (this.position.x + this.size.x <= 0){
        this.position.x = -this.size.x;
      }
    }
    
    if(this.size.y >= 0){
      if (this.leaningDown()){
        this.position.y = (HEIGHT+HEIGHT_INV)*SCALE_EDIT - this.size.y;
      }
      if (this.leaningTop()){
        this.position.y = HEIGHT_INV*SCALE_EDIT;
      }
    }
    else {
      if (this.position.y >= (HEIGHT+HEIGHT_INV)*SCALE_EDIT){
        this.position.y = (HEIGHT+HEIGHT_INV)*SCALE_EDIT;
      }
      if (this.position.y + this.size.y <= HEIGHT_INV*SCALE_EDIT){
        this.position.y = -this.size.y + HEIGHT_INV*SCALE_EDIT;
      }
    }
  }

  setLastPosition(x,y){
    this.lastPosition = new Position(x,y);
  }

  setX(x){
    this.position.x = x;
  }

  setY(y){
    this.position.y = y;
  }

  dragViewX(x){
    this.position.x += x;
  }

  dragViewY(y){
    this.position.y += y;
  }

  resizeX(x){
    this.size.x = x;
  }

  resizeY(y){
    this.size.y = y;
  }

  resizeRight(mX,mY,changeX){
    if(!(this.leaningRight() && changeX > 0)){ //Não dou resize se tiver a tocar a borda da direita e o movimento for para a direita (changeX positivo)
      let touched_limits = false;
      
      this.resizeX(Math.max(0,this.size.x + changeX));
      if(this.leaningRight()){
        this.resizeX(WIDTH*SCALE_EDIT - this.position.x);
        touched_limits = true;
      }
      if (this.size.x !== 0 && !touched_limits) {
        this.setLastPosition(mX,mY);
      }
    }
  }

  resizeDown(mX,mY,changeY){
    if(!(this.leaningDown() && changeY > 0)){ //Não dou resize se tiver a tocar a borda de baixo e o movimento for para baixo (changeY positivo)
      let touched_limits = false;
      this.resizeY(Math.max(0,this.size.y + changeY));
      if(this.leaningDown()){ //Se tiver passado da borda de baixo ajusta-se para ficar em encostado a ela.
        this.resizeY((HEIGHT+HEIGHT_INV)*SCALE_EDIT - this.position.y);
        touched_limits = true;
      }
      if (this.size.y !== 0 && !touched_limits) {
        this.setLastPosition(mX,mY);
      }
    }
  }

  resizeLeft(mX,mY,changeX){
    if(!(this.leaningLeft() && changeX < 0)){ //Não dou resize se tiver a tocar a borda da esquerda e o movimento for para a esquerda (changeX negativo)
      let touched_limits = false;
      this.dragViewX(changeX);
      this.resizeX(this.size.x - changeX);
      if(this.leaningLeft()){ //Se tiver passado da borda da esquerda ajusta-se para ficar em encostado a ela.
        this.resizeX(this.size.x + this.position.x);
        this.setX(0);
        touched_limits = true;
      }
      if(this.size.x < 0){
        this.dragViewX(this.size.x);
        this.resizeX(0);
      }
      
      if (this.size.x !== 0 && !touched_limits) {
        this.setLastPosition(mX,mY);
      }
    }
  }

  resizeTop(mX,mY,changeY){
    if(!(this.leaningTop() && changeY < 0)){ //Não dou resize se tiver a tocar a borda de cima e o movimento for para cima (changeY negativo).
      let touched_limits = false;
      this.dragViewY(changeY);
      this.resizeY(this.size.y - changeY);
      if (this.leaningTop()){ //Se tiver passado da borda de cima ajusta-se para ficar em encostado a ela.
        this.resizeY(this.size.y - (HEIGHT_INV*SCALE_EDIT - this.position.y));
        this.setY(HEIGHT_INV*SCALE_EDIT);
        touched_limits = true;
      }
      
      if(this.size.y < 0){
        this.dragViewY(this.size.y);
        this.resizeY(0);
      }

      if (this.size.y !== 0 && !touched_limits) {
        this.setLastPosition(mX,mY);
      }
    }
  }

  resizeDownRight(mX,mY,changeX, changeY,relXY,relYX){
    if(!((this.leaningDown() && changeY > 0) || (this.leaningRight() && changeX > 0))){
      let touched_limits = false;
      if(relXY > relYX){
        //right
        this.resizeX(Math.max(0.1,this.size.x + changeY*relXY));
        //down
        this.resizeY(Math.max(0.1,this.size.y + changeY));
      }
      else{
        //right
        this.resizeX(Math.max(0.1,this.size.x + changeX));
        //down
        this.resizeY(Math.max(0.1,this.size.y + changeX*relYX));
      }

      if(this.leaningDown()){ //Se tiver passado da borda de baixo ajusta-se para ficar em encostado a ela.
        this.resizeY((HEIGHT+HEIGHT_INV)*SCALE_EDIT - this.position.y);
        this.resizeX(this.size.y*relXY);
        touched_limits = true;
      }
      if(this.leaningRight()){
        this.resizeX(WIDTH*SCALE_EDIT - this.position.x);
        this.resizeY(this.size.x*relYX);
        touched_limits = true;
      }

      if (this.size.x !== 0.1 && this.size.y !== 0.1 && !touched_limits) {
        this.setLastPosition(mX,mY);
      }
    }
  }

  resizeTopRight(mX,mY,changeX, changeY,relXY,relYX){
    if(!((this.leaningTop() && changeY < 0) || (this.leaningRight() && changeX > 0))){
      let touched_limits = false;
      if(relXY > relYX){
        //right
        this.resizeX(Math.max(0.1,this.size.x - changeY*relXY));
        //top
        this.dragViewY(changeY);
        this.resizeY(this.size.y - changeY);
      }
      else{
        //right
        this.resizeX(Math.max(0.1,this.size.x + changeX));
        //top
        this.dragViewY(-changeX*relYX);
        this.resizeY(this.size.y + changeX*relYX);
      }


      if (this.leaningTop()){ //Se tiver passado da borda de cima ajusta-se para ficar em encostado a ela.
        let dif = (HEIGHT_INV*SCALE_EDIT - this.position.y);
        this.resizeY(this.size.y - dif);
        this.setY(HEIGHT_INV*SCALE_EDIT);

        this.resizeX(this.size.x - dif*relXY);
        touched_limits = true;
      }

      if(this.size.y < 0.1){
        this.dragViewY(this.size.y-0.1);
        this.resizeY(0.1);
      }

      if(this.leaningRight()){
        let dif = this.size.x - (WIDTH*SCALE_EDIT - this.position.x)
        this.resizeX(WIDTH*SCALE_EDIT - this.position.x);

        this.dragViewY(dif*relYX);
        this.resizeY(this.size.y - dif*relYX);
        touched_limits = true;
      }

      if (this.size.x !== 0.1 && this.size.y !== 0.1 && !touched_limits) {
        this.setLastPosition(mX,mY);
      }
    }
  }

  resizeDownLeft(mX,mY,changeX, changeY,relXY,relYX){
    if(!((this.leaningDown() && changeY > 0) || (this.leaningLeft() && changeX < 0))){
      let touched_limits = false;
      if(relXY > relYX){
        //left
        this.dragViewX(-changeY*relXY);
        this.resizeX(this.size.x + changeY*relXY);
        //down
        this.resizeY(Math.max(0.1,this.size.y + changeY));
      }
      else{
        //left
        this.dragViewX(changeX);
        this.resizeX(this.size.x - changeX);
        //down
        this.resizeY(Math.max(0.1,this.size.y - changeX*relYX));
      }


      if(this.leaningDown()){ //Se tiver passado da borda de baixo ajusta-se para ficar em encostado a ela.
        let dif = this.size.y - ((HEIGHT+HEIGHT_INV)*SCALE_EDIT - this.position.y)
        this.resizeY((HEIGHT+HEIGHT_INV)*SCALE_EDIT - this.position.y);

        
        this.dragViewX(dif*relXY);
        this.resizeX(this.size.x - dif*relXY);
        touched_limits = true;
      }
      if(this.leaningLeft()){ //Se tiver passado da borda da esquerda ajusta-se para ficar em encostado a ela.
        let dif = -this.position.x
        this.resizeX(this.size.x - dif);
        this.setX(0);

        this.resizeY(this.size.y - dif*relYX);
        touched_limits = true;
      }

      

      if(this.size.x < 0.1){
        this.dragViewX(this.size.x-0.1);
        this.resizeX(0.1);
      }

      if (this.size.x !== 0.1 && this.size.y !== 0.1 && !touched_limits) {
        this.setLastPosition(mX,mY);
      }
    }
  }

  resizeTopLeft(mX,mY,changeX, changeY,relXY,relYX){
    if(!((this.leaningTop() && changeY < 0) || (this.leaningLeft() && changeX < 0))){
      let touched_limits = false;
      if(relXY > relYX){
        //left
        this.dragViewX(changeY*relXY);
        this.resizeX(this.size.x - changeY*relXY);
        //top
        this.dragViewY(changeY);
        this.resizeY(this.size.y - changeY);
      }
      else{
        //left
        this.dragViewX(changeX);
        this.resizeX(this.size.x - changeX);
        //top
        this.dragViewY(changeX*relYX);
        this.resizeY(this.size.y - changeX*relYX);
      }

      if (this.leaningTop()){ //Se tiver passado da borda de cima ajusta-se para ficar em encostado a ela.
        let dif = (HEIGHT_INV*SCALE_EDIT - this.position.y);
        this.resizeY(this.size.y - dif);
        this.setY(HEIGHT_INV*SCALE_EDIT);

        this.dragViewX(dif*relXY);
        this.resizeX(this.size.x - dif*relXY);
        touched_limits = true;
      }
      
      if(this.size.y < 0.1){
        this.dragViewY(this.size.y-0.1);
        this.resizeY(0.1);
      }

      if(this.leaningLeft()){ //Se tiver passado da borda da esquerda ajusta-se para ficar em encostado a ela.
        let dif = -this.position.x
        this.resizeX(this.size.x - dif);
        this.setX(0);

        this.dragViewY(dif*relYX);
        this.resizeY(this.size.y - dif*relYX);
        touched_limits = true;
      }
      if(this.size.x < 0.1){
        this.dragViewX(this.size.x-0.1);
        this.resizeX(0.1);
      }

      if (this.size.x !== 0.1 && this.size.y !== 0.1 && !touched_limits) {
        this.setLastPosition(mX,mY);
      }
    }
  }

  mouseDragged(mX,mY) {
    let changeX = mX-this.lastPosition.x;
    let changeY = mY-this.lastPosition.y;
    let relXY = this.size.x / this.size.y;
    let relYX = this.size.y / this.size.x;

    if (this.isDragging) {
      this.dragViewX(changeX);
      this.dragViewY(changeY);
      this.setLastPosition(mX,mY);
      this.fixPosition()
    }
    else if(this.isResizing) {
      if(this.typeResizing === "RETA_DIREITA"){
        this.resizeRight(mX,mY,changeX);
      }
      else if(this.typeResizing === "RETA_BAIXO"){
        this.resizeDown(mX,mY,changeY);
      }
      else if(this.typeResizing === "RETA_ESQUERDA"){
        this.resizeLeft(mX,mY,changeX);
      }
      else if(this.typeResizing === "RETA_CIMA"){
        this.resizeTop(mX,mY,changeY);
      }
      else if(this.typeResizing === "CIRCULO_DIREITA_BAIXO"){ //RETA_BAIXO + RETA_DIREITA
        if(this.shift){
          this.resizeDownRight(mX,mY,changeX, changeY,relXY,relYX);
        }
        else{
          this.resizeRight(mX,mY,changeX);
          this.resizeDown(mX,mY,changeY);
        }
      }
      else if(this.typeResizing === "CIRCULO_DIREITA_CIMA"){ //RETA_CIMA + RETA_DIREITA
        if(this.shift){
          this.resizeTopRight(mX,mY,changeX,changeY,relXY,relYX);
        }
        else{
          this.resizeRight(mX,mY,changeX);
          this.resizeTop(mX,mY,changeY);
        }
      }
      else if(this.typeResizing === "CIRCULO_ESQUERDA_BAIXO"){ //RETA_BAIXO + RETA_ESQUERDA
        if(this.shift){
          this.resizeDownLeft(mX,mY,changeX,changeY,relXY,relYX);
        }
        else{
          this.resizeLeft(mX,mY,changeX);
          this.resizeDown(mX,mY,changeY);
        }
        
      }
      else if(this.typeResizing === "CIRCULO_ESQUERDA_CIMA"){ //RETA_CIMA + RETA_ESQUERDA
        if(this.shift){
          this.resizeTopLeft(mX,mY,changeX,changeY,relXY,relYX);
        }
        else{
          this.resizeLeft(mX,mY,changeX);
          this.resizeTop(mX,mY,changeY);
        }
      }
    }
  }

  mouseReleased(mX,mY) {
    if (this.isDragging || this.isResizing){
      this.isDragging = false;
      this.isResizing = false;
      return true;
    }
    return false;
  }
}

export class ViewSketch {
  constructor(id){
    this.id = id;
    this.draws = [];
  }

  draw(p5){
    p5.push();
    p5.noStroke();
    this.draws.forEach(draw => {
      draw.draw(p5);
    })
    p5.pop()
  }

  addDraw(draw){
    this.draws.push(draw);
  }

  mouseMoved(mX,mY) {}
  mousePressed(mX,mY) {}
  mouseDragged(mX,mY) {}
  mouseReleased(mX,mY) {}
}


export class DrawP5 {
  constructor(id){
    this.id = id;
  }

  draw(p5){
    // Abstract method to be implemented in subclasses
  }
}

export class Rect extends DrawP5 {
  constructor(id,x,y,w,h,tl,tr,br,bl){
    super(id);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.tl = tl;
    this.tr = tr;
    this.br = br;
    this.bl = bl;
  }

  draw(p5){
    p5.rect(this.x,this.y,this.w, this.h, this.tl,this.tr,this.br, this.bl);
  }
}


export class Quad extends DrawP5 {
  constructor(id,x1,y1,x2,y2,x3,y3,x4,y4){
    super(id);
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3;
    this.x4 = x4;
    this.y4 = y4;
  }

  draw(p5){
    p5.quad(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3, this.x4, this.y4);
  }
}

export class Square extends DrawP5 {
  constructor(id,x,y,s,tl,tr,br,bl){
    super(id);
    this.x = x;
    this.y = y;
    this.s = s;
    this.tl = tl;
    this.tr = tr;
    this.br = br;
    this.bl = bl;
  }

  draw(p5){
    p5.square(this.x, this.y, this.s, this.tl, this.tr, this.br, this.bl)
  }
}

export class Triangle extends DrawP5 {
  constructor(id,x1,y1,x2,y2,x3,y3){
    super(id);
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.x3 = x3;
    this.y3 = y3; 
  }

  draw(p5){
    p5.triangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3);
  }
}

export class Arc extends DrawP5 {
  constructor(id,x,y,w,h,start,stop,mode){
    super(id);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.start = start * (Math.PI/180);
    this.stop = stop * (Math.PI/180);
    this.mode = mode;
  }

  draw(p5){
    console.log(this.mode);
    if(this.mode !== 'default') {
      p5.arc(this.x, this.y, this.w, this.h, this.start, this.stop, this.mode);
    }
    else {
      p5.arc(this.x, this.y, this.w, this.h, this.start, this.stop);
    }
  }
}

export class Circle extends DrawP5 {
  constructor(id,x,y,d){
    super(id);
    this.x = x;
    this.y = y;
    this.d = d;
  }

  draw(p5){
    p5.circle(this.x, this.y, this.d);
  }
}

export class Ellipse extends DrawP5 {
  constructor(id,x,y,w,h){
    super(id);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  draw(p5){
    p5.ellipse(this.x, this.y, this.w, this.h);
  }
}

export class Line extends DrawP5 {
  constructor(id,x1,y1,x2,y2){
    super(id);
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }

  draw(p5){
    p5.line(this.x1, this.y1, this.x2, this.y2);
  }
}

export class Point extends DrawP5 {
  constructor(id,x,y){
    super(id);
    this.x = x;
    this.y = y;
  }

  draw(p5){
    p5.point(this.x, this.y);
  }
}

export class BeginClip extends DrawP5 {
  constructor(){
    super("BeginClip")
  }

  draw(p5){
    p5.beginClip();
  }
}

export class EndClip extends DrawP5 {
  constructor(){
    super("EndClip")
  }

  draw(p5){
    p5.endClip();
  }
}

export class Fill extends DrawP5 {
  constructor(hexcode, alpha){
    super("Fill");
    this.color = hexcode;
    this.alpha = alpha;
  }

  draw(p5){
    let color = p5.color(this.color);
    color.setAlpha(this.alpha);
    p5.fill(color);
  }
}

export class NoFill extends DrawP5 {
  constructor(){
    super("NoFill")
  }

  draw(p5){
    p5.noFill();
  }
}

export class Stroke extends DrawP5 {
  constructor(hexcode,w, alpha){
    super("Stroke");
    this.color = hexcode;
    this.w = w;
    this.alpha = alpha;

  }

  draw(p5){
    let color = p5.color(this.color);
    color.setAlpha(this.alpha);
    p5.stroke(color);
    p5.strokeWeight(this.w);
  }
}

export class NoStroke extends DrawP5 {
  constructor(){
    super("NoStroke")
  }

  draw(p5){
    p5.noStroke();
  }
}

export class Erase extends DrawP5 {
  constructor(){
    super("Erase")
  }

  draw(p5){
    p5.erase();
  }
}

export class NoErase extends DrawP5 {
  constructor(){
    super("NoErase")
  }

  draw(p5){
    p5.noErase();
  }
}