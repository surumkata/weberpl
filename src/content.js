const INITIAL =
  `<xml>
  <block type="escape_room" x="10" y="10">
    <field name="TITLE">ESCAPE ROOM</field>
    <field name="TYPE">SCENARIO</field>
    <field name="START">ROOM</field>
    <statement name="SCENARIOS">
      <block type="scenario">
        <field name="ID">ROOM</field>
        <field name="initial_view">WALL</field>
        <statement name="VIEWS">
            <block type="view">
              <field name="ID">WALL</field>
              <value name="SIZE">
                <block type="point">
                  <field name="x">1280</field>
                  <field name="y">720</field>
                </block>
              </value>
              <value name="POSITION">
                <block type="point">
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
              <field name="ID">DOOR</field>
              <field name="initial_view">CLOSED DOOR</field>
              <statement name="VIEWS">
                  <block type="view">
                    <field name="ID">CLOSED DOOR</field>
                    <value name="SIZE">
                      <block type="point">
                        <field name="x">225</field>
                        <field name="y">300</field>
                      </block>
                    </value>
                    <value name="POSITION">
                      <block type="point">
                        <field name="x">480</field>
                        <field name="y">360</field>
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
  '  <category name="SCENARIOS" colour="200">\n' +
  '    <block type="scenario"></block>\n' +
  '    <block type="object"></block>\n' +
  '    <block type="transition"></block>\n' +
  '    <block type="sound"></block>\n' +
  '  </category>\n' +
  '  <category name="EVENTS" colour="300">\n' +
  '   <block type="event"></block>\n' +
  '   <category name="TRIGGERS" colour="42">\n' +
  '     <block type="precond_click_obj"></block>\n' +
  '     <block type="precond_click_not_obj"></block>\n' +
  '     <block type="precond_obj_is_view"></block>\n' +
  '     <block type="precond_ev_already_hap"></block>\n' +
  '     <block type="precond_obj_in_use"></block>\n' +
  '     <block type="precond_already_passed"></block>\n' +
  '     <block type="not"></block>\n' +
  '     <block type="andpre"></block>\n' +
  '     <block type="or"></block>\n' +
  '     <block type="parenteses"></block>\n' +
  '   </category>\n' +
  '   <category name="ACTIONS" colour="82">\n' +
  '     <block type="poscond_obj_muda_view"></block>\n' +
  '     <block type="poscond_obj_vai_inv"></block>\n' +
  '     <block type="poscond_fim_de_jogo"></block>\n' +
  '     <block type="poscond_mostra_msg"></block>\n' +
  '     <block type="poscond_obj_muda_tam"></block>\n' +
  '     <block type="poscond_obj_muda_pos"></block>\n' +
  '     <block type="poscond_muda_cena"></block>\n' +
  '     <block type="poscond_remove_obj"></block>\n' +
  '     <block type="poscond_comeca_des"></block>\n' +
  '     <block type="poscond_trans"></block>\n' +
  '     <block type="poscond_play_sound"></block>\n' +
  '     <block type="andpos"></block>\n' +
  '   </category>\n' +
  '   <category name="CHALLENGES" colour="285">\n' +
  '     <block type="challenge_question"></block>\n' +
  '     <block type="challenge_motion"></block>\n' +
  '     <block type="challenge_multiple_choice"></block>\n' +
  '     <block type="challenge_connection"></block>\n' +
  '     <block type="challenge_sequence"></block>\n' +
  '   </category>\n' +
  '  </category>\n' +
  '  <category name="VIEWS" colour="80">\n' +
  '    <block type="view"></block>\n' +
  '    <block type="view2"></block>\n' +
  '    <block type="view_draw"></block>\n' +
  '    <category name="DRAWS" colour="120">\n' +
  '      <block type="draw_rect"></block>\n' +
  '      <block type="draw_quad"></block>\n' +
  '      <block type="draw_square"></block>\n' +
  '      <block type="draw_triangle"></block>\n' +
  '      <block type="draw_line"></block>\n' +
  '      <block type="draw_point"></block>\n' +
  '      <block type="draw_arc"></block>\n' +
  '      <block type="draw_circle"></block>\n' +
  '      <block type="draw_ellipse"></block>\n' +
  '      <block type="begin_clip"></block>\n' +
  '      <block type="end_clip"></block>\n' +
  '      <block type="erase"></block>\n' +
  '      <block type="no_erase"></block>\n' +
  '      <block type="fill"></block>\n' +
  '      <block type="no_fill"></block>\n' +
  '      <block type="stroke"></block>\n' +
  '      <block type="no_stroke"></block>\n' +
  '    </category>\n' +
  '    <category name="HITBOXES" colour="345">\n' +
  '      <block type="hitbox_rect"></block>\n' +
  '      <block type="hitbox_quad"></block>\n' +
  '      <block type="hitbox_square"></block>\n' +
  '      <block type="hitbox_triangle"></block>\n' +
  '      <block type="hitbox_line"></block>\n' +
  '      <block type="hitbox_point"></block>\n' +
  '      <block type="hitbox_arc"></block>\n' +
  '      <block type="hitbox_circle"></block>\n' +
  '      <block type="hitbox_ellipse"></block>\n' +
  '    </category>\n' +
  '  </category>\n' +
  '  <category name="UTILS" colour="20">\n' +
  '    <block type="point"></block>\n' +
  '    <block type="url"></block>\n' +
  '    <block type="image"></block>\n' +
  '    <block type="story"></block>\n' +
  '    <block type="custom_dropdown_block"></block>\n' +
  '    <block type="turn"></block>\n' +
  '  </category>\n' +
  '</xml>';


const ConfigFiles = {
  INITIAL,
  TOOLBOX
};

export default ConfigFiles;
