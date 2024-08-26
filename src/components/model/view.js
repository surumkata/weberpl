import { HEIGHT, HEIGHT_INV, Position, WIDTH, SCALE_EDIT } from "./utils";
import { collidePointCircle, collidePointEllipse, collidePointLine, collidePointPoint, collidePointPoly, collidePointRect, collidePointTriangle } from "p5collide";
//import { Hitbox, HitboxRect } from "./hitbox";

export class View {
  constructor(p5,id, srcImages, size, position, timeSprite, repeate,turn,hitboxes) {
    this.id = id;
    this.position = position;
    this.size = size;
    this.srcImages = srcImages;
    this.timeSprite = timeSprite;
    this.repeate = repeate;
    this.images = [];
    this.currentSprite = 0;
    this.currentTimeSprite = 0;
    this.repeateInit = repeate;
    this.repeate = this.repeateInit;
    this.turnX = turn.x;
    this.turnY = turn.y;
    this.hitboxes = hitboxes;
    this.hover = false;
    this.rect = new Rect(id,this.position.x,this.position.y,this.size.x,this.size.y,0,0,0,0);

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

  collide(px,py){
    var collide = false;
    this.hitboxes.forEach(hitbox => {
      collide = collide || hitbox.collide(px,py);
    })
    return collide;
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

  drawHitbox(p5){
    this.hitboxes.forEach(hitbox => {
      hitbox.draw(p5);
    })
  }

  draw(p5, semi_opacity =false){
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
    if(semi_opacity){
      p5.tint(255, 127);
    }
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
  mouseMoved(mX,mY) {
    if(this.rect.mouseMoved(mX,mY)){
      this.hover = true;
    }
    else {
      this.hover = false;
    }
    return this.hover;
  }
  mousePressed(mX,mY) {
    return this.rect.mousePressed(mX,mY);
  }
  mouseDragged(mX,mY) {
    this.rect.mouseDragged(mX,mY);
    this.position.x = this.rect.x;
    this.position.y = this.rect.y;
    this.size.x = this.rect.w;
    this.size.y = this.rect.h;
  }
  mouseReleased(mX,mY) {
    return this.rect.mouseReleased(mX,mY);
  }
  shiftReleased(){
    this.rect.shiftReleased();
  }
}

export class ViewSketch {
  constructor(id){
    this.id = id;
    this.draws = [];
  }

  draw(p5, semi_opacity=false){
    p5.push();
    p5.noStroke();
    p5.fill(0);
    if(semi_opacity){
      p5.fill(0, 127);
    }
    this.draws.forEach(draw => {
      draw.draw(p5,semi_opacity);
    })
    p5.pop()
  }

  drawHitbox(p5){
    this.hitboxes.forEach(hitbox => {
      hitbox.draw(p5);
    })
  }

  addDraw(draw){
    this.draws.push(draw);
  }

  mouseMoved(mX,mY) {
    let hover = false;
    for (var draw in this.draws){
      if(hover){
        this.draws[draw].setHoverFalse();
      }
      else {
        hover = this.draws[draw].mouseMoved(mX,mY);
      }
    }
    return hover;
  }
  mousePressed(mX,mY) {
    for (var draw in this.draws){
      var pressed = this.draws[draw].mousePressed(mX,mY);
      if(pressed){
        return true;
      }
    }
  }
  mouseDragged(mX,mY) {
    for (var draw in this.draws){
      this.draws[draw].mouseDragged(mX,mY);
    }
  }

  mouseReleased(mX,mY) {
    for (var draw in this.draws){
      var released = this.draws[draw].mousePressed(mX,mY);
      if(released){
        return true;
      }
    }
  }

  shiftReleased(){
    for (var draw in this.draws){
      this.draws[draw].shiftReleased();
    }
  }
}


export class DrawP5 {
  constructor(id){
    this.id = id;
    this.hover = false;
  }

  draw(p5){
    // Abstract method to be implemented in subclasses
  }

  mouseMoved(mX,mY) {return false;}
  mousePressed(mX,mY) {return false;}
  mouseDragged(mX,mY) {}
  mouseReleased(mX,mY) {return false;}
  shiftReleased(){}
  setHoverFalse(){
    this.hover = false;
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
    this.hover = false;
    this.isDragging = false;
    this.isResizing = false;
    this.lastPosition = new Position(0,0);
    this.typeResizing = "";
    this.hover = false;
    this.shift = false;
  }

  draw(p5){
    p5.rect(this.x,this.y,this.w, this.h, this.tl,this.tr,this.br, this.bl);

    if(this.hover){
      p5.push();
      p5.stroke(255,0,0);
      p5.strokeWeight(2);
      p5.fill(100,100,100,0);
      p5.rect(this.x,this.y,this.w,this.h);
      p5.fill(255,0,0);
      p5.noStroke();
      p5.circle(this.x,this.y,10);
      p5.circle(this.x+this.w,this.y,10);
      p5.circle(this.x,this.y+this.h,10);
      p5.circle(this.x+this.w,this.y+this.h,10);
      p5.pop();
    }
  }

  
  mouseMoved(mX,mY) {
    let width = this.w;
    let height = this.h;
    let posX = this.x;
    let posY = this.y;
    if (width < 0){
      posX += width;
      width = -width;
    }
    if (height < 0){
      posY += height;
      height = -height;
    }
    if(collidePointCircle(mX,mY,posX,posY,11)){
      this.hover = true
      document.documentElement.style.cursor = 'nwse-resize';
    }
    else if(collidePointCircle(mX,mY,posX+width,posY,11)){
      this.hover = true
      document.documentElement.style.cursor = 'nesw-resize';
    }
    else if(collidePointCircle(mX,mY,posX,posY+height,11)){
      this.hover = true
      document.documentElement.style.cursor = 'nesw-resize';
    }
    else if(collidePointCircle(mX,mY,posX+width,posY+height,11)){
      this.hover = true
      document.documentElement.style.cursor = 'nwse-resize';
    }
    else if(collidePointLine(mX,mY,posX,posY,posX+width,posY)){
      this.hover = true
      document.documentElement.style.cursor = 'ns-resize';
    }
    else if(collidePointLine(mX,mY,posX,posY+height,posX+width,posY+height)){
      this.hover = true
      document.documentElement.style.cursor = 'ns-resize';
    }
    else if(collidePointLine(mX,mY,posX,posY,posX,posY+height)){
      this.hover = true
      document.documentElement.style.cursor = 'ew-resize';
    }
    else if(collidePointLine(mX,mY,posX+width,posY,posX+width,posY+height)){
      this.hover = true
      document.documentElement.style.cursor = 'ew-resize';
    }
    else if (collidePointRect(mX,mY,posX,posY,width,height)){
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
    if(collidePointCircle(mX,mY,this.x,this.y,11)){ //CIRCULO ESQUERDO CIMA
      this.isResizing = true
      this.setLastPosition(mX,mY);
      this.typeResizing = "CIRCULO_ESQUERDA_CIMA"
    }
    else if(collidePointCircle(mX,mY,this.x+this.w,this.y,11)){ //CIRCULO DIREITA CIMA
      this.isResizing = true
      this.setLastPosition(mX,mY);
      this.typeResizing = "CIRCULO_DIREITA_CIMA"
    }
    else if(collidePointCircle(mX,mY,this.x,this.y+this.h,11)){ //CIRCULO ESQUERDA BAIXO
      this.isResizing = true
      this.setLastPosition(mX,mY);
      this.typeResizing = "CIRCULO_ESQUERDA_BAIXO"
    }
    else if(collidePointCircle(mX,mY,this.x+this.w,this.y+this.h,11)){ //CIRCULO DIREITA BAIXO
      this.isResizing = true
      this.setLastPosition(mX,mY);
      this.typeResizing = "CIRCULO_DIREITA_BAIXO"
    }
    else if(collidePointLine(mX,mY,this.x,this.y,this.x+this.w,this.y)){ //RETA CIMA
      this.isResizing = true
      this.setLastPosition(mX,mY);
      this.typeResizing = "RETA_CIMA"
    }
    else if(collidePointLine(mX,mY,this.x,this.y+this.h,this.x+this.w,this.y+this.h)){ //RETA BAIXO
      this.isResizing = true
      this.setLastPosition(mX,mY);
      this.typeResizing = "RETA_BAIXO"
    }
    else if(collidePointLine(mX,mY,this.x,this.y,this.x,this.y+this.h)){ //RETA ESQUERDA
      this.isResizing = true
      this.setLastPosition(mX,mY);
      this.typeResizing = "RETA_ESQUERDA"
    }
    else if(collidePointLine(mX,mY,this.x+this.w,this.y,this.x+this.w,this.y+this.h)){ //RETA DIREITA
      this.isResizing = true
      this.setLastPosition(mX,mY);
      this.typeResizing = "RETA_DIREITA"
    }
    else if (collidePointRect(mX,mY,this.x,this.y,this.w,this.h)){
      this.isDragging = true
      this.setLastPosition(mX,mY);
    }
    return this.isDragging || this.isResizing;
  }

  leaningRight(){
    return this.x + this.w >= WIDTH*SCALE_EDIT;
  }

  leaningLeft(){
    return this.x <= 0;
  }

  leaningDown(){
    return this.y + this.h >= (HEIGHT+HEIGHT_INV)*SCALE_EDIT;
  }

  leaningTop(){
    return this.y <= HEIGHT_INV*SCALE_EDIT;
  }

  fixPosition(){
    if(this.w >= 0){
      if (this.leaningRight()){
        this.x = WIDTH*SCALE_EDIT - this.w;
      }
      if (this.leaningLeft()){
        this.x = 0;
      }
    }
    else {
      if (this.x >= WIDTH*SCALE_EDIT){
        this.x = WIDTH*SCALE_EDIT;
      }
      if (this.x + this.w <= 0){
        this.x = -this.w;
      }
    }
    
    if(this.h >= 0){
      if (this.leaningDown()){
        this.y = (HEIGHT+HEIGHT_INV)*SCALE_EDIT - this.h;
      }
      if (this.leaningTop()){
        this.y = HEIGHT_INV*SCALE_EDIT;
      }
    }
    else {
      if (this.y >= (HEIGHT+HEIGHT_INV)*SCALE_EDIT){
        this.y = (HEIGHT+HEIGHT_INV)*SCALE_EDIT;
      }
      if (this.y + this.h <= HEIGHT_INV*SCALE_EDIT){
        this.y = -this.h + HEIGHT_INV*SCALE_EDIT;
      }
    }
  }

  setLastPosition(x,y){
    this.lastPosition = new Position(x,y);
  }

  setX(x){
    this.x = x;
  }

  setY(y){
    this.y = y;
  }

  dragViewX(x){
    this.x += x;
  }

  dragViewY(y){
    this.y += y;
  }

  resizeX(x){
    this.w = x;
  }

  resizeY(y){
    this.h = y;
  }

  resizeRight(mX,mY,changeX){
    if(!(this.leaningRight() && changeX > 0)){ //Não dou resize se tiver a tocar a borda da direita e o movimento for para a direita (changeX positivo)
      let touched_limits = false;
      
      this.resizeX(Math.max(0,this.w + changeX));
      if(this.leaningRight()){
        this.resizeX(WIDTH*SCALE_EDIT - this.x);
        touched_limits = true;
      }
      if (this.w !== 0 && !touched_limits) {
        this.setLastPosition(mX,mY);
      }
    }
  }

  resizeDown(mX,mY,changeY){
    if(!(this.leaningDown() && changeY > 0)){ //Não dou resize se tiver a tocar a borda de baixo e o movimento for para baixo (changeY positivo)
      let touched_limits = false;
      this.resizeY(Math.max(0,this.h + changeY));
      if(this.leaningDown()){ //Se tiver passado da borda de baixo ajusta-se para ficar em encostado a ela.
        this.resizeY((HEIGHT+HEIGHT_INV)*SCALE_EDIT - this.y);
        touched_limits = true;
      }
      if (this.h !== 0 && !touched_limits) {
        this.setLastPosition(mX,mY);
      }
    }
  }

  resizeLeft(mX,mY,changeX){
    if(!(this.leaningLeft() && changeX < 0)){ //Não dou resize se tiver a tocar a borda da esquerda e o movimento for para a esquerda (changeX negativo)
      let touched_limits = false;
      this.dragViewX(changeX);
      this.resizeX(this.w - changeX);
      if(this.leaningLeft()){ //Se tiver passado da borda da esquerda ajusta-se para ficar em encostado a ela.
        this.resizeX(this.w + this.x);
        this.setX(0);
        touched_limits = true;
      }
      if(this.w < 0){
        this.dragViewX(this.w);
        this.resizeX(0);
      }
      
      if (this.w !== 0 && !touched_limits) {
        this.setLastPosition(mX,mY);
      }
    }
  }

  resizeTop(mX,mY,changeY){
    if(!(this.leaningTop() && changeY < 0)){ //Não dou resize se tiver a tocar a borda de cima e o movimento for para cima (changeY negativo).
      let touched_limits = false;
      this.dragViewY(changeY);
      this.resizeY(this.h - changeY);
      if (this.leaningTop()){ //Se tiver passado da borda de cima ajusta-se para ficar em encostado a ela.
        this.resizeY(this.h - (HEIGHT_INV*SCALE_EDIT - this.y));
        this.setY(HEIGHT_INV*SCALE_EDIT);
        touched_limits = true;
      }
      
      if(this.h < 0){
        this.dragViewY(this.h);
        this.resizeY(0);
      }

      if (this.h !== 0 && !touched_limits) {
        this.setLastPosition(mX,mY);
      }
    }
  }

  resizeDownRight(mX,mY,changeX, changeY,relXY,relYX){
    if(!((this.leaningDown() && changeY > 0) || (this.leaningRight() && changeX > 0))){
      let touched_limits = false;
      if(relXY > relYX){
        //right
        this.resizeX(Math.max(0.1,this.w + changeY*relXY));
        //down
        this.resizeY(Math.max(0.1,this.h + changeY));
      }
      else{
        //right
        this.resizeX(Math.max(0.1,this.w + changeX));
        //down
        this.resizeY(Math.max(0.1,this.h + changeX*relYX));
      }

      if(this.leaningDown()){ //Se tiver passado da borda de baixo ajusta-se para ficar em encostado a ela.
        this.resizeY((HEIGHT+HEIGHT_INV)*SCALE_EDIT - this.y);
        this.resizeX(this.h*relXY);
        touched_limits = true;
      }
      if(this.leaningRight()){
        this.resizeX(WIDTH*SCALE_EDIT - this.x);
        this.resizeY(this.w*relYX);
        touched_limits = true;
      }

      if (this.w !== 0.1 && this.h !== 0.1 && !touched_limits) {
        this.setLastPosition(mX,mY);
      }
    }
  }

  resizeTopRight(mX,mY,changeX, changeY,relXY,relYX){
    if(!((this.leaningTop() && changeY < 0) || (this.leaningRight() && changeX > 0))){
      let touched_limits = false;
      if(relXY > relYX){
        //right
        this.resizeX(Math.max(0.1,this.w - changeY*relXY));
        //top
        this.dragViewY(changeY);
        this.resizeY(this.h - changeY);
      }
      else{
        //right
        this.resizeX(Math.max(0.1,this.w + changeX));
        //top
        this.dragViewY(-changeX*relYX);
        this.resizeY(this.h + changeX*relYX);
      }


      if (this.leaningTop()){ //Se tiver passado da borda de cima ajusta-se para ficar em encostado a ela.
        let dif = (HEIGHT_INV*SCALE_EDIT - this.y);
        this.resizeY(this.h - dif);
        this.setY(HEIGHT_INV*SCALE_EDIT);

        this.resizeX(this.w - dif*relXY);
        touched_limits = true;
      }

      if(this.h < 0.1){
        this.dragViewY(this.h-0.1);
        this.resizeY(0.1);
      }

      if(this.leaningRight()){
        let dif = this.w - (WIDTH*SCALE_EDIT - this.x)
        this.resizeX(WIDTH*SCALE_EDIT - this.x);

        this.dragViewY(dif*relYX);
        this.resizeY(this.h - dif*relYX);
        touched_limits = true;
      }

      if (this.w !== 0.1 && this.h !== 0.1 && !touched_limits) {
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
        this.resizeX(this.w + changeY*relXY);
        //down
        this.resizeY(Math.max(0.1,this.h + changeY));
      }
      else{
        //left
        this.dragViewX(changeX);
        this.resizeX(this.w - changeX);
        //down
        this.resizeY(Math.max(0.1,this.h - changeX*relYX));
      }


      if(this.leaningDown()){ //Se tiver passado da borda de baixo ajusta-se para ficar em encostado a ela.
        let dif = this.h - ((HEIGHT+HEIGHT_INV)*SCALE_EDIT - this.y)
        this.resizeY((HEIGHT+HEIGHT_INV)*SCALE_EDIT - this.y);

        
        this.dragViewX(dif*relXY);
        this.resizeX(this.w - dif*relXY);
        touched_limits = true;
      }
      if(this.leaningLeft()){ //Se tiver passado da borda da esquerda ajusta-se para ficar em encostado a ela.
        let dif = -this.x
        this.resizeX(this.w - dif);
        this.setX(0);

        this.resizeY(this.h - dif*relYX);
        touched_limits = true;
      }

      

      if(this.w < 0.1){
        this.dragViewX(this.w-0.1);
        this.resizeX(0.1);
      }

      if (this.w !== 0.1 && this.h !== 0.1 && !touched_limits) {
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
        this.resizeX(this.w - changeY*relXY);
        //top
        this.dragViewY(changeY);
        this.resizeY(this.h - changeY);
      }
      else{
        //left
        this.dragViewX(changeX);
        this.resizeX(this.w - changeX);
        //top
        this.dragViewY(changeX*relYX);
        this.resizeY(this.h - changeX*relYX);
      }

      if (this.leaningTop()){ //Se tiver passado da borda de cima ajusta-se para ficar em encostado a ela.
        let dif = (HEIGHT_INV*SCALE_EDIT - this.y);
        this.resizeY(this.h - dif);
        this.setY(HEIGHT_INV*SCALE_EDIT);

        this.dragViewX(dif*relXY);
        this.resizeX(this.w - dif*relXY);
        touched_limits = true;
      }
      
      if(this.h < 0.1){
        this.dragViewY(this.h-0.1);
        this.resizeY(0.1);
      }

      if(this.leaningLeft()){ //Se tiver passado da borda da esquerda ajusta-se para ficar em encostado a ela.
        let dif = -this.x
        this.resizeX(this.w - dif);
        this.setX(0);

        this.dragViewY(dif*relYX);
        this.resizeY(this.h - dif*relYX);
        touched_limits = true;
      }
      if(this.w < 0.1){
        this.dragViewX(this.w-0.1);
        this.resizeX(0.1);
      }

      if (this.w !== 0.1 && this.h !== 0.1 && !touched_limits) {
        this.setLastPosition(mX,mY);
      }
    }
  }

  mouseDragged(mX,mY) {
    let changeX = mX-this.lastPosition.x;
    let changeY = mY-this.lastPosition.y;
    let relXY = this.w / this.h;
    let relYX = this.h / this.w;

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
    this.vertices = [
      {x:x1,y:y1},
      {x:x2,y:y2},
      {x:x3,y:y3},
      {x:x4,y:y4},
    ]
    this.hover = false;
    this.pressed = false;
    this.typePressed = null;
    this.lastPosition = new Position(0,0);
  }

  draw(p5){
    p5.quad(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3, this.x4, this.y4);
    if(this.hover){
      p5.push();
      p5.fill(255,0,0);
      p5.noStroke();
      p5.circle(this.x1,this.y1,10);
      p5.circle(this.x2,this.y2,10);
      p5.circle(this.x3,this.y3,10);
      p5.circle(this.x4,this.y4,10);
      p5.pop();
    }
  }

  mouseMoved(mX,mY) {
    if(collidePointCircle(mX,mY,this.x1,this.y1,11)){
      this.hover = true
      document.documentElement.style.cursor = 'grab';
    }
    else if(collidePointCircle(mX,mY,this.x2,this.y2,11)){
      this.hover = true
      document.documentElement.style.cursor = 'grab';
    }
    else if(collidePointCircle(mX,mY,this.x3,this.y3,11)){
      this.hover = true
      document.documentElement.style.cursor = 'grab';
    }
    else if(collidePointCircle(mX,mY,this.x4,this.y4,11)){
      this.hover = true
      document.documentElement.style.cursor = 'grab';
    }
    else if (collidePointPoly(mX,mY,this.vertices)){
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
    if(collidePointCircle(mX,mY,this.x1,this.y1,11)){
      document.documentElement.style.cursor = 'grabbing';
      this.pressed = true;
      this.typePressed = "point1"
    }
    else if(collidePointCircle(mX,mY,this.x2,this.y2,11)){
      document.documentElement.style.cursor = 'grabbing';
      this.pressed = true;
      this.typePressed = "point2"
    }
    else if(collidePointCircle(mX,mY,this.x3,this.y3,11)){
      document.documentElement.style.cursor = 'grabbing';
      this.pressed = true;
      this.typePressed = "point3"
    }
    else if(collidePointCircle(mX,mY,this.x4,this.y4,11)){
      document.documentElement.style.cursor = 'grabbing';
      this.pressed = true;
      this.typePressed = "point4"
    }
    else if (collidePointPoly(mX,mY,this.vertices)){
      this.pressed = true;
      this.typePressed = "quad"
    }
    if(this.pressed){
      this.lastPosition = new Position(mX,mY);
    }
    return this.pressed;
  }

  mouseDragged(mX,mY) {
    let changeX = mX-this.lastPosition.x;
    let changeY = mY-this.lastPosition.y;

    if (this.pressed) {
      switch(this.typePressed){
        case "point1":
          this.x1 += changeX;
          this.y1 += changeY;
          break;
        case "point2":
          this.x2 += changeX;
          this.y2 += changeY;
          break;
        case "point3":
          this.x3 += changeX;
          this.y3 += changeY;
          break;
        case "point4":
          this.x4 += changeX;
          this.y4 += changeY;
          break;
        default:
          this.x1 += changeX;
          this.y1 += changeY;
          this.x2 += changeX;
          this.y2 += changeY;
          this.x3 += changeX;
          this.y3 += changeY;
          this.x4 += changeX;
          this.y4 += changeY;
          break;
      }
      this.vertices = [
        {x:this.x1,y:this.y1},
        {x:this.x2,y:this.y2},
        {x:this.x3,y:this.y3},
        {x:this.x4,y:this.y4},
      ];
      this.lastPosition = new Position(mX,mY);
    }
  }

  mouseReleased(mX,mY) {
    if (this.pressed){
      this.pressed = false;
      this.typePressed = null;
      return true;
    }
    return false;
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
    this.hover = false;
    this.pressed = false;
    this.typePressed = null;
    this.lastPosition = new Position(0,0);
  }

  draw(p5){
    p5.triangle(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3);
    if(this.hover){
      p5.push();
      p5.fill(255,0,0);
      p5.noStroke();
      p5.circle(this.x1,this.y1,10);
      p5.circle(this.x2,this.y2,10);
      p5.circle(this.x3,this.y3,10);
      p5.pop();
    }
  }

  mouseMoved(mX,mY) {
    if(collidePointCircle(mX,mY,this.x1,this.y1,11)){
      this.hover = true
      document.documentElement.style.cursor = 'grab';
    }
    else if(collidePointCircle(mX,mY,this.x2,this.y2,11)){
      this.hover = true
      document.documentElement.style.cursor = 'grab';
    }
    else if(collidePointCircle(mX,mY,this.x3,this.y3,11)){
      this.hover = true
      document.documentElement.style.cursor = 'grab';
    }
    else if (collidePointTriangle(mX,mY,this.x1,this.y1,this.x2,this.y2,this.x3,this.y3)){
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
    if(collidePointCircle(mX,mY,this.x1,this.y1,11)){
      document.documentElement.style.cursor = 'grabbing';
      this.pressed = true;
      this.typePressed = "point1"
    }
    else if(collidePointCircle(mX,mY,this.x2,this.y2,11)){
      document.documentElement.style.cursor = 'grabbing';
      this.pressed = true;
      this.typePressed = "point2"
    }
    else if(collidePointCircle(mX,mY,this.x3,this.y3,11)){
      document.documentElement.style.cursor = 'grabbing';
      this.pressed = true;
      this.typePressed = "point3"
    }
    else if (collidePointTriangle(mX,mY,this.x1,this.y1,this.x2,this.y2,this.x3,this.y3)){
      this.pressed = true;
      this.typePressed = "triangle"
    }
    if(this.pressed){
      this.lastPosition = new Position(mX,mY);
    }
    return this.pressed;
  }

  mouseDragged(mX,mY) {
    let changeX = mX-this.lastPosition.x;
    let changeY = mY-this.lastPosition.y;

    if (this.pressed) {
      switch(this.typePressed){
        case "point1":
          this.x1 += changeX;
          this.y1 += changeY;
          break;
        case "point2":
          this.x2 += changeX;
          this.y2 += changeY;
          break;
        case "point3":
          this.x3 += changeX;
          this.y3 += changeY;
          break;
        default:
          this.x1 += changeX;
          this.y1 += changeY;
          this.x2 += changeX;
          this.y2 += changeY;
          this.x3 += changeX;
          this.y3 += changeY;
          break;
      }
      this.lastPosition = new Position(mX,mY);
    }
  }

  mouseReleased(mX,mY) {
    if (this.pressed){
      this.pressed = false;
      this.typePressed = null;
      return true;
    }
    return false;
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
    this.hover = false;
    this.pressed = false;
    this.typePressed = null;
    this.lastPosition = new Position(0,0);
  }

  draw(p5){
    p5.circle(this.x, this.y, this.d);
    if(this.hover){
      p5.push();
      p5.fill(255,0,0);
      p5.noStroke();
      p5.circle(this.x+this.d/2,this.y,10);
      p5.circle(this.x,this.y+this.d/2,10);
      p5.circle(this.x-this.d/2,this.y,10);
      p5.circle(this.x,this.y-this.d/2,10);
      p5.stroke(255,0,0);
      p5.strokeWeight(2);
      p5.line(this.x,this.y,this.x+this.d/2,this.y);
      p5.line(this.x,this.y,this.x,this.y+this.d/2);
      p5.line(this.x,this.y,this.x-this.d/2,this.y);
      p5.line(this.x,this.y,this.x,this.y-this.d/2);
      p5.pop();
    }
  }

  mouseMoved(mX,mY) {
    if(collidePointCircle(mX,mY,this.x+this.d/2,this.y,11)){
      this.hover = true
      document.documentElement.style.cursor = 'grab';
    }
    else if(collidePointCircle(mX,mY,this.x,this.y+this.d/2,11)){
      this.hover = true
      document.documentElement.style.cursor = 'grab';
    }
    else if(collidePointCircle(mX,mY,this.x-this.d/2,this.y,11)){
      this.hover = true
      document.documentElement.style.cursor = 'grab';
    }
    else if(collidePointCircle(mX,mY,this.x,this.y-this.d/2,11)){
      this.hover = true
      document.documentElement.style.cursor = 'grab';
    }
    else if (collidePointCircle(mX,mY,this.x,this.y,this.d)){
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
    if(collidePointCircle(mX,mY,this.x+this.d/2,this.y,11)){
      document.documentElement.style.cursor = 'grabbing';
      this.pressed = true;
      this.typePressed = "width"
    }
    else if(collidePointCircle(mX,mY,this.x,this.y+this.d/2,11)){
      document.documentElement.style.cursor = 'grabbing';
      this.pressed = true;
      this.typePressed = "height"
    }
    else if(collidePointCircle(mX,mY,this.x-this.d/2,this.y,11)){
      document.documentElement.style.cursor = 'grabbing';
      this.pressed = true;
      this.typePressed = "-width"
    }
    else if(collidePointCircle(mX,mY,this.x,this.y-this.d/2,11)){
      document.documentElement.style.cursor = 'grabbing';
      this.pressed = true;
      this.typePressed = "-height"
    }
    else if (collidePointCircle(mX,mY,this.x,this.y,this.d)){
      this.pressed = true;
      this.typePressed = "circle"
    }
    if(this.pressed){
      this.lastPosition = new Position(mX,mY);
    }
    return this.pressed;
  }

  mouseDragged(mX,mY) {
    let changeX = mX-this.lastPosition.x;
    let changeY = mY-this.lastPosition.y;

    if (this.pressed) {
      switch(this.typePressed){
        case "width":
          this.d += changeX;
          break;
        case "height":
          this.d += changeY;
          break;
        case "-width":
          this.d -= changeX;
          break;
        case "-height":
          this.d -= changeY;
          break;
        default:
          this.x += changeX;
          this.y += changeY;
          break;
      }
      this.lastPosition = new Position(mX,mY);
    }
  }

  mouseReleased(mX,mY) {
    if (this.pressed){
      this.pressed = false;
      this.typePressed = null;
      return true;
    }
    return false;
  }
}

export class Ellipse extends DrawP5 {
  constructor(id,x,y,w,h){
    super(id);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.hover = false;
    this.pressed = false;
    this.typePressed = null;
    this.lastPosition = new Position(0,0);
  }

  draw(p5){
    p5.ellipse(this.x, this.y, this.w, this.h);
    if(this.hover){
      p5.push();
      p5.fill(255,0,0);
      p5.noStroke();
      p5.circle(this.x+this.w/2,this.y,10);
      p5.circle(this.x,this.y+this.h/2,10);
      p5.circle(this.x-this.w/2,this.y,10);
      p5.circle(this.x,this.y-this.h/2,10);
      p5.stroke(255,0,0);
      p5.strokeWeight(2);
      p5.line(this.x,this.y,this.x+this.w/2,this.y);
      p5.line(this.x,this.y,this.x,this.y+this.h/2);
      p5.line(this.x,this.y,this.x-this.w/2,this.y);
      p5.line(this.x,this.y,this.x,this.y-this.h/2);
      p5.pop();
    }
  }

  mouseMoved(mX,mY) {
    if(collidePointCircle(mX,mY,this.x+this.w/2,this.y,11)){
      this.hover = true
      document.documentElement.style.cursor = 'grab';
    }
    else if(collidePointCircle(mX,mY,this.x,this.y+this.h/2,11)){
      this.hover = true
      document.documentElement.style.cursor = 'grab';
    }
    else if(collidePointCircle(mX,mY,this.x-this.w/2,this.y,11)){
      this.hover = true
      document.documentElement.style.cursor = 'grab';
    }
    else if(collidePointCircle(mX,mY,this.x,this.y-this.h/2,11)){
      this.hover = true
      document.documentElement.style.cursor = 'grab';
    }
    else if (collidePointEllipse(mX,mY,this.x,this.y,this.w,this.h)){
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
    if(collidePointCircle(mX,mY,this.x+this.w/2,this.y,11)){
      document.documentElement.style.cursor = 'grabbing';
      this.pressed = true;
      this.typePressed = "width"
    }
    else if(collidePointCircle(mX,mY,this.x,this.y+this.h/2,11)){
      document.documentElement.style.cursor = 'grabbing';
      this.pressed = true;
      this.typePressed = "height"
    }
    else if(collidePointCircle(mX,mY,this.x-this.w/2,this.y,11)){
      document.documentElement.style.cursor = 'grabbing';
      this.pressed = true;
      this.typePressed = "-width"
    }
    else if(collidePointCircle(mX,mY,this.x,this.y-this.h/2,11)){
      document.documentElement.style.cursor = 'grabbing';
      this.pressed = true;
      this.typePressed = "-height"
    }
    else if (collidePointEllipse(mX,mY,this.x,this.y,this.w,this.h)){
      this.pressed = true;
      this.typePressed = "ellipse"
    }
    if(this.pressed){
      this.lastPosition = new Position(mX,mY);
    }
    return this.pressed;
  }

  mouseDragged(mX,mY) {
    let changeX = mX-this.lastPosition.x;
    let changeY = mY-this.lastPosition.y;

    if (this.pressed) {
      switch(this.typePressed){
        case "width":
          this.w += changeX;
          break;
        case "height":
          this.h += changeY;
          break;
        case "-width":
          this.w -= changeX;
          break;
        case "-height":
          this.h -= changeY;
          break;
        default:
          this.x += changeX;
          this.y += changeY;
          break;
      }
      this.lastPosition = new Position(mX,mY);
    }
  }

  mouseReleased(mX,mY) {
    if (this.pressed){
      this.pressed = false;
      this.typePressed = null;
      return true;
    }
    return false;
  }

}

export class Line extends DrawP5 {
  constructor(id,x1,y1,x2,y2){
    super(id);
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.hover = false;
    this.pressed = false;
    this.typePressed = null;
    this.lastPosition = new Position(0,0);
  }

  draw(p5){
    p5.line(this.x1, this.y1, this.x2, this.y2);
    if(this.hover){
      p5.push();
      p5.fill(255,0,0);
      p5.noStroke();
      p5.circle(this.x1,this.y1,10);
      p5.circle(this.x2,this.y2,10);
      p5.pop();
    }
  }

  mouseMoved(mX,mY) {
    if(collidePointCircle(mX,mY,this.x1,this.y1,11)){
      this.hover = true
      document.documentElement.style.cursor = 'grab';
    }
    else if(collidePointCircle(mX,mY,this.x2,this.y2,11)){
      this.hover = true
      document.documentElement.style.cursor = 'grab';
    }
    else if (collidePointLine(mX,mY,this.x1,this.y1,this.x2,this.y2)){
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
    if(collidePointCircle(mX,mY,this.x1,this.y1,11)){
      document.documentElement.style.cursor = 'grabbing';
      this.pressed = true;
      this.typePressed = "point1"
    }
    else if(collidePointCircle(mX,mY,this.x2,this.y2,11)){
      document.documentElement.style.cursor = 'grabbing';
      this.pressed = true;
      this.typePressed = "point2"
    }
    else if (collidePointLine(mX,mY,this.x1,this.y1,this.x2,this.y2)){
      this.pressed = true;
      this.typePressed = "line"
    }
    if(this.pressed){
      this.lastPosition = new Position(mX,mY);
    }
    return this.pressed;
  }

  mouseDragged(mX,mY) {
    let changeX = mX-this.lastPosition.x;
    let changeY = mY-this.lastPosition.y;

    if (this.pressed) {
      switch(this.typePressed){
        case "point1":
          this.x1 += changeX;
          this.y1 += changeY;
          break;
        case "point2":
          this.x2 += changeX;
          this.y2 += changeY;
          break;
        default:
          this.x1 += changeX;
          this.y1 += changeY;
          this.x2 += changeX;
          this.y2 += changeY;
          break;
      }
      this.lastPosition = new Position(mX,mY);
    }
  }

  mouseReleased(mX,mY) {
    if (this.pressed){
      this.pressed = false;
      this.typePressed = null;
      return true;
    }
    return false;
  }
}

export class Point extends DrawP5 {
  constructor(id,x,y){
    super(id);
    this.x = x;
    this.y = y;
    this.hover = false;
    this.pressed = false;
    this.lastPosition = new Position(0,0);
  }

  draw(p5){
    p5.point(this.x, this.y);
    if(this.hover){
      p5.push();
      p5.fill(255,0,0);
      p5.noStroke();
      p5.circle(this.x,this.y,10);
      p5.pop();
    }
  }

  mouseMoved(mX,mY) {
    if(collidePointCircle(mX,mY,this.x,this.y,11)){
      this.hover = true
      document.documentElement.style.cursor = 'grab';
    }
    else {
      this.hover = false
      document.documentElement.style.cursor = 'default';
    }
    return this.hover
  }

  mousePressed(mX,mY) {
    if(collidePointCircle(mX,mY,this.x,this.y,11)){
      document.documentElement.style.cursor = 'grabbing';
      this.pressed = true;
    }
    if(this.pressed){
      this.lastPosition = new Position(mX,mY);
    }
    return this.pressed;
  }

  mouseDragged(mX,mY) {
    let changeX = mX-this.lastPosition.x;
    let changeY = mY-this.lastPosition.y;

    if (this.pressed) {
      this.x += changeX;
      this.y += changeY;
      this.lastPosition = new Position(mX,mY);
    }
  }

  mouseReleased(mX,mY) {
    if (this.pressed){
      this.pressed = false;
      return true;
    }
    return false;
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

  draw(p5,semi_opacity=false){
    let color = p5.color(this.color);
    if(!semi_opacity){
      color.setAlpha(this.alpha);
    }
    else{
      color.setAlpha(this.alpha*0.5);
    }
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

  draw(p5,semi_opacity=false){
    let color = p5.color(this.color);
    if(!semi_opacity){
      color.setAlpha(this.alpha);
    }
    else{
      color.setAlpha(this.alpha*0.5);
    }
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