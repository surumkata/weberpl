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

import './Navebar.css'

import { jsPDF } from 'jspdf';

import { View, ViewSketch } from './components/model/view';
import { updateView,updateViewSketch, updateHitbox } from './components/updateBlocks';

import { useParams } from 'react-router-dom';


function EscapeRoomEditor() {

  function fromUrlSafeBase64(str) {
    let base64 = str
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    // Padding pode ser necessário dependendo do comprimento do string
    while (base64.length % 4) {
        base64 += '=';
    }
    return atob(base64);
  }

  var initial;
  const { data } = useParams();
  if (data !== undefined){
    try{
      initial = fromUrlSafeBase64(data)
    }
    catch{
      initial = ConfigFiles.INITIAL
    }
  }
  else{
    initial = ConfigFiles.INITIAL
  }

  const [erCode, setEscapeRoomCode] = useState(null);
  const [er, setEscapeRoom] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [errors, setErrors] = useState([]);
  const [xml, setXML] = useState(null);
  const workspaceRef = useRef(null);  // Referência para o workspace
  const [transitionsIds, setTransitionsIds] = useState([]);
  const [scenariosIds, setScenariosIds] = useState(["ROOM"]);
  const [showInvisible, setInvisibleViews] = useState(0);
  const [showHitboxes, setShowHitboxes] = useState(false);
  const inputFileXML = useRef(null);
  const [currentScenario, setCurrentScenario] = useState("ROOM");
  const [scenariosImgs, setScenariosImgs] = useState({});
  const [imgsLoaded, setImgsLoaded] = useState(true);
  const [imgsIndex, setImgIndex] = useState(0);

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
    renderer: 'zelos',
    rendererOverrides: null,
    rtl: null,
    scrollbars: null,
    sounds: null,
    theme: null,
    toolboxPosition: null,
    trashcan: null,
    maxTrashcanContents: null,
    plugins: null,
    zoom: {controls: true,
     wheel: true,
     startScale: 0.7,
     maxScale: 3,
     minScale: 0.3,
     scaleSpeed: 1.2,
     pinch: true},
    parentWorkspace: null,
  };

  const onInject = useCallback(({ workspace }) => {
    workspaceRef.current = workspace;  // Guardar a referência do workspace
  }, []);

  const scaleToEditHitbox = (hitbox) => {
    switch(hitbox.type) {
      case "RECT":
        hitbox.position.x *= SCALE_EDIT;
        hitbox.position.y *= SCALE_EDIT;
        hitbox.size.x *= SCALE_EDIT;
        hitbox.size.y *= SCALE_EDIT;
        hitbox.tl *= SCALE_EDIT;
        hitbox.tr *= SCALE_EDIT;
        hitbox.br *= SCALE_EDIT;
        hitbox.bl *= SCALE_EDIT;
        break;
      case "POLYGON":
        for (var i in hitbox.points){
          hitbox.points[i].x *= SCALE_EDIT;
          hitbox.points[i].y *= SCALE_EDIT;
        }
        break;
      case "SQUARE":
        hitbox.position.x  *= SCALE_EDIT;
        hitbox.position.y  *= SCALE_EDIT;
        hitbox.width  *= SCALE_EDIT;
        hitbox.tl *= SCALE_EDIT;
        hitbox.tr *= SCALE_EDIT;
        hitbox.br *= SCALE_EDIT;
        hitbox.bl *= SCALE_EDIT;
        break;
      case "TRIANGLE":
        hitbox.point1.x *= SCALE_EDIT;
        hitbox.point1.y *= SCALE_EDIT;
        hitbox.point2.x *= SCALE_EDIT;
        hitbox.point2.y *= SCALE_EDIT;
        hitbox.point3.x *= SCALE_EDIT;
        hitbox.point3.y *= SCALE_EDIT; 
        break;
      case "LINE":
        hitbox.point1.x *= SCALE_EDIT;
        hitbox.point1.y *= SCALE_EDIT;
        hitbox.point2.x *= SCALE_EDIT;
        hitbox.point2.y *= SCALE_EDIT;
        break;
      case "ARC":
        hitbox.position.x *= SCALE_EDIT;
        hitbox.position.y *= SCALE_EDIT;
        hitbox.size.x *= SCALE_EDIT;
        hitbox.size.y *= SCALE_EDIT;
        break;
      case "CIRCLE":
        hitbox.position.x *= SCALE_EDIT;
        hitbox.position.y *= SCALE_EDIT;
        hitbox.radius *= SCALE_EDIT;
        break;
      case "ELLIPSE":
        hitbox.position.x *= SCALE_EDIT;
        hitbox.position.y *= SCALE_EDIT;
        hitbox.size.x *= SCALE_EDIT;
        hitbox.size.y *= SCALE_EDIT;
        break;
      default:
        break;
    }
  }

  const scaleToEditDraw = (draw) => {
    switch(draw.type) {
      case "RECT":
        draw.position.x *= SCALE_EDIT;
        draw.position.y *= SCALE_EDIT;
        draw.size.x *= SCALE_EDIT;
        draw.size.y *= SCALE_EDIT;
        draw.tl *= SCALE_EDIT;
        draw.tr *= SCALE_EDIT;
        draw.br *= SCALE_EDIT;
        draw.bl *= SCALE_EDIT;
        break;
      case "POLYGON":
        for (var i in draw.points){
          draw.points[i].x *= SCALE_EDIT;
          draw.points[i].y *= SCALE_EDIT;
        }
        break;
      case "SQUARE":
        draw.position.x *= SCALE_EDIT;
        draw.position.y *= SCALE_EDIT;
        draw.width  *= SCALE_EDIT;
        draw.tl *= SCALE_EDIT;
        draw.tr *= SCALE_EDIT;
        draw.br *= SCALE_EDIT;
        draw.bl *= SCALE_EDIT;
        break;
      case "TRIANGLE":
        draw.point1.x *= SCALE_EDIT;
        draw.point1.y *= SCALE_EDIT;
        draw.point2.x *= SCALE_EDIT;
        draw.point2.y *= SCALE_EDIT;
        draw.point3.x *= SCALE_EDIT;
        draw.point3.y *= SCALE_EDIT; 
        break;
      case "LINE":
        draw.point1.x *= SCALE_EDIT;
        draw.point1.y *= SCALE_EDIT;
        draw.point2.x *= SCALE_EDIT;
        draw.point2.y *= SCALE_EDIT;
        break;
      case "ARC":
        draw.position.x *= SCALE_EDIT;
        draw.position.y *= SCALE_EDIT;
        draw.size.x *= SCALE_EDIT;
        draw.size.y *= SCALE_EDIT;
        break;
      case "CIRCLE":
        draw.position.x *= SCALE_EDIT;
        draw.position.y *= SCALE_EDIT;
        draw.radius *= SCALE_EDIT;
        break;
      case "ELLIPSE":
        draw.position.x *= SCALE_EDIT;
        draw.position.y *= SCALE_EDIT;
        draw.size.x *= SCALE_EDIT;
        draw.size.y *= SCALE_EDIT;
        break;
      case "STROKE":
        draw.w *= SCALE_EDIT;
        break;
      default:
        break;
    }
  }

  const scaleToEditView = (view) => {
    if (view.type == "VIEW_IMAGE"){
      view.position.x *= SCALE_EDIT;
      view.position.y *= SCALE_EDIT;
      view.size.x *= SCALE_EDIT;
      view.size.y *= SCALE_EDIT;
      view.hitboxes.forEach(hitbox => {
        scaleToEditHitbox(hitbox);
      })
    }
    else if (view.type == "VIEW_SKETCH"){
      view.draws.forEach(draw => {
        scaleToEditDraw(draw);
      })
      view.hitboxes.forEach(hitbox => {
        scaleToEditHitbox(hitbox);
      })
    }
  }

  const scaleToEdit = (json) => {
    json.scenarios.forEach(scenario => {
      scenario.views.forEach(scnView => {
        scaleToEditView(scnView);
      })
      if(scenario.objects){
        scenario.objects.forEach(object => {
          object.views.forEach(objView => {
            scaleToEditView(objView);
          })
        })
      }
      if(scenario.hitboxes){
        scenario.hitboxes.forEach(hitbox => {
          scaleToEditHitbox(hitbox)
        })
      }
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

  // Função auxiliar para esperar as imagens serem carregadas
  const waitForImagesToLoad = () => {
    return new Promise((resolve) => {
      // Verifica a cada 500ms se todas as imagens estão carregadas
      const interval = setInterval(() => {
        if (Object.keys(scenariosImgs).length === scenariosIds.length) {
          setImgsLoaded(true);
          clearInterval(interval);
          resolve(); // Resolve a promise quando todas as imagens estiverem prontas
        }
      }, 500);
    });
  };



  const exportBlocksPDF = async () => {

    setImgsLoaded(false);
    setScenariosImgs({});
    setImgIndex(0);
    // Espera até que as imagens estejam todas carregadas
    await waitForImagesToLoad();

    const doc = new jsPDF();
    scenariosIds.forEach((scenarioId,index) => {
      if (index > 0) doc.addPage();
      doc.setFontSize(20);
      doc.text(`${scenarioId}`, 10, 10);
      doc.addImage(scenariosImgs[scenarioId], 'PNG', 10, 20, 100, 56.25);
    })

    // Converte o PDF para Blob
    const pdfBlob = doc.output('blob');

    // Verifica se o navegador suporta a API File System Access
    if (window.showSaveFilePicker) {
      try {
        // Prompt para o usuário selecionar o nome e local do arquivo
        const handle = await window.showSaveFilePicker({
          suggestedName: 'cenarios.pdf',
          types: [{
            description: 'PDF Files',
            accept: { 'application/pdf': ['.pdf'] }
          }]
        });

        // Escreve o arquivo PDF no local escolhido
        const writableStream = await handle.createWritable();
        await writableStream.write(pdfBlob);
        await writableStream.close();
        console.log("Arquivo salvo com sucesso!");

      } catch (err) {
        console.error("Erro ao salvar o arquivo:", err);
      }
    } else {
      // Caso o navegador não suporte a API, faz o download automático com jsPDF
      doc.save('cenarios.pdf');
    }
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
    const scenariosBlocks2 = workspaceRef.current.getBlocksByType('scenario2');
    const transitionsBlocks = workspaceRef.current.getBlocksByType('transition');

    var scenarios = []
    var transitions = []

    scenariosBlocks.forEach(scenarioBlock => {
      scenarios.push(scenarioBlock.getFieldValue('ID'));
    })
    scenariosBlocks2.forEach(scenarioBlock => {
      scenarios.push(scenarioBlock.getFieldValue('ID'));
    })
    transitionsBlocks.forEach(transitionBlock => {
      transitions.push(transitionBlock.getFieldValue('ID'));
    })

    setTransitionsIds(transitions);
    setScenariosIds(scenarios);

  }; 

  const prepareEscapeRoom = (blocks) => {
    let er = {
      "title" : "",
      "scenarios" : [],
      "events" : [],
      "transitions" : [],
      "variables" : [],
      "start_type" : "",
      "start" : ""
    };

    blocks.forEach(block => {
      switch(block.block_type){
        case 'ESCAPE_ROOM':
          er.title = block.title;
          er.start_type = block.start_type;
          er.start = block.start;
          er.variables = block.variables
          break;
        case 'SCENARIO':
          delete block.block_type;
          er.scenarios.push(block);
          break;
        case 'EVENT':
          delete block.block_type;
          er.events.push(block);
          break;
        case 'TRANSITION':
          delete block.block_type;
          er.transitions.push(block);
          break;
        default:
          break;
      }
    })

    return er
  }



  const onChange = useCallback(({ xml, json, js }) => {
    js = js.replaceAll("}\n{","}\n,{")
    js = "[" + js + "]"
    let blocksParsed = JSON.parse(js);
    var jsonER = prepareEscapeRoom(blocksParsed);
    var errorsEr = validate(jsonER);
    if (errorsEr.length == 0) {
        setEscapeRoomCode(jsonER);
        makeScenariosTransitionsList();
    }
    else {
      setEscapeRoomCode(null);
    }
    setErrors(errorsEr);
    setLoaded(false);
    setXML(xml);
    
  }, []);

  const onDispose = useCallback(({ workspace, xml, json }) => {
    console.log('onDispose', workspace, xml, json);
  }, []);

  const onError = useCallback(error => {
    console.log('onError', error);
    setEscapeRoom(null);
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
          room.gameState.currentScenario = currentScenario;
          
          setEscapeRoom(room);

        }
        else {
          setEscapeRoom(null);
        }
        setLoaded(true);
      }
    

      if(er !== null){
        
        if(!imgsLoaded){
          if(imgsIndex < scenariosIds.length){
            er.gameState.currentScenario = scenariosIds[imgsIndex];
            er.escapeRoom.draw(p5,er.gameState.currentScenario, showInvisible, showHitboxes);
            
            let canvas = document.querySelector('canvas');
            let imgData = canvas.toDataURL('image/png');

            let scenarioId = er.gameState.currentScenario;

            setScenariosImgs(prev => ({...prev, [scenarioId]: imgData}));

            setImgIndex(imgsIndex+1);
          }
          else{
            er.gameState.currentScenario = currentScenario;
            er.escapeRoom.draw(p5,er.gameState.currentScenario, showInvisible, showHitboxes);
            setImgsLoaded(true);
          }
          setEscapeRoom(er);
        }
        else{
          er.escapeRoom.draw(p5,er.gameState.currentScenario, showInvisible, showHitboxes);
        }

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
          if(obj.reference === er.gameState.currentScenario){
            if (obj.currentView in obj.views){
              var hover = obj.views[obj.currentView].mouseMoved(p5.mouseX,p5.mouseY)
              if(hover){
                break;
              }
            }
          }
        }
      }
    }

      p5.mousePressed = (e) => {
        if(er !== null){
          for(var objectId in er.escapeRoom.objects){
            var obj = er.escapeRoom.objects[objectId]
            if(obj.reference === er.gameState.currentScenario){
              if (obj.currentView in obj.views){
                var pressed = obj.views[obj.currentView].mousePressed(p5.mouseX,p5.mouseY)
                if (pressed){
                  break;
                }
              }
            }
          }
        }
      }

      p5.mouseDragged = (e) => {
        if(er !== null){
          for(var objectId in er.escapeRoom.objects){
            var obj = er.escapeRoom.objects[objectId]
            if(obj.reference === er.gameState.currentScenario){
              if (obj.currentView in obj.views){
                obj.views[obj.currentView].mouseDragged(p5.mouseX,p5.mouseY)
              }
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
              if(showHitboxes){
                for(var hitboxIndex in view.hitboxes){
                  var hitbox = view.hitboxes[hitboxIndex];
                  let changes = hitbox.mouseReleased();
                  if(changes) {
                    updateHitbox(workspaceRef,objectId,view.id,hitbox);
                  }
                }
              }
              else{
                if(view.constructor === View){
                  let changes = view.mouseReleased();
                  if (changes) {
                    updateView(workspaceRef,objectId,view);
                  }
                }
                else if(view.constructor === ViewSketch){
                  for(var drawIndex in view.draws){
                    var draw = view.draws[drawIndex];
                    let changes = draw.mouseReleased();
                    if(changes){
                      updateViewSketch(workspaceRef,objectId,view.id,draw);
                    }
                  }
                }
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
    var img = document.getElementById("showInvisible");
    var btn = document.getElementById("showInvisible-btn");
    var span = document.getElementById("showInvisible-span")
    if (showInvisible === 0){
      img.src = "/weberpl/icons/semi_open.png";
      btn.style.backgroundColor = "#f1d00c";
      span.textContent = "Show Invisible Views (100%)"
      span.style.color = "#17116e";
      setInvisibleViews(1);
    }
    else if(showInvisible === 1){
      img.src = "/weberpl/icons/open_eye.png";
      span.textContent = "Hide Invisible Views"
      setInvisibleViews(2);
    }
    else{
      img.src = "/weberpl/icons/closed_eye.png";
      btn.style.backgroundColor = "#17116e";
      span.textContent = "Show Invisible Views (50%)"
      span.style.color = "#f1d00c";
      setInvisibleViews(0);
    }
  }

  const enableHitboxs = () => {
    var img = document.getElementById("showHitboxes");
    var btn = document.getElementById("showHitboxes-btn");
    var span = document.getElementById("showHitboxes-span");
    if (showHitboxes){
      img.src = "/weberpl/icons/hitboxes.png";
      btn.style.backgroundColor = "#17116e";
      span.textContent = "Show Hitboxes"
      span.style.color = "#f1d00c";
      setShowHitboxes(false);
    }
    else{
      img.src = "/weberpl/icons/hitboxes_visible.png";
      btn.style.backgroundColor = "#f1d00c";
      span.textContent = "Hide Hitboxes"
      span.style.color = "#17116e";
      setShowHitboxes(true);
    }
  }

  const changeCurrentScenario = (e) => {
    setCurrentScenario(e.target.value);
    setLoaded(false);
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
          <a className="a-img" href="/weberpl/"><img src="/weberpl/logo_extenso.png" /></a>
          <div className="dropdown">
            <button className="dropbtn">Export <i className="fa fa-caret-down"></i></button>
            <div className="dropdown-content">
              <a onClick={exportBlocksXML}>Export XML</a>
              <a onClick={exportBlocksJSON}>Export JSON</a>
              <a onClick={exportBlocksPDF}>Export PDF</a>
            </div>
          </div> 
          <div className="dropdown">
            <button className="dropbtn">Import <i className="fa fa-caret-down"></i></button>
            <div className="dropdown-content">
              <a onClick={importXML}>Import XML</a>
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
            initial={initial}
            onInject={onInject}
            onChange={onChange}
            onDispose={onDispose}
            onError={onError}
          />
        </div>
      </div>
      <div className="containerCenter">
        <div className="containerButtons">
                <button className="play-btn" id="" title="PLAY" onClick={generateCode} disabled={er === null}>
                  <img src='/weberpl/logo.png'/>
                  <span>Play!</span>
                </button>
                <button className="play-btn" id="showInvisible-btn" title="Show invisible views" onClick={enableInvisibleViews}>
                  <img id="showInvisible" src='/weberpl/icons/closed_eye.png'/>
                  <span id="showInvisible-span">Show Invisible Views (50%)</span>
                </button>
                <button className="play-btn" id="showHitboxes-btn" title="Show Hitboxs" onClick={enableHitboxs}>
                  <img id="showHitboxes" src='/weberpl/icons/hitboxes.png'/>
                  <span id="showHitboxes-span">Show Hitboxs</span>
                </button>
        </div>
      </div>
      <div className="containerRight">
          <div className="select-scenario">
            <p>You are seeing the following scenario:</p>
            <div className="select">
              <select onChange={changeCurrentScenario}>
                {scenariosIds?.map((id) => <option className="option" key={id} value={id} >{id}</option>)}
                {transitionsIds?.map((id) => <option className="option" key={id} value={id} >{id}</option>)}
              </select>
            </div>
          </div>
          <div className="containerSketch">
            {<ReactP5Wrapper sketch={sketch} />}
          </div>
      </div>
    </div>   
    </div>
  );
}

export {EscapeRoomEditor};
