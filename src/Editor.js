import React, { useCallback } from 'react';
import {useRef, useState} from 'react';

import { BlocklyEditor } from '@react-blockly/web';
import './blocks/customBlocks'
import './blocks/javascriptGenerator'
import './blocks/otherGenerator'

import * as Blockly from 'blockly/core';

import './Editor.css'
import ConfigFiles from './content';

import { ReactP5Wrapper } from "@p5-wrapper/react";

import { WIDTH,HEIGHT,HEIGHT_INV, SCALE_EDIT } from './components/model/utils';
import { validate } from './components/validate';
import { load } from './components/model/load';

import { Link } from 'react-router-dom';

function Editor() {

  const [erCode, setEscapeRoomCode] = useState(null);
  const [er, setEscapeRoom] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [errors, setErrors] = useState([]);
  const [data, setData] = useState(null);
  const [xml, setXML] = useState(null);
  const workspaceRef = useRef(null);  // Referência para o workspace
  const [transitionsIds, setTransitionsIds] = useState([]);
  const [scenariosIds, setScenariosIds] = useState(["SCENARIO_1"]);

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

  // Função para exportar blocos para XML
  const exportBlocks = () => {
    var blob = new Blob([xml], { type: 'text/xml' });
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
  }, []);

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
  }

  const generateCode = () => {
    if(erCode !== null){
      let json = JSON.stringify(erCode, null, 2);
      setData(btoa(json));
      console.log(data);
    }
  };

  return (
    <div style={{ display: 'flex', flexGrow: 1, flexDirection: 'row' }}>
      <div style={{ flexGrow: 1 }}>
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
      <div className="containerButtons">
          <button onClick={generateCode} disabled={!errors.length == 0}>Convert</button>
          <button onClick={exportBlocks}>Exportar Blocos</button>
          <input type="file" accept=".xml" onChange={importBlocks} />
          <select>
            {scenariosIds?.map((id) => <option key={id} value={id} >{id}</option>)}
            {transitionsIds?.map((id) => <option key={id} value={id} >{id}</option>)}
          </select>
          { data !== null && (
            <Link to={`/escape_room/${data}`} >EscapeRoom</Link>
          )
          }
      </div>
      <div className="sceneContainer">
        {<ReactP5Wrapper sketch={sketch} />}
      </div>  
    </div>
  );
}

export {Editor};
