import { Enum } from 'enum';
import { ABC, abstractmethod } from 'abc';

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

class EventPreCondition extends ABC {
  constructor() {}

  test(room, inventory) {
    var tested;
    tested = false;
    return tested;
  }

}

_pj.set_decorators(EventPreCondition, {
  "test": [abstractmethod]
});

class EventPreConditionClick extends EventPreCondition {
  constructor(object_id) {
    this.object_id = object_id;
  }

  test(room, inventory) {
    return false;
  }

}

class EventPreConditionClickAfterEvent extends EventPreCondition {
  constructor(object_id, event_id) {
    this.object_id = object_id;
    this.event_id = event_id;
  }

  test(room, inventory) {
    return false;
  }

}

class EventPreConditionActiveByEvent extends EventPreCondition {
  constructor(event_id) {
    this.event_id = event_id;
  }

  test(room, inventory) {
    return false;
  }

}

class EventPreConditionActiveAfterEvent extends EventPreCondition {
  constructor(event_id) {
    this.event_id = event_id;
  }

  test(room, inventory) {
    return false;
  }

}

class EventPreConditionActiveAfterTime extends EventPreCondition {
  constructor(time) {
    this.time = time;
  }

  test(room, inventory) {
    return false;
  }

}

class EventPreConditionActiveWhenState extends EventPreCondition {
  constructor(object_id, state_id) {
    this.object_id = object_id;
    this.state_id = state_id;
  }

  test(room, inventory) {
    return false;
  }

}

class EventPreConditionActiveWhenNotState extends EventPreCondition {
  constructor(object_id, state_id) {
    this.object_id = object_id;
    this.state_id = state_id;
  }

  test(room, inventory) {
    return false;
  }

}

class EventPreConditionActiveWhenItemInUse extends EventPreCondition {
  constructor(item_id) {
    this.item_id = item_id;
  }

  test(room, inventory) {
    return false;
  }

}

class EventPreConditionActiveWhenItemNotInUse extends EventPreCondition {
  constructor(item_id) {
    this.item_id = item_id;
  }

  test(room, inventory) {
    return false;
  }

}

class EventPreConditionClickItem extends EventPreCondition {
  constructor(item_id) {
    this.item_id = item_id;
  }

  test(room, inventory) {
    return false;
  }

}

class EventPreConditionClickNot extends EventPreCondition {
  constructor(object_id) {
    this.object_id = object_id;
  }

  test(room, inventory) {
    return false;
  }

}
