import {javascriptGenerator, Order} from 'blockly/javascript';

javascriptGenerator.forBlock['escape_room'] = function(block, generator) {
  var text_title = block.getFieldValue('TITLE');
  var start_type = block.getFieldValue('TYPE');
  var start_id = block.getFieldValue('START');

  var code = {
    "block_type" : "ESCAPE_ROOM",
    "title" : text_title,
    "start_type" : start_type,
    "start" : start_id
  };

  return JSON.stringify(code, null, 2); // Retornar o JSON como string formatada
};

javascriptGenerator.forBlock['point'] = function(block, generator) {
  var x = block.getFieldValue('x');
  var y = block.getFieldValue('y');
  // Criar um objeto JSON com os valores x e y
  var sizeObject = { "x": x, "y": y };
  var jsonString = JSON.stringify(sizeObject);
  // Retornar o objeto JSON e a ordem (ORDER_NONE neste caso)
  return [jsonString, javascriptGenerator.ORDER_NONE];
};


javascriptGenerator.forBlock['url'] = function(block, generator) {
  var text_url = block.getFieldValue('URL');
  var code = ["URL",text_url]
  return JSON.stringify(code,null,2);
};

javascriptGenerator.forBlock['image'] = function(block, generator) {
  var opcao1 = block.getFieldValue('OPCAO1');
  var opcao2 = block.getFieldValue('OPCAO2');
  var code = ["LIB",opcao1 + "_" + opcao2]
  return JSON.stringify(code,null,2);
};

javascriptGenerator.forBlock['url2'] = function(block, generator) {
  var text_url = block.getFieldValue('URL');
  var code = ["URL",text_url]
  return [JSON.stringify(code,null,2), javascriptGenerator.ORDER_NONE];
};

javascriptGenerator.forBlock['image2'] = function(block, generator) {
  var opcao1 = block.getFieldValue('OPCAO1');
  var opcao2 = block.getFieldValue('OPCAO2');
  var code = ["LIB",opcao1 + "_" + opcao2]
  return [JSON.stringify(code,null,2), javascriptGenerator.ORDER_NONE];
};

javascriptGenerator.forBlock['story'] = function(block, generator) {
  var text_story = block.getFieldValue('STORY');
  return text_story + "@!@!@";
};

//Scenarios block

javascriptGenerator.forBlock['scenario'] = function(block, generator) {
  var text_id = block.getFieldValue('ID');
  var text_initial_view = block.getFieldValue('initial_view');
  var stringViews = generator.statementToCode(block, 'VIEWS');
  var stringObjects = generator.statementToCode(block, 'OBJECTS');
  var stringSounds = generator.statementToCode(block, 'SOUNDS');

  if(stringViews) {
    stringViews = stringViews.replaceAll("}{","},\n{");
    stringViews = "[" + stringViews + "]"
  }
  else {
    stringViews = "[]"
  }
  
  
  if(stringObjects) {
    stringObjects = stringObjects.replaceAll("}{","},\n{");
    stringObjects = "[" + stringObjects + "]"
  }
  else {
    stringObjects = "[]"
  }

  if(stringSounds) {
    stringSounds = stringSounds.replaceAll("}{","},\n{");
    stringSounds = "[" + stringSounds + "]"
  }
  else {
    stringSounds = "[]"
  }
  
  
  var viewsObject = JSON.parse(stringViews);
  var objectsObject = JSON.parse(stringObjects);
  var soundsObject = JSON.parse(stringSounds);
  
  var code = {
    'block_type' : 'SCENARIO',
    'id' : text_id,
    'initial_view' : text_initial_view,
    'views' : viewsObject,
    'objects' : objectsObject,
    'sounds' : soundsObject
  }

  return JSON.stringify(code, null, 2);
};
//Events block


javascriptGenerator.forBlock['event'] = function(block, generator) {
  var text_id = block.getFieldValue('ID');
  var number_repetitions = block.getFieldValue('REPETITIONS');
  var ifString = generator.valueToCode(block, 'IF', Order.ATOMIC);
  var doString = generator.valueToCode(block, 'DO', Order.ATOMIC);

  if (ifString) {
    ifString = ifString.slice(1, -1);
  } 
  else {
    ifString = null
  }
  
  if (doString) {
    doString = doString.slice(1,-1);
    doString = "[" + doString + "]";
  }
  else {
    doString = "[]"
  }
  
  
  var ifObject = JSON.parse(ifString);
  var doObject = JSON.parse(doString);

  var code = {
    "block_type" : "EVENT",
    "id" : text_id,
    "preconditions" : ifObject,
    "posconditions" : doObject,
    "repetitions" : number_repetitions
  }
  return JSON.stringify(code, null, 2);
};

