import React from 'react';
import './BlocklyComponent.css';
import {useEffect, useRef, useState} from 'react';

import * as Blockly from 'blockly/core';
import {javascriptGenerator} from 'blockly/javascript';
import * as locale from 'blockly/msg/en';
import 'blockly/blocks';
import { Link } from 'react-router-dom';
import Sketch from 'react-p5';
import { load } from '../components/model/load';

import { WIDTH,HEIGHT,HEIGHT_INV } from '../components/model/utils';

Blockly.setLocale(locale);

let SCALE = 0.5

function BlocklyComponent(props) {
  const blocklyDiv = useRef();
  const toolbox = useRef();
  let primaryWorkspace = useRef();
  let data = useRef(null);
  const [haveData, setHaveData] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [escape_room, setEscapeRoom] = useState(null);
  const [validated, setValidate] = useState(false);

  function addEscapeRoomBlock(workspace) {
    // Cria um novo bloco "escape_room"
    var xmlText = ```
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
```;
    var xml = Blockly.utils.xml.textToDom(xmlText);
    Blockly.Xml.domToWorkspace(xml, workspace.current);

    // Obter o bloco "escape_room" e torná-lo não deletável
    var blocks = workspace.current.getAllBlocks(false);
    for (var i = 0; i < blocks.length; i++) {
      if (blocks[i].type === 'escape_room') {
        blocks[i].setDeletable(false);
      }
    }
  }

  // Função para exportar blocos para XML
  const exportBlocks = () => {
    var xml = Blockly.Xml.workspaceToDom(primaryWorkspace.current);
    var xmlText = Blockly.Xml.domToPrettyText(xml);
    var blob = new Blob([xmlText], { type: 'text/xml' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'workspace.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const importBlocks = (event) => {
    var file = event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var xmlText = e.target.result;
      
        try {
          var xml = Blockly.utils.xml.textToDom(xmlText);
          if (!xml || !xml.firstChild) {
            throw new Error('XML inválido.');
          }
        
          // Limpar o workspace antes de importar novos blocos
          primaryWorkspace.current.clear();
        
          // Importar os novos blocos
          Blockly.Xml.domToWorkspace(xml, primaryWorkspace.current);
              
          // Verificar se o bloco "escape_room" já está presente
          var existingEscapeRoom = primaryWorkspace.current.getAllBlocks().find(function(block) {
            return block.type === 'escape_room';
          });
          
          // Adicionar o bloco "escape_room" somente se não estiver presente
          if (!existingEscapeRoom) {
              addEscapeRoomBlock();
          }
        
          // Assegurar que o bloco "escape_room" não seja deletável
          var blocks = primaryWorkspace.current.getAllBlocks(false);
          for (var i = 0; i < blocks.length; i++) {
            if (blocks[i].type === 'escape_room') {
              blocks[i].setDeletable(false);
            }
          }
        } catch (error) {
          console.error('Erro ao importar blocos:', error);
          // Lidar com o erro de importação
        }
      };
      reader.readAsText(file);
    }
  }

  const generateCode = () => {
    var code = javascriptGenerator.workspaceToCode(primaryWorkspace.current);
    var reasons = validate(code);
    if (reasons.length == 0) {
      console.log(reasons)
      data.current = btoa(code);
      setHaveData(true);
    }
    else {
      console.log(reasons)
    }  
  };

  const validate = (code) => {
    let er = JSON.parse(code);
    console.log(er);
    let scenarios = er.scenarios;
    let events = er.events;
    let transitions = er.transitions;
    var reasons = []

    var vars = {
      scenarios : {},
      objects : {},
      events : {},
      transitions : {}
    }

    //Verificar se existe pelo menos 1 cenario
    if (scenarios.length == 0){
      reasons.push("Escape Room tem de ter pelo menos 1 cenário.")
    }
    else {
      // Validar cenarios
      scenarios.forEach(scenario => {
        //Verificar se existem cenarios com o mesmo id
        if (scenario.id in vars.scenarios){
          reasons.push("Não pode existir cenários com o mesmo id")
        }
        else {
          vars.scenarios[scenario.id] = {
            views : []
          }
          let views = scenario.views;
          //Verificar se os cenarios tem pelo menos 1 view.
          if (views.length == 0) {
            reasons.push("Os cenários precisam ter pelo menos 1 view.")
          }
          //Validar views de um cenario 
          views.forEach(view => {
            //Verificar se existem ids duplicados nas views desse cenario
            if (vars.scenarios[scenario.id].views.includes(view.id)){
              reasons.push("Não pode existir views com o mesmo id no mesmo cenário")
            }
            else {
              vars.scenarios[scenario.id].views.push(view.id)
              //Verificar se view tem posiçao
              if (!view.position) {
                reasons.push("Views preicam ter uma posição")
              }
              //Verificar se view tem tamanho
              if (!view.size) {
                reasons.push("Views preicam ter um tamanho")
              }
              //Verificar se view tem source
              if (!view.src) {
                reasons.push("Views preicam ter uma source")
              }
            }
          });
          //Verificar se a initial view de uma cena existe
          if (!(vars.scenarios[scenario.id].views.includes(scenario.initial_view))){
            reasons.push(scenario.initial_view + " não é uma view de " + scenario.id)
          }
          let objects = scenario.objects
          //Validar objetos de um cenario
          objects.forEach(object => {
            //Verificar se existem id ja existe entre os objetos
            if (object.id in vars.objects){
              reasons.push("Não pode existir objetos com o mesmo id")
            }
            else {
              vars.objects[object.id] = {
                views : []
              }
              let views = object.views;
              //Verificar se os objetos tem pelo menos 1 view
              if (views.length == 0) {
                reasons.push("Os objetos precisam ter pelo menos 1 view.")
              }
              //Validar views do objeto
              views.forEach(view => {
                //Verificar se existem ids duplicados nas views desse cenario
                if (vars.objects[object.id].views.includes(view.id)){
                  reasons.push("Não pode existir views com o mesmo id no mesmo cenário")
                }
                else {
                  vars.objects[object.id].views.push(view.id)
                  //Verificar se view tem posiçao
                  if (!view.position) {
                    reasons.push("Views preicam ter uma posição")
                  }
                  //Verificar se view tem tamanho
                  if (!view.size) {
                    reasons.push("Views preicam ter um tamanho")
                  }
                  //Verificar se view tem source
                  if (!view.src) {
                    reasons.push("Views preicam ter uma source")
                  }
                }
              });
              //Verificar se a initial view de um objeto existe
              if (!(vars.objects[object.id].views.includes(object.initial_view))){
                reasons.push(object.initial_view + " não é uma view de " + object.id)
              }
            }
          })
        }  
      });


  
      return reasons;
    }
  }



  const update = () => {
    setLoaded(false);
  }

  useEffect(() => {
    const {initialXml, children, ...rest} = props;
    primaryWorkspace.current = Blockly.inject(blocklyDiv.current, {
      toolbox: toolbox.current,
      ...rest,
    });

    if (initialXml) {
      Blockly.Xml.domToWorkspace(
        Blockly.utils.xml.textToDom(initialXml),
        primaryWorkspace.current,
      );

      var blocks = primaryWorkspace.current.getAllBlocks(false);
      for (var i = 0; i < blocks.length; i++) {
        if (blocks[i].type === 'escape_room') {
          blocks[i].setDeletable(false);
        }
      }

    }
    primaryWorkspace.current.addChangeListener(update);
  }, [primaryWorkspace, toolbox, blocklyDiv, props]);

  const setup = (p5, canvasParentRef) => {
      p5.createCanvas(WIDTH * SCALE, (HEIGHT+HEIGHT_INV) * SCALE).parent(canvasParentRef);
  }

  const draw = (p5) => {
      p5.background(255);

      if(!loaded) {
        let code = javascriptGenerator.workspaceToCode(primaryWorkspace.current);
        try {
          let json = JSON.parse(code);
          var room = load(p5,json,SCALE);
          setLoaded(true)
          setEscapeRoom(room)
        }
        catch{}
      }

      if(escape_room != undefined){
        escape_room.escapeRoom.draw(p5,escape_room.gameState.currentScenario);
      }
  }

  const mouseMoved = (e) => {
    if(escape_room != undefined){
      for(var objectId in escape_room.escapeRoom.objects){
        var obj = escape_room.escapeRoom.objects[objectId]
        if (obj.currentView in obj.views){
          var hover = obj.views[obj.currentView].mouseMoved(e)
          if(hover){
            break;
          }
        }
      }
    }
  }

  const mousePressed = (e) => {
    if(escape_room != undefined){
      for(var objectId in escape_room.escapeRoom.objects){
        var obj = escape_room.escapeRoom.objects[objectId]
        if (obj.currentView in obj.views){
          var pressed = obj.views[obj.currentView].mousePressed(e)
          if (pressed){
            break;
          }
        }
      }
    }
  }

  const mouseDragged = (e) => {
    if(escape_room != undefined){
      for(var objectId in escape_room.escapeRoom.objects){
        var obj = escape_room.escapeRoom.objects[objectId]
        if (obj.currentView in obj.views){
          obj.views[obj.currentView].mouseDragged(e)
        }
      }
    }
  }

  const updateViewPositionAndSize = (objectId, viewId, newPosx, newPosy, newSizex, newSizey) => {
    // 1. Encontrar todos os blocos do tipo 'object'
    const objectBlocks = primaryWorkspace.current.getBlocksByType('object');
  
    objectBlocks.forEach(objectBlock => {
      // 2. Verificar se este bloco 'object' tem o ID que estamos procurando
      if (objectBlock.getFieldValue('ID') === objectId) {
        // 3. Encontrar todos os sub-blocos do tipo 'view' dentro do bloco 'object'
        const viewBlocks = objectBlock.getChildren(false).filter(childBlock => childBlock.type === 'view');
  
        viewBlocks.forEach(viewBlock => {
          // 4. Verificar se este bloco 'view' tem o ID que estamos procurando
          if (viewBlock.getFieldValue('ID') === viewId) {
            // 5. Encontrar o sub-bloco 'position' dentro do bloco 'view'
            const positionBlock = viewBlock.getChildren(false).find(childBlock => childBlock.type === 'position');
            if (positionBlock) {
              // 6. Alterar os valores dos campos 'x' e 'y'
              positionBlock.setFieldValue(newPosx, 'x');
              positionBlock.setFieldValue(newPosy, 'y');
            }
            const sizeBlock = viewBlock.getChildren(false).find(childBlock => childBlock.type === 'size');
            if (sizeBlock) {
              sizeBlock.setFieldValue(newSizex, 'x');
              sizeBlock.setFieldValue(newSizey, 'y')
            }
          }
        });
      }
    });
  };

  const mouseReleased = (e) => {
    if(escape_room != undefined){
      for(var objectId in escape_room.escapeRoom.objects){
        var obj = escape_room.escapeRoom.objects[objectId]
        if (obj.currentView in obj.views){
          var view = obj.views[obj.currentView]
          let changes = view.mouseReleased(e);
          if (changes) {
            let newPosx = view.position.x * 1/SCALE;
            let newPosy = (view.position.y* 1/SCALE-HEIGHT_INV);
            let newSizex = view.size.x * 1/SCALE;
            let newSizey = view.size.y * 1/SCALE;
            updateViewPositionAndSize(objectId,obj.currentView,newPosx,newPosy,newSizex,newSizey);
          }
        }
      }
    }
  }

  return (
    <React.Fragment>
        <div ref={blocklyDiv} id="blocklyDiv" />
        <div style={{display: 'none'}} ref={toolbox}>
          {props.children}
        </div>
        <div className="container-buttons">
          <button onClick={generateCode}>Convert</button>
          <button onClick={exportBlocks}>Exportar Blocos</button>
          <input onChange={importBlocks} type="file" accept=".xml"/>
          { haveData && (
            <Link to={`/escape_room/${data.current}`} >EscapeRoom</Link>
          )
          }
        </div>
        <div className="scene-container">
            {<Sketch setup={setup} draw={draw} mouseMoved={mouseMoved} mousePressed={mousePressed} mouseDragged={mouseDragged} mouseReleased={mouseReleased}/>}
        </div>  
    </React.Fragment>
  );
}

export default BlocklyComponent;
