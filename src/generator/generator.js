/**
 * @license
 *
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Define generation methods for custom blocks.
 * @author samelh@google.com (Sam El-Husseini)
 */

// More on generating code:
// https://developers.google.com/blockly/guides/create-custom-blocks/generating-code

import {javascriptGenerator, Order} from 'blockly/javascript';

javascriptGenerator.forBlock['escape_room'] = function(block, generator) {
  var text_title = block.getFieldValue('TITLE');
  var sizeString = generator.valueToCode(block, 'SIZE', Order.ATOMIC);
  var scenariosString = generator.statementToCode(block, 'SCENARIOS');
  var eventsString = generator.statementToCode(block, 'EVENTS');
  var transitionString = generator.statementToCode(block, 'TRANSITIONS');
  
  // Remover os parênteses externos da string
  sizeString = sizeString.slice(1, -1);
  transitionString = transitionString.replaceAll("}{","},\n{");
  transitionString = "[" + transitionString + "]";
  scenariosString = scenariosString.replaceAll("}{","},\n{");
  scenariosString = "[" + scenariosString + "]"
  eventsString = eventsString.replaceAll("}{","},\n{");
  eventsString = "[" + eventsString + "]"

  // Converter a string para objeto JSON
  var sizeObject = JSON.parse(sizeString);
  var transitionObject = JSON.parse(transitionString);
  var scenariosObject = JSON.parse(scenariosString);
  var eventsObject = JSON.parse(eventsString);

  var code = {
    "title" : text_title,
    "size" : sizeObject,
    "scenarios" : scenariosObject,
    "events" : eventsObject,
    "transitions" : transitionObject
  };
  return JSON.stringify(code, null, 2); // Retornar o JSON como string formatada
};

javascriptGenerator.forBlock['size'] = function(block, generator) {
  var x = block.getFieldValue('x');
  var y = block.getFieldValue('y');
  // Criar um objeto JSON com os valores x e y
  var sizeObject = { "x": parseInt(x), "y": parseInt(y) };
  var jsonString = JSON.stringify(sizeObject);
  // Retornar o objeto JSON e a ordem (ORDER_NONE neste caso)
  return [jsonString, javascriptGenerator.ORDER_NONE];
};

javascriptGenerator.forBlock['position'] = function(block, generator) {
  var x = block.getFieldValue('x');
  var y = block.getFieldValue('y');
  // Criar um objeto JSON com os valores x e y
  var posObject = { "x": parseInt(x), "y": parseInt(y) };
  var jsonString = JSON.stringify(posObject);
  // Retornar o objeto JSON e a ordem (ORDER_NONE neste caso)
  return [jsonString, javascriptGenerator.ORDER_NONE];
};


javascriptGenerator.forBlock['url'] = function(block, generator) {
  var text_url = block.getFieldValue('URL');
  return [text_url, javascriptGenerator.ORDER_NONE];
};

javascriptGenerator.forBlock['image'] = function(block, generator) {
  var dropdown_image = block.getFieldValue('IMAGE');
  var code = '/assets/'+dropdown_image+'.png';
  return [code, javascriptGenerator.ORDER_NONE];
};


javascriptGenerator.forBlock['story'] = function(block, generator) {
  var text_story = block.getFieldValue('STORY');
  return text_story + "\n";
};

//Scenarios block

javascriptGenerator.forBlock['scenario'] = function(block, generator) {
  var text_id = block.getFieldValue('ID');
  var text_initial_view = block.getFieldValue('initial_view');
  var stringViews = generator.statementToCode(block, 'VIEWS');
  var stringObjects = generator.statementToCode(block, 'OBJECTS');

  stringViews = stringViews.replaceAll("}{","},\n{");
  stringViews = "[" + stringViews + "]"
  var viewsObject = JSON.parse(stringViews);

  
  stringObjects = stringObjects.replaceAll("}{","},\n{");
  stringObjects = "[" + stringObjects + "]"
  console.log(stringObjects)
  var objectsObject = JSON.parse(stringObjects);

  var code = {
    'id' : text_id,
    'initial_view' : text_initial_view,
    'views' : viewsObject,
    'objects' : objectsObject
  }

  return JSON.stringify(code, null, 2);
};
//Events block


