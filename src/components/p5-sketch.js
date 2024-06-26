import React from 'react';
import Sketch from 'react-p5';
import { load } from './model/load.js';
import "./p5-sketch.css"
import { WIDTH, HEIGHT, HEIGHT_INV } from './model/utils.js';

function P5Sketch(json) {
    var gameData;

    const preload = (p5) => {
        gameData = load(p5,json.json);
      }

    const setup = (p5, canvasParentRef) => {

        p5.createCanvas(WIDTH, HEIGHT+HEIGHT_INV).parent(canvasParentRef);
        gameData.gameState.inputElem = p5.createElement('textarea').parent(canvasParentRef);
        gameData.gameState.inputElem.hide();
    }
    

    const draw = (p5) => {
        tryDoEvents(gameData);
        //Atualiza os buffers depois dos events
        gameData.gameState.updateBuffers(gameData.escapeRoom)
        gameData.inventory.updateItems()
        if(gameData !== undefined){ 
            if (gameData.gameState.isRunning()){
                gameData.escapeRoom.draw(p5,gameData.gameState.currentScenario);
                gameData.inventory.draw(p5);
                gameData.gameState.drawMessages(p5);
            }
            else if (gameData.gameState.isTransition()){
                gameData.gameState.transition.draw(p5);
            }
            else if (gameData.gameState.isChallengeMode()){
                gameData.escapeRoom.draw(p5,gameData.gameState.currentScenario);
                gameData.inventory.draw(p5);
                gameData.gameState.challenge.draw(p5);
            }
            else if (gameData.gameState.isFinished()){
                gameData.gameState.drawFinishScreen(p5);
            }    
        }
    }

    const mousePressed = (e) => {
        if (gameData.gameState.isRunning()){
            gameData.gameState.bufferMessages = []
            gameData.gameState.bufferClickEvents.push([e.mouseX,e.mouseY])
        }
        else if (gameData.gameState.isChallengeMode()){
            let event = gameData.gameState.challenge.mousePressed(e,gameData.gameState);
            if (event !== undefined && event !== 0){
                doEvent(gameData,event)
                gameData.gameState.desactivateChallengeMode();
            }
            else if (event === 0){
                gameData.gameState.desactivateChallengeMode();
            }
        }
        else if (gameData.gameState.isTransition()) {
            gameData.gameState.transition.stopMusic()
            if (gameData.gameState.transition.nextScenario !== undefined) {
                gameData.gameState.desactivateTransitionMode()
            }
            else {
                gameData.gameState.activeTransitionMode(gameData.escapeRoom.transitions[gameData.gameState.transition.nextTransition])
            }
        }
    }

    const mouseMoved = (e) => {
        if (gameData !== undefined) {
            if (gameData.gameState.isChallengeMode()){
                gameData.gameState.challenge.mouseMoved(e);
            }
            else if (gameData.gameState.isRunning()){
                gameData.inventory.mouseMoved(e);
            }
        }
    }

    function doEvent(gameData,event) {
        // Do the pos-conditions of an event
        for (let posCondition of event.posConditions) {
            posCondition.do(gameData.escapeRoom, gameData.inventory, gameData.gameState);
        }
        gameData.gameState.bufferEventsHappened.push(event.id);
    }

    function tryDoEvents(gameData) {
        // Test whether an event is to be held
        for (let event of Object.values(gameData.escapeRoom.events)) {
            if (event.preConditions.root === null) {
                continue;
            }
            if (!event.infinityRepetitions && event.repetitions <= 0) {
                continue;
            }
            if (event.preConditions.testTree(gameData.escapeRoom, gameData.inventory, gameData.gameState)) {
                doEvent(gameData,event);
            }
        }   
    }

    return (
        <div className="sketch-container">
            <Sketch setup={setup} draw={draw} preload={preload} mousePressed={mousePressed} mouseMoved={mouseMoved}/>
        </div>
    )
}

export default P5Sketch;