//Transitions Array Block

javascriptGenerator.forBlock['transition'] = function(block, generator) {
  var text_id = block.getFieldValue('ID');
  var statements_story = generator.statementToCode(block, 'STORY');
  var stringView = generator.valueToCode(block, 'VIEW', Order.ATOMIC);
  var dropdown_type = block.getFieldValue('TYPE');
  var text_next = block.getFieldValue('NEXT');

  var viewObject;
  if(stringView){
    stringView = stringView.slice(1,-1);
    viewObject = JSON.parse(stringView);
  }
  else{
    viewObject = null;
  }

  statements_story = statements_story.split("@!@!@");
  statements_story.pop()
  if(statements_story.length > 0){
    statements_story[0] = statements_story[0].slice(2);
  }

  var code = {
    "block_type" : "TRANSITION",
    'id' : text_id,
    'story' : statements_story,
    'view' : viewObject,
    'next_type' : dropdown_type,
    'next' : text_next
  }

  return JSON.stringify(code, null, 2);
};

//Objects Array Block

javascriptGenerator.forBlock['object'] = function(block, generator) {
  var text_id = block.getFieldValue('ID');
  var text_initial_view = block.getFieldValue('initial_view');
  var stringViews = generator.statementToCode(block, 'VIEWS');
  var stringSounds = generator.statementToCode(block, 'SOUNDS');

  if (stringViews){
    stringViews = stringViews.replaceAll(/}\s*{/g, "},{");
    stringViews = "[" + stringViews + "]"
  }
  else {
    stringViews = "[]"
  }

  if (stringSounds){
    stringSounds = stringSounds.replaceAll(/}\s*{/g, "},{");
    stringSounds = "[" + stringSounds + "]"
  }
  else {
    stringSounds = "[]"
  }

  var viewsObject = JSON.parse(stringViews);
  var soundsObject = JSON.parse(stringSounds);

  var code = {
    "id" : text_id,
    "initial_view" : text_initial_view,
    "views" : viewsObject,
    "sounds" : soundsObject
  }

  return JSON.stringify(code, null, 2) 
};


javascriptGenerator.forBlock['sound'] = function(block,generator) {
  var text_id = block.getFieldValue('ID');
  var checkbox_loop = block.getFieldValue('LOOP');
  var value_src = generator.valueToCode(block, 'SRC', Order.ATOMIC);

  if (value_src) {
    value_src = value_src.slice(1,-1);
  }
  else{
    value_src = ""
  }

  if (checkbox_loop === "TRUE"){
    checkbox_loop = true;
  }
  else {
    checkbox_loop = false;
  }

  var code = {
    "id" : text_id,
    "src" : value_src,
    "loop" : checkbox_loop
  }

  return JSON.stringify(code, null, 2); // Retornar o JSON como string formatada
}

//Views Array Block

javascriptGenerator.forBlock['view'] = function(block, generator) {
  var text_id = block.getFieldValue('ID');
  var sourceString = generator.valueToCode(block, 'SOURCE', Order.ATOMIC);
  var posString = generator.valueToCode(block, 'POSITION', Order.ATOMIC);
  var sizeString = generator.valueToCode(block, 'SIZE', Order.ATOMIC);
  var hitboxType = block.getFieldValue('HITBOX_TYPE');

  var hitboxString;
  if (hitboxType === "ADVANCED"){
    hitboxString = generator.statementToCode(block, 'ADVANCED_HITBOX');
    if (hitboxString){
      hitboxString = hitboxString.replaceAll(/}\s*{/g, "},{");
      hitboxString = "[" + hitboxString + "]"
    }
    else {
      hitboxString = "[]"
    }
  }
  else {
    hitboxString = "[]"
  }

  var hitboxObject = JSON.parse(hitboxString);


  if (sizeString) {
    sizeString = sizeString.slice(1, -1);
  }
  else {
    sizeString = 'null'
  }
  if (posString) {
    posString = posString.slice(1, -1);
  }
  else {
    posString = 'null'
  }
  
  if (sourceString) {
    sourceString = sourceString.slice(1, -1);
  }
  else{
    sourceString = "[]"
  }
  var sourceObject = JSON.parse(sourceString);
  // Converter a string para objeto JSON
  var sizeObject = JSON.parse(sizeString);
  var posObject = JSON.parse(posString);

  
  var code = {
    "id" : text_id,
    "type" : "VIEW_IMAGE",
    "sources" : [sourceObject],
    "position" : posObject,
    "size" : sizeObject,
    "turn" : {"x" : false, "y" : false},
    "hitbox_type" : hitboxType,
    "hitboxes" : hitboxObject
  }

  return JSON.stringify(code, null, 2); // Retornar o JSON como string formatada
};