javascriptGenerator.forBlock['event'] = function(block, generator) {
var ifString = generator.valueToCode(block, 'IF', Order.ATOMIC);
var doString = generator.valueToCode(block, 'DO', Order.ATOMIC);

ifString = ifString.slice(1, -1);
var ifObject = JSON.parse(ifString);

doString = doString.slice(1,-1);
doString = "[" + doString + "]";
var doObject = JSON.parse(doString);

var code = {
  "preconditions" : ifObject,
  "posconditions" : doObject
}
return JSON.stringify(code, null, 2);
};

javascriptGenerator.forBlock['event_do'] = function(block, generator) {
var doString = generator.valueToCode(block, 'DO', Order.ATOMIC);

doString = doString.slice(1,-1);
doString = "[" + doString + "]";
var doObject = JSON.parse(doString);

var code = {
  "posconditions" : doObject
}

return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};

//Transitions Array Block

javascriptGenerator.forBlock['transition'] = function(block, generator) {
  var text_id = block.getFieldValue('ID');
  var statements_story = generator.statementToCode(block, 'STORY');
  var stringView = generator.valueToCode(block, 'VIEW', Order.ATOMIC);

  stringView = stringView.slice(1,-1);
  var viewObject = JSON.parse(stringView);

  var code = {
    'id' : text_id,
    'story' : statements_story,
    'view' : viewObject
  }

  return JSON.stringify(code, null, 2);
};

//Objects Array Block

javascriptGenerator.forBlock['object'] = function(block, generator) {
  var text_id = block.getFieldValue('ID');
  var text_initial_view = block.getFieldValue('initial_view');
  var stringViews = generator.statementToCode(block, 'VIEWS');

  stringViews = stringViews.replaceAll("}{", "},\n{");
  stringViews = "[" + stringViews + "]"
  var viewsObject = JSON.parse(stringViews);

  var code = {
    "id" : text_id,
    "initial_view" : text_initial_view,
    "views" : viewsObject,
  }

  return JSON.stringify(code, null, 2) 
};

//Views Array Block

javascriptGenerator.forBlock['view'] = function(block, generator) {
  var text_id = block.getFieldValue('ID');
  var value_image = generator.valueToCode(block, 'IMAGE', Order.ATOMIC);
  var posString = generator.valueToCode(block, 'POSITION', Order.ATOMIC);
  var sizeString = generator.valueToCode(block, 'SIZE', Order.ATOMIC);

  sizeString = sizeString.slice(1, -1);
  posString = posString.slice(1,-1);
  value_image = value_image.slice(1,-1);
  // Converter a string para objeto JSON
  var sizeObject = JSON.parse(sizeString);
  var posObject = JSON.parse(posString);

  var code = {
    "id" : text_id,
    "src" : value_image,
    "position" : posObject,
    "size" : sizeObject
  }

  return JSON.stringify(code, null, 2); // Retornar o JSON como string formatada
};


javascriptGenerator.forBlock['view2'] = function(block, generator) {
  var text_id = block.getFieldValue('ID');
  var value_image = generator.valueToCode(block, 'IMAGE', Order.ATOMIC);
  var posString = generator.valueToCode(block, 'POSITION', Order.ATOMIC);
  var sizeString = generator.valueToCode(block, 'SIZE', Order.ATOMIC);

  sizeString = sizeString.slice(1, -1);
  posString = posString.slice(1,-1);
  value_image = value_image.slice(1,-1);
  // Converter a string para objeto JSON
  var sizeObject = JSON.parse(sizeString);
  var posObject = JSON.parse(posString);

  var code = {
    "id" : text_id,
    "src" : value_image,
    "position" : posObject,
    "size" : sizeObject
  }

  return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE]; // Retornar o JSON como string formatada
};


//Logic blocks


