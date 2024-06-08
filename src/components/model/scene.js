export class Scene {
  constructor(id) {
    this.id = id;
    this.current_view = null;
    this.views = {};
  }

  add_view(view,initial){
    this.views[view.id] = view;
    if (initial){
      this.current_view = view.id
    }
  }

  draw(p5){
    if (this.current_view != null){
      this.views[this.current_view].draw(p5);
    }
  }
}