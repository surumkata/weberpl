
/* CLASSE DE UM OBJETO */
export class Object {
  constructor(id, scene_id, position, size) {
    this.id = id;
    this.current_view = null;
    this.reference = scene_id;
    this.position = position;
    this.size = size;
    this.views = {};
  }

  add_view(view){
    this.views[view.id] = view;
  }

  draw(p5){
    if (this.current_view !== null && this.current_view != "null"){
      this.views[this.current_view].draw(p5);
    }
  }
}
