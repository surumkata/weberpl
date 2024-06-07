
/* CLASSE DE UM OBJETO */
export class Object {
  constructor(id, scene_id, position, size) {
    this.id = id;
    this.current_state = null;
    this.reference = scene_id;
    this.position = position;
    this.size = size;
    this.states = {};
  }

  add_state(state,initial){
    this.states[state.id] = state;
    if (initial){
      this.current_state = state.id
    }
  }

  draw(p5){
    if (this.current_state != null){
      this.states[this.current_state].draw(p5);
    }
  }
}
