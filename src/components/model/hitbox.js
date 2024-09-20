import { collidePointCircle, collidePointEllipse, collidePointLine, collidePointPoint, collidePointPoly, collidePointRect, collidePointTriangle } from "p5collide";
import { Position } from "./utils";
import { WIDTH, HEIGHT, HEIGHT_INV, SCALE_EDIT } from "./utils";

export class Hitbox {
    constructor(id){
        this.id = id;
        this.hover = false;
    }

    collide(px,py){
        // Abstract method to be implemented in subclasses
    }

    draw(p5){}

    scale(scaleX,scaleY){}
    translate(tx,ty){}

    mouseMoved(mX,mY) {return false;}
    mousePressed(mX,mY) {return false;}
    mouseDragged(mX,mY) {}
    mouseReleased() {return false;}
    shiftPressed(){}
    shiftReleased(){}
    setHoverFalse(){
      this.hover = false;
    }
};


export class HitboxRect extends Hitbox {
    constructor(id,x,y,w,h) {
        super(id);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.hover = false;
        this.isDragging = false;
        this.isResizing = false;
        this.lastPosition = new Position(0,0);
        this.typeResizing = "";
        this.hover = false;
        this.shift = false;
    }
    

    shiftPressed(){
      this.shift = true;
    }
  
    shiftReleased(){
      this.shift = false;
    }

    collide(px,py){
        console.log(px,py);
        return collidePointRect(px,py,this.x,this.y,this.w,this.h);
    }

    scale(scaleX,scaleY){
      this.x *=scaleX;
      this.y *=scaleY;
      this.w *=scaleX;
      this.h *=scaleY;
    }

    translate(tx,ty){
      console.log(tx,ty)
      this.x += tx
      this.y += ty
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
  
    mouseReleased() {
      if (this.isDragging || this.isResizing){
        this.isDragging = false;
        this.isResizing = false;
        return true;
      }
      return false;
    }

    draw(p5){
        p5.rect(this.x,this.y,this.w,this.h);
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
}

export class HitboxQuad extends Hitbox {
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
            {x:x4,y:y4}
        ]
        this.pressed = false;
        this.typePressed = null;
        this.lastPosition = new Position(0,0);
    }

