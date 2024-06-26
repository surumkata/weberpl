import { Position } from "./utils";

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
    this.lastPosition = new Position(0,0);

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
    if(this.position.x <= mx && mx <= this.position.x + this.size.x && this.position.y <= my && my <= this.position.y  + this.size.y){
        return true;
    }
    return false;
  }

  draw(p5){
    p5.image(this.images[this.currentSprite],this.position.x,this.position.y,this.size.x,this.size.y);
  }

  mouseMoved(e) {
    let mX = e.mouseX;
    let mY = e.mouseY;
    if (this.viewCollision(mX,mY)){
      document.documentElement.style.cursor = 'grab';
    }
    else {
      document.documentElement.style.cursor = 'default';
    }
  }

  mousePressed(e) {
    let mX = e.mouseX;
    let mY = e.mouseY;
    if (this.viewCollision(mX,mY)){
      this.isDragging = true
      this.lastPosition = new Position(mX,mY);
    }
  }

  mouseDragged(e) {
    let mX = e.mouseX;
    let mY = e.mouseY;
    if (this.isDragging) {
      this.position.x += mX-this.lastPosition.x;
      this.position.y += mY-this.lastPosition.y;
      this.lastPosition = new Position(mX,mY);
    }
  }

  mouseReleased(e) {
    if (this.isDragging){
      this.isDragging = false;
      return true;
    }
    return false;
  }


}