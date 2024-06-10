import React from 'react';
import './BlocklyComponent.css';
import {useEffect, useRef, useState} from 'react';

import * as Blockly from 'blockly/core';
import {javascriptGenerator} from 'blockly/javascript';
import * as locale from 'blockly/msg/en';
import 'blockly/blocks';
import { Link } from 'react-router-dom';


Blockly.setLocale(locale);

function BlocklyComponent(props) {
  const blocklyDiv = useRef();
  const toolbox = useRef();
  let primaryWorkspace = useRef();
  let data = useRef(null);
  const [haveData, setHaveData] = useState(false);

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
    console.log(code);
    data.current = btoa(code);
    setHaveData(true);
    console.log(data.current);
  };

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
  }, [primaryWorkspace, toolbox, blocklyDiv, props]);

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
    </React.Fragment>
  );
}

export default BlocklyComponent;