javascriptGenerator.forBlock['view_animated'] = function(block, generator) {
  var text_id = block.getFieldValue('ID');
  var sourceString = generator.statementToCode(block, 'SOURCES');
  var posString = generator.valueToCode(block, 'POSITION', Order.ATOMIC);
  var sizeString = generator.valueToCode(block, 'SIZE', Order.ATOMIC);
  var hitboxType = block.getFieldValue('HITBOX_TYPE');
  const number_time_sprite = block.getFieldValue('TIME_SPRITE:');
  const number_repeates = block.getFieldValue('REPETITIONS');

  var hitboxString;
  if (hitboxType === "ADVANCED"){
    hitboxString = generator.statementToCode(block, 'ADVANCED_HITBOX');
    if (hitboxString){
      hitboxString = hitboxString.replaceAll(/}\s*{/g, "},{");
      hitboxString = "[" + hitboxString + "]"
    }
    else {
      hitboxString = "[]"
    }
  }
  else {
    hitboxString = "[]"
  }

  var hitboxObject = JSON.parse(hitboxString);


  if (sizeString) {
    sizeString = sizeString.slice(1, -1);
  }
  else {
    sizeString = 'null'
  }
  if (posString) {
    posString = posString.slice(1, -1);
  }
  else {
    posString = 'null'
  }
  
  if (sourceString) {
    sourceString = sourceString.replaceAll(/\]\s*\[/g, "],[");
    sourceString = "[" + sourceString + "]"
  }
  else{
    sourceString = "[]"
  }

  var sourceObject = JSON.parse(sourceString);
  // Converter a string para objeto JSON
  var sizeObject = JSON.parse(sizeString);
  var posObject = JSON.parse(posString);

  
  var code = {
    "id" : text_id,
    "type" : "VIEW_IMAGE",
    "sources" : sourceObject,
    "position" : posObject,
    "size" : sizeObject,
    "turn" : {"x" : false, "y" : false},
    "hitbox_type" : hitboxType,
    "hitboxes" : hitboxObject,
    "repetitions" : number_repeates,
    "time_sprite" : number_time_sprite
  }

  return JSON.stringify(code, null, 2); // Retornar o JSON como string formatada
};

javascriptGenerator.forBlock['view_animated2'] = function(block, generator) {
  var text_id = block.getFieldValue('ID');
  var sourceString = generator.statementToCode(block, 'SOURCES');
  var posString = generator.valueToCode(block, 'POSITION', Order.ATOMIC);
  var sizeString = generator.valueToCode(block, 'SIZE', Order.ATOMIC);
  const number_time_sprite = block.getFieldValue('TIME_SPRITE:');
  const number_repeates = block.getFieldValue('REPETITIONS');

  if (sizeString) {
    sizeString = sizeString.slice(1, -1);
  }
  else {
    sizeString = 'null'
  }
  if (posString) {
    posString = posString.slice(1, -1);
  }
  else {
    posString = 'null'
  }
  
  if (sourceString) {
    sourceString = sourceString.replaceAll(/\]\s*\[/g, "],[");
    sourceString = "[" + sourceString + "]"
  }
  else{
    sourceString = "[]"
  }

  var sourceObject = JSON.parse(sourceString);
  // Converter a string para objeto JSON
  var sizeObject = JSON.parse(sizeString);
  var posObject = JSON.parse(posString);

  
  var code = {
    "id" : text_id,
    "type" : "VIEW_IMAGE",
    "sources" : sourceObject,
    "position" : posObject,
    "size" : sizeObject,
    "turn" : {"x" : false, "y" : false},
    "repetitions" : number_repeates,
    "time_sprite" : number_time_sprite
  }

  return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE]; // Retornar o JSON como string formatada
};