javascriptGenerator.forBlock['not'] = function(block, generator) {
var triggerString = generator.valueToCode(block, 'TRIGGER1', Order.ATOMIC);

triggerString = triggerString.slice(1,-1);
var triggerObject = JSON.parse(triggerString);

var code = {
  "operator" : "NOT",
  "left" : triggerObject,
  "right" : null
};

return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};

javascriptGenerator.forBlock['andpos'] = function(block, generator) {
var action1String = generator.valueToCode(block, 'ACTION1', Order.ATOMIC);
var action2String = generator.valueToCode(block, 'ACTION2', Order.ATOMIC);

action1String = action1String.slice(1,-1);
action2String = action2String.slice(1,-1);

var code = action1String + "," + action2String;

return [code, javascriptGenerator.ORDER_NONE];
};


javascriptGenerator.forBlock['andpre'] = function(block, generator) {
var trigger1String = generator.valueToCode(block, 'TRIGGER1', Order.ATOMIC);
var trigger2String = generator.valueToCode(block, 'TRIGGER2', Order.ATOMIC);

trigger1String = trigger1String.slice(1,-1);
trigger2String = trigger2String.slice(1,-1);

var trigger1Object = JSON.parse(trigger1String);
var trigger2Object = JSON.parse(trigger2String);

var code = {
  "operator" : "AND",
  "left" : trigger1Object,
  "right" : trigger2Object
};

return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};


javascriptGenerator.forBlock['or'] = function(block, generator) {
var trigger1String = generator.valueToCode(block, 'TRIGGER1', Order.ATOMIC);
var trigger2String = generator.valueToCode(block, 'TRIGGER2', Order.ATOMIC);

trigger1String = trigger1String.slice(1,-1);
trigger2String = trigger2String.slice(1,-1);

var trigger1Object = JSON.parse(trigger1String);
var trigger2Object = JSON.parse(trigger2String);

var code = {
  "operator" : "OR",
  "left" : trigger1Object,
  "right" : trigger2Object
};

return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};


javascriptGenerator.forBlock['parenteses'] = function(block, generator) {
var triggerString = generator.valueToCode(block, 'TRIGGER', Order.ATOMIC);
triggerString = triggerString.slice(1,-1);

return [triggerString, javascriptGenerator.ORDER_NONE];
};

//Actions blocks


javascriptGenerator.forBlock['poscond_obj_muda_view'] = function(block, generator) {
var object_id = block.getFieldValue('OBJECT');
var view_id = block.getFieldValue('VIEW');

var code = {
  'type' : 'OBJ_CHANGE_VIEW',
  'object' : object_id,
  'view' : view_id
  }

return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};

javascriptGenerator.forBlock['poscond_obj_vai_inv'] = function(block, generator) {
var object_id = block.getFieldValue('OBJECT');

var code = {
  'type' : 'OBJ_PUT_INVENTORY',
  'object' : object_id
  }

return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};


javascriptGenerator.forBlock['poscond_fim_de_jogo'] = function(block, generator) {
var code = {
  'type' : 'END_GAME'
  }

return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};

javascriptGenerator.forBlock['poscond_mostra_msg'] = function(block, generator) {
var message = block.getFieldValue('MESSAGE');
var positionString = generator.valueToCode(block, 'NAME', Order.ATOMIC);

positionString = positionString.slice(1,-1);
var positionObject = JSON.parse(positionString);


var code = {
  'type' : 'SHOW_MESSAGE',
  'message' : message,
  'position' : positionObject
  }

return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};


javascriptGenerator.forBlock['poscond_obj_muda_tam'] = function(block, generator) {
var object_id = block.getFieldValue('OBJECT_ID');
var sizeString = generator.valueToCode(block, 'NAME', Order.ATOMIC);

sizeString = sizeString.slice(1,-1);
var sizeObject = JSON.parse(sizeString);

var code = {
  'type' : 'OBJ_CHANGE_SIZE',
  'object' : object_id,
  'size' : sizeObject
  }

return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};


