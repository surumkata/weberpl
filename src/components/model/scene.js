export class Scene {
  constructor(id) {
    this.id = id;
    this.current_state = null;
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