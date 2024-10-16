const SNOWMAN =
  `<xml>
  <block type="escape_room" x="10" y="10">
<field name="TITLE">ESCAPE ROOM</field>
<field name="TYPE">SCENARIO</field>
<field name="START">ROOM</field>
</block>
<block type="scenario" x="350" y="10">
<field name="ID">ROOM</field>
<field name="initial_view">WALL</field>
<statement name="VIEWS">
<block type="view">
<field name="ID">WALL</field>
<field name="HITBOX_TYPE">DEFAULT</field>
<value name="SOURCE">
<block type="image2">
<field name="OPCAO1">BACKGROUND</field>
<field name="OPCAO2">ROOM</field>
</block>
</value>
<value name="POSITION">
<block type="point">
<field name="x">0</field>
<field name="y">0</field>
</block>
</value>
<value name="SIZE">
<block type="point">
<field name="x">1280</field>
<field name="y">720</field>
</block>
</value>
</block>
</statement>
<statement name="OBJECTS">
<block type="object">
<field name="ID">DOOR</field>
<field name="initial_view">SKETCH</field>
<statement name="VIEWS">
<block type="view">
<field name="ID">CLOSED DOOR</field>
<field name="HITBOX_TYPE">DEFAULT</field>
<value name="SOURCE">
<block type="image2">
<field name="OPCAO1">DOOR</field>
<field name="OPCAO2">CLOSED</field>
</block>
</value>
<value name="POSITION">
<block type="point">
<field name="x">480</field>
<field name="y">360</field>
</block>
</value>
<value name="SIZE">
<block type="point">
<field name="x">225</field>
<field name="y">300</field>
</block>
</value>
<next>
<block type="view_draw">
<field name="ID">SKETCH</field>
<field name="HITBOX_TYPE">DEFAULT</field>
<statement name="DRAWS">
<block type="fill">
<field name="COLOUR">#ffffff</field>
<field name="ALPHA">255</field>
<next>
<block type="draw_circle">
<field name="ID">CIRCLE1</field>
<field name="X">222</field>
<field name="Y">390</field>
<field name="RADIUS">80</field>
<next>
<block type="draw_circle">
<field name="ID">CIRCLE2</field>
<field name="X">224</field>
<field name="Y">282</field>
<field name="RADIUS">60</field>
<next>
<block type="draw_circle">
<field name="ID">CIRCLE3</field>
<field name="X">222</field>
<field name="Y">510</field>
<field name="RADIUS">100</field>
<next>
<block type="fill">
<field name="COLOUR">#ff8800</field>
<field name="ALPHA">255</field>
<next>
<block type="draw_triangle">
<field name="ID">TRIANGLE</field>
<field name="X1">200</field>
<field name="Y1">300</field>
<field name="X2">100</field>
<field name="Y2">270</field>
<field name="X3">200</field>
<field name="Y3">280</field>
<next>
<block type="fill">
<field name="COLOUR">#000000</field>
<field name="ALPHA">255</field>
<next>
<block type="draw_circle">
<field name="ID">CIRCLE4</field>
<field name="X">205</field>
<field name="Y">264</field>
<field name="RADIUS">10</field>
<next>
<block type="draw_circle">
<field name="ID">CIRCLE4</field>
<field name="X">245</field>
<field name="Y">264</field>
<field name="RADIUS">10</field>
<next>
<block type="fill">
<field name="COLOUR">#522c00</field>
<field name="ALPHA">255</field>
<next>
<block type="draw_triangle">
<field name="ID">TRIANGLE2</field>
<field name="X1">170</field>
<field name="Y1">360</field>
<field name="X2">50</field>
<field name="Y2">370</field>
<field name="X3">170</field>
<field name="Y3">380</field>
<next>
<block type="draw_triangle">
<field name="ID">TRIANGLE3</field>
<field name="X1">280</field>
<field name="Y1">360</field>
<field name="X2">400</field>
<field name="Y2">370</field>
<field name="X3">280</field>
<field name="Y3">380</field>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</next>
</block>
</statement>
</block>
</next>
</block>
</statement>
</block>
</statement>
</block>
</xml>`;

const ExampleFiles = {
  SNOWMAN
};

export default ExampleFiles;