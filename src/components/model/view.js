export class View {
  constructor(p5,id, src_images, size, position, time_sprite, repeate) {
    this.id = id;
    this.position = position;
    this.size = size;
    this.src_images = src_images;
    this.time_sprite = time_sprite;
    this.repeate = repeate;
    this.images = [];
    this.current_sprite = 0;

    for (let i in this.src_images){
      //TODO: colocar assets para funcionar :)
      this.images[i] = p5.loadImage(process.env.PUBLIC_URL + this.src_images[i]);
      //console.log(this.src_images[i])
    }
    
  }

  draw(p5){
    p5.image(this.images[this.current_sprite],this.position.x,this.position.y,this.size.x,this.size.y);
  }
}