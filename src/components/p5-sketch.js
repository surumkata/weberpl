import React, { useState, useEffect, useRef } from 'react';
import { ReactP5Wrapper } from "@p5-wrapper/react";
import { load } from './model/load.js';
import "./p5-sketch.css";
import { WIDTH, HEIGHT, HEIGHT_INV } from './model/utils.js';

const P5Sketch = ({ json }) => {
    var gameData;

    const doEvent = (gameData, event) => {
        for (let posCondition of event.posConditions) {
            posCondition.do(gameData.escapeRoom, gameData.inventory, gameData.gameState);
        }
        gameData.gameState.bufferEventsHappened.push(event.id);
    };

    const tryDoEvents = (gameData) => {
        for (let event of Object.values(gameData.escapeRoom.events)) {
            if (event.preConditions.root === null || event.repetitions === 0) continue;
            if (event.preConditions.testTree(gameData.escapeRoom, gameData.inventory, gameData.gameState)) {
                doEvent(gameData, event);
            }
        }
    };

    const sketch = (p5) => {
        p5.preload = () => {
            // Definindo os dados do jogo carregados
            gameData = load(p5, json);
            gameData.escapeRoom.variables['__time__'] = gameData.gameState.time
        };

        p5.setup = (canvasParentRef) => {
            p5.createCanvas(WIDTH, HEIGHT + HEIGHT_INV).parent(canvasParentRef);
            const textarea = p5.createElement('textarea');
            textarea.parent(canvasParentRef);
            textarea.hide();
            if (gameData) {
                gameData.gameState.inputElem = textarea;
            }
        };

        p5.draw = () => {
            p5.background(0);
            if (gameData) {
                tryDoEvents(gameData);
                gameData.gameState.updateBuffers(gameData.escapeRoom);
                gameData.inventory.updateItems();
                if (gameData.gameState.isRunning()) {
                    gameData.escapeRoom.draw(p5, gameData.gameState.currentScenario);
                    gameData.inventory.draw(p5);
                    gameData.gameState.drawMessages(p5);
                } else if (gameData.gameState.isTransition()) {
                    gameData.gameState.transition.draw(p5,gameData.escapeRoom.variables);
                } else if (gameData.gameState.isChallengeMode()) {
                    gameData.escapeRoom.draw(p5, gameData.gameState.currentScenario);
                    gameData.inventory.draw(p5);
                    gameData.gameState.challenge.draw(p5);
                } else if (gameData.gameState.isFinished()) {
                    gameData.gameState.drawFinishScreen(p5);
                }
            }
        };

        p5.mousePressed = () => {
            if (gameData) {
                if (gameData.gameState.isRunning()) {
                    gameData.gameState.bufferMessages = [];
                    gameData.gameState.bufferClickEvents.push([p5.mouseX, p5.mouseY]);
                } else if (gameData.gameState.isChallengeMode()) {
                    const event = gameData.gameState.challenge.mousePressed(p5.mouseX, p5.mouseY, gameData.gameState);
                    if (event !== undefined && event !== 0) {
                        doEvent(gameData, event);
                        gameData.gameState.desactivateChallengeMode();
                    } else if (event === 0) {
                        gameData.gameState.desactivateChallengeMode();
                    }
                } else if (gameData.gameState.isTransition()) {
                    if (gameData.gameState.transition.nextScenario !== null) {
                        gameData.gameState.desactivateTransitionMode();
                    } else {
                        gameData.gameState.activeTransitionMode(gameData.escapeRoom.transitions[gameData.gameState.transition.nextTransition]);
                    }
                }
            }
        };

        p5.mouseMoved = () => {
            if (gameData) {
                if (gameData.gameState.isChallengeMode()) {
                    gameData.gameState.challenge.mouseMoved(p5.mouseX, p5.mouseY);
                } else if (gameData.gameState.isRunning()) {
                    gameData.inventory.mouseMoved(p5.mouseX, p5.mouseY);
                }  
            }
        };

        p5.mouseReleased = () => {
            if (gameData) {
                if (gameData.gameState.isChallengeMode()) {
                    const event = gameData.gameState.challenge.mouseReleased(p5.mouseX, p5.mouseY);
                    if(event !== undefined && event !== 0){
                        console.log(event);
                        doEvent(gameData,event);
                        gameData.gameState.desactivateChallengeMode();
                    } else if (event === 0) {
                        gameData.gameState.desactivateChallengeMode();
                    }
                }
            }
        }

        p5.mouseDragged = () => {
            if (gameData) {
                if (gameData.gameState.isChallengeMode()) {
                    gameData.gameState.challenge.mouseDragged(p5.mouseX, p5.mouseY);
                }
            }
        }
    };

    return (
        <div className="sketch-container">
            <ReactP5Wrapper sketch={sketch} />
        </div>
    );
};

export default P5Sketch;
