import React from 'react';

import BlocklyComponent, {Category, Block, Value, Field, Shadow} from './Blockly';

import './blocks/customblocks';
import './generator/generator';
import './BlockEditor.css'

function BlockEditor() {

  

  return (
        <BlocklyComponent
          readOnly={false}
          trashcan={true}
          media={'media/'}
          move={{
            scrollbars: true,
            drag: true,
            wheel: true,
          }}
          initialXml={`
<xml>
  <block type="escape_room" x="10" y="10">
    <statement name="SCENARIOS">
      <block type="scenario">
        <statement name="VIEWS">
            <block type="view">
              <field name="ID">initial_view</field>
              <value name="SIZE">
                <block type="size">
                  <field name="x">0</field>
                  <field name="y">0</field>
                </block>
              </value>
              <value name="POSITION">
                <block type="position">
                  <field name="x">0</field>
                  <field name="y">0</field>
                </block>
              </value>
              <value name="IMAGE">
                <block type="image">
                </block>
              </value>
            </block>
        </statement>
        <statement name="OBJECTS">
            <block type="object">
              <statement name="VIEWS">
                  <block type="view">
                    <field name="ID">initial_view</field>
                    <value name="SIZE">
                      <block type="size">
                        <field name="x">225</field>
                        <field name="y">300</field>
                      </block>
                    </value>
                    <value name="POSITION">
                      <block type="position">
                        <field name="x">600</field>
                        <field name="y">342</field>
                      </block>
                    </value>
                    <value name="IMAGE">
                      <block type="image">
                        <field name="IMAGE">door</field>
                      </block>
                    </value>
                  </block>
              </statement>
            </block>
        </statement>
      </block>
    </statement>
  </block>
</xml>
      `}>
        <Category name="Classes">
            <Block type="scenario"/>
            <Block type="view"/>
            <Block type="view2"/>
            <Block type="object"/>
            <Block type="transition"/>
            <Block type="event"/>
            <Block type="event_do"/>
        </Category>
        <Category name="Utils">
            <Block type="size"/>
            <Block type="position"/>
            <Block type="url"/>
            <Block type="image"/>
            <Block type="story"/>
        </Category>
        <Category name="Triggers">
            <Block type="precond_click_obj"/>
            <Block type="precond_click_not_obj"/>
            <Block type="precond_obj_is_view"/>
            <Block type="precond_ev_already_hap"/>
            <Block type="precond_obj_in_use"/>
            <Block type="precond_already_passed"/>
            <Block type="not"/>
            <Block type="andpre"/>
            <Block type="or"/>
            <Block type="parenteses"/>
        </Category>
        <Category name="Actions">
            <Block type="poscond_obj_muda_view"/>
            <Block type="poscond_obj_vai_inv"/>
            <Block type="poscond_fim_de_jogo"/>
            <Block type="poscond_mostra_msg"/>
            <Block type="poscond_obj_muda_tam"/>
            <Block type="poscond_obj_muda_pos"/>
            <Block type="poscond_muda_cena"/>
            <Block type="poscond_remove_obj"/>
            <Block type="poscond_comeca_des"/>
            <Block type="poscond_trans"/>
            <Block type="poscond_play_sound"/>
            <Block type="andpos"/>
        </Category>
        <Category name="Challenges">
            <Block type="challenge_question"/>
            <Block type="challenge_motion"/>  
            <Block type="challenge_multiple_choice"/>
            <Block type="challenge_connection"/>
            <Block type="challenge_sequence"/>
        </Category>
        </BlocklyComponent>
  );
}

export default BlockEditor;
