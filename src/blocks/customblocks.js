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
 * @fileoverview Define custom blocks.
 * @author samelh@google.com (Sam El-Husseini)
 */

// More on defining blocks:
// https://developers.google.com/blockly/guides/create-custom-blocks/define-blocks

import * as Blockly from 'blockly/core';

// Since we're using json to initialize the field, we'll need to import it.
import '../fields/BlocklyReactField';
import '../fields/DateField';

import '@blockly/field-date';

Blockly.Blocks['escape_room'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Escape Room");
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("My Escape Room"), "TITLE");
    this.appendValueInput("SIZE")
        .setCheck("size")
        .appendField("size : ");
    this.appendStatementInput("SCENARIOS")
        .setCheck("scenario")
        .appendField("scenarios : ");
    this.appendStatementInput("EVENTS")
        .setCheck("event")
        .appendField("events : ");
    this.appendStatementInput("TRANSITIONS")
        .setCheck("transition")
        .appendField("transitions :");
    this.setColour(60);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['size'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Size (")
        .appendField(new Blockly.FieldNumber(0, 0), "x")
        .appendField(",")
        .appendField(new Blockly.FieldNumber(0, 0), "y")
        .appendField(")");
    this.setInputsInline(false);
    this.setOutput(true, "size");
    this.setColour(20);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['position'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Position (")
        .appendField(new Blockly.FieldNumber(0, 0, 1280), "x")
        .appendField(",")
        .appendField(new Blockly.FieldNumber(0, 0, 720), "y")
        .appendField(")");
    this.setInputsInline(false);
    this.setOutput(true, "position");
    this.setColour(20);
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
    this.setColour(20);
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
    this.setColour(20);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['scenario'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Scenario");
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("My Scene"), "ID");
    this.appendDummyInput()
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField("Initial view :")
        .appendField(new Blockly.FieldTextInput("initial_view"), "initial_view");
    this.appendStatementInput("VIEWS")
        .setCheck("view")
        .appendField("views :");
    this.appendStatementInput("OBJECTS")
        .setCheck("object")
        .appendField("objects :");
    this.setPreviousStatement(true, "scenario");
    this.setNextStatement(true, "scenario");
    this.setColour(60);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['event'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Event");
    this.appendValueInput("IF")
        .setCheck("trigger")
        .appendField("if");
    this.appendValueInput("DO")
        .setCheck("action")
        .appendField("do");
    this.setPreviousStatement(true, "event");
    this.setNextStatement(true, "event");
    this.setColour(60);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['event_do'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Event");
    this.appendValueInput("DO")
        .setCheck("action")
        .appendField("do");
    this.setOutput(true, null);
    this.setColour(60);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['transition'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Transition");
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("My Transition"), "ID");
    this.appendStatementInput("STORY")
        .setCheck("story")
        .appendField("story : ");
    this.appendValueInput("VIEW")
        .setCheck("view")
        .appendField("view :");
    this.setPreviousStatement(true, "transition");
    this.setNextStatement(true, "transition");
    this.setColour(60);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['object'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Object");
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("My Object"), "ID");
    this.appendDummyInput()
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField("Initial view :")
        .appendField(new Blockly.FieldTextInput("initial_view"), "initial_view");
    this.appendStatementInput("VIEWS")
        .setCheck("view")
        .appendField("views :");
    this.setPreviousStatement(true, "object");
    this.setNextStatement(true, "object");
    this.setColour(60);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.Blocks['view'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("View");
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("My View"), "ID");
    this.appendValueInput("IMAGE")
        .setCheck("url")
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField("image :");
    this.appendValueInput("POSITION")
        .setCheck("position")
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField("position :");
    this.appendValueInput("SIZE")
        .setCheck("size")
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField("size :");
    this.setPreviousStatement(true, "view");
    this.setNextStatement(true, "view");
    this.setColour(60);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};


Blockly.Blocks['view2'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("View");
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput("My View"), "ID");
    this.appendValueInput("IMAGE")
        .setCheck("url")
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField("image :");
    this.appendValueInput("POSITION")
        .setCheck("position")
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField("position :");
    this.appendValueInput("SIZE")
        .setCheck("size")
        .setAlign(Blockly.inputs.Align.RIGHT)
        .appendField("size :");
    this.setOutput(true, "view");
    this.setColour(60);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};


//Logic blocks

Blockly.Blocks['not'] = {
init: function() {
  this.appendValueInput("TRIGGER1")
      .setCheck("trigger")
      .appendField("not");
  this.setOutput(true, "trigger");
  this.setColour(270);
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
      .appendField("and");
  this.setOutput(true, "action");
  this.setColour(180);
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
      .appendField("and");
  this.setOutput(true, "trigger");
  this.setColour(270);
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['or'] = {
init: function() {
  this.appendValueInput("TRIGGER1")
      .setCheck("trigger");
  this.appendValueInput("TRIGGER1")
      .setCheck("trigger")
      .appendField("or");
  this.setOutput(true, "trigger");
  this.setColour(270);
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
  this.setColour(270);
this.setTooltip("");
this.setHelpUrl("");
}
};

//Actions blocks

Blockly.Blocks['poscond_obj_muda_view'] = {
init: function() {
  this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput("object_id"), "OBJECT")
      .appendField("change to")
      .appendField(new Blockly.FieldTextInput("view_id"), "VIEW");
  this.setOutput(true, "action");
  this.setColour(180);
this.setTooltip("");
this.setHelpUrl("");
}
};


Blockly.Blocks['poscond_obj_vai_inv'] = {
init: function() {
  this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput("object_id"), "OBJECT")
      .appendField("goes to inventory");
  this.setOutput(true, "action");
  this.setColour(180);
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['poscond_fim_de_jogo'] = {
init: function() {
  this.appendDummyInput()
      .appendField("end of game");
  this.setOutput(true, "action");
  this.setColour(180);
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['poscond_mostra_msg'] = {
init: function() {
  this.appendValueInput("NAME")
      .setCheck("position")
      .appendField("show message")
      .appendField(new Blockly.FieldTextInput("message"), "MESSAGE")
      .appendField("in");
  this.setOutput(true, "action");
  this.setColour(180);
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['poscond_obj_muda_tam'] = {
init: function() {
  this.appendValueInput("NAME")
      .setCheck("size")
      .appendField(new Blockly.FieldTextInput("object_id"), "OBJECT_ID")
      .appendField("change size to");
  this.setOutput(true, "action");
  this.setColour(180);
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['poscond_obj_muda_pos'] = {
init: function() {
  this.appendValueInput("NAME")
      .setCheck("position")
      .appendField(new Blockly.FieldTextInput("object_id"), "OBJECT_ID")
      .appendField("move to");
  this.setOutput(true, "action");
  this.setColour(180);
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['poscond_muda_cena'] = {
init: function() {
  this.appendDummyInput()
      .appendField("change to scenario")
      .appendField(new Blockly.FieldTextInput("scenario_id"), "SCENARIO_ID");
  this.setOutput(true, "action");
  this.setColour(180);
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['poscond_remove_obj'] = {
init: function() {
  this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput("object_id"), "OBJECT_ID")
      .appendField("is removed");
  this.setOutput(true, "action");
  this.setColour(180);
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['poscond_comeca_des'] = {
init: function() {
  this.appendValueInput("CHALLENGE")
      .setCheck("challenge")
      .appendField("start challenge");
  this.setOutput(true, "action");
  this.setColour(180);
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['poscond_trans'] = {
init: function() {
  this.appendDummyInput()
      .appendField("transition")
      .appendField(new Blockly.FieldTextInput("transition_id"), "TRANSITION_ID");
  this.setOutput(true, "action");
  this.setColour(180);
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['poscond_play_sound'] = {
init: function() {
  this.appendDummyInput()
      .appendField("play")
      .appendField(new Blockly.FieldTextInput("sound_id"), "SOUND_ID")
      .appendField("of")
      .appendField(new Blockly.FieldTextInput("object_id/scenario_id"), "ID");
  this.setOutput(true, "action");
  this.setColour(180);
this.setTooltip("");
this.setHelpUrl("");
}
};

//Triggers blocks

Blockly.Blocks['precond_click_obj'] = {
init: function() {
  this.appendDummyInput()
      .appendField("click")
      .appendField(new Blockly.FieldTextInput("object_id"), "OBJECT_ID");
  this.setOutput(true, "trigger");
  this.setColour(270);
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['precond_click_not_obj'] = {
init: function() {
  this.appendDummyInput()
      .appendField("click not")
      .appendField(new Blockly.FieldTextInput("object_id"), "OBJECT_ID");
  this.setOutput(true, "trigger");
  this.setColour(270);
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['precond_obj_is_view'] = {
init: function() {
  this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput("object_id"), "OBJECT_ID")
      .appendField("is")
      .appendField(new Blockly.FieldTextInput("view_id"), "VIEW_ID");
  this.setOutput(true, "trigger");
  this.setColour(270);
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['precond_ev_already_hap'] = {
init: function() {
  this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput("event_id"), "EVENT_ID")
      .appendField("already happened");
  this.setOutput(true, "trigger");
  this.setColour(270);
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['precond_obj_in_use'] = {
init: function() {
  this.appendDummyInput()
      .appendField(new Blockly.FieldTextInput("object_id"), "OBJECT_ID")
      .appendField("is in use");
  this.setOutput(true, "trigger");
  this.setColour(270);
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['precond_already_passed'] = {
init: function() {
  this.appendDummyInput()
      .appendField(new Blockly.FieldNumber(0, 0), "SECONDS")
      .appendField("seconds have already passed");
  this.setOutput(true, "trigger");
  this.setColour(270);
this.setTooltip("");
this.setHelpUrl("");
}
};

//Challenges blocks

Blockly.Blocks['challenge_question'] = {
init: function() {
  this.appendDummyInput()
      .appendField("Challenge Question");
  this.appendDummyInput()
      .appendField("question :")
      .appendField(new Blockly.FieldTextInput("question"), "QUESTION");
  this.appendDummyInput()
      .appendField("answer :")
      .appendField(new Blockly.FieldTextInput("answer"), "ANSWER");
  this.appendValueInput("SUCESS")
      .setCheck("event_do")
      .appendField("sucess :");
  this.appendValueInput("FAIL")
      .setCheck("event_do")
      .appendField("fail : ");
  this.setOutput(true, "challenge");
  this.setColour(345);
this.setTooltip("");
this.setHelpUrl("");
}
};


Blockly.Blocks['challenge_motion'] = {
init: function() {
  this.appendDummyInput()
      .appendField("Challenge Motion");
  this.appendDummyInput()
      .appendField("motion_object")
      .appendField(new Blockly.FieldTextInput("object_id"), "MOTION_OBJECT");
  this.appendDummyInput()
      .appendField("trigger_object")
      .appendField(new Blockly.FieldTextInput("object_id"), "TRIGGER_OBJECT");
  this.appendValueInput("SUCESS")
      .setCheck("event_do")
      .appendField("sucess :");
  this.appendValueInput("FAIL")
      .setCheck("event_do")
      .appendField("fail : ");
  this.setOutput(true, "challenge");
  this.setColour(345);
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['challenge_multiple_choice'] = {
init: function() {
  this.appendDummyInput()
      .appendField("Challenge Multiple Choice");
  this.appendDummyInput()
      .appendField("question :")
      .appendField(new Blockly.FieldTextInput("question"), "QUESTION");
  this.appendDummyInput()
      .appendField("correct answer")
      .appendField(new Blockly.FieldTextInput("answer"), "CORRECT_ANSWER");
  this.appendDummyInput()
      .appendField("wrong answer 1")
      .appendField(new Blockly.FieldTextInput("answer"), "WRONG_ANSWER_1");
  this.appendDummyInput()
      .appendField("wrong answer 2")
      .appendField(new Blockly.FieldTextInput("answer"), "WRONG_ANSWER_2");
  this.appendDummyInput()
      .appendField("wrong answer 3")
      .appendField(new Blockly.FieldTextInput("answer"), "WRONG_ANSWER_3");
  this.appendValueInput("SUCESS")
      .setCheck("event_do")
      .appendField("sucess :");
  this.appendValueInput("FAIL")
      .setCheck("event_do")
      .appendField("fail : ");
  this.setOutput(true, "challenge");
  this.setColour(345);
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['challenge_connection'] = {
init: function() {
  this.appendDummyInput()
      .appendField("Challenge Connection");
  this.appendDummyInput()
      .appendField("question :")
      .appendField(new Blockly.FieldTextInput("question"), "QUESTION");
  this.appendDummyInput()
      .appendField("connect 1 :")
      .appendField(new Blockly.FieldTextInput("a1"), "A1")
      .appendField(new Blockly.FieldTextInput("b1"), "B1");
  this.appendDummyInput()
      .appendField("connect 2 :")
      .appendField(new Blockly.FieldTextInput("a2"), "A2")
      .appendField(new Blockly.FieldTextInput("b2"), "B2");
  this.appendDummyInput()
      .appendField("connect 3 :")
      .appendField(new Blockly.FieldTextInput("a3"), "A3")
      .appendField(new Blockly.FieldTextInput("b3"), "B3");
  this.appendDummyInput()
      .appendField("connect 4 :")
      .appendField(new Blockly.FieldTextInput("a4"), "A4")
      .appendField(new Blockly.FieldTextInput("b4"), "B4");
  this.appendValueInput("SUCESS")
      .setCheck("event_do")
      .appendField("sucess :");
  this.appendValueInput("FAIL")
      .setCheck("event_do")
      .appendField("fail : ");
  this.setOutput(true, "challenge");
  this.setColour(345);
this.setTooltip("");
this.setHelpUrl("");
}
};

Blockly.Blocks['challenge_sequence'] = {
init: function() {
  this.appendDummyInput()
      .appendField("Challenge Sequence");
  this.appendDummyInput()
      .appendField("question :")
      .appendField(new Blockly.FieldTextInput("question"), "QUESTION");
  this.appendDummyInput()
      .appendField("sequence :")
      .appendField(new Blockly.FieldTextInput("a1"), "A1")
      .appendField(">>")
      .appendField(new Blockly.FieldTextInput("a2"), "A2")
      .appendField(">>")
      .appendField(new Blockly.FieldTextInput("a3"), "A3")
      .appendField(">>")
      .appendField(new Blockly.FieldTextInput("a4"), "A4");
  this.appendValueInput("SUCESS")
      .setCheck("event_do")
      .appendField("sucess :");
  this.appendValueInput("FAIL")
      .setCheck("event_do")
      .appendField("fail : ");
  this.setOutput(true, "challenge");
  this.setColour(345);
this.setTooltip("");
this.setHelpUrl("");
}
};