javascriptGenerator.forBlock['poscond_obj_muda_pos'] = function(block, generator) {
var object_id = block.getFieldValue('OBJECT_ID');
var positionString = generator.valueToCode(block, 'NAME', Order.ATOMIC);

positionString = positionString.slice(1,-1);
var positionObject = JSON.parse(positionString);

var code = {
  'type' : 'OBJ_CHANGE_POSITION',
  'object' : object_id,
  'position' : positionObject
  }

return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};


javascriptGenerator.forBlock['poscond_muda_cena'] = function(block, generator) {
var scenario_id = block.getFieldValue('SCENARIO_ID');

var code = {
  'type' : 'CHANGE_SCENARIO',
  'scenario' : scenario_id
  }

return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};


javascriptGenerator.forBlock['poscond_remove_obj'] = function(block, generator) {
var item_id = block.getFieldValue('OBJECT_ID');

var code = {
  'type' : 'DELETE_ITEM',
  'item' : item_id
  }

return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};


javascriptGenerator.forBlock['poscond_comeca_des'] = function(block, generator) {
var challengeString = generator.valueToCode(block, 'CHALLENGE', Order.ATOMIC);

challengeString = challengeString.slice(1,-1);

return [challengeString, javascriptGenerator.ORDER_NONE];
};

javascriptGenerator.forBlock['poscond_trans'] = function(block, generator) {
var transition_id = block.getFieldValue('TRANSITION_ID');

var code = {
  'type' : 'TRANSITION',
  'transition' : transition_id
  }

return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};


javascriptGenerator.forBlock['poscond_play_sound'] = function(block, generator) {
var sound_id = block.getFieldValue('SOUND_ID');
var source_id = block.getFieldValue('ID');

var code = {
  'type' : 'PLAY_SOUND',
  'sound' : sound_id,
  'source_id' : source_id
  //'source_type' : source_type //TODO::
}

return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};

//Triggers blocks


javascriptGenerator.forBlock['precond_click_obj'] = function(block, generator) {
var object_id = block.getFieldValue('OBJECT_ID');

var code = {
  'type' : 'CLICKED_OBJECT',
  'object' : object_id,
}

return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};



javascriptGenerator.forBlock['precond_click_not_obj'] = function(block, generator) {
var object_id = block.getFieldValue('OBJECT_ID');

var code = {
  'type' : 'CLICKED_NOT_OBJECT',
  'object' : object_id,
}

return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};


javascriptGenerator.forBlock['precond_obj_is_view'] = function(block, generator) {
var object_id = block.getFieldValue('OBJECT_ID');
var view_id = block.getFieldValue('VIEW_ID');

var code = {
  'type' : 'WHEN_OBJECT_IS_VIEW',
  'object' : object_id,
  'view' : view_id
}

return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};


javascriptGenerator.forBlock['precond_ev_already_hap'] = function(block, generator) {
var event_id = block.getFieldValue('EVENT_ID');

var code = {
  'type' : 'AFTER_EVENT',
  'event' : event_id
}

return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};


javascriptGenerator.forBlock['precond_obj_in_use'] = function(block, generator) {
var item_id = block.getFieldValue('OBJECT_ID');

var code = {
  'type' : 'ITEM_IS_IN_USE',
  'item' : item_id
}

return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};


javascriptGenerator.forBlock['precond_already_passed'] = function(block, generator) {
var time = block.getFieldValue('SECONDS');

var code = {
  'type' : 'AFTER_TIME',
  'time' : parseInt(time) * 1000
}

return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};

//Challenges blocks


javascriptGenerator.forBlock['challenge_question'] = function(block, generator) {
var question = block.getFieldValue('QUESTION');
var answer = block.getFieldValue('ANSWER');
var sucessString = generator.valueToCode(block, 'SUCESS', Order.ATOMIC);
var failString = generator.valueToCode(block, 'FAIL', Order.ATOMIC);

sucessString = sucessString.slice(1,-1);
failString = failString.slice(1,-1);

var sucess = JSON.parse(sucessString);
var fail = JSON.parse(failString);

var code = {
  'type' : 'QUESTION',
  'question' : question,
  'answer' : answer,
  'sucess' : sucess,
  'fail' : fail
};
return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};


