/* CLASSE DE DO ESTADO DE UMA ESCAPE ROOM */

export class EscapeRoomState {
  constructor() {
    this.current_scene = null;
  }

  first_scene(scene_id){
    if (this.current_scene == null) {
      this.current_scene = scene_id;
    }
  }
}