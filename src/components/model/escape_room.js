import {EscapeRoomState} from './er_state.js';

export class EscapeRoom {
    constructor(title, size) {
      this.title = title;
      this.scenes = {};
      this.objects = {};
      this.events = {};
      this.er_state = new EscapeRoomState();
      this.sounds = {};
      this.size = size;
    }
    
    add_scene(scene){
      this.scenes[scene.id] = scene;
      this.er_state.first_scene(scene.id);
    }

    add_object(object){
      this.objects[object.id] = object;
    }

    draw(p5){
      //Desenhar cena atual
      let current_scene = this.er_state.current_scene;
      this.scenes[current_scene].draw(p5);
      
      //Desenhar objetos dessa cena
      for (var object_id in this.objects){
        let object = this.objects[object_id];
        //desenhar objeto se pertencer à cena
        if (current_scene == object.reference){
          object.draw(p5);
        } 
      }
    }
}