javascriptGenerator.forBlock['challenge_motion'] = function(block, generator) {
var motion_object = block.getFieldValue('MOTION_OBJECT');
var trigger_object = block.getFieldValue('TRIGGER_OBJECT');
var sucessString = generator.valueToCode(block, 'SUCESS', Order.ATOMIC);
var failString = generator.valueToCode(block, 'FAIL', Order.ATOMIC);

sucessString = sucessString.slice(1,-1);
failString = failString.slice(1,-1);

var sucess = JSON.parse(sucessString);
var fail = JSON.parse(failString);

var code = {
  'type' : 'MOTION_OBJECT',
  'motion_object' : motion_object,
  'trigger_object' : trigger_object,
  'sucess' : sucess,
  'fail' : fail
};
return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};

javascriptGenerator.forBlock['challenge_multiple_choice'] = function(block, generator) {
var question = block.getFieldValue('QUESTION');
var correct_answer = block.getFieldValue('CORRECT_ANSWER');
var wrong_answer_1 = block.getFieldValue('WRONG_ANSWER_1');
var wrong_answer_2 = block.getFieldValue('WRONG_ANSWER_2');
var wrong_answer_3 = block.getFieldValue('WRONG_ANSWER_3');
var sucessString = generator.valueToCode(block, 'SUCESS', Order.ATOMIC);
var failString = generator.valueToCode(block, 'FAIL', Order.ATOMIC);

sucessString = sucessString.slice(1,-1);
failString = failString.slice(1,-1);

var sucess = JSON.parse(sucessString);
var fail = JSON.parse(failString);

var code = {
  'type' : 'MULTIPLE_CHOICE',
  'question' : question,
  'choices' : [correct_answer,wrong_answer_1,wrong_answer_2,wrong_answer_3],
  'answer' : correct_answer,
  'sucess' : sucess,
  'fail' : fail
};
return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};

javascriptGenerator.forBlock['challenge_connection'] = function(block, generator) {
var question = block.getFieldValue('QUESTION');
var a1 = block.getFieldValue('A1');
var b1 = block.getFieldValue('B1');
var a2 = block.getFieldValue('A2');
var b2 = block.getFieldValue('B2');
var a3 = block.getFieldValue('A3');
var b3 = block.getFieldValue('B3');
var a4 = block.getFieldValue('A4');
var b4 = block.getFieldValue('B4');
var sucessString = generator.valueToCode(block, 'SUCESS', Order.ATOMIC);
var failString = generator.valueToCode(block, 'FAIL', Order.ATOMIC);

sucessString = sucessString.slice(1,-1);
failString = failString.slice(1,-1);

var sucess = JSON.parse(sucessString);
var fail = JSON.parse(failString);

var code = {
  'type' : 'CONNECTIONS',
  'question' : question,
  'list1' : [a1,a2,a3,a4],
  'list2' : [b1,b2,b3,b4],
  'sucess' : sucess,
  'fail' : fail
};
return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};

javascriptGenerator.forBlock['challenge_sequence'] = function(block, generator) {
var question = block.getFieldValue('QUESTION');
var a1 = block.getFieldValue('A1');
var a2 = block.getFieldValue('A2');
var a3 = block.getFieldValue('A3');
var a4 = block.getFieldValue('A4');
var sucessString = generator.valueToCode(block, 'SUCESS', Order.ATOMIC);
var failString = generator.valueToCode(block, 'FAIL', Order.ATOMIC);

sucessString = sucessString.slice(1,-1);
failString = failString.slice(1,-1);

var sucess = JSON.parse(sucessString);
var fail = JSON.parse(failString);

var code = {
  'type' : 'SEQUENCE',
  'question' : question,
  'sequence' : [a1,a2,a3,a4],
  'sucess' : sucess,
  'fail' : fail
};
return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};