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

    for (let i in this.srcImages){
      //TODO: colocar assets para funcionar :)
      this.images[i] = p5.loadImage(this.srcImages[i]);
      console.log(this.srcImages[i])
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

  draw(p5){
    p5.image(this.images[this.currentSprite],this.position.x,this.position.y,this.size.x,this.size.y);
  }
}