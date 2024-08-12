import React from 'react';
import './BlocklyComponent.css';
import {useEffect, useRef, useState} from 'react';

import * as Blockly from 'blockly/core';
import {toolboxCategories, createPlayground} from '@blockly/dev-tools';
import 'blockly/blocks';


import {javascriptGenerator} from 'blockly/javascript';
import * as locale from 'blockly/msg/en';
import { Link } from 'react-router-dom';
import { P5CanvasInstance, ReactP5Wrapper } from "@p5-wrapper/react";
import { load } from '../components/model/load';
import { validate } from './validate';

import { WIDTH,HEIGHT,HEIGHT_INV, SCALE_EDIT } from '../components/model/utils';

Blockly.setLocale(locale);

function BlocklyComponent(props) {
  const blocklyDiv = useRef();
  const toolbox = useRef(toolboxCategories);
  let primaryWorkspace = useRef();
  let data = useRef(null);
  const [haveData, setHaveData] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [escape_room, setEscapeRoom] = useState(null);
  const [errors, setErrors] = useState([]);
  const [transitionsIds, setTransitionsIds] = useState([]);
  const [scenariosIds, setScenariosIds] = useState(["SCENARIO_1"]);

  function addEscapeRoomBlock(workspace) {
    // Cria um novo bloco "escape_room"
    var xmlText = ```
<xml>
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
    let json = JSON.parse(code);
    var reasons = validate(json);
    if (reasons.length == 0) {
      data.current = btoa(code);
      setHaveData(true);
    }
  };

  const updateTypes = ['block_field_intermediate_change', 'change','delete','create']

  const update = (e) => {
    if(updateTypes.includes(e.type)){
        setLoaded(false);
        makeScenariosTransitionsList();
    }
    else if (e.type === 'move' && e.reason && (e.reason.includes('connect') || e.reason.includes('disconnect'))){
        setLoaded(false);
        makeScenariosTransitionsList();
    }
  }

  const makeScenariosTransitionsList = () => {
    const scenariosBlocks = primaryWorkspace.current.getBlocksByType('scenario');
    const transitionsBlocks = primaryWorkspace.current.getBlocksByType('transition');

    var scenarios = []
    var transitions = []

    scenariosBlocks.forEach(scenarioBlock => {
      scenarios.push(scenarioBlock.getFieldValue('ID'));
    })
    transitionsBlocks.forEach(transitionBlock => {
      transitions.push(transitionBlock.getFieldValue('ID'));
    })

    setTransitionsIds(transitions);
    setScenariosIds(scenarios);

   }; 

  useEffect(() => {
    const {initialXml, children, ...rest} = props;
    primaryWorkspace.current = Blockly.inject(blocklyDiv.current, {
      toolbox: toolbox.current,
      zoom: {controls:true},
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

  

  const scaleToEdit = (json) => {
    json.scenarios.forEach(scenario => {
      scenario.objects.forEach(object => {
        object.views.forEach(view => {
          if (view.type == "VIEW_IMAGE"){
            view.position.x *= SCALE_EDIT;
            view.position.y *= SCALE_EDIT;
            view.size.x *= SCALE_EDIT;
            view.size.y *= SCALE_EDIT;
          }
          else if (view.type == "VIEW_SKETCH"){
            view.draws.forEach(draw => {
              switch(draw.type) {
                case "RECT":
                  draw.x *= SCALE_EDIT;
                  draw.y *= SCALE_EDIT;
                  draw.w *= SCALE_EDIT;
                  draw.h *= SCALE_EDIT;
                  draw.tl *= SCALE_EDIT;
                  draw.tr *= SCALE_EDIT;
                  draw.br *= SCALE_EDIT;
                  draw.bl *= SCALE_EDIT;
                  break;
                case "QUAD":
                  draw.x1 *= SCALE_EDIT;
                  draw.y1 *= SCALE_EDIT;
                  draw.x2 *= SCALE_EDIT;
                  draw.y2 *= SCALE_EDIT;
                  draw.x3 *= SCALE_EDIT;
                  draw.y3 *= SCALE_EDIT;
                  draw.x4 *= SCALE_EDIT;
                  draw.y4 *= SCALE_EDIT;
                  break;
                case "SQUARE":
                  draw.x  *= SCALE_EDIT;
                  draw.y  *= SCALE_EDIT;
                  draw.s  *= SCALE_EDIT;
                  draw.tl *= SCALE_EDIT;
                  draw.tr *= SCALE_EDIT;
                  draw.br *= SCALE_EDIT;
                  draw.bl *= SCALE_EDIT;
                  break;
                case "TRIANGLE":
                  draw.x1 *= SCALE_EDIT;
                  draw.y1 *= SCALE_EDIT;
                  draw.x2 *= SCALE_EDIT;
                  draw.y2 *= SCALE_EDIT;
                  draw.x3 *= SCALE_EDIT;
                  draw.y3 *= SCALE_EDIT; 
                  break;
                case "LINE":
                  draw.x1 *= SCALE_EDIT;
                  draw.y1 *= SCALE_EDIT;
                  draw.x2 *= SCALE_EDIT;
                  draw.y2 *= SCALE_EDIT;
                  break;
                case "POINT":
                  draw.x1 *= SCALE_EDIT;
                  draw.y1 *= SCALE_EDIT;
                  break;
                case "ARC":
                  draw.x *= SCALE_EDIT;
                  draw.y *= SCALE_EDIT;
                  draw.w *= SCALE_EDIT;
                  draw.h *= SCALE_EDIT;
                  break;
                case "CIRCLE":
                  draw.x *= SCALE_EDIT;
                  draw.y *= SCALE_EDIT;
                  draw.d *= SCALE_EDIT;
                  break;
                case "ELLIPSE":
                  draw.x *= SCALE_EDIT;
                  draw.y *= SCALE_EDIT;
                  draw.w *= SCALE_EDIT;
                  draw.h *= SCALE_EDIT;
                  break;
                case "STROKE":
                  draw.w *= SCALE_EDIT;
                  break;
                default:
                  break;
              }
            })
          }
        })
      })
    })
  }

  

  const updateViewPositionAndSize = (objectId, viewId, newPosx, newPosy, newSizex, newSizey) => {
    // 1. Encontrar todos os blocos do tipo 'object'
    const objectBlocks = primaryWorkspace.current.getBlocksByType('object');
  
    objectBlocks.forEach(objectBlock => {
      // 2. Verificar se este bloco 'object' tem o ID que estamos procurando
      if (objectBlock.getFieldValue('ID') === objectId) {
        // 3. Encontrar todos os sub-blocos do tipo 'view' dentro do bloco 'object'
        var viewBlocks = objectBlock.getChildren(false).filter(childBlock => childBlock.type === 'view');
        const turnBlocks = objectBlock.getChildren(false).filter(childBlock => childBlock.type === 'turn');


        turnBlocks.forEach(turnBlock => {
          const turnViewBlocks = turnBlock.getChildren(false).filter(childBlock => childBlock.type === 'view');
          viewBlocks = viewBlocks.concat(turnViewBlocks);
        });

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

  function sketch(p5){
    p5.setup = (canvasParentRef) => {
      p5.createCanvas(WIDTH * SCALE_EDIT, (HEIGHT+HEIGHT_INV) * SCALE_EDIT).parent(canvasParentRef);
    }

    p5.draw = () => {
      p5.background(255);
      if(!loaded) {
        let code = javascriptGenerator.workspaceToCode(primaryWorkspace.current);
        try {
          let json = JSON.parse(code);
          var errors_json = validate(json);
          if (errors_json.length == 0) {
            scaleToEdit(json);
            var room = load(p5,json,true);
            setEscapeRoom(room)
          }
          else {
            setEscapeRoom(null);
          }
          setErrors(errors_json);
          setLoaded(true)
        }
        catch(e){
          console.log(e);
          setEscapeRoom(null);
          setLoaded(true);
        }
      }
  
      if(escape_room !== null){
        escape_room.escapeRoom.draw(p5,escape_room.gameState.currentScenario);
      }
      else if (errors.length > 0){
        var error_number = 1;
        p5.push()
        p5.textSize(30);
        p5.fill(255,0,0);
        p5.stroke(0);
        p5.strokeWeight(1);
        p5.text("ERRORS!", 10, HEIGHT_INV);
        errors.forEach(error => {
          p5.textSize(20);
          p5.fill(255,0,0);
          p5.stroke(0);
          p5.strokeWeight(1);
          p5.text(error_number + ". " + error, 10, HEIGHT_INV+30*error_number);
          error_number += 1;
        })
        p5.pop();
      }
    }

    p5.mouseMoved = (e) => {
      if(escape_room !== null){
        for(var objectId in escape_room.escapeRoom.objects){
          var obj = escape_room.escapeRoom.objects[objectId]
          if (obj.currentView in obj.views){
            var hover = obj.views[obj.currentView].mouseMoved(p5.mouseX,p5.mouseY)
            if(hover){
              break;
            }
          }
        }
      }
    }
    
      p5.mousePressed = (e) => {
        if(escape_room !== null){
          for(var objectId in escape_room.escapeRoom.objects){
            var obj = escape_room.escapeRoom.objects[objectId]
            if (obj.currentView in obj.views){
              var pressed = obj.views[obj.currentView].mousePressed(p5.mouseX,p5.mouseY)
              if (pressed){
                break;
              }
            }
          }
        }
      }
    
      p5.mouseDragged = (e) => {
        if(escape_room !== null){
          for(var objectId in escape_room.escapeRoom.objects){
            var obj = escape_room.escapeRoom.objects[objectId]
            if (obj.currentView in obj.views){
              obj.views[obj.currentView].mouseDragged(p5.mouseX,p5.mouseY)
            }
          }
        }
      }
    
      p5.mouseReleased = (e) => {
        if(escape_room !== null){
          for(var objectId in escape_room.escapeRoom.objects){
            var obj = escape_room.escapeRoom.objects[objectId]
            if (obj.currentView in obj.views){
              var view = obj.views[obj.currentView]
              let changes = view.mouseReleased(p5.mouseX,p5.mouseY);
              if (changes) {
                let newPosx = view.position.x * 1/SCALE_EDIT;
                let newPosy = (view.position.y* 1/SCALE_EDIT-HEIGHT_INV);
                let newSizex = 0;
                let newSizey = 0;
                if(view.size.x !== 0){
                  newSizex = view.size.x * 1/SCALE_EDIT;
                }
                if(view.size.y !== 0){
                  newSizey = view.size.y * 1/SCALE_EDIT;
                }
                updateViewPositionAndSize(objectId,obj.currentView,newPosx,newPosy,newSizex,newSizey);
              }
            }
          }
        }
      }
    
      p5.keyPressed = (e) => {
        if (e.keyCode == 16){
          if(escape_room !== null){
            for(var objectId in escape_room.escapeRoom.objects){
              var obj = escape_room.escapeRoom.objects[objectId]
              for (var viewId in obj.views)
                obj.views[viewId].shiftPressed();
            }
          }
        }
      }
      
      p5.keyReleased = (e) => {
        if (e.keyCode == 16){
          if(escape_room !== null){
            for(var objectId in escape_room.escapeRoom.objects){
              var obj = escape_room.escapeRoom.objects[objectId]
              for (var viewId in obj.views)
                obj.views[viewId].shiftReleased();
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
          <button onClick={generateCode} disabled={!errors.length == 0}>Convert</button>
          <button onClick={exportBlocks}>Exportar Blocos</button>
          <input onChange={importBlocks} type="file" accept=".xml"/>
          <select>
            {scenariosIds?.map((id) => <option value={id} >{id}</option>)}
            {transitionsIds?.map((id) => <option value={id} >{id}</option>)}
          </select>
          { haveData && (
            <Link to={`/escape_room/${data.current}`} >EscapeRoom</Link>
          )
          }
        </div>
        <div className="scene-container">
            {<ReactP5Wrapper sketch={sketch} />}
        </div>  
    </React.Fragment>
  );
}

export default BlocklyComponent;