import { View } from './view.js';
import { Object } from './object.js';
import { EscapeRoom } from './escape_room.js';
import { Position, Size } from './utils.js';
import { Scenario } from './scenario.js';
import { GameState } from './game_state.js';
import { Inventory } from './inventory.js';
import { WIDTH, HEIGHT, HEIGHT_INV, SCALE_EDIT, setHEIGHT, setHEIGHT_INV, setSCALE_EDIT, setWIDTH } from './utils.js';
import {Transition } from './transition.js';

import { Event } from './event.js';
import { PreConditionOperatorAnd, PreConditionOperatorNot, PreConditionOperatorOr, PreConditionTree, PreConditionVar } from './precondition_tree.js';
import { EventPreConditionAfterEvent,EventPreConditionAfterTime,EventPreConditionClickedNotObject,EventPreConditionClickedObject,EventPreConditionItemIsInUse,EventPreConditionWhenObjectIsView } from './precondition.js';
import { EventPosConditionTransition, EventPosConditionConnections, EventPosConditionSequence, EventPosConditionQuestion, EventPosConditionChangeScenario,EventPosConditionDeleteItem,EventPosConditionEndGame,EventPosConditionMultipleChoice,EventPosConditionObjChangePosition,EventPosConditionObjChangeSize,EventPosConditionObjChangeState,EventPosConditionObjPutInventory,EventPosConditionPlaySound,EventPosConditionShowMessage } from './poscondition.js';



const load = (p5,json,edit=false) => {
    if(edit){
        setWIDTH(WIDTH*SCALE_EDIT);
        setHEIGHT(HEIGHT*SCALE_EDIT);
        setHEIGHT_INV(HEIGHT_INV*SCALE_EDIT);
    }
    if (!json) {
        return undefined;
    }
    let scenarios = json.scenarios
    if (!scenarios) {
        scenarios = []
    }
    var gs = new GameState(new Size(WIDTH,HEIGHT))
    var er = new EscapeRoom(json.title)
    loadScenarios(p5,er,gs,scenarios);
    let events = loadEvents(json.events);
    events.forEach(function(event){
        er.addEvent(event);
    })

    let transitions = json.transitions
    loadTransitions(p5,er,gs,transitions)
    //let map = json.map
    //let events = json.events
    //let sounds = json.sounds
    ////Load the room

    if (json.start_type == 'TRANSITION'){
        gs.activeTransitionMode(er.transitions[json.start])
    }
    else{
        gs.currentScenario = json.start
    }

    if(edit){
        setWIDTH(WIDTH*1/SCALE_EDIT);
        setHEIGHT(HEIGHT*1/SCALE_EDIT);
        setHEIGHT_INV(HEIGHT_INV*1/SCALE_EDIT);
    }
    

    return {
        'escapeRoom' : er,
        'gameState' : gs,
        'inventory' : new Inventory()
    }
}

export {load};

function loadTransitions(p5,er,gs,transitions){
    transitions.forEach(function(transition){
        let view = transition.view;
        let tv = new View(p5,view.id,[view.src],gs.size,new Position(0,HEIGHT_INV),0,0,view.turn);
        var next_scenario = null;
        var next_transition = null;
        console.log(transition)
        if (transition.next_type == "TRANSITION") {
            next_transition = transition.next;
        }
        else {
            next_scenario = transition.next;
        }
        let t = new Transition(transition.id,tv,transition.story,next_scenario,next_transition);
        er.addTransition(t);
    })
}

function loadScenarios(p5,er,gs,scenarios){
    scenarios.forEach(function(scenario){
        let s = new Scenario(scenario.id);
        s.currentView = scenario['initial_view'];
        scenario.views.forEach(function(view){
            let sv = new View(p5,view.id,[view.src],gs.size,new Position(0,HEIGHT_INV),0,0,view.turn);
            s.addView(sv);
        })
        er.addScenario(s);
        scenario.objects.forEach(function(object){
            let o = new Object(object.id,scenario.id,new Position(0,0),new Size(0,0));
            o.currentView = object['initial_view'];
            object.views.forEach(function(objView){
                let ov = new View(p5,objView.id,[objView.src],new Size(objView.size.x,objView.size.y), new Position(objView.position.x,(objView.position.y+HEIGHT_INV)),0,0,objView.turn)
                o.addView(ov);
            })
            er.addObject(o);
        })
    })
}

function loadPrecondition(precondition) {
    const type = precondition.type;
    let eventPrecondition;

    switch (type) {
        case "CLICKED_OBJECT":
            const objectId = precondition.object;
            eventPrecondition = new EventPreConditionClickedObject(objectId);
            break;
        case "CLICKED_NOT_OBJECT":
            const clickedNotObjectId = precondition.object;
            eventPrecondition = new EventPreConditionClickedNotObject(clickedNotObjectId);
            break;
        case "WHEN_OBJECT_IS_VIEW":
            const whenObjectId = precondition.object;
            const viewId = precondition.view;
            eventPrecondition = new EventPreConditionWhenObjectIsView(whenObjectId, viewId);
            break;
        case "AFTER_EVENT":
            const afterEventId = precondition.event;
            eventPrecondition = new EventPreConditionAfterEvent(afterEventId);
            break;
        case "ITEM_IS_IN_USE":
            const itemInUseId = precondition.item;
            eventPrecondition = new EventPreConditionItemIsInUse(itemInUseId);
            break;
        case "AFTER_TIME":
            const afterTime = precondition.time;
            eventPrecondition = new EventPreConditionAfterTime(afterTime);
            break;
        default:
            eventPrecondition = null;
            break;
    }

    return eventPrecondition;
}

