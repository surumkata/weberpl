import * as Blockly from 'blockly';
import {registerFieldAngle} from '@blockly/field-angle';
import { FieldAngle } from '@blockly/field-angle';
import {FieldColourHsvSliders} from '@blockly/field-colour-hsv-sliders';

Blockly.Msg.ESCAPE_ROOM = '#17116e';
Blockly.Msg.SCENARIOS = 200;
Blockly.Msg.TRANSITIONS = 200;
Blockly.Msg.OBJECTS = 140;
Blockly.Msg.EVENTS = 300;
Blockly.Msg.VIEWS = 80;
Blockly.Msg.SOUNDS = 260;
Blockly.Msg.TRIGGERS = 42;
Blockly.Msg.ACTIONS = 82;
Blockly.Msg.HITBOXES = 345;
Blockly.Msg.DRAWS = 120;
Blockly.Msg.UTILS = 20;
Blockly.Msg.CHALLENGES = 285;

Blockly.Blocks['escape_room'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.inputs.Align.CENTRE)
        .appendField("ESCAPE ROOM")
        .appendField(new Blockly.FieldTextInput("My Escape Room"), "TITLE");
    this.appendDummyInput()
        .setAlign(Blockly.inputs.Align.CENTRE)
        .appendField("SCENARIOS:");
    this.appendStatementInput("SCENARIOS")
        .setCheck("scenario");
    this.appendDummyInput()
        .setAlign(Blockly.inputs.Align.CENTRE)
        .appendField("EVENTS:");
    this.appendStatementInput("EVENTS")
        .setCheck("event");
    this.appendDummyInput()
        .setAlign(Blockly.inputs.Align.CENTRE)
        .appendField("TRANSITIONS:");
    this.appendStatementInput("TRANSITIONS")
        .setCheck("transition");
    this.appendDummyInput()
        .appendField("STARTS WITH")
        .appendField(new Blockly.FieldDropdown([["TRANSITION","TRANSITION"], ["SCENARIO","SCENARIO"]]), "TYPE")
        .appendField(new Blockly.FieldTextInput("ID"), "START");
    this.setColour('%{BKY_ESCAPE_ROOM}');
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['point'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("(")
        .appendField(new Blockly.FieldNumber(0, -10000), "x")
        .appendField(",")
        .appendField(new Blockly.FieldNumber(0, -10000), "y")
        .appendField(")");
    this.setInputsInline(false);
    this.setOutput(true, "point");
    this.setColour('%{BKY_UTILS}');
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['url'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("URL (")
        .appendField(new Blockly.FieldTextInput("url"), "URL")
        .appendField(")");
    this.setInputsInline(false);
    this.setOutput(true, "url");
    this.setColour('%{BKY_UTILS}');
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['image'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("IMAGE")
          .appendField(new Blockly.FieldDropdown([["room","room"],["safe","cofre"], ["open_safe","open_cofre"], ["door","door"], ["open_door","open_door"], ["key","key"], ["active_key","active_key"], ["note","nota"], ["note_zoom","nota_nova"], ["magnifying_glass","lupa"], ["active_magnifying glass","active_lupa"]]), "IMAGE");
      this.setInputsInline(false);
      this.setOutput(true, "url");
      this.setColour('%{BKY_UTILS}');
   this.setTooltip("");
   this.setHelpUrl("");
    }
  };

Blockly.Blocks['story'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("\"")
        .appendField(new Blockly.FieldTextInput(""), "STORY")
        .appendField("\"");
    this.setInputsInline(false);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour('%{BKY_UTILS}');
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['scenario'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.inputs.Align.CENTRE)
        .appendField("SCENARIO")
        .appendField(new Blockly.FieldTextInput("SCENARIO"), "ID");
    this.appendDummyInput()
        .setAlign(Blockly.inputs.Align.CENTRE)
        .appendField("INITIAL VIEW:")
        .appendField(new Blockly.FieldTextInput("VIEW"), "initial_view");
    this.appendDummyInput()
        .setAlign(Blockly.inputs.Align.CENTRE)
        .appendField("VIEWS:");
    this.appendStatementInput("VIEWS")
        .setCheck("view");
    this.appendDummyInput()
        .setAlign(Blockly.inputs.Align.CENTRE)
        .appendField("OBJECTS:");
    this.appendStatementInput("OBJECTS")
        .setCheck("object");
    this.appendDummyInput()
        .setAlign(Blockly.inputs.Align.CENTRE)
        .appendField("SOUNDS:");
    this.appendStatementInput("SOUNDS")
        .setCheck("sound");
    this.setPreviousStatement(true, "scenario");
    this.setNextStatement(true, "scenario");
    this.setColour('%{BKY_SCENARIOS}');
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['event'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.inputs.Align.CENTRE)
        .appendField("EVENT")
        .appendField(new Blockly.FieldTextInput("EVENT"), "ID");
    this.appendDummyInput()
        .setAlign(Blockly.inputs.Align.CENTRE)
        .appendField("CAN BE REPEATED")
        .appendField(new Blockly.FieldNumber(1,1,Infinity,1), "REPETITIONS")
        .appendField("TIMES");
    this.appendValueInput("IF")
        .setCheck("trigger")
        .appendField("IF");
    this.appendValueInput("DO")
        .setCheck("action")
        .appendField("DO");
    this.setPreviousStatement(true, "event");
    this.setNextStatement(true, "event");
    this.setColour('%{BKY_EVENTS}');
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['transition'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.inputs.Align.CENTRE)
        .appendField("TRANSITION")
        .appendField(new Blockly.FieldTextInput("TRANSITION"), "ID");
    this.appendStatementInput("STORY")
        .setCheck("story")
        .appendField("STORY: ");
    this.appendValueInput("VIEW")
        .setCheck("view")
        .appendField("VIEW:");
    this.appendEndRowInput('END');
    this.appendDummyInput()
        .appendField("NEXT ")
        .appendField(new Blockly.FieldDropdown([["TRANSITION","TRANSITION"], ["SCENARIO","SCENARIO"]]), "TYPE")
        .appendField(new Blockly.FieldTextInput("ID"), "NEXT");
    this.setPreviousStatement(true, "transition");
    this.setNextStatement(true, "transition");
    this.setColour('%{BKY_TRANSITIONS}');
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['object'] = {
  init: function() {
    this.appendDummyInput()
        .setAlign(Blockly.inputs.Align.CENTRE)
        .appendField("OBJECT")
        .appendField(new Blockly.FieldTextInput("OBJECT"), "ID");
    this.appendDummyInput()
        .setAlign(Blockly.inputs.Align.CENTRE)
        .appendField("INITIAL VIEW:")
        .appendField(new Blockly.FieldTextInput("VIEW"), "initial_view");
    this.appendDummyInput()
        .setAlign(Blockly.inputs.Align.CENTRE)
        .appendField("VIEWS:");
    this.appendStatementInput("VIEWS")
        .setCheck("view");
    this.appendDummyInput()
        .setAlign(Blockly.inputs.Align.CENTRE)
        .appendField("SOUNDS:");
    this.appendStatementInput("SOUNDS")
        .setCheck("sound");
    this.setPreviousStatement(true, "object");
    this.setNextStatement(true, "object");
    this.setColour('%{BKY_OBJECTS}');
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['sound'] = {
  init: function() {
    this.appendDummyInput('ID')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('SOUND ')
      .appendField(new Blockly.FieldTextInput('SOUND'), 'ID');
    this.appendDummyInput('NAME')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('LOOP:')
      .appendField(new Blockly.FieldCheckbox('FALSE'), 'LOOP');
    this.appendValueInput('SRC')
    .setAlign(Blockly.inputs.Align.CENTRE)
    .setCheck('url')
      .appendField('SOURCE:');
    this.setPreviousStatement(true, 'sound');
    this.setNextStatement(true, 'sound');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_SOUNDS}');
  }
};

Blockly.Blocks['view'] = {
  init: function() {
    this.appendDummyInput('ID')
      .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('VIEW')
      .appendField(new Blockly.FieldTextInput('VIEW'), 'ID');
    this.appendDummyInput('HITBOX')
    .setAlign(Blockly.inputs.Align.CENTRE)
    .appendField('HITBOX:')
    .appendField(new Blockly.FieldDropdown([
        ['DEFAULT', 'DEFAULT'],
        ['NO', 'NO'],
        ['ADVANCED', 'ADVANCED']
      ], this.onHitboxChange.bind(this)), 'HITBOX_TYPE');  // Associa a função de mudança
    this.appendValueInput('IMAGE')
      .setAlign(Blockly.inputs.Align.CENTRE)
      .setCheck('url')
      .appendField('IMAGE:');
    this.appendValueInput('POSITION')
      .setAlign(Blockly.inputs.Align.CENTRE)
      .setCheck('point')
      .appendField('POSITION:');
    this.appendValueInput('SIZE')
      .setAlign(Blockly.inputs.Align.CENTRE)
      .setCheck('point')
      .appendField('SIZE:');
    this.setPreviousStatement(true, 'view');
    this.setNextStatement(true, 'view');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_VIEWS}');
  },

  onHitboxChange: function(newValue) {
    this.updateAdvancedHitbox(newValue);
  },

  updateAdvancedHitbox: function(option) {
    // Remove o campo de advanced hitbox, se existir
    if (this.getInput('ADVANCED_HITBOX')) {
      this.removeInput('ADVANCED_HITBOX');
      this.removeInput('ADVANCED_HITBOX_LABEL');
    }

    // Adiciona o campo se a opção for "ADVANCED"
    if (option === 'ADVANCED') {
      this.appendDummyInput('ADVANCED_HITBOX_LABEL')
        .setAlign(Blockly.inputs.Align.CENTRE)
        .appendField('ADVANCED HITBOX:');
      this.appendStatementInput('ADVANCED_HITBOX')
        .setCheck('hitbox');

      this.moveInputBefore('ADVANCED_HITBOX', 'IMAGE');
      this.moveInputBefore('ADVANCED_HITBOX_LABEL', 'ADVANCED_HITBOX');
    }

    // Atualiza o layout do bloco
    this.render();
  }
};


Blockly.Blocks['view2'] = {
  init: function() {
    this.appendDummyInput()
      .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField("VIEW")
      .appendField(new Blockly.FieldTextInput("VIEW"), "ID");
    this.appendValueInput("IMAGE")
        .setCheck("url")
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField("IMAGE:");
    this.appendValueInput("POSITION")
        .setCheck("point")
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField("POSITION:");
    this.appendValueInput("SIZE")
        .setCheck("point")
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField("SIZE:");
    this.setOutput(true, "view");
    this.setColour('%{BKY_VIEWS}');
 this.setTooltip("");
 this.setHelpUrl("");
  }
};


//Logic blocks

Blockly.Blocks['not'] = {
init: function() {
  this.appendValueInput("TRIGGER1")
      .setCheck("trigger")
      .appendField("NOT");
  this.setOutput(true, "trigger");
  this.setColour('%{BKY_TRIGGERS}');
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['andpos'] = {
init: function() {
  this.appendValueInput("ACTION1")
      .setCheck("action");
  this.appendValueInput("ACTION2")
      .setCheck("action")
      .appendField("AND");
  this.appendEndRowInput('END');
  this.setOutput(true, "action");
  this.setColour('%{BKY_ACTIONS}');
this.setTooltip("");
this.setHelpUrl("");
}
};


Blockly.Blocks['andpre'] = {
init: function() {
  this.appendValueInput("TRIGGER1")
      .setCheck("trigger");
  this.appendValueInput("TRIGGER2")
      .setCheck("trigger")
      .appendField("AND");
  this.appendEndRowInput('END');
  this.setOutput(true, "trigger");
  this.setColour('%{BKY_TRIGGERS}');
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['or'] = {
init: function() {
  this.appendValueInput("TRIGGER1")
      .setCheck("trigger");
  this.appendValueInput("TRIGGER2")
      .setCheck("trigger")
      .appendField("OR");
  this.appendEndRowInput('END');
  this.setOutput(true, "trigger");
  this.setColour('%{BKY_TRIGGERS}');
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['parenteses'] = {
init: function() {
  this.appendValueInput("NAME")
      .setCheck("trigger")
      .appendField("(");
  this.appendEndRowInput()
      .appendField(")");
  this.setOutput(true, null);
  this.setColour('%{BKY_TRIGGERS}');
this.setTooltip("");
this.setHelpUrl("");
}
};

//Actions blocks

Blockly.Blocks['poscond_obj_muda_view'] = {
init: function() {
  this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput("OBJECT"), "OBJECT")
      .appendField("CHANGE TO")
      .appendField(new Blockly.FieldTextInput("VIEW"), "VIEW");
  this.setOutput(true, "action");
  this.setColour('%{BKY_ACTIONS}');
this.setTooltip("");
this.setHelpUrl("");
}
};


Blockly.Blocks['poscond_obj_vai_inv'] = {
init: function() {
  this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput("OBJECT"), "OBJECT")
      .appendField("GOES TO INVENTORY");
  this.setOutput(true, "action");
  this.setColour('%{BKY_ACTIONS}');
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['poscond_fim_de_jogo'] = {
init: function() {
  this.appendDummyInput()
      .appendField("END OF GAME");
  this.setOutput(true, "action");
  this.setColour('%{BKY_ACTIONS}');
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['poscond_mostra_msg'] = {
init: function() {
  this.appendValueInput("POSITION")
      .setCheck("point")
      .appendField("SHOW MESSAGE")
      .appendField(new Blockly.FieldTextInput("MESSAGE"), "MESSAGE")
      .appendField("IN");
  this.setOutput(true, "action");
  this.setColour('%{BKY_ACTIONS}');
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['poscond_obj_muda_tam'] = {
init: function() {
  this.appendValueInput("SIZE")
      .setCheck("point")
      .appendField(new Blockly.FieldTextInput("OBJECT"), "OBJECT_ID")
      .appendField("CHANGE SIZE TO");
  this.setOutput(true, "action");
  this.setColour('%{BKY_ACTIONS}');
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['poscond_obj_muda_pos'] = {
init: function() {
  this.appendValueInput("POSITION")
      .setCheck("point")
      .appendField(new Blockly.FieldTextInput("OBJECT"), "OBJECT_ID")
      .appendField("MOVE TO");
  this.setOutput(true, "action");
  this.setColour('%{BKY_ACTIONS}');
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['poscond_muda_cena'] = {
init: function() {
  this.appendDummyInput()
      .appendField("CHANGE TO SCENARIO")
      .appendField(new Blockly.FieldTextInput("SCENARIO"), "SCENARIO_ID");
  this.setOutput(true, "action");
  this.setColour('%{BKY_ACTIONS}');
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['poscond_remove_obj'] = {
init: function() {
  this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput("OBJECT"), "OBJECT_ID")
      .appendField("IS REMOVED");
  this.setOutput(true, "action");
  this.setColour('%{BKY_ACTIONS}');
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['poscond_comeca_des'] = {
init: function() {
  this.appendValueInput("CHALLENGE")
      .setCheck("challenge")
      .appendField("START CHALLENGE");
  this.setOutput(true, "action");
  this.setColour('%{BKY_ACTIONS}');
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['poscond_trans'] = {
init: function() {
  this.appendDummyInput()
      .appendField("CHANGE TO TRANSITION")
      .appendField(new Blockly.FieldTextInput("TRANSITION"), "TRANSITION_ID");
  this.setOutput(true, "action");
  this.setColour('%{BKY_ACTIONS}');
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['poscond_play_sound'] = {
init: function() {
  this.appendDummyInput()
      .appendField("PLAY")
      .appendField(new Blockly.FieldTextInput("SOUND"), "SOUND_ID")
      .appendField("OF")
      .appendField(new Blockly.FieldDropdown([["OBJECT","OBJECT"], ["SCENARIO","SCENARIO"]]), "SRC_TYPE")
      .appendField(new Blockly.FieldTextInput("ID"), "SRC");
  this.setOutput(true, "action");
  this.setColour('%{BKY_ACTIONS}');
this.setTooltip("");
this.setHelpUrl("");
}
};

//Triggers blocks

Blockly.Blocks['precond_click_obj'] = {
init: function() {
  this.appendDummyInput()
      .appendField("CLICK")
      .appendField(new Blockly.FieldTextInput("OBJECT"), "OBJECT_ID");
  this.setOutput(true, "trigger");
  this.setColour('%{BKY_TRIGGERS}');
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['precond_click_not_obj'] = {
init: function() {
  this.appendDummyInput()
      .appendField("CLICK NOT")
      .appendField(new Blockly.FieldTextInput("OBJECT"), "OBJECT_ID");
  this.setOutput(true, "trigger");
  this.setColour('%{BKY_TRIGGERS}');
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['precond_obj_is_view'] = {
init: function() {
  this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput("OBJECT"), "OBJECT_ID")
      .appendField("IS")
      .appendField(new Blockly.FieldTextInput("VIEW"), "VIEW_ID");
  this.setOutput(true, "trigger");
  this.setColour('%{BKY_TRIGGERS}');
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['precond_ev_already_hap'] = {
init: function() {
  this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput("EVENT"), "EVENT_ID")
      .appendField("ALREADY HAPPENED");
  this.setOutput(true, "trigger");
  this.setColour('%{BKY_TRIGGERS}');
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['precond_obj_in_use'] = {
init: function() {
  this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput("OBJECT"), "OBJECT_ID")
      .appendField("IS IN USE");
  this.setOutput(true, "trigger");
  this.setColour('%{BKY_TRIGGERS}');
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['precond_already_passed'] = {
init: function() {
  this.appendDummyInput()
      .appendField(new Blockly.FieldNumber(0, 0), "SECONDS")
      .appendField("SECONDS HAVE ALREADY PASSED");
  this.setOutput(true, "trigger");
  this.setColour('%{BKY_TRIGGERS}');
this.setTooltip("");
this.setHelpUrl("");
}
};

//Challenges blocks

Blockly.Blocks['challenge_question'] = {
init: function() {
  this.appendDummyInput()
      .appendField("CHALLENGE QUESTION");
  this.appendDummyInput()
      .appendField("QUESTION:")
      .appendField(new Blockly.FieldTextInput("QUESTION"), "QUESTION");
  this.appendDummyInput()
      .appendField("ANSWER:")
      .appendField(new Blockly.FieldTextInput("ANSWER"), "ANSWER");
  this.appendValueInput("SUCESS")
      .setCheck("action")
      .appendField("IF SUCESS DO:");
  this.appendValueInput("FAIL")
      .setCheck("action")
      .appendField("IF FAIL DO: ");
  this.setOutput(true, "challenge");
  this.setColour('%{BKY_CHALLENGES}');
this.setTooltip("");
this.setHelpUrl("");
}
};


Blockly.Blocks['challenge_motion'] = {
init: function() {
  this.appendDummyInput()
      .appendField("CHALLENGE MOTION");
  this.appendDummyInput()
      .appendField("MOTION OBJECT:")
      .appendField(new Blockly.FieldTextInput("OBJECT"), "MOTION_OBJECT");
  this.appendDummyInput()
      .appendField("TRIGGER OBJECT:")
      .appendField(new Blockly.FieldTextInput("OBJECT"), "TRIGGER_OBJECT");
  this.appendValueInput("SUCESS")
      .setCheck("action")
      .appendField("IF SUCESS DO:");
  this.appendValueInput("FAIL")
      .setCheck("action")
      .appendField("IF FAIL DO:");
  this.setOutput(true, "challenge");
  this.setColour('%{BKY_CHALLENGES}');
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['challenge_multiple_choice'] = {
init: function() {
  this.appendDummyInput()
      .appendField("CHALLENGE MULTIPLE CHOICE");
  this.appendDummyInput()
      .appendField("QUESTON:")
      .appendField(new Blockly.FieldTextInput("QUESTION"), "QUESTION");
  this.appendDummyInput()
      .appendField("CORRECT ANSWER:")
      .appendField(new Blockly.FieldTextInput("ANSWER"), "CORRECT_ANSWER");
  this.appendDummyInput()
      .appendField("WRONG ANSWER 1")
      .appendField(new Blockly.FieldTextInput("ANSWER"), "WRONG_ANSWER_1");
  this.appendDummyInput()
      .appendField("WRONG ANSWER 2")
      .appendField(new Blockly.FieldTextInput("ANSWER"), "WRONG_ANSWER_2");
  this.appendDummyInput()
      .appendField("WRONG ANSWER 3")
      .appendField(new Blockly.FieldTextInput("ANSWER"), "WRONG_ANSWER_3");
  this.appendValueInput("SUCESS")
      .setCheck("action")
      .appendField("IF SUCESS DO:");
  this.appendValueInput("FAIL")
      .setCheck("action")
      .appendField("IF FAIL DO:");
  this.setOutput(true, "challenge");
  this.setColour('%{BKY_CHALLENGES}');
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['challenge_connection'] = {
init: function() {
  this.appendDummyInput()
      .appendField("CHALLENGE CONNECTION");
  this.appendDummyInput()
      .appendField("QUESTION:")
      .appendField(new Blockly.FieldTextInput("QUESTION"), "QUESTION");
  this.appendDummyInput()
      .appendField("CONNECT 1:")
      .appendField(new Blockly.FieldTextInput("A1"), "A1")
      .appendField(new Blockly.FieldTextInput("B1"), "B1");
  this.appendDummyInput()
      .appendField("CONNECT 2:")
      .appendField(new Blockly.FieldTextInput("A2"), "A2")
      .appendField(new Blockly.FieldTextInput("B2"), "B2");
  this.appendDummyInput()
      .appendField("CONNECT 3:")
      .appendField(new Blockly.FieldTextInput("A3"), "A3")
      .appendField(new Blockly.FieldTextInput("B3"), "B3");
  this.appendDummyInput()
      .appendField("CONNECT 4:")
      .appendField(new Blockly.FieldTextInput("A4"), "A4")
      .appendField(new Blockly.FieldTextInput("B4"), "B4");
  this.appendValueInput("SUCESS")
      .setCheck("action")
      .appendField("IF SUCESS DO:");
  this.appendValueInput("FAIL")
      .setCheck("action")
      .appendField("IF FAIL DO: ");
  this.setOutput(true, "challenge");
  this.setColour('%{BKY_CHALLENGES}');
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['challenge_sequence'] = {
init: function() {
  this.appendDummyInput()
      .appendField("CHALLENGE SEQUENCE");
  this.appendDummyInput()
      .appendField("QUESTION:")
      .appendField(new Blockly.FieldTextInput("QUESTION"), "QUESTION");
  this.appendDummyInput()
      .appendField("SEQUENCE:")
      .appendField(new Blockly.FieldTextInput("A1"), "A1")
      .appendField(">>")
      .appendField(new Blockly.FieldTextInput("A2"), "A2")
      .appendField(">>")
      .appendField(new Blockly.FieldTextInput("A3"), "A3")
      .appendField(">>")
      .appendField(new Blockly.FieldTextInput("A4"), "A4");
  this.appendValueInput("SUCESS")
      .setCheck("action")
      .appendField("IF SUCESS DO:");
  this.appendValueInput("FAIL")
      .setCheck("action")
      .appendField("IF FAIL DO: ");
  this.setOutput(true, "challenge");
  this.setColour('%{BKY_CHALLENGES}');
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['custom_dropdown_block'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("IMAGE")
          .appendField(new Blockly.FieldDropdown([
            ["porta", "PORTA"],
            ["chave", "CHAVE"],
            ["cofre", "COFRE"]
          ], this.updateOptions.bind(this)), 'OPCAO1')
          .appendField(new Blockly.FieldDropdown(this.getSecondOptions.bind(this)), 'OPCAO2');
      this.setColour('%{BKY_UTILS}');
      this.setOutput(true, null);
      this.setTooltip('');
      this.setHelpUrl('');
    },
    // Função para atualizar as opções do segundo dropdown
    updateOptions: function(newValue) {
      const opcoes2 = this.getField('OPCAO2');
      opcoes2.menuGenerator_ = this.getSecondOptions(newValue);
      opcoes2.setValue(opcoes2.menuGenerator_[0][1]); // Define o valor padrão para a primeira opção
    },
    // Função para obter as opções do segundo dropdown com base na escolha do primeiro dropdown
    getSecondOptions: function(option1) {
      switch(option1) {
        case 'PORTA':
          return [
            ["ABERTA", "ABERTA"],
            ["FECHADA", "FECHADA"]
          ];
        case 'CHAVE':
          return [
            ["NORMAL", "NORMAL"],
            ["ATIVA", "ATIVA"]
          ];
        case 'COFRE':
          return [
            ["ABERTO", "ABERTO"],
            ["FECHADO", "FECHADO"]
          ];
        default:
          return [
            ["ABERTA", "ABERTA"],
            ["FECHADA", "FECHADA"]
          ];
      }
    }
  };

//UTILS

Blockly.Blocks['turn'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("TURN")
        .appendField(new Blockly.FieldDropdown([["HORIZONTALLY","HORIZONTALLY"], ["VERTICALLY","VERTICALLY"], ["VERTICALLY AND HORIZONTALLY","VERTICALLY_HORIZONTALLY"]]), "direction");
    this.appendStatementInput("VIEWS")
        .setCheck("view")
        .appendField("VIEW:");
    this.setPreviousStatement(true, "view");
    this.setNextStatement(true, "view");
    this.setColour('%{BKY_UTILS}');
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

//DRAWS

Blockly.Blocks['draw_rect'] = {
  init: function() {
    this.appendDummyInput('ID')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('RECT')
      .appendField(new Blockly.FieldTextInput('RECT'), 'ID');
    this.appendDummyInput('XY')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x:')
      .appendField(new Blockly.FieldNumber(100), 'X')
      .appendField('y:')
      .appendField(new Blockly.FieldNumber(100), 'Y');
    this.appendDummyInput('WH')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('w:')
      .appendField(new Blockly.FieldNumber(100), 'W')
      .appendField('h:')
      .appendField(new Blockly.FieldNumber(100), 'H');
    this.appendDummyInput('RADIUS-BORDER')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('tl:')
      .appendField(new Blockly.FieldNumber(0), 'TL')
      .appendField('tr:')
      .appendField(new Blockly.FieldNumber(0), 'TR')
      .appendField('br:')
      .appendField(new Blockly.FieldNumber(0), 'BR')
      .appendField('bl:')
      .appendField(new Blockly.FieldNumber(0), 'BL');
    this.setPreviousStatement(true, 'draw');
    this.setNextStatement(true, 'draw');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_DRAWS}');
  }
};

Blockly.Blocks['draw_quad'] = {
  init: function() {
    this.appendDummyInput('ID')
      .appendField('QUAD')
      .appendField(new Blockly.FieldTextInput('QUAD'), 'ID');
    this.appendDummyInput('P1')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x1:')
      .appendField(new Blockly.FieldNumber(100), 'X1')
      .appendField('y1:')
      .appendField(new Blockly.FieldNumber(100), 'Y1');
    this.appendDummyInput('P2')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x2:')
      .appendField(new Blockly.FieldNumber(100), 'X2')
      .appendField('y2:')
      .appendField(new Blockly.FieldNumber(200), 'Y2');
    this.appendDummyInput('P3')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x3:')
      .appendField(new Blockly.FieldNumber(200), 'X3')
      .appendField('y3:')
      .appendField(new Blockly.FieldNumber(200), 'Y3');
    this.appendDummyInput('P4')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x4:')
      .appendField(new Blockly.FieldNumber(200), 'X4')
      .appendField('y4:')
      .appendField(new Blockly.FieldNumber(100), 'Y4');
    this.setPreviousStatement(true, 'draw');
    this.setNextStatement(true, 'draw');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_DRAWS}');
  }
};

Blockly.Blocks['draw_square'] = {
  init: function() {
    this.appendDummyInput('ID')
      .appendField('SQUARE')
      .appendField(new Blockly.FieldTextInput('SQUARE'), 'ID');
    this.appendDummyInput('XY')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x:')
      .appendField(new Blockly.FieldNumber(100), 'X')
      .appendField('y:')
      .appendField(new Blockly.FieldNumber(100), 'Y')
      .appendField('s:')
      .appendField(new Blockly.FieldNumber(100), 'S');
    this.appendDummyInput('RADIUS-BORDER')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('tl:')
      .appendField(new Blockly.FieldNumber(0), 'TL')
      .appendField('tr:')
      .appendField(new Blockly.FieldNumber(0), 'TR')
      .appendField('br:')
      .appendField(new Blockly.FieldNumber(0), 'BR')
      .appendField('bl:')
      .appendField(new Blockly.FieldNumber(0), 'BL');
    this.setPreviousStatement(true, 'draw');
    this.setNextStatement(true, 'draw');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_DRAWS}');
  }
};

Blockly.Blocks['draw_triangle'] = {
  init: function() {
    this.appendDummyInput('ID')
      .appendField('TRIANGLE')
      .appendField(new Blockly.FieldTextInput('TRIANGLE'), 'ID');
    this.appendDummyInput('P1')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x1:')
      .appendField(new Blockly.FieldNumber(100), 'X1')
      .appendField('y1:')
      .appendField(new Blockly.FieldNumber(100), 'Y1');
    this.appendDummyInput('P2')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x2:')
      .appendField(new Blockly.FieldNumber(100), 'X2')
      .appendField('y2:')
      .appendField(new Blockly.FieldNumber(200), 'Y2');
    this.appendDummyInput('P3')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x3:')
      .appendField(new Blockly.FieldNumber(200), 'X3')
      .appendField('y3:')
      .appendField(new Blockly.FieldNumber(200), 'Y3');
    this.setPreviousStatement(true, 'draw');
    this.setNextStatement(true, 'draw');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_DRAWS}');
  }
};

Blockly.Blocks['draw_line']  = {
  init: function() {
    this.appendDummyInput('ID')
      .appendField('LINE')
      .appendField(new Blockly.FieldTextInput('LINE'), 'ID');
    this.appendDummyInput('P1')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x1:')
      .appendField(new Blockly.FieldNumber(100), 'X1')
      .appendField('y1:')
      .appendField(new Blockly.FieldNumber(100), 'Y1');
    this.appendDummyInput('P2')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x2:')
      .appendField(new Blockly.FieldNumber(200), 'X2')
      .appendField('y2:')
      .appendField(new Blockly.FieldNumber(200), 'Y2');
    this.setPreviousStatement(true, 'draw');
    this.setNextStatement(true, 'draw');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_DRAWS}');
  }
};

Blockly.Blocks['draw_point'] = {
  init: function() {
    this.appendDummyInput('ID')
      .appendField('POINT')
      .appendField(new Blockly.FieldTextInput('POINT'), 'ID');
    this.appendDummyInput('P')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x:')
      .appendField(new Blockly.FieldNumber(100), 'X')
      .appendField('y:')
      .appendField(new Blockly.FieldNumber(100), 'Y');
    this.setPreviousStatement(true, 'draw');
    this.setNextStatement(true, 'draw');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_DRAWS}');
  }
};

registerFieldAngle();
Blockly.Blocks['draw_arc'] = {
  init: function() {
    this.appendDummyInput('ID')
      .appendField('ARC')
      .appendField(new Blockly.FieldTextInput('ARC'), 'ID');
    this.appendDummyInput('XY')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x:')
      .appendField(new Blockly.FieldNumber(100), 'X')
      .appendField('y:')
      .appendField(new Blockly.FieldNumber(100), 'Y');
    this.appendDummyInput('WH')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('w:')
      .appendField(new Blockly.FieldNumber(100), 'W')
      .appendField('h:')
      .appendField(new Blockly.FieldNumber(100), 'H');
    this.appendDummyInput('start_stop')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('start:')
      .appendField(new FieldAngle(0), 'START')
      .appendField('stop:')
      .appendField(new FieldAngle(90), 'STOP');
    this.appendDummyInput('mode')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('mode:')
      .appendField(new Blockly.FieldDropdown([
          ['DEFAULT', 'default'],
          ['OPEN', 'open'],
          ['CHORD', 'chord'],
          ['PIE', 'pie']
        ]), 'MODE');
    this.setPreviousStatement(true, 'draw');
    this.setNextStatement(true, 'draw');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_DRAWS}');
  }
};

Blockly.Blocks['draw_circle'] = {
  init: function() {
    this.appendDummyInput('ID')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('CIRCLE')
      .appendField(new Blockly.FieldTextInput('CIRCLE'), 'ID');
    this.appendDummyInput('XYD')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x:')
      .appendField(new Blockly.FieldNumber(100), 'X')
      .appendField('y:')
      .appendField(new Blockly.FieldNumber(100), 'Y')
      .appendField('d:')
      .appendField(new Blockly.FieldNumber(100), 'D');
    this.setPreviousStatement(true, 'draw');
    this.setNextStatement(true, 'draw');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_DRAWS}');
  }
};

Blockly.Blocks['draw_ellipse']  = {
  init: function() {
    this.appendDummyInput('ID')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('ELLIPSE')
      .appendField(new Blockly.FieldTextInput('ELLIPSE'), 'ID');
    this.appendDummyInput('XYWH')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x:')
      .appendField(new Blockly.FieldNumber(100), 'X')
      .appendField('y:')
      .appendField(new Blockly.FieldNumber(100), 'Y')
      .appendField('w:')
      .appendField(new Blockly.FieldNumber(100), 'W')
      .appendField('h:')
      .appendField(new Blockly.FieldNumber(100), 'H');
    this.setPreviousStatement(true, 'draw');
    this.setNextStatement(true, 'draw');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_DRAWS}');
  }
};

Blockly.Blocks['begin_clip']  = {
  init: function() {
    this.appendDummyInput('NAME')
      .appendField('Begin Clip');
    this.setPreviousStatement(true, 'draw');
    this.setNextStatement(true, 'draw');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_DRAWS}');
  }
};

Blockly.Blocks['end_clip']  = {
  init: function() {
    this.appendDummyInput('NAME')
      .appendField('End Clip');
    this.setPreviousStatement(true, 'draw');
    this.setNextStatement(true, 'draw');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_DRAWS}');
  }
};

Blockly.Blocks['no_fill']  = {
  init: function() {
    this.appendDummyInput('NAME')
      .appendField('No Fill');
    this.setPreviousStatement(true, 'draw');
    this.setNextStatement(true, 'draw');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_DRAWS}');
  }
};

Blockly.Blocks['no_stroke']  = {
  init: function() {
    this.appendDummyInput('NAME')
      .appendField('No Stroke');
    this.setPreviousStatement(true, 'draw');
    this.setNextStatement(true, 'draw');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_DRAWS}');
  }
};


Blockly.Blocks['no_erase']  = {
  init: function() {
    this.appendDummyInput('NAME')
      .appendField('No Erase');
    this.setPreviousStatement(true, 'draw');
    this.setNextStatement(true, 'draw');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_DRAWS}');
  }
};

Blockly.Blocks['erase']  = {
  init: function() {
    this.appendDummyInput('NAME')
      .appendField('Erase');
    this.setPreviousStatement(true, 'draw');
    this.setNextStatement(true, 'draw');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_DRAWS}');
  }
};

Blockly.Blocks['fill'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('Fill ')
      .appendField(new FieldColourHsvSliders('#ff0000'), 'COLOUR')
      .appendField('opacity: ')
      .appendField(new Blockly.FieldNumber(255, 0, 255, 1), 'ALPHA');
    this.setStyle('colour_blocks');
    this.setPreviousStatement(true, 'draw');
    this.setNextStatement(true, 'draw');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_DRAWS}');
  },
};

Blockly.Blocks['stroke'] = {
  init: function () {
    this.appendDummyInput()
      .appendField('Stroke ')
      .appendField(new FieldColourHsvSliders('#ff0000'), 'COLOUR')
      .appendField('size: ')
      .appendField(new Blockly.FieldNumber(1), 'W')
      .appendField('opacity: ')
      .appendField(new Blockly.FieldNumber(255, 0, 255, 1), 'ALPHA');
    this.setStyle('colour_blocks');
    this.setPreviousStatement(true, 'draw');
    this.setNextStatement(true, 'draw');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_DRAWS}');
  },
};


Blockly.Blocks['view_draw'] = {
  init: function() {
    this.appendDummyInput('NAME')
      .appendField('VIEW SKETCH')
      .appendField(new Blockly.FieldTextInput('SKETCH'), 'ID');
    this.appendDummyInput('HITBOX')
      .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('HITBOX:')
      .appendField(new Blockly.FieldDropdown([
        ['DEFAULT', 'DEFAULT'],
        ['NO', 'NO'],
        ['ADVANCED', 'ADVANCED']
      ], this.onHitboxChange.bind(this)), 'HITBOX_TYPE');  // Associa a função de mudança
    this.appendDummyInput('DRAWS_TITLE')
      .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('DRAWS:')
    this.appendStatementInput('DRAWS')
      .setCheck('draw');
    this.setPreviousStatement(true, 'view');
    this.setNextStatement(true, 'view');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_VIEWS}');
  },

  onHitboxChange: function(newValue) {
    this.updateAdvancedHitbox(newValue);
  },

  updateAdvancedHitbox: function(option) {
    // Remove o campo de advanced hitbox, se existir
    if (this.getInput('ADVANCED_HITBOX')) {
      this.removeInput('ADVANCED_HITBOX');
      this.removeInput('ADVANCED_HITBOX_LABEL');
    }

    // Adiciona o campo se a opção for "ADVANCED"
    if (option === 'ADVANCED') {
      this.appendDummyInput('ADVANCED_HITBOX_LABEL')
        .setAlign(Blockly.inputs.Align.CENTRE)
        .appendField('ADVANCED HITBOX:');
      this.appendStatementInput('ADVANCED_HITBOX')
        .setCheck('hitbox');

      this.moveInputBefore('ADVANCED_HITBOX', 'DRAWS_TITLE');
      this.moveInputBefore('ADVANCED_HITBOX_LABEL', 'ADVANCED_HITBOX');
    }

    // Atualiza o layout do bloco
    this.render();
  }
};

Blockly.Blocks['hitbox_rect'] = {
  init: function() {
    this.appendDummyInput('ID')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('RECT')
      .appendField(new Blockly.FieldTextInput('RECT'), 'ID');
    this.appendDummyInput('XY')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x:')
      .appendField(new Blockly.FieldNumber(100), 'X')
      .appendField('y:')
      .appendField(new Blockly.FieldNumber(100), 'Y');
    this.appendDummyInput('WH')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('w:')
      .appendField(new Blockly.FieldNumber(100), 'W')
      .appendField('h:')
      .appendField(new Blockly.FieldNumber(100), 'H');
    this.setPreviousStatement(true, 'hitbox');
    this.setNextStatement(true, 'hitbox');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_HITBOXES}');
  }
};

Blockly.Blocks['hitbox_quad'] = {
  init: function() {
    this.appendDummyInput('ID')
      .appendField('QUAD')
      .appendField(new Blockly.FieldTextInput('QUAD'), 'ID');
    this.appendDummyInput('P1')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x1:')
      .appendField(new Blockly.FieldNumber(100), 'X1')
      .appendField('y1:')
      .appendField(new Blockly.FieldNumber(100), 'Y1');
    this.appendDummyInput('P2')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x2:')
      .appendField(new Blockly.FieldNumber(100), 'X2')
      .appendField('y2:')
      .appendField(new Blockly.FieldNumber(200), 'Y2');
    this.appendDummyInput('P3')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x3:')
      .appendField(new Blockly.FieldNumber(200), 'X3')
      .appendField('y3:')
      .appendField(new Blockly.FieldNumber(200), 'Y3');
    this.appendDummyInput('P4')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x4:')
      .appendField(new Blockly.FieldNumber(200), 'X4')
      .appendField('y4:')
      .appendField(new Blockly.FieldNumber(100), 'Y4');
      this.setPreviousStatement(true, 'hitbox');
      this.setNextStatement(true, 'hitbox');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_HITBOXES}');
  }
};

Blockly.Blocks['hitbox_square'] = {
  init: function() {
    this.appendDummyInput('ID')
      .appendField('SQUARE')
      .appendField(new Blockly.FieldTextInput('SQUARE'), 'ID');
    this.appendDummyInput('XY')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x:')
      .appendField(new Blockly.FieldNumber(100), 'X')
      .appendField('y:')
      .appendField(new Blockly.FieldNumber(100), 'Y')
      .appendField('s:')
      .appendField(new Blockly.FieldNumber(100), 'S');
    this.setPreviousStatement(true, 'hitbox');
    this.setNextStatement(true, 'hitbox');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_HITBOXES}');
  }
};

Blockly.Blocks['hitbox_triangle'] = {
  init: function() {
    this.appendDummyInput('ID')
      .appendField('TRIANGLE')
      .appendField(new Blockly.FieldTextInput('TRIANGLE'), 'ID');
    this.appendDummyInput('P1')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x1:')
      .appendField(new Blockly.FieldNumber(100), 'X1')
      .appendField('y1:')
      .appendField(new Blockly.FieldNumber(100), 'Y1');
    this.appendDummyInput('P2')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x2:')
      .appendField(new Blockly.FieldNumber(100), 'X2')
      .appendField('y2:')
      .appendField(new Blockly.FieldNumber(200), 'Y2');
    this.appendDummyInput('P3')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x3:')
      .appendField(new Blockly.FieldNumber(200), 'X3')
      .appendField('y3:')
      .appendField(new Blockly.FieldNumber(200), 'Y3');
    this.setPreviousStatement(true, 'hitbox');
    this.setNextStatement(true, 'hitbox');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_HITBOXES}');
  }
};

Blockly.Blocks['hitbox_line']  = {
  init: function() {
    this.appendDummyInput('ID')
      .appendField('LINE')
      .appendField(new Blockly.FieldTextInput('LINE'), 'ID');
    this.appendDummyInput('P1')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x1:')
      .appendField(new Blockly.FieldNumber(100), 'X1')
      .appendField('y1:')
      .appendField(new Blockly.FieldNumber(100), 'Y1');
    this.appendDummyInput('P2')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x2:')
      .appendField(new Blockly.FieldNumber(200), 'X2')
      .appendField('y2:')
      .appendField(new Blockly.FieldNumber(200), 'Y2');
    this.setPreviousStatement(true, 'hitbox');
    this.setNextStatement(true, 'hitbox');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_HITBOXES}');
  }
};

Blockly.Blocks['hitbox_point'] = {
  init: function() {
    this.appendDummyInput('ID')
      .appendField('POINT')
      .appendField(new Blockly.FieldTextInput('POINT'), 'ID');
    this.appendDummyInput('P')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x:')
      .appendField(new Blockly.FieldNumber(100), 'X')
      .appendField('y:')
      .appendField(new Blockly.FieldNumber(100), 'Y');
    this.setPreviousStatement(true, 'hitbox');
    this.setNextStatement(true, 'hitbox');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_HITBOXES}');
  }
};

registerFieldAngle();
Blockly.Blocks['hitbox_arc'] = {
  init: function() {
    this.appendDummyInput('ID')
      .appendField('ARC')
      .appendField(new Blockly.FieldTextInput('ARC'), 'ID');
    this.appendDummyInput('XY')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x:')
      .appendField(new Blockly.FieldNumber(100), 'X')
      .appendField('y:')
      .appendField(new Blockly.FieldNumber(100), 'Y');
    this.appendDummyInput('WH')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('w:')
      .appendField(new Blockly.FieldNumber(100), 'W')
      .appendField('h:')
      .appendField(new Blockly.FieldNumber(100), 'H');
    this.appendDummyInput('start_stop')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('start:')
      .appendField(new FieldAngle(0), 'START')
      .appendField('stop:')
      .appendField(new FieldAngle(90), 'STOP');
    this.appendDummyInput('mode')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('mode:')
      .appendField(new Blockly.FieldDropdown([
          ['DEFAULT', 'default'],
          ['OPEN', 'open'],
          ['CHORD', 'chord'],
          ['PIE', 'pie']
        ]), 'MODE');
    this.setPreviousStatement(true, 'hitbox');
    this.setNextStatement(true, 'hitbox');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_HITBOXES}');
  }
};

Blockly.Blocks['hitbox_circle'] = {
  init: function() {
    this.appendDummyInput('ID')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('CIRCLE')
      .appendField(new Blockly.FieldTextInput('CIRCLE'), 'ID');
    this.appendDummyInput('XYD')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x:')
      .appendField(new Blockly.FieldNumber(100), 'X')
      .appendField('y:')
      .appendField(new Blockly.FieldNumber(100), 'Y')
      .appendField('d:')
      .appendField(new Blockly.FieldNumber(100), 'D');
    this.setPreviousStatement(true, 'hitbox');
    this.setNextStatement(true, 'hitbox');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_HITBOXES}');
  }
};

Blockly.Blocks['hitbox_ellipse']  = {
  init: function() {
    this.appendDummyInput('ID')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('ELLIPSE')
      .appendField(new Blockly.FieldTextInput('ELLIPSE'), 'ID');
    this.appendDummyInput('XYWH')
    .setAlign(Blockly.inputs.Align.CENTRE)
      .appendField('x:')
      .appendField(new Blockly.FieldNumber(100), 'X')
      .appendField('y:')
      .appendField(new Blockly.FieldNumber(100), 'Y')
      .appendField('w:')
      .appendField(new Blockly.FieldNumber(100), 'W')
      .appendField('h:')
      .appendField(new Blockly.FieldNumber(100), 'H');
    this.setPreviousStatement(true, 'hitbox');
    this.setNextStatement(true, 'hitbox');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour('%{BKY_HITBOXES}');
  }
};