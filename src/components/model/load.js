import { State } from './state.js';
import { Object } from './object.js';
import {EscapeRoom} from './escape_room.js';
import {Position,Size} from './utils.js';
import {Scene} from './scene.js';

const load = (p5,json) => {
    let map = json.map
    let events = json.events
    let sounds = json.sounds
    console.log(map)
    //Load the room
    let er = load_room(p5,map);
    return er;
}

export {load};

//Função que carrega a sala (cenas, objetos, estados...)
function load_room(p5,map){
    var er = null //inicializar a escape room a nulo
    for(var room_id in map){ //apesar de ser um for, em principio só vai ter 1 sala no map. por isso o break no fim
        let room = map[room_id];
        let room_size = new Size(room.size[0],room.size[1]);
        er = new EscapeRoom(room_id,room_size);
        //percorrer as cenas todas da sala
        for(var scene_id in room.scenes){
            let scene = room.scenes[scene_id];
            let s = new Scene(scene_id); //inicializar a cena.
            //percorrer todos os estados da cena
            for(var state_scene_id in scene.states){
                let scene_state = scene.states[state_scene_id];
                let ss_filenames = scene_state.filenames;
                let ss_initial = scene_state.initial;
                let ss = new State(p5,state_scene_id,ss_filenames,room_size,new Position(0,0),0,0); //inicializar o estado da cena.
                s.add_state(ss,ss_initial);
            }
            er.add_scene(s); //adicionar a cena à escape room
            //percorrer todos os objetos da cena
            for(var object_id in scene.objects){
                let object = scene.objects[object_id];
                let pos = new Position(0,0);
                let size = new Size(0,0);
                if (object.position != undefined) {
                    pos.set(object.position[0],object.position[1]);
                }
                if (object.size != undefined) {
                    size.set(object.size[0],object.size[1]);
                }
                let o = new Object(object_id,scene_id,pos,size); //inicializar o objeto.
                //percorrer todos os estados do objeto
                for(var object_state_id in object.states){
                    let object_state = object.states[object_state_id];
                    if (object_state.position != undefined){
                        pos.set(object_state.position[0],object_state.position[1]);
                    }
                    if (object_state.size != undefined){
                        size.set(object_state.size[0],object_state.size[1]);
                    }


                    let os = new State(p5,object_state_id,object_state.filenames,size,pos,object_state.time_sprite,object_state.repeate); //inicializar o estado de objeto.
                    o.add_state(os,object_state.initial); //adicionar estado ao objeto.
                }
                er.add_object(o); //adicionar o objeto à escape room.
            }
        }
        break
    }
    return er;
}