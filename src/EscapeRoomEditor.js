import React, { useCallback } from 'react';
import {useRef, useState} from 'react';

import { BlocklyEditor } from '@react-blockly/web';
import './blocks/customBlocks'
import './blocks/javascriptGenerator'
import './blocks/otherGenerator'

import * as Blockly from 'blockly/core';

import './EscapeRoomEditor.css'
import ConfigFiles from './content';

import { ReactP5Wrapper } from "@p5-wrapper/react";

import { WIDTH,HEIGHT,HEIGHT_INV, SCALE_EDIT } from './components/model/utils';
import { validate } from './components/validate';
import { load } from './components/model/load';

import { Link } from 'react-router-dom';
import './Navebar.css'
import Footer from './Footer';

function EscapeRoomEditor() {

  const [erCode, setEscapeRoomCode] = useState(null);
  const [er, setEscapeRoom] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [errors, setErrors] = useState([]);
  const [xml, setXML] = useState(null);
  const workspaceRef = useRef(null);  // Referência para o workspace
  const [transitionsIds, setTransitionsIds] = useState([]);
  const [scenariosIds, setScenariosIds] = useState(["SCENARIO_1"]);
  const inputFileXML = useRef(null);

  const workspaceConfiguration = {
    grid: {
      spacing: 20,
      length: 3,
      colour: '#ccc',
      snap: true,
    },
    toolbox: ConfigFiles.TOOLBOX,
    // null safety example
    collapse: null,
    comments: null,
    css: null,
    disable: null,
    horizontalLayout: null,
    maxBlocks: null,
    maxInstances: null,
    media: null,
    modalInputs: null,
    move: null,
    oneBasedIndex: null,
    readOnly: null,
    renderer: null,
    rendererOverrides: null,
    rtl: null,
    scrollbars: null,
    sounds: null,
    theme: null,
    toolboxPosition: null,
    trashcan: null,
    maxTrashcanContents: null,
    plugins: null,
    zoom: null,
    parentWorkspace: null,
  };

  const onInject = useCallback(({ workspace }) => {
    workspaceRef.current = workspace;  // Guardar a referência do workspace
  }, []);

  const scaleToEditView = (view) => {
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
  }

  const scaleToEdit = (json) => {
    json.scenarios.forEach(scenario => {
      scenario.views.forEach(scnView => {
        scaleToEditView(scnView);
      })
      scenario.objects.forEach(object => {
        object.views.forEach(objView => {
          scaleToEditView(objView);
        })
      })
    })
  }

  // Verifica se o navegador suporta a API do File System Access
  const supportsFileSystemAccess = 'showSaveFilePicker' in window;

  const exportFileWithPicker = async (content, suggestedName, fileType) => {
    if (supportsFileSystemAccess) {
      // Usar a API File System Access para escolher o local de salvamento
      const options = {
        suggestedName: suggestedName,
        types: [{
          description: fileType.description,
          accept: fileType.accept
        }]
      };
  
      try {
        const fileHandle = await window.showSaveFilePicker(options);
        const writable = await fileHandle.createWritable();
        await writable.write(content);
        await writable.close();
      } catch (error) {
        console.error("Erro ao salvar o arquivo:", error);
      }
    } else {
      // Fallback para download automático no caso da API não estar disponível
      const blob = new Blob([content], { type: fileType.mime });
      exportFile(blob, suggestedName);
    }
  }
  
  // Função para exportar blocos para XML usando a API do File System Access
  const exportBlocksXML = async () => {
    const xmlBlob = new Blob([xml], { type: 'text/xml' });
    await exportFileWithPicker(xmlBlob, "workspace.xml", {
      description: "Arquivo XML",
      accept: { 'text/xml': ['.xml'] },
      mime: 'text/xml'
    });
  }
  
  // Função para exportar blocos para JSON usando a API do File System Access
  const exportBlocksJSON = async () => {
    if (erCode !== null) {
      const json = JSON.stringify(erCode, null, 2);
      const jsonBlob = new Blob([json], { type: 'application/json' });
      await exportFileWithPicker(jsonBlob, "room.json", {
        description: "Arquivo JSON",
        accept: { 'application/json': ['.json'] },
        mime: 'application/json'
      });
    }
  }

  const importBlocksXML = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const content = e.target.result;
        const parser = new DOMParser();
        const xml = parser.parseFromString(content, "text/xml");
        if (workspaceRef.current) {
          Blockly.Xml.clearWorkspaceAndLoadFromXml(xml.documentElement, workspaceRef.current);
        }
      };
      reader.readAsText(file);
    }
  };
  
  const makeScenariosTransitionsList = () => {
    const scenariosBlocks = workspaceRef.current.getBlocksByType('scenario');
    const transitionsBlocks = workspaceRef.current.getBlocksByType('transition');

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



  const onChange = useCallback(({ xml, json, js }) => {
    let jsonParsed = JSON.parse(js);
    var errorsEr = validate(jsonParsed);
      if (errorsEr.length == 0) {
          setEscapeRoomCode(jsonParsed);
      }
      else {
        setEscapeRoomCode(null);
      }
    setErrors(errorsEr);
    setLoaded(false);
    setXML(xml);
    makeScenariosTransitionsList();
  }, []);

  const onDispose = useCallback(({ workspace, xml, json }) => {
    console.log('onDispose', workspace, xml, json);
  }, []);

  const onError = useCallback(error => {
    console.log('onError', error);
    setEscapeRoom(null);
  }, []);

  const updateViewPositionAndSize = (objectId, viewId, newPosx, newPosy, newSizex, newSizey) => {
    // 1. Encontrar todos os blocos do tipo 'object'
    const objectBlocks = workspaceRef.current.getBlocksByType('object');

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
        if(erCode !== null){
          let editCode = JSON.parse(JSON.stringify(erCode));
          scaleToEdit(editCode);
          var room = load(p5,editCode,true);
          setEscapeRoom(room);
        }
        else {
          setEscapeRoom(null);
        }
        setLoaded(true);
      }

      if(er !== null){
        er.escapeRoom.draw(p5,er.gameState.currentScenario);
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
      if(er !== null){
        for(var objectId in er.escapeRoom.objects){
          var obj = er.escapeRoom.objects[objectId]
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
        if(er !== null){
          for(var objectId in er.escapeRoom.objects){
            var obj = er.escapeRoom.objects[objectId]
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
        if(er !== null){
          for(var objectId in er.escapeRoom.objects){
            var obj = er.escapeRoom.objects[objectId]
            if (obj.currentView in obj.views){
              obj.views[obj.currentView].mouseDragged(p5.mouseX,p5.mouseY)
            }
          }
        }
      }

      p5.mouseReleased = (e) => {
        if(er !== null){
          for(var objectId in er.escapeRoom.objects){
            var obj = er.escapeRoom.objects[objectId]
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
          if(er !== null){
            for(var objectId in er.escapeRoom.objects){
              var obj = er.escapeRoom.objects[objectId]
              for (var viewId in obj.views)
                obj.views[viewId].shiftPressed();
            }
          }
        }
      }

      p5.keyReleased = (e) => {
        if (e.keyCode == 16){
          if(er !== null){
            for(var objectId in er.escapeRoom.objects){
              var obj = er.escapeRoom.objects[objectId]
              for (var viewId in obj.views)
                obj.views[viewId].shiftReleased();
            }
          }
        }
      }
  }

  // Função para codificar em Base64 seguro para URL
  function toUrlSafeBase64(str) {
    return btoa(str)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
  }

  const generateCode = () => {
    if(erCode !== null){
      let json = JSON.stringify(erCode, null, 2);
      let data = toUrlSafeBase64(json);
      if (data !== "null" || data !== null) {
        window.open(`#/escape_room/${data}`, "_blank", "noreferrer");
      }
    }
  };

  const importXML = () => {
    // `current` points to the mounted file input element
    inputFileXML.current.click();
  };

  const enableInvisibleViews = () => {

  }

  return (
    <div>
      <div className="nav">
        <input type="checkbox" id="nav-check"/>
        <div className="nav-header"></div>
        <div className="nav-btn">
          <label htmlFor="nav-check">
            <img src="/weberpl/logo.png"/>
          </label>
        </div>
        <div className="nav-links">
          <a className="a-img" href="/"><img src="/weberpl/logo_extenso.png" /></a>
          <div className="dropdown">
            <button className="dropbtn">Export <i className="fa fa-caret-down"></i></button>
            <div className="dropdown-content">
              <a href="#" onClick={exportBlocksXML}>Export XML</a>
              <a href="#" onClick={exportBlocksJSON}>Export JSON</a>
            </div>
          </div> 
          <div className="dropdown">
            <button className="dropbtn">Import <i className="fa fa-caret-down"></i></button>
            <div className="dropdown-content">
              <a href="#" onClick={importXML}>Import XML</a>
              <input type="file" accept=".xml" ref={inputFileXML} onChange={importBlocksXML} style={{display: 'none'}}/>
            </div>
          </div> 
        </div>
      </div>
    <div className="containerEditor">
      <div className="containerLeft">
        <div className="containerBlockly">
          <BlocklyEditor
            className={'editor'}
            workspaceConfiguration={workspaceConfiguration}
            initial={ConfigFiles.INITIAL}
            onInject={onInject}
            onChange={onChange}
            onDispose={onDispose}
            onError={onError}
          />
        </div>
      </div>
      <div className="containerRight">
        <div>
          <div className="containerButtons">
              <button className="play-btn" title="PLAY" onClick={generateCode} disabled={er === null}><img src='/weberpl/logo.png'/></button>
              <div className="select-scenario">
                <p>Select the scenario to show:</p>
                <div className="select">
                  <select>
                    {scenariosIds?.map((id) => <option className="option" key={id} value={id} >{id}</option>)}
                    {transitionsIds?.map((id) => <option className="option" key={id} value={id} >{id}</option>)}
                  </select>
                </div>
              </div>
              <button className="play-btn" title="Show invisible views" onClick={enableInvisibleViews}><img src='/weberpl/invisible.png'/></button>
          </div>
          <div className="containerSketch">
            {<ReactP5Wrapper sketch={sketch} />}
          </div>
        </div>
      </div>
    </div>    
    <Footer/>
    </div>
  );
}

export {EscapeRoomEditor};