function loadPreconditions(preconditions) {
    if (preconditions.operator) {
        const operator = preconditions.operator;
        const left = loadPreconditions(preconditions.left);
        const right = preconditions.right ? loadPreconditions(preconditions.right) : null;

        switch (operator) {
            case 'AND':
                return new PreConditionOperatorAnd(left, right);
            case 'OR':
                return new PreConditionOperatorOr(left, right);
            case 'NOT':
                return new PreConditionOperatorNot(left);
            default:
                return null;
        }
    } else {
        return new PreConditionVar(loadPrecondition(preconditions));
    }
}

function loadPosconditions(dataPosconditions) {
    const posConditions = [];

    dataPosconditions.forEach(dataAction => {
        const type = dataAction.type;
        let eventPoscondition;

        switch (type) {
            case "END_GAME":
                eventPoscondition = new EventPosConditionEndGame();
                break;
            case "OBJ_CHANGE_VIEW":
                const objectId = dataAction.object;
                const viewId = dataAction.view;
                eventPoscondition = new EventPosConditionObjChangeState(objectId, viewId);
                break;
            case "OBJ_CHANGE_POSITION":
                const objPositionObjectId = dataAction.object;
                const pos = dataAction.position;
                eventPoscondition = new EventPosConditionObjChangePosition(objPositionObjectId, new Position(pos.x,(pos.y+HEIGHT_INV)));
                break;
            case "OBJ_CHANGE_SIZE":
                const objSizeObjectId = dataAction.object;
                const size = dataAction.size;
                eventPoscondition = new EventPosConditionObjChangeSize(objSizeObjectId, new Size(size.x, size.y));
                break;
            case "SHOW_MESSAGE":
                const message = dataAction.message;
                const msgpos = dataAction.position;
                eventPoscondition = new EventPosConditionShowMessage(message, new Position(msgpos.x, (msgpos.y+HEIGHT_INV)));
                break;
            case "OBJ_PUT_INVENTORY":
                const objInventoryObjectId = dataAction.object;
                eventPoscondition = new EventPosConditionObjPutInventory(objInventoryObjectId);
                break;
            case "CHANGE_SCENARIO":
                const scenarioId = dataAction.scenario;
                eventPoscondition = new EventPosConditionChangeScenario(scenarioId);
                break;
            case "DELETE_ITEM":
                const itemId = dataAction.item;
                eventPoscondition = new EventPosConditionDeleteItem(itemId);
                break;
            case "PLAY_SOUND":
                const soundId = dataAction.sound;
                const sourceId = dataAction.sourceId;
                const sourceType = dataAction.sourceType;
                eventPoscondition = new EventPosConditionPlaySound(soundId, sourceId, sourceType);
                break;
            case "QUESTION":
                const question = dataAction.question;
                const answer = dataAction.answer;
                const sucess = new Event("sucess",{},loadPosconditions(dataAction.sucess.posConditions),null);
                const fail = new Event("fail",{},loadPosconditions(dataAction.fail.posConditions),null);
                eventPoscondition = new EventPosConditionQuestion(answer, question, sucess, fail);
                break;
            case "MULTIPLE_CHOICE":
                const mc_question = dataAction.question;
                const mc_answer = dataAction.answer;
                const multipleChoices = dataAction.choices;
                const mc_sucess = new Event("sucess",{},loadPosconditions(dataAction.sucess.posConditions),null);
                const mc_fail = new Event("fail",{},loadPosconditions(dataAction.fail.posConditions),null);
                eventPoscondition = new EventPosConditionMultipleChoice(mc_question,mc_answer,multipleChoices,mc_sucess,mc_fail);
                break;
            case "SEQUENCE":
                const s_question = dataAction.question;
                const sequence = dataAction.sequence;
                const s_sucess = new Event("sucess",{},loadPosconditions(dataAction.sucess.posConditions),null);
                const s_fail = new Event("fail",{},loadPosconditions(dataAction.fail.posConditions),null);
                eventPoscondition = new EventPosConditionSequence(s_question,sequence,s_sucess,s_fail);
                break;
            case "CONNECTIONS":
                const c_question = dataAction.question;
                const list1 = dataAction.list1;
                const list2 = dataAction.list2;
                const c_sucess = new Event("sucess",{},loadPosconditions(dataAction.sucess.posConditions),null);
                const c_fail = new Event("fail",{},loadPosconditions(dataAction.fail.posConditions),null);
                eventPoscondition = new EventPosConditionConnections(c_question,list1,list2,c_sucess,c_fail);
                break;
            case "TRANSITION":
                const transition_id = dataAction.transition;
                eventPoscondition = new EventPosConditionTransition(transition_id);
            default:
                break;
        }

        if (eventPoscondition) {
            posConditions.push(eventPoscondition);
        }
    });

    return posConditions;
}

function loadEvents(dataEvents) {
    const events = [];

    dataEvents.forEach(dataEvent => {
        const id = dataEvent.id;
        const dataPreconditions = dataEvent.preconditions || {};
        const dataPosconditions = dataEvent.posconditions;
        const repetitions = dataEvent.repetitions || null;
        const preConditions = new PreConditionTree(loadPreconditions(dataPreconditions));
        const posConditions = loadPosconditions(dataPosconditions);

        events.push(new Event(id, preConditions, posConditions, repetitions));
    });

    return events;
}
