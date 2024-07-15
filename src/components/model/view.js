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
    this.shift = false
    this.scaleX = 1
    this.scaleY = 1

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
    p5.push();
    p5.scale(this.scaleX,this.scaleY);
    p5.image(this.images[this.currentSprite],this.position.x*this.scaleX,this.position.y*this.scaleY,this.size.x,this.size.y);
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

  shiftPressed(){
    this.shift = true;
  }

  shiftReleased(){
    this.shift = false;
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
    console.log(this.typeResizing)
    return this.isDragging || this.isResizing;
  }

  leaningRight(scale){
    return this.position.x + this.size.x >= WIDTH*scale;
  }

  leaningLeft(){
    return this.position.x <= 0;
  }

  leaningDown(scale){
    return this.position.y + this.size.y >= (HEIGHT+HEIGHT_INV)*scale;
  }

  leaningTop(scale){
    return this.position.y <= HEIGHT_INV*scale;
  }

  fixPosition(scale){
    if(this.size.x >= 0){
      if (this.leaningRight(scale)){
        this.position.x = WIDTH*scale - this.size.x;
      }
      if (this.leaningLeft()){
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
      if (this.leaningDown(scale)){
        this.position.y = (HEIGHT+HEIGHT_INV)*scale - this.size.y;
      }
      if (this.leaningTop(scale)){
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

  resizeRight(mX,mY,changeX,scale){
    if(!(this.leaningRight(scale) && changeX > 0)){ //Não dou resize se tiver a tocar a borda da direita e o movimento for para a direita (changeX positivo)
      let touched_limits = false;
      
      this.resizeX(Math.max(0,this.size.x + changeX));
      if(this.leaningRight(scale)){
        this.resizeX(WIDTH*scale - this.position.x);
        touched_limits = true;
      }
      if (this.size.x != 0 && !touched_limits) {
        this.setLastPosition(mX,mY);
      }
    }
  }

  resizeDown(mX,mY,changeY,scale){
    if(!(this.leaningDown(scale) && changeY > 0)){ //Não dou resize se tiver a tocar a borda de baixo e o movimento for para baixo (changeY positivo)
      let touched_limits = false;
      this.resizeY(Math.max(0,this.size.y + changeY));
      if(this.leaningDown(scale)){ //Se tiver passado da borda de baixo ajusta-se para ficar em encostado a ela.
        this.resizeY((HEIGHT+HEIGHT_INV)*scale - this.position.y);
        touched_limits = true;
      }
      if (this.size.y != 0 && !touched_limits) {
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
      
      if (this.size.x != 0 && !touched_limits) {
        this.setLastPosition(mX,mY);
      }
    }
  }

  resizeTop(mX,mY,changeY,scale){
    if(!(this.leaningTop(scale) && changeY < 0)){ //Não dou resize se tiver a tocar a borda de cima e o movimento for para cima (changeY negativo).
      let touched_limits = false;
      this.dragViewY(changeY);
      this.resizeY(this.size.y - changeY);
      if (this.leaningTop(scale)){ //Se tiver passado da borda de cima ajusta-se para ficar em encostado a ela.
        this.resizeY(this.size.y - (HEIGHT_INV*scale - this.position.y));
        this.setY(HEIGHT_INV*scale);
        touched_limits = true;
      }
      
      if(this.size.y < 0){
        this.dragViewY(this.size.y);
        this.resizeY(0);
      }

      if (this.size.y != 0 && !touched_limits) {
        this.setLastPosition(mX,mY);
      }
    }
  }

  resizeDownRight(mX,mY,changeX, changeY, scale,relXY,relYX){
    if(!((this.leaningDown(scale) && changeY > 0) || (this.leaningRight(scale) && changeX > 0))){
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

      if(this.leaningDown(scale)){ //Se tiver passado da borda de baixo ajusta-se para ficar em encostado a ela.
        this.resizeY((HEIGHT+HEIGHT_INV)*scale - this.position.y);
        this.resizeX(this.size.y*relXY);
        touched_limits = true;
      }
      if(this.leaningRight(scale)){
        this.resizeX(WIDTH*scale - this.position.x);
        this.resizeY(this.size.x*relYX);
        touched_limits = true;
      }

      if (this.size.x != 0.1 && this.size.y != 0.1 && !touched_limits) {
        this.setLastPosition(mX,mY);
      }
    }
  }

  resizeTopRight(mX,mY,changeX, changeY, scale,relXY,relYX){
    if(!((this.leaningTop(scale) && changeY < 0) || (this.leaningRight() && changeX > 0))){
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


      if (this.leaningTop(scale)){ //Se tiver passado da borda de cima ajusta-se para ficar em encostado a ela.
        let dif = (HEIGHT_INV*scale - this.position.y);
        this.resizeY(this.size.y - dif);
        this.setY(HEIGHT_INV*scale);

        this.resizeX(this.size.x - dif*relXY);
        touched_limits = true;
      }

      if(this.size.y < 0.1){
        this.dragViewY(this.size.y-0.1);
        this.resizeY(0.1);
      }

      if(this.leaningRight(scale)){
        let dif = this.size.x - (WIDTH*scale - this.position.x)
        this.resizeX(WIDTH*scale - this.position.x);

        this.dragViewY(dif*relYX);
        this.resizeY(this.size.y - dif*relYX);
        touched_limits = true;
      }

      if (this.size.x != 0.1 && this.size.y != 0.1 && !touched_limits) {
        this.setLastPosition(mX,mY);
      }
    }
  }

  resizeDownLeft(mX,mY,changeX, changeY, scale,relXY,relYX){
    if(!((this.leaningDown(scale) && changeY > 0) || (this.leaningLeft(scale) && changeX < 0))){
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


      if(this.leaningDown(scale)){ //Se tiver passado da borda de baixo ajusta-se para ficar em encostado a ela.
        let dif = this.size.y - ((HEIGHT+HEIGHT_INV)*scale - this.position.y)
        this.resizeY((HEIGHT+HEIGHT_INV)*scale - this.position.y);

        
        this.dragViewX(dif*relXY);
        this.resizeX(this.size.x - dif*relXY);
        touched_limits = true;
      }
      if(this.leaningLeft()){ //Se tiver passado da borda da esquerda ajusta-se para ficar em encostado a ela.
        let dif = -this.position.x
        this.resizeX(this.size.x - dif);
        this.setX(0);

        //TODO:
        this.resizeY(this.size.y - dif*relYX);
        touched_limits = true;
      }

      

      if(this.size.x < 0.1){
        this.dragViewX(this.size.x-0.1);
        this.resizeX(0.1);
      }

      if (this.size.x != 0.1 && this.size.y != 0.1 && !touched_limits) {
        this.setLastPosition(mX,mY);
      }
    }
  }

  resizeTopLeft(mX,mY,changeX, changeY, scale,relXY,relYX){
    if(!((this.leaningTop(scale) && changeY < 0) || (this.leaningLeft() && changeX < 0))){
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

      if (this.leaningTop(scale)){ //Se tiver passado da borda de cima ajusta-se para ficar em encostado a ela.
        let dif = (HEIGHT_INV*scale - this.position.y);
        this.resizeY(this.size.y - dif);
        this.setY(HEIGHT_INV*scale);

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

      if (this.size.x != 0.1 && this.size.y != 0.1 && !touched_limits) {
        this.setLastPosition(mX,mY);
      }
    }
  }

  mouseDragged(e,scale) {
    let mX = e.mouseX;
    let mY = e.mouseY;
    let changeX = mX-this.lastPosition.x;
    let changeY = mY-this.lastPosition.y;
    let relXY = this.size.x / this.size.y;
    let relYX = this.size.y / this.size.x;

    if (this.isDragging) {
      this.dragViewX(changeX);
      this.dragViewY(changeY);
      this.setLastPosition(mX,mY);
      this.fixPosition(scale)
    }
    else if(this.isResizing) {
      if(this.typeResizing === "RETA_DIREITA"){
        this.resizeRight(mX,mY,changeX,scale);
      }
      else if(this.typeResizing === "RETA_BAIXO"){
        this.resizeDown(mX,mY,changeY,scale);
      }
      else if(this.typeResizing === "RETA_ESQUERDA"){
        this.resizeLeft(mX,mY,changeX);
      }
      else if(this.typeResizing === "RETA_CIMA"){
        this.resizeTop(mX,mY,changeY,scale);
      }
      else if(this.typeResizing === "CIRCULO_DIREITA_BAIXO"){ //RETA_BAIXO + RETA_DIREITA
        if(this.shift){
          this.resizeDownRight(mX,mY,changeX, changeY, scale,relXY,relYX);
        }
        else{
          this.resizeRight(mX,mY,changeX,scale);
          this.resizeDown(mX,mY,changeY,scale);
        }
      }
      else if(this.typeResizing === "CIRCULO_DIREITA_CIMA"){ //RETA_CIMA + RETA_DIREITA
        if(this.shift){
          this.resizeTopRight(mX,mY,changeX,changeY,scale,relXY,relYX);
        }
        else{
          this.resizeRight(mX,mY,changeX,scale);
          this.resizeTop(mX,mY,changeY,scale);
        }
      }
      else if(this.typeResizing === "CIRCULO_ESQUERDA_BAIXO"){ //RETA_BAIXO + RETA_ESQUERDA
        if(this.shift){
          this.resizeDownLeft(mX,mY,changeX,changeY,scale,relXY,relYX);
        }
        else{
          this.resizeLeft(mX,mY,changeX);
          this.resizeDown(mX,mY,changeY,scale);
        }
        
      }
      else if(this.typeResizing === "CIRCULO_ESQUERDA_CIMA"){ //RETA_CIMA + RETA_ESQUERDA
        if(this.shift){
          this.resizeTopLeft(mX,mY,changeX,changeY,scale,relXY,relYX);
        }
        else{
          this.resizeLeft(mX,mY,changeX);
          this.resizeTop(mX,mY,changeY,scale);
        }
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