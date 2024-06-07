import { PreConditionTree } from './precondition_tree';
import { EventPosCondition } from './poscondition';

class Event {
  constructor(id, pre_conditions, pos_conditions, repeatable, linked = false) {
    this.id = id;
    this.pre_conditions = pre_conditions;
    this.pos_conditions = pos_conditions;
    this.repeatable = repeatable;
    this.happen = false;
    this.linked = linked;
  }

}