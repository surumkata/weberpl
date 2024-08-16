const INITIAL =
  `<xml>
  <block type="escape_room" x="10" y="10">
    <field name="TYPE">SCENARIO</field>
    <field name="START">SCENARIO_1</field>
    <statement name="SCENARIOS">
      <block type="scenario">
        <statement name="VIEWS">
            <block type="view">
              <field name="ID">VIEW_1</field>
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
                    <field name="ID">VIEW_1</field>
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
</xml>`;

const TOOLBOX =
  '<xml xmlns="http://www.w3.org/1999/xhtml" id="toolbox" style="display: none;">\n' +
  '  <category name="Classes" colour="#5C81A6">\n' +
  '    <block type="scenario"></block>\n' +
  '    <block type="view"></block>\n' +
  '    <block type="view2"></block>\n' +
  '    <block type="object"></block>\n' +
  '    <block type="transition"></block>\n' +
  '    <block type="event"></block>\n' +
  '    <block type="event_do"></block>\n' +
  '  </category>\n' +
  '  <category name="Utils" colour="#5C81A6">\n' +
  '    <block type="size"></block>\n' +
  '    <block type="position"></block>\n' +
  '    <block type="url"></block>\n' +
  '    <block type="image"></block>\n' +
  '    <block type="story"></block>\n' +
  '    <block type="custom_dropdown_block"></block>\n' +
  '    <block type="turn"></block>\n' +
  '  </category>\n' +
  '  <category name="Triggers" colour="#5C81A6">\n' +
  '    <block type="precond_click_obj"></block>\n' +
  '    <block type="precond_click_not_obj"></block>\n' +
  '    <block type="precond_obj_is_view"></block>\n' +
  '    <block type="precond_ev_already_hap"></block>\n' +
  '    <block type="precond_obj_in_use"></block>\n' +
  '    <block type="precond_already_passed"></block>\n' +
  '    <block type="not"></block>\n' +
  '    <block type="andpre"></block>\n' +
  '    <block type="or"></block>\n' +
  '    <block type="parenteses"></block>\n' +
  '  </category>\n' +
  '  <category name="Actions" colour="#5C81A6">\n' +
  '    <block type="poscond_obj_muda_view"></block>\n' +
  '    <block type="poscond_obj_vai_inv"></block>\n' +
  '    <block type="poscond_fim_de_jogo"></block>\n' +
  '    <block type="poscond_mostra_msg"></block>\n' +
  '    <block type="poscond_obj_muda_tam"></block>\n' +
  '    <block type="poscond_obj_muda_pos"></block>\n' +
  '    <block type="poscond_muda_cena"></block>\n' +
  '    <block type="poscond_remove_obj"></block>\n' +
  '    <block type="poscond_comeca_des"></block>\n' +
  '    <block type="poscond_trans"></block>\n' +
  '    <block type="poscond_play_sound"></block>\n' +
  '    <block type="andpos"></block>\n' +
  '  </category>\n' +
  '  <category name="Challenges" colour="#5C81A6">\n' +
  '    <block type="challenge_question"></block>\n' +
  '    <block type="challenge_motion"></block>\n' +
  '    <block type="challenge_multiple_choice"></block>\n' +
  '    <block type="challenge_connection"></block>\n' +
  '    <block type="challenge_sequence"></block>\n' +
  '  </category>\n' +
  '  <category name="Draws" colour="#5C81A6">\n' +
  '    <block type="view_draw"></block>\n' +
  '    <block type="draw_rect"></block>\n' +
  '    <block type="draw_quad"></block>\n' +
  '    <block type="draw_square"></block>\n' +
  '    <block type="draw_triangle"></block>\n' +
  '    <block type="draw_line"></block>\n' +
  '    <block type="draw_point"></block>\n' +
  '    <block type="draw_arc"></block>\n' +
  '    <block type="draw_circle"></block>\n' +
  '    <block type="draw_ellipse"></block>\n' +
  '  </category>\n' +
  '  <category name="Draws Aux" colour="#5C81A6">\n' +
  '    <block type="begin_clip"></block>\n' +
  '    <block type="end_clip"></block>\n' +
  '    <block type="erase"></block>\n' +
  '    <block type="no_erase"></block>\n' +
  '    <block type="fill"></block>\n' +
  '    <block type="no_fill"></block>\n' +
  '    <block type="stroke"></block>\n' +
  '    <block type="no_stroke"></block>\n' +
  '  </category>\n' +
  '</xml>';


const ConfigFiles = {
  INITIAL,
  TOOLBOX
};

export default ConfigFiles;