javascriptGenerator.forBlock['view2'] = function(block, generator) {
  var text_id = block.getFieldValue('ID');
  var sourceString = generator.statementToCode(block, 'SOURCES');
  var posString = generator.valueToCode(block, 'POSITION', Order.ATOMIC);
  var sizeString = generator.valueToCode(block, 'SIZE', Order.ATOMIC);

  if (sizeString) {
    sizeString = sizeString.slice(1, -1);
  }
  else {
    sizeString = 'null'
  }
  if (posString) {
    posString = posString.slice(1, -1);
  }
  else {
    posString = 'null'
  }
  if (sourceString) {
    sourceString = sourceString.slice(1, -1);
  }
  else{
    sourceString = "[]"
  }
  var sourceObject = JSON.parse(sourceString);

  var sizeObject = JSON.parse(sizeString);
  var posObject = JSON.parse(posString);

  var code = {
    "id" : text_id,
    "type" : "VIEW_IMAGE",
    "sources" : [sourceObject],
    "position" : posObject,
    "size" : sizeObject,
    "turn" : {"x" : false, "y" : false}
  }

  return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE]; // Retornar o JSON como string formatada
};

javascriptGenerator.forBlock['view_draw'] = function(block,generator) {
  const text_id = block.getFieldValue('ID');

  var stringDraws = generator.statementToCode(block, 'DRAWS');
  var hitboxType = block.getFieldValue('HITBOX_TYPE');

  var hitboxString;
  if (hitboxType === "ADVANCED"){
    hitboxString = generator.statementToCode(block, 'ADVANCED_HITBOX');
    if (hitboxString){
      hitboxString = hitboxString.replaceAll(/}\s*{/g, "},{");
      hitboxString = "[" + hitboxString + "]"
    }
    else {
      hitboxString = "[]"
    }
  }
  else {
    hitboxString = "[]"
  }

  var hitboxObject = JSON.parse(hitboxString);

  if (stringDraws){
    stringDraws = stringDraws.replaceAll(/}\s*{/g, "},{");
    stringDraws = "[" + stringDraws + "]"
  }
  else {
    stringDraws = "[]"
  }

  var draws = JSON.parse(stringDraws);

  var code = {
    "id" : text_id,
    "type" : "VIEW_SKETCH",
    "draws" : draws,
    "hitbox_type" : hitboxType,
    "hitboxes" : hitboxObject
  }

  return JSON.stringify(code, null, 2) 
}

javascriptGenerator.forBlock['view_draw2'] = function(block,generator) {
  const text_id = block.getFieldValue('ID');

  var stringDraws = generator.statementToCode(block, 'DRAWS');

  if (stringDraws){
    stringDraws = stringDraws.replaceAll(/}\s*{/g, "},{");
    stringDraws = "[" + stringDraws + "]"
  }
  else {
    stringDraws = "[]"
  }

  var draws = JSON.parse(stringDraws);

  var code = {
    "id" : text_id,
    "type" : "VIEW_SKETCH",
    "draws" : draws
  }

  return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE]; // Retornar o JSON como string formatada
}


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

if (action1String) {
  action1String = action1String.slice(1,-1);
}
else {
  action1String = "{}"
}
if (action2String) {
  action2String = action2String.slice(1,-1);
}
else {
  action2String = "{}"
}


var code = action1String + "," + action2String;

return [code, javascriptGenerator.ORDER_NONE];
};


javascriptGenerator.forBlock['andpre'] = function(block, generator) {
var trigger1String = generator.valueToCode(block, 'TRIGGER1', Order.ATOMIC);
var trigger2String = generator.valueToCode(block, 'TRIGGER2', Order.ATOMIC);

if (trigger1String){
  trigger1String = trigger1String.slice(1,-1);
}
else {
  trigger1String = "{}"
}

if (trigger2String) {
  trigger2String = trigger2String.slice(1,-1);
}
else {
  trigger2String = "{}"
}


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

if (trigger1String){
  trigger1String = trigger1String.slice(1,-1);
}
else {
  trigger1String = "{}"
}

if (trigger2String) {
  trigger2String = trigger2String.slice(1,-1);
}
else {
  trigger2String = "{}"
}
;

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

if (triggerString){
  triggerString = triggerString.slice(1,-1);
}
else {
  triggerString = "{}"
}




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
var posString = generator.valueToCode(block, 'POSITION', Order.ATOMIC);

if(posString){
  posString = posString.slice(1,-1);
}
else{
  posString = 'null';
}
var positionObject = JSON.parse(posString);


var code = {
  'type' : 'SHOW_MESSAGE',
  'message' : message,
  'position' : positionObject
  }

return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};


