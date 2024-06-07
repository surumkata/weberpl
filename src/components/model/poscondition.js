import { Enum } from 'enum';
import { ABC, abstractmethod } from 'abc';
import { BalloonMessage, Position, debug } from './utils';
import { EventPreConditionActiveWhenItemInUse, EventPreConditionActiveWhenItemNotInUse, EventPreConditionClickItem } from './precondition';
import { PreConditionOperatorAnd, PreConditionTree, PreConditionVar } from './precondition_tree';
import * as sys from 'sys';

var _pj;

function _pj_snippets(container) {
  function set_decorators(cls, props) {
    var deco, decos;
    var _pj_a = props;

    for (var p in _pj_a) {
      if (_pj_a.hasOwnProperty(p)) {
        decos = props[p];

        function reducer(val, deco) {
          return deco(val, cls, p);
        }

        deco = decos.reduce(reducer, cls.prototype[p]);

        if (!(deco instanceof Function || deco instanceof Map || deco instanceof WeakMap) && deco instanceof Object && ("value" in deco || "get" in deco)) {
          delete cls.prototype[p];
          Object.defineProperty(cls.prototype, p, deco);
        } else {
          cls.prototype[p] = deco;
        }
      }
    }
  }

  container["set_decorators"] = set_decorators;
  return container;
}

_pj = {};

_pj_snippets(_pj);

class EventPosCondition extends ABC {
  constructor(type) {}

  do(room, inventory) {}

}

_pj.set_decorators(EventPosCondition, {
  "do": [abstractmethod]
});

class EventPosConditionEndGame extends EventPosCondition {
  constructor(message = "") {
    this.message = message;
  }

  do(room, inventory) {
    room.er_state.finish_game = true;
    debug("EVENT_ENDGAME.");
  }

}

class EventPosConditionChangeState extends EventPosCondition {
  constructor(object_id, state_id) {
    this.object_id = object_id;
    this.state_id = state_id;
  }

  do(room, inventory) {
    room.er_state.changed_objects_states[this.object_id] = this.state_id;
    debug("EVENT_CHANGE_STATE: Mudando o estado do objeto " + this.object_id + " para " + this.state_id + ".");
  }

}

class EventPosConditionChangePosition extends EventPosCondition {
  constructor(object_id, position) {
    this.object_id = object_id;
    this.position = position;
  }

  do(room, inventory) {
    room.objects[this.object_id].change_position(this.position);
    debug("EVENT_CHANGE_POSITION: Mudando " + this.object_id + " para a posi\u00e7\u00e3o (" + this.position.x.toString() + "," + this.position.y.toString() + ").");
  }

}

class EventPosConditionChangeSize extends EventPosCondition {
  constructor(object_id, size) {
    this.object_id = object_id;
    this.size = size;
  }

  do(room, inventory) {
    var object_id, size;
    object_id = this.object_id;
    size = this.size;
    room.objects[object_id].change_size(size);
    debug("EVENT_CHANGE_SIZE: Mudando " + object_id + " para o tamanho (" + size.x.toString() + "," + size.y.toString() + ").");
  }

}

class EventPosConditionShowMessage extends EventPosCondition {
  constructor(position, message) {
    this.position = position;
    this.message = message;
  }

  do(room, inventory) {
    room.er_state.messages.append(new BalloonMessage(this.message, this.position.x, this.position.y));
    debug("EVENT_MESSAGE: Mostrando mensagem '" + this.message.toString() + "' na posi\u00e7\u00e3o (" + this.position.x.toString() + "," + this.position.y.toString() + ").");
  }

}

class EventPosConditionAskCode extends EventPosCondition {
  constructor(code, message, sucess_event, fail_event, position) {
    this.code = code;
    this.message = message;
    this.sucess_event = sucess_event;
    this.fail_event = fail_event;
    this.position = position;
  }

