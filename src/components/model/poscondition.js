// Import statements and class declarations omitted for brevity
import { debug, BalloonMessage } from "./utils";
import { PreConditionTree,PreConditionVar,PreConditionOperatorAnd } from "./precondition_tree";
import { EventPreConditionClickedItem, EventPreConditionItemIsInUse, EventPreConditionItemNotInUse } from "./precondition";
import { ChallengeConnections, ChallengeQuestion, ChallengeMultipleChoice, ChallengeSequence } from "./challenge";

class EventPosCondition {
  constructor(type) {
      this.type = type;
  }

  do(room, inventory, state) {
      // Abstract method to be implemented in subclasses
  }
}

class EventPosConditionEndGame extends EventPosCondition {
  constructor(message = "") {
      super("END_GAME");
      this.message = message;
  }

  do(room, inventory, state) {
      state.finishGame();
      debug("EVENT_ENDGAME.");
  }
}

class EventPosConditionObjChangeState extends EventPosCondition {
  constructor(objectId, viewId) {
      super("OBJ_CHANGE_STATE");
      this.objectId = objectId;
      this.viewId = viewId;
  }

  do(room, inventory, state) {
      state.bufferObjViews[this.objectId] = this.viewId;
      debug("EVENT_CHANGE_STATE: Mudando o view do object " + this.objectId + " para " + this.viewId + ".");
  }
}

class EventPosConditionObjChangePosition extends EventPosCondition {
  constructor(objectId, position) {
      super("OBJ_CHANGE_POSITION");
      this.objectId = objectId;
      this.position = position;
  }

  do(room, inventory, state) {
      room.objects[this.objectId].changePosition(this.position);
      debug("EVENT_CHANGE_POSITION: Mudando " + this.objectId + " para a position (" + this.position.x + "," + this.position.y + ").");
  }
}

class EventPosConditionObjChangeSize extends EventPosCondition {
  constructor(objectId, size) {
      super("OBJ_CHANGE_SIZE");
      this.objectId = objectId;
      this.size = size;
  }

  do(room, inventory, state) {
      room.objects[this.objectId].changeSize(this.size);
      debug("EVENT_CHANGE_SIZE: Mudando " + this.objectId + " para o size (" + this.size.x + "," + this.size.y + ").");
  }
}

class EventPosConditionShowMessage extends EventPosCondition {
  constructor(message, position) {
      super("SHOW_MESSAGE");
      this.message = message;
      this.position = position;
  }

  do(room, inventory, state) {
      state.bufferMessages.push(new BalloonMessage(this.message, this.position.x, this.position.y));
      debug("EVENT_MESSAGE: Mostrando message '" + this.message + "'.");
  }
}

class EventPosConditionObjPutInventory extends EventPosCondition {
  constructor(objectId) {
      super("OBJ_PUT_INVENTORY");
      this.objectId = objectId;
  }

  do(room, inventory, state) {
      const object = room.objects[this.objectId];
      delete room.objects[this.objectId];
      const slot = inventory.findEmptySlot();
      inventory.updateAdd.push([object, slot]);
      const deactivate = new PreConditionTree(new PreConditionOperatorAnd(new PreConditionVar(new EventPreConditionClickedItem(this.objectId)), new PreConditionVar(new EventPreConditionItemIsInUse(this.objectId))));
      const activate = new PreConditionTree(new PreConditionOperatorAnd(new PreConditionVar(new EventPreConditionClickedItem(this.objectId)), new PreConditionVar(new EventPreConditionItemNotInUse(this.objectId))));
      room.addEventBuffer("desativar_" + this.objectId, deactivate, [new EventPosConditionDesactiveItem(this.objectId)], Number.MAX_SAFE_INTEGER);
      room.addEventBuffer("ativar_" + this.objectId, activate, [new EventPosConditionActiveItem(this.objectId)], Number.MAX_SAFE_INTEGER);
      debug("EVENT_PUT_IN_INVENTORY: Colocando item " + this.objectId + " no slot " + slot + " do inventário.");
  }
}

class EventPosConditionChangeScenario extends EventPosCondition {
  constructor(scenarioId) {
      super("CHANGE_SCENARIO");
      this.scenarioId = scenarioId;
  }

  do(room, inventory, state) {
      state.bufferCurrentScenario = this.scenarioId;
      debug("EVENT_CHANGE_SCENE: Mudando para cena " + this.scenarioId + ".");
  }
}

class EventPosConditionActiveItem extends EventPosCondition {
  constructor(itemId) {
      super("ACTIVE_ITEM");
      this.itemId = itemId;
  }