javascriptGenerator.forBlock['poscond_obj_muda_tam'] = function(block, generator) {
var object_id = block.getFieldValue('OBJECT_ID');
var scaleString = generator.valueToCode(block, 'SCALE', Order.ATOMIC);

if(scaleString) {
  scaleString = scaleString.slice(1,-1);
}
else {
  scaleString = 'null'
}
var scaleObject = JSON.parse(scaleString);

var code = {
  'type' : 'OBJ_SCALES',
  'object' : object_id,
  'scale' : scaleObject
  }

return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};


javascriptGenerator.forBlock['poscond_obj_muda_pos'] = function(block, generator) {
var object_id = block.getFieldValue('OBJECT_ID');
var posString = generator.valueToCode(block, 'POSITION', Order.ATOMIC);

if(posString){
  posString = posString.slice(1,-1);
}
else {
  posString = 'null'
}
var positionObject = JSON.parse(posString);

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
var object_id = block.getFieldValue('OBJECT_ID');

var code = {
  'type' : 'REMOVE_OBJ',
  'object' : object_id
  }

return [JSON.stringify(code, null, 2), javascriptGenerator.ORDER_NONE];
};


javascriptGenerator.forBlock['poscond_comeca_des'] = function(block, generator) {
var challengeString = generator.valueToCode(block, 'CHALLENGE', Order.ATOMIC);

if (challengeString) {
  challengeString = challengeString.slice(1,-1);
}
else {
  challengeString = '{"type":"NO_CHALLENGE"}'
}

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
var source_type = block.getFieldValue('SRC_TYPE');
var source_id = block.getFieldValue('SRC');

var code = {
  'type' : 'PLAY_SOUND',
  'sound' : sound_id,
  'source_id' : source_id,
  'source_type' : source_type
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
var obj_id = block.getFieldValue('OBJECT_ID');

var code = {
  'type' : 'OBJ_IS_IN_USE',
  'object' : obj_id
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

if(sucessString){
  sucessString = sucessString.slice(1,-1);
  sucessString = "[" + sucessString + "]";
}
else {
  sucessString = "[]"
}

if (failString){
  failString = failString.slice(1,-1);
  failString = "[" + failString + "]";
}
else {
  failString = "[]"
}

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

if(sucessString){
  sucessString = sucessString.slice(1,-1);
  sucessString = "[" + sucessString + "]";
}
else {
  sucessString = "[]"
}

if (failString){
  failString = failString.slice(1,-1);
  failString = "[" + failString + "]";
}
else {
  failString = "[]"
}

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

if(sucessString){
  sucessString = sucessString.slice(1,-1);
  sucessString = "[" + sucessString + "]";
}
else {
  sucessString = "[]"
}

if (failString){
  failString = failString.slice(1,-1);
  failString = "[" + failString + "]";
}
else {
  failString = "[]"
}

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

  if(sucessString){
    sucessString = sucessString.slice(1,-1);
    sucessString = "[" + sucessString + "]";
  }
  else {
    sucessString = "[]"
  }
  
  if (failString){
    failString = failString.slice(1,-1);
    failString = "[" + failString + "]";
  }
  else {
    failString = "[]"
  }

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

  if(sucessString){
    sucessString = sucessString.slice(1,-1);
    sucessString = "[" + sucessString + "]";
  }
  else {
    sucessString = "[]"
  }
  
  if (failString){
    failString = failString.slice(1,-1);
    failString = "[" + failString + "]";
  }
  else {
    failString = "[]"
  }

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



//UTILS

javascriptGenerator.forBlock['turn'] = function(block, generator) {
  var direction = block.getFieldValue('direction');
  var stringViews = generator.statementToCode(block, 'VIEWS');
  
  if (stringViews){
    stringViews = stringViews.replaceAll("}{", "},\n{");
    stringViews = "[" + stringViews + "]"
  }
  else {
    stringViews = "[]"
  }

  var viewsObject = JSON.parse(stringViews);

  for(var view in viewsObject){
    if(direction.includes("VERTICALLY")) {
     viewsObject[view].turn.x = !viewsObject[view].turn.x;
    }
    if(direction.includes("HORIZONTALLY")){
      viewsObject[view].turn.y = !viewsObject[view].turn.y;
    }
  }

  var code = JSON.stringify(viewsObject, null, 2);

  return code.slice(1, -1);
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

//DRAWS

javascriptGenerator.forBlock['draw_rect'] = function(block, generator) {
  const text_id = block.getFieldValue('ID');

  const x = block.getFieldValue('X');
  const y = block.getFieldValue('Y');

  const w = block.getFieldValue('W');
  const h = block.getFieldValue('H');

  const tl = block.getFieldValue('TL');
  const tr = block.getFieldValue('TR');
  const br = block.getFieldValue('BR');
  const bl = block.getFieldValue('BL');

  var code = {
    "id" : text_id,
    "type" : "RECT",
    "position" : {"x" : x, "y" : y},
    "size" : {"x" : w, "y" : h},
    "tl" : tl,
    "tr" : tr,
    "br" : br,
    "bl" : bl
  }

  return JSON.stringify(code, null, 2); // Retornar o JSON como string formatada
}

javascriptGenerator.forBlock['draw_polygon'] = function(block, generator) {
  const text_id = block.getFieldValue('ID');

  // Inicializar a lista de pontos
  let points = [];

  // Percorrer todos os campos do bloco para capturar as coordenadas X e Y
  for (let i = 0; i < block.itemCount_; i++) {
    let x = block.getFieldValue('X' + (i+1));
    let y = block.getFieldValue('Y' + (i+1));
    
    // Adicionar o ponto à lista se ambas as coordenadas estiverem definidas
    if (x !== null && y !== null) {
      points.push({ "x": x, "y": y });
    }
  }

  var code = {
    "id" : text_id,
    "type" : "POLYGON",
    "points" : points
  }

  return JSON.stringify(code, null, 2); // Retornar o JSON como string formatada
}

javascriptGenerator.forBlock['draw_square'] = function(block, generator) {
  const text_id = block.getFieldValue('ID');

  const x = block.getFieldValue('X');
  const y = block.getFieldValue('Y');
  const s = block.getFieldValue('S');

  const tl = block.getFieldValue('TL');
  const tr = block.getFieldValue('TR');
  const br = block.getFieldValue('BR');
  const bl = block.getFieldValue('BL');

  var code = {
    "id" : text_id,
    "type" : "SQUARE",
    "position" : {"x" : x, "y" : y},
    "width" : s,
    "tl" : tl,
    "tr" : tr,
    "br" : br,
    "bl" : bl
  }

  return JSON.stringify(code, null, 2); // Retornar o JSON como string formatada
}

javascriptGenerator.forBlock['draw_triangle'] = function(block, generator) {
  const text_id = block.getFieldValue('ID');

  const x1 = block.getFieldValue('X1');
  const y1 = block.getFieldValue('Y1');

  const x2 = block.getFieldValue('X2');
  const y2 = block.getFieldValue('Y2');

  const x3 = block.getFieldValue('X3');
  const y3 = block.getFieldValue('Y3');

  var code = {
    "id" : text_id,
    "type" : "TRIANGLE",
    "point1" : {"x" : x1, "y" : y1},
    "point2" : {"x" : x2, "y" : y2},
    "point3" : {"x" : x3, "y" : y3}
  }

  return JSON.stringify(code, null, 2); // Retornar o JSON como string formatada
}

javascriptGenerator.forBlock['draw_line'] = function(block, generator) {
  const text_id = block.getFieldValue('ID');

  const x1 = block.getFieldValue('X1');
  const y1 = block.getFieldValue('Y1');

  const x2 = block.getFieldValue('X2');
  const y2 = block.getFieldValue('Y2');

  var code = {
    "id" : text_id,
    "type" : "LINE",
    "point1" : {"x" : x1, "y" : y1},
    "point2" : {"x" : x2, "y" : y2},
  }

  return JSON.stringify(code, null, 2); // Retornar o JSON como string formatada
}

javascriptGenerator.forBlock['draw_arc'] = function(block, generator) {
  const text_id = block.getFieldValue('ID');

  const x = block.getFieldValue('X');
  const y = block.getFieldValue('Y');

  const w = block.getFieldValue('W');
  const h = block.getFieldValue('H');

  const start = block.getFieldValue('START');
  const stop = block.getFieldValue('STOP');

  var code = {
    "id" : text_id,
    "type" : "ARC",
    "position" : {"x" : x, "y" : y},
    "size" : {"x" : w, "y" : h},
    "arcstart" : start * (Math.PI/180),
    "arcstop" : stop * (Math.PI/180)
  }

  return JSON.stringify(code, null, 2); // Retornar o JSON como string formatada
}

javascriptGenerator.forBlock['draw_circle'] = function(block, generator) {
  const text_id = block.getFieldValue('ID');

  const x = block.getFieldValue('X');
  const y = block.getFieldValue('Y');
  const radius = block.getFieldValue('RADIUS');

  var code = {
    "id" : text_id,
    "type" : "CIRCLE",
    "position" : {"x" : x, "y" : y},
    "radius" : radius
  }

  return JSON.stringify(code, null, 2); // Retornar o JSON como string formatada
}

javascriptGenerator.forBlock['draw_ellipse'] = function(block, generator) {
  const text_id = block.getFieldValue('ID');

  const x = block.getFieldValue('X');
  const y = block.getFieldValue('Y');
  const w = block.getFieldValue('W');
  const h = block.getFieldValue('H');

  var code = {
    "id" : text_id,
    "type" : "ELLIPSE",
    "position" : {"x" : x, "y" : y},
    "size" : {"x" : w, "y" : h},
  }

  return JSON.stringify(code, null, 2); // Retornar o JSON como string formatada
}

javascriptGenerator.forBlock['begin_clip'] = function(block,generator) {

  var code = {
    "type" : "BEGIN_CLIP"
  }

  return JSON.stringify(code, null, 2) 
}

javascriptGenerator.forBlock['end_clip'] = function(block,generator) {

  var code = {
    "type" : "END_CLIP"
  }

  return JSON.stringify(code, null, 2) 
}

javascriptGenerator.forBlock['erase'] = function(block,generator) {

  var code = {
    "type" : "ERASE"
  }

  return JSON.stringify(code, null, 2) 
}

javascriptGenerator.forBlock['no_erase'] = function(block,generator) {

  var code = {
    "type" : "NO_ERASE"
  }

  return JSON.stringify(code, null, 2) 
}

javascriptGenerator.forBlock['fill'] = function(block,generator) {

  const color = generator.quote_(block.getFieldValue('COLOUR'));
  const alpha = block.getFieldValue('ALPHA');


  var code = {
    "type" : "FILL",
    "color" : color.slice(1,-1),
    "alpha" : alpha
  }

  return JSON.stringify(code, null, 2) 
}

javascriptGenerator.forBlock['no_fill'] = function(block,generator) {

  var code = {
    "type" : "NO_FILL"
  }

  return JSON.stringify(code, null, 2) 
}

javascriptGenerator.forBlock['stroke'] = function(block,generator) {

  const color = generator.quote_(block.getFieldValue('COLOUR'));
  const w = block.getFieldValue('W');
  const alpha = block.getFieldValue('ALPHA');

  var code = {
    "type" : "STROKE",
    "color" : color.slice(1,-1),
    "w" : w,
    "alpha" : alpha
    
  }

  return JSON.stringify(code, null, 2) 
}

javascriptGenerator.forBlock['no_stroke'] = function(block,generator) {

  var code = {
    "type" : "NO_STROKE"
  }

  return JSON.stringify(code, null, 2) 
}

//HITBOXS

javascriptGenerator.forBlock['hitbox_rect'] = function(block, generator) {
  const text_id = block.getFieldValue('ID');

  const x = block.getFieldValue('X');
  const y = block.getFieldValue('Y');

  const w = block.getFieldValue('W');
  const h = block.getFieldValue('H');

  var code = {
    "id" : text_id,
    "type" : "RECT",
    "position" : {"x" : x, "y" : y},
    "size" : {"x" : w, "y" : h},
  }

  return JSON.stringify(code, null, 2); // Retornar o JSON como string formatada
}


javascriptGenerator.forBlock['hitbox_polygon'] = function(block, generator) {
  const text_id = block.getFieldValue('ID');

  // Inicializar a lista de pontos
  let points = [];

  // Percorrer todos os campos do bloco para capturar as coordenadas X e Y
  for (let i = 0; i < block.itemCount_; i++) {
    let x = block.getFieldValue('X' + (i+1));
    let y = block.getFieldValue('Y' + (i+1));
    
    // Adicionar o ponto à lista se ambas as coordenadas estiverem definidas
    if (x !== null && y !== null) {
      points.push({ "x": x, "y": y });
    }
  }

  var code = {
    "id" : text_id,
    "type" : "POLYGON",
    "points" : points
  }

  return JSON.stringify(code, null, 2); // Retornar o JSON como string formatada
}

javascriptGenerator.forBlock['hitbox_square'] = function(block, generator) {
  const text_id = block.getFieldValue('ID');

  const x = block.getFieldValue('X');
  const y = block.getFieldValue('Y');
  const s = block.getFieldValue('S');

  var code = {
    "id" : text_id,
    "type" : "SQUARE",
    "position" : {"x" : x, "y" : y},
    "width" : s
  }

  return JSON.stringify(code, null, 2); // Retornar o JSON como string formatada
}

javascriptGenerator.forBlock['hitbox_triangle'] = function(block, generator) {
  const text_id = block.getFieldValue('ID');

  const x1 = block.getFieldValue('X1');
  const y1 = block.getFieldValue('Y1');

  const x2 = block.getFieldValue('X2');
  const y2 = block.getFieldValue('Y2');

  const x3 = block.getFieldValue('X3');
  const y3 = block.getFieldValue('Y3');

  var code = {
    "id" : text_id,
    "type" : "TRIANGLE",
    "point1" : {"x" : x1, "y" : y1},
    "point2" : {"x" : x2, "y" : y2},
    "point3" : {"x" : x3, "y" : y3}
  }

  return JSON.stringify(code, null, 2); // Retornar o JSON como string formatada
}

javascriptGenerator.forBlock['hitbox_line'] = function(block, generator) {
  const text_id = block.getFieldValue('ID');

  const x1 = block.getFieldValue('X1');
  const y1 = block.getFieldValue('Y1');

  const x2 = block.getFieldValue('X2');
  const y2 = block.getFieldValue('Y2');

  var code = {
    "id" : text_id,
    "type" : "LINE",
    "point1" : {"x" : x1, "y" : y1},
    "point2" : {"x" : x2, "y" : y2},
  }

  return JSON.stringify(code, null, 2); // Retornar o JSON como string formatada
}

javascriptGenerator.forBlock['hitbox_arc'] = function(block, generator) {
  const text_id = block.getFieldValue('ID');

  const x = block.getFieldValue('X');
  const y = block.getFieldValue('Y');

  const w = block.getFieldValue('W');
  const h = block.getFieldValue('H');

  const start = block.getFieldValue('START');
  const stop = block.getFieldValue('STOP');
  var code = {
    "id" : text_id,
    "type" : "ARC",
    "position" : {"x" : x, "y" : y},
    "size" : {"x" : w, "y" : h},
    "arcstart" : start * (Math.PI/180),
    "arcstop" : stop * (Math.PI/180)
  }

  return JSON.stringify(code, null, 2); // Retornar o JSON como string formatada
}

javascriptGenerator.forBlock['hitbox_circle'] = function(block, generator) {
  const text_id = block.getFieldValue('ID');

  const x = block.getFieldValue('X');
  const y = block.getFieldValue('Y');
  const radius = block.getFieldValue('RADIUS');

  var code = {
    "id" : text_id,
    "type" : "CIRCLE",
    "position" : {"x" : x, "y" : y},
    "radius" : radius
  }

  return JSON.stringify(code, null, 2); // Retornar o JSON como string formatada
}

javascriptGenerator.forBlock['hitbox_ellipse'] = function(block, generator) {
  const text_id = block.getFieldValue('ID');

  const x = block.getFieldValue('X');
  const y = block.getFieldValue('Y');
  const w = block.getFieldValue('W');
  const h = block.getFieldValue('H');

  var code = {
    "id" : text_id,
    "type" : "ELLIPSE",
    "position" : {"x" : x, "y" : y},
    "size" : {"x" : w, "y" : h},
  }

  return JSON.stringify(code, null, 2); // Retornar o JSON como string formatada
}