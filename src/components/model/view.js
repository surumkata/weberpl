import { HEIGHT, HEIGHT_INV, Position, WIDTH } from "./utils";

export class View {
  constructor(p5,id, srcImages, size, position, timeSprite, repeate) {
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
    let width = this.size.x;
    let height = this.size.y;
    let posX = this.position.x;
    let posY = this.position.y;
    let scaleX = 1;
    let scaleY = 1;
    if (width < 0){
      scaleX = -1;
      width = -width;
      posX = -posX;
    }
    if (height < 0){
      scaleY = -1;
      height = -height;
      posY = -posY;
    }
    p5.push();
    p5.scale(scaleX,scaleY);
    p5.image(this.images[this.currentSprite],posX,posY,width,height);
    p5.pop();
    if(this.hover){
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
    }
    

  }

  mouseMoved(e) {
    let mX = e.mouseX;
    let mY = e.mouseY;
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

  mousePressed(e) {
    let mX = e.mouseX;
    let mY = e.mouseY;
    if(this.circleCollision(mX,mY,this.position.x,this.position.y,11)){ //CIRCULO ESQUERDO CIMA
      this.isResizing = true
      this.lastPosition = new Position(mX,mY);
      this.typeResizing = "CIRCULO_ESQUERDA_CIMA"
    }
    else if(this.circleCollision(mX,mY,this.position.x+this.size.x,this.position.y,11)){ //CIRCULO DIREITA CIMA
      this.isResizing = true
      this.lastPosition = new Position(mX,mY);
      this.typeResizing = "CIRCULO_DIREITA_CIMA"
    }
    else if(this.circleCollision(mX,mY,this.position.x,this.position.y+this.size.y,11)){ //CIRCULO ESQUERDA BAIXO
      this.isResizing = true
      this.lastPosition = new Position(mX,mY);
      this.typeResizing = "CIRCULO_ESQUERDA_BAIXO"
    }
    else if(this.circleCollision(mX,mY,this.position.x+this.size.x,this.position.y+this.size.y,11)){ //CIRCULO DIREITA BAIXO
      this.isResizing = true
      this.lastPosition = new Position(mX,mY);
      this.typeResizing = "CIRCULO_DIREITA_BAIXO"
    }
    else if(this.lineCollision(mX,mY,this.position.x,this.position.y,this.position.x+this.size.x,this.position.y)){ //RETA CIMA
      this.isResizing = true
      this.lastPosition = new Position(mX,mY);
      this.typeResizing = "RETA_CIMA"
    }
    else if(this.lineCollision(mX,mY,this.position.x,this.position.y+this.size.y,this.position.x+this.size.x,this.position.y+this.size.y)){ //RETA BAIXO
      this.isResizing = true
      this.lastPosition = new Position(mX,mY);
      this.typeResizing = "RETA_BAIXO"
    }
    else if(this.lineCollision(mX,mY,this.position.x,this.position.y,this.position.x,this.position.y+this.size.y)){ //RETA ESQUERDA
      this.isResizing = true
      this.lastPosition = new Position(mX,mY);
      this.typeResizing = "RETA_ESQUERDA"
    }
    else if(this.lineCollision(mX,mY,this.position.x+this.size.x,this.position.y,this.position.x+this.size.x,this.position.y+this.size.y)){ //RETA DIREITA
      this.isResizing = true
      this.lastPosition = new Position(mX,mY);
      this.typeResizing = "RETA_DIREITA"
    }
    else if (this.viewCollision(mX,mY)){
      this.isDragging = true
      this.lastPosition = new Position(mX,mY);
    }
    return this.isDragging || this.isResizing;
  }

  fixPosition(scale){
    if(this.size.x >= 0){
      if (this.position.x + this.size.x >= WIDTH*scale){
        this.position.x = WIDTH*scale - this.size.x;
      }
      if (this.position.x <= 0){
        this.position.x = 0;
      }
    }
    else {
      if (this.position.x >= WIDTH*scale){
        this.position.x = WIDTH*scale;
      }
      if (this.position.x + this.size.x <= 0){
        this.position.x = -this.size.x;
      }
    }
    
    if(this.size.y >= 0){
      if (this.position.y + this.size.y >= (HEIGHT+HEIGHT_INV)*scale){
        this.position.y = (HEIGHT+HEIGHT_INV)*scale - this.size.y;
      }
      if (this.position.y <= HEIGHT_INV*scale){
        this.position.y = HEIGHT_INV*scale;
      }
    }
    else {
      if (this.position.y >= (HEIGHT+HEIGHT_INV)*scale){
        this.position.y = (HEIGHT+HEIGHT_INV)*scale;
      }
      if (this.position.y + this.size.y <= HEIGHT_INV*scale){
        this.position.y = -this.size.y + HEIGHT_INV*scale;
      }
    }
  }

  mouseDragged(e,scale) {
    let mX = e.mouseX;
    let mY = e.mouseY;
    if (this.isDragging) {
      this.position.x += mX-this.lastPosition.x;
      this.position.y += mY-this.lastPosition.y;
      this.lastPosition = new Position(mX,mY);
      this.fixPosition(scale)
    }
    else if(this.isResizing) {
      if(this.typeResizing === "RETA_DIREITA"){
        this.size.x += mX-this.lastPosition.x;
        this.lastPosition = new Position(mX,mY);
      }
      else if(this.typeResizing === "RETA_BAIXO"){
        this.size.y += mY-this.lastPosition.y;
        this.lastPosition = new Position(mX,mY);
      }
      else if(this.typeResizing === "RETA_ESQUERDA"){
        this.position.x += mX-this.lastPosition.x;
        this.size.x -= mX-this.lastPosition.x;
        this.lastPosition = new Position(mX,mY);
      }
      else if(this.typeResizing === "RETA_CIMA"){
        this.position.y += mY-this.lastPosition.y;
        this.size.y -= mY-this.lastPosition.y;
        this.lastPosition = new Position(mX,mY);
      }
      else if(this.typeResizing === "CIRCULO_DIREITA_BAIXO"){
        this.size.x += mX-this.lastPosition.x;
        this.size.y += mY-this.lastPosition.y;
        this.lastPosition = new Position(mX,mY);
      }
      else if(this.typeResizing === "CIRCULO_DIREITA_CIMA"){
        this.size.x += mX-this.lastPosition.x;
        this.position.y += mY-this.lastPosition.y;
        this.size.y -= mY-this.lastPosition.y;
        this.lastPosition = new Position(mX,mY);
      }
      else if(this.typeResizing === "CIRCULO_ESQUERDA_BAIXO"){
        this.position.x += mX-this.lastPosition.x;
        this.size.x -= mX-this.lastPosition.x;
        this.size.y += mY-this.lastPosition.y;
        this.lastPosition = new Position(mX,mY);
      }
      else if(this.typeResizing === "CIRCULO_ESQUERDA_CIMA"){
        this.position.x += mX-this.lastPosition.x;
        this.size.x -= mX-this.lastPosition.x;
        this.position.y += mY-this.lastPosition.y;
        this.size.y -= mY-this.lastPosition.y;
        this.lastPosition = new Position(mX,mY);
      }
    }
  }

  mouseReleased(e) {
    if (this.isDragging || this.isResizing){
      this.isDragging = false;
      this.isResizing = false;
      return true;
    }
    return false;
  }


}