  do(room, inventory, state) {
      inventory.activeItem(this.itemId);
      debug("EVENT_ACTIVE_ITEM: Ativando item " + this.itemId + ".");
  }
}

class EventPosConditionDesactiveItem extends EventPosCondition {
  constructor(itemId) {
      super("DESACTIVE_ITEM");
      this.itemId = itemId;
  }

  do(room, inventory, state) {
      inventory.desactiveItem(this.itemId);
      debug("EVENT_DESACTIVE_ITEM: Desativando item " + this.itemId + ".");
  }
}

class EventPosConditionDeleteItem extends EventPosCondition {
  constructor(itemId) {
      super("DELETE_ITEM");
      this.itemId = itemId;
  }

  do(room, inventory, state) {
      inventory.updateRemove.push(this.itemId);
      debug("EVENT_DELETE_ITEM: Removendo item " + this.itemId + ".");
  }
}

class EventPosConditionPlaySound extends EventPosCondition {
  constructor(soundId, sourceId, sourceType) {
      super("PLAY_SOUND");
      this.soundId = soundId;
      this.sourceId = sourceId;
      this.sourceType = sourceType;
  }

  do(room, inventory, state) {
      if (this.sourceType === 'Object') {
          room.objects[this.sourceId].sounds[this.soundId].play();
      } else if (this.sourceType === 'Scenario') {
          room.scenarios[this.sourceId].sounds[this.soundId].play();
      }
      debug("EVENT_PLAY_SOUND: Tocando sound " + this.soundId + ".");
  }
}

class EventPosConditionQuestion extends EventPosCondition {
  constructor(answer, question, sucessEvent, failEvent) {
      super("QUESTION");
      this.answer = answer;
      this.question = question;
      this.sucessEvent = sucessEvent;
      this.failEvent = failEvent;
  }

  do(room,inventory,state){
    state.inputElem.show();
    state.inputElem.value("");
    state.activeChallengeMode(new ChallengeQuestion(this.question,this.answer, this.sucessEvent, this.failEvent));
    debug("EVENT_QUESTION: Pergunta: "+this.question+" com resposta " +this.answer + ".");
  }
}

class EventPosConditionMultipleChoice extends EventPosCondition {
  constructor(question, answer, multipleChoices, sucessEvent, failEvent) {
      super("MULTIPLE_CHOICE");
      this.answer = answer;
      this.question = question;
      this.multipleChoices = multipleChoices;
      this.sucessEvent = sucessEvent;
      this.failEvent = failEvent;
  }

  do(room,inventory,state){
    state.activeChallengeMode(new ChallengeMultipleChoice(this.question,this.multipleChoices,this.answer, this.sucessEvent, this.failEvent));
    debug("EVENT_POSCONDITION_MULTIPLE_CHOICE");
  }
}

class EventPosConditionSequence extends EventPosCondition {
  constructor(question, sequence, sucessEvent, failEvent) {
      super("SEQUENCE");
      this.question = question;
      this.sequence = sequence;
      this.sucessEvent = sucessEvent;
      this.failEvent = failEvent;
  }

  do(room,inventory,state){
    state.activeChallengeMode(new ChallengeSequence(this.question,this.sequence, this.sucessEvent, this.failEvent));
    debug("EVENT_POSCONDITION_SEQUENCE");
  }
}

class EventPosConditionConnections extends EventPosCondition {
  constructor(question, list1, list2, sucessEvent, failEvent){
    super("CONNECTIONS");
    this.question = question;
    this.list1 = list1;
    this.list2 = list2;
    this.sucessEvent = sucessEvent;
      this.failEvent = failEvent;
  }

  do(room,inventory,state){
    state.activeChallengeMode(new ChallengeConnections(this.question,this.list1,this.list2, this.sucessEvent, this.failEvent));
    debug("EVENT_POSCONDITION_CONNECTIONS");
  }
}

// Exporting the classes for use in other modules if needed
export {
  EventPosCondition,
  EventPosConditionEndGame,
  EventPosConditionObjChangeState,
  EventPosConditionObjChangePosition,
  EventPosConditionObjChangeSize,
  EventPosConditionShowMessage,
  EventPosConditionObjPutInventory,
  EventPosConditionChangeScenario,
  EventPosConditionActiveItem,
  EventPosConditionDesactiveItem,
  EventPosConditionDeleteItem,
  EventPosConditionPlaySound,
  EventPosConditionQuestion,
  EventPosConditionMultipleChoice,
  EventPosConditionSequence,
  EventPosConditionConnections
};