    draw(p5){
        p5.quad(this.x1,this.y1,this.x2,this.y2,this.x3,this.y3,this.x4,this.y4);
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

    scale(scaleX,scaleY){
      this.x1 *= scaleX
      this.y1 *= scaleY
      this.x2 *= scaleX
      this.y2 *= scaleY
      this.x3 *= scaleX
      this.y3 *= scaleY
      this.x4 *= scaleX
      this.y4 *= scaleY
    }

    translate(tx,ty){
      this.x1 += tx;
      this.y1 += ty;
      this.x2 += tx;
      this.y2 += ty;
      this.x3 += tx;
      this.y3 += ty;
      this.x4 += tx;
      this.y4 += ty;

      this.vertices = [
        {x:this.x1,y:this.y1},
        {x:this.x2,y:this.y2},
        {x:this.x3,y:this.y3},
        {x:this.x4,y:this.y4}
      ]
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
    
      mouseReleased() {
        if (this.pressed){
          this.pressed = false;
          this.typePressed = null;
          return true;
        }
        return false;
      }

    collide(px,py){
        return collidePointPoly(px,py,this.vertices);
    }

}

export class HitboxSquare extends Hitbox {
    constructor(id,x,y,s){
        super(id);
        this.x = x;
        this.y = y;
        this.w = s;
        this.h = s;
    }

    collide(px,py){
        return collidePointRect(px,py,this.x,this.y,this.w,this.h);
    }

    draw(p5){
        p5.rect(this.x,this.y,this.w,this.h);
    }

    scale(scaleX,scaleY){
      this.x *= scaleX
      this.y *= scaleY
      this.w *= scaleX
      this.h *= scaleY
    }

    translate(tx,ty){
      this.x += tx
      this.y += ty
    }
}

export class HitboxTriangle extends Hitbox {
    constructor(id,x1,y1,x2,y2,x3,y3){
        super(id);
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;
    }

    collide(px,py){
        return collidePointTriangle(px,py,this.x1,this.y1,this.x2,this.y2,this.x3,this.y3);
    }

    draw(p5){
        p5.triangle(this.x1,this.y1,this.x2,this.y2,this.x3,this.y3);
    }

    scale(scaleX,scaleY){
      this.x1 *= scaleX
      this.y1 *= scaleY
      this.x2 *= scaleX
      this.y2 *= scaleY
      this.x3 *= scaleX
      this.y3 *= scaleY
    }

    translate(tx,ty){
      this.x1 += tx;
      this.y1 += ty;
      this.x2 += tx;
      this.y2 += ty;
      this.x3 += tx;
      this.y3 += ty;
    }
}

export class HitboxArc extends Hitbox {
    constructor(id,x,y,w,h,start,stop,mode){
        super(id);
        this.arcX = x;
        this.arcY = y;
        this.arcW = w;
        this.arcH = h;
        this.arcStart = start * (Math.PI/180);
        this.arcStop = stop * (Math.PI/180);
        this.mode = mode;
      }

    draw(p5){
        if(this.mode !== 'default') {
          p5.arc(this.arcX, this.arcY, this.arcW, this.arcH, this.arcStart, this.arcStop, this.mode);
        }
        else {
          p5.arc(this.arcX, this.arcY, this.arcW, this.arcH, this.arcStart, this.arcStop);
        }
    }

    scale(scaleX,scaleY){
      this.arcX *=scaleX;
      this.arcY *=scaleY;
      this.arcW *=scaleX;
      this.arcH *=scaleY;
    }

    translate(tx,ty){
      this.arcX += tx;
      this.arcY += ty;
    }

    pointOfEllipse(angle) {
        // Semi-eixos da elipse
        const a = this.arcW / 2; // Semi-eixo maior
        const b = this.arcH / 2; // Semi-eixo menor
    
        // Coordenadas do ponto na elipse
        const x = this.arcX + a * Math.cos(angle);
        const y = this.arcY + b * Math.sin(angle);
    
        return { x: x, y: y };
    }

    collide(px, py){
        const inside = collidePointEllipse(px,py,this.arcX,this.arcY,this.arcW,this.arcH);
        if (!inside){return false;}
      
        const angle = (Math.atan2(py - this.arcY, px - this.arcX) + 2*Math.PI) % (2*Math.PI);
        let insideSlice;
        if(this.arcStop < this.arcStart){
            const angle2 = angle+2*Math.PI;
            insideSlice = ((angle > this.arcStart) && (angle < this.arcStop+2*Math.PI) || (angle2 > this.arcStart) && (angle2 < this.arcStop+2*Math.PI)) ;
        }
        else {
            insideSlice = (angle > this.arcStart) && (angle < this.arcStop);
        }

        if (inside && (this.mode == 'chord' || this.mode == 'open')){
            let p1 = this.pointOfEllipse(this.arcStart);
            let p2 = this.pointOfEllipse(this.arcStop);
            
            let insideTriangle = collidePointTriangle(px,py,this.arcX,this.arcY,p1.x,p1.y,p2.x,p2.y);

            let angStop = this.arcStop
            if (angStop < this.arcStart){
                angStop += Math.PI*2;
            }
            let difAngle = angStop - this.arcStart;
            if(difAngle < Math.PI){
                return (inside && insideSlice && !insideTriangle)
            }
            else{
                return (inside && (insideSlice || insideTriangle))
            }
        }
      
        return (inside && insideSlice);
    }
}

export class HitboxCircle extends Hitbox {
    constructor(id,x,y,d){
        super(id);
        this.x = x;
        this.y = y;
        this.w = d;
        this.h = d;
      }
    
      collide(px,py){
        return collidePointEllipse(px, py,this.x, this.y, this.w,this.h);
      }

      draw(p5){
        p5.ellipse(this.x,this.y,this.w,this.h);
      }

      scale(scaleX, scaleY){
        this.x *=scaleX;
        this.y *=scaleY;
        this.w *=scaleX;
        this.h *=scaleY;
      }

      translate(tx,ty){
        this.x += tx;
        this.y += ty;
      }

      
}

export class HitboxLine extends Hitbox {
    constructor(id,x1,y1,x2,y2){
        super(id);
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
      }
    
      collide(px,py){
        return collidePointLine(px, py,this.x1, this.y1,this.x2,this.y2);
      }

      draw(p5){
        p5.line(this.x1,this.y1,this.x2,this.y2);
      }

      scale(scaleX,scaleY){
        this.x1 *= scaleX
        this.y1 *= scaleY
        this.x2 *= scaleX
        this.y2 *= scaleY
      }

      translate(tx,ty){
        this.x1 += tx;
        this.y1 += ty;
        this.x2 += tx;
        this.y2 += ty;
      }
}

export class HitboxPoint extends Hitbox {
    constructor(id,x,y){
        super(id);
        this.x = x;
        this.y = y;
    }
    
      collide(px,py){
        return collidePointPoint(px, py,this.x, this.y);
      }

      draw(p5){
        p5.point(this.x,this.y);
      }
      scale(scaleX,scaleY){
        //Don't Make any sense :()
        this.x *=scaleX;
        this.y *=scaleY;
      }

      translate(tx,ty){
        this.x += tx;
        this.y += ty;
      }
}


export class HitboxEllipse extends Hitbox {
    constructor(id,x,y,w,h){
        super(id);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    collide(px,py){
        return collidePointEllipse(px,py,this.x,this.y,this.w,this.h);
    }

    draw(p5){
        p5.ellipse(this.x,this.y,this.w,this.h);
    }

    scale(scaleX, scaleY){
      this.x *= scaleX;
      this.y *= scaleY;
      this.w *= scaleX;
      this.h *= scaleY;
    }

    translate(tx,ty){
      this.x += tx;
      this.y += ty;
    }
}