  do(room, inventory) {
    room.er_state.input_active = true;
    room.er_state.input_code = this.code;
    room.er_state.messages.append(new BalloonMessage(this.message, this.position.x, this.position.y));
    room.er_state.input_sucess = this.sucess_event;
    room.er_state.input_fail = this.fail_event;
    room.er_state.input_box.x = this.position.x;
    room.er_state.input_box.y = this.position.y + 50;
    debug("EVENT_ASKCODE: Pedindo c\u00f3digo " + this.code + ".");
  }

}

class EventPosConditionPutInventory extends EventPosCondition {
  constructor(object_id) {
    this.object_id = object_id;
  }

  do(room, inventory) {
    var ativar, desativar, object, object_id, slot;
    object_id = this.object_id;
    object = room.objects[object_id];
    delete room.objects[object_id];
    slot = inventory.find_empty_slot();
    inventory.update_add.append([object, slot]);
    desativar = new PreConditionTree(new PreConditionOperatorAnd(new PreConditionVar(new EventPreConditionClickItem(object_id)), new PreConditionVar(new EventPreConditionActiveWhenItemInUse(object_id))));
    ativar = new PreConditionTree(new PreConditionOperatorAnd(new PreConditionVar(new EventPreConditionClickItem(object_id)), new PreConditionVar(new EventPreConditionActiveWhenItemNotInUse(object_id))));
    room.add_event_buffer("desativar_" + object_id, desativar, [new EventPosConditionDesactiveItem(object_id)], sys.maxsize, false);
    room.add_event_buffer("ativar" + object_id, ativar, [new EventPosConditionActiveItem(object_id)], sys.maxsize, false);
    debug("EVENT_PUT_IN_INVENTORY: Colocando item " + object_id + " no slot " + slot.toString() + " do invent\u00e1rio.");
  }

}

class EventPosConditionChangeScene extends EventPosCondition {
  constructor(scene_id) {
    this.scene_id = scene_id;
  }

  do(room, inventory) {
    room.er_state.current_scene_buffer = this.scene_id;
    debug("EVENT_CHANGE_SCENE: Mudando para cena " + this.scene_id + ".");
  }

}

class EventPosConditionActiveItem extends EventPosCondition {
  constructor(item_id) {
    this.item_id = item_id;
  }

  do(room, inventory) {
    inventory.active_item(this.item_id);
    debug("EVENT_ACTIVE_ITEM: Ativando item " + this.item_id + ".");
  }

}

class EventPosConditionDesactiveItem extends EventPosCondition {
  constructor(item_id) {
    this.item_id = item_id;
  }

  do(room, inventory) {
    inventory.desactive_item(this.item_id);
    debug("EVENT_DESACTIVE_ITEM: Desativando item " + this.item_id + ".");
  }

}

class EventPosConditionDeleteItem extends EventPosCondition {
  constructor(item_id) {
    this.item_id = item_id;
  }

  do(room, inventory) {
    inventory.update_remove.append(this.item_id);
    debug("EVENT_DELETE_ITEM: Removendo item " + this.item_id + ".");
  }

}

class EventPosConditionPlaySound extends EventPosCondition {
  constructor(sound_id) {
    this.sound_id = sound_id;
  }

  do(room, inventory) {
    room.sounds[this.sound_id].play();
    debug("EVENT_PLAY_SOUND: Tocando som " + this.sound_id + ".");
  }

}

class EventPosConditionMoveObject extends EventPosCondition {
  constructor(object_id, object_trigger, sucess_event, fail_event) {
    this.object_id = object_id;
    this.object_trigger = object_trigger;
    this.sucess_event = sucess_event;
    this.fail_event = fail_event;
  }

  do(room, inventory) {
    room.er_state.motion_activated = true;
    room.er_state.object_motion = this.object_id;
    room.er_state.trigger_motion = this.object_trigger;
    room.er_state.motion_sucess_event = this.sucess_event;
    room.er_state.motion_fail_event = this.fail_event;
    debug("EVENT_POSCONDITION_MOVE_OBJECT: Arrasta objeto " + this.object_id + ".");
  }

}
