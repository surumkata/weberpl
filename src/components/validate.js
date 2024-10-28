

const validateSound = (sound,reasons) => {
  if(!sound.src){
    reasons.push("View "+sound.id+" does not have a source");
  }
}

const validateView = (view,reasons) => {
  //Verificar se view tem posiçao
  if(view.type == 'VIEW_IMAGE'){
    if (!view.position) {
      reasons.push("View "+view.id+" does not have a position");
    }
    //Verificar se view tem tamanho
    if (!view.size) {
      reasons.push("View "+view.id+" does not have a size");
    }
    //Verificar se view tem source
    if (!view.sources) {
      reasons.push("View "+view.id+" does not have a source");
    }
    else{
      if(view.sources.length===0){
        reasons.push("View "+view.id+" does not have a source");
      }
    }
  }
  else if (view.type == 'VIEW_SKETCH'){
    //TODO:
  }
}

const validateObject = (object,vars,reasons) => {
  //Verificar se existem id ja existe entre os objetos
  if (object.id in vars.objects){
    reasons.push("There is more than one object with id " + object.id)
  }
  else {
    vars.objects[object.id] = {
      views : [],
      sounds : []
    }
    let views = object.views;
    //Verificar se os objetos tem pelo menos 1 view
    if (views.length == 0) {
      reasons.push("Objects must have at least 1 view.")
    }
    //Validar views do objeto
    views.forEach(view => {
      //Verificar se existem ids duplicados nas views desse cenario
      if (vars.objects[object.id].views.includes(view.id)){
        reasons.push("There is more than one view in object " + object.id + " with id " + view.id)
      }
      else {
        vars.objects[object.id].views.push(view.id)
        validateView(view,reasons);     
      }
    });

    let sounds = object.sounds
      //Validar sons de um cenario
      sounds.forEach(sound => {
        //Verificar se existem ids duplicados nas sounds desse cenario
        if (vars.objects[object.id].sounds.includes(sound.id)){
          reasons.push("There is more than one sound in object " + object.id + " with id " + sound.id);
        }
        else {
          vars.objects[object.id].sounds.push(sound.id);
          validateSound(sound,reasons);
        }
    })

    //Verificar se a initial view de um objeto existe
    if (!(vars.objects[object.id].views.includes(object.initial_view))){
      reasons.push("View "+object.initial_view + " is not a view of object " + object.id)
    }
  }
}

const validateText = (text, reasons) => {
  if (!text.position) {
    reasons.push("Text does not have a position");
  }
}

const validateScenario = (scenario,vars,reasons) => {
    //Verificar se existem cenarios com o mesmo id
    if (scenario.id in vars.scenarios){
      reasons.push("There is more than one scenario with the id " + scenario.id);
    }
    else {
      vars.scenarios[scenario.id] = {
        views : [],
        sounds : []
      }
      let views = scenario.views;
      //Verificar se os cenarios tem pelo menos 1 view.
      if (views.length == 0) {
        reasons.push("Scenarios must have at least 1 view.")
      }
      //Validar views de um cenario 
      views.forEach(view => {
        //Verificar se existem ids duplicados nas views desse cenario
        if (vars.scenarios[scenario.id].views.includes(view.id)){
          reasons.push("There is more than one view in scenario " + scenario.id + " with id " + view.id)
        }
        else {
          vars.scenarios[scenario.id].views.push(view.id)
          validateView(view,reasons);
        }
      });
      //Verificar se a initial view de uma cena existe
      if (!(vars.scenarios[scenario.id].views.includes(scenario.initial_view))){
        reasons.push("View "+scenario.initial_view+" is not a view of scenario "+scenario.id)
      }
      let objects = scenario.objects
      if(objects){
        //Validar objetos de um cenario
        objects.forEach(object => {
          validateObject(object,vars,reasons);
        })
      }

      let hitboxes = scenario.hitboxes
      if(hitboxes){
        //TODO: validate hitboxes
      }

      let texts = scenario.texts
      texts.forEach(text => {
        validateText(text,reasons);
      })
      
      let sounds = scenario.sounds
      //Validar sons de um cenario
      sounds.forEach(sound => {
        //Verificar se existem ids duplicados nas sounds desse cenario
        if (vars.scenarios[scenario.id].sounds.includes(sound.id)){
          reasons.push("There is more than one sound in scenario " + scenario.id + " with id " + sound.id);
        }
        else {
          vars.scenarios[scenario.id].sounds.push(sound.id);
          validateSound(sound,reasons);
        }
      })
    }  
}

const validatePreCondition = (preCondition, vars, reasons) => {
  switch (preCondition.type) {
    case "CLICKED_OBJECT":
        if(!(preCondition.object in vars.objects)){
          reasons.push("Object "+preCondition.object+" does not exist in escape room");
        }
        break;
    case "CLICKED_NOT_OBJECT":
        //validate
        break;
    case "CLICKED_HITBOX":
          //validate
          break;
    case "CLICKED_NOT_HITBOX":
          if(!(preCondition.hitbox in vars.objects)){
            reasons.push("Hitbox "+preCondition.object+" does not exist in escape room");
          }
          break;
    case "WHEN_OBJECT_IS_VIEW":
        if(!(preCondition.object in vars.objects)){
          reasons.push("Object "+preCondition.object+" does not exist in escape room");
        }
        else if (!(vars.objects[preCondition.object].views.includes(preCondition.view))){
          reasons.push("View "+preCondition.view+" is not a view of object " + preCondition.object);
        }
        break;
    case "AFTER_EVENT":
        if(!(vars.events.includes(preCondition.event))){
          reasons.push("Event "+preCondition.event+" does not exist in escape room");
        }
        break;
    case "OBJ_IS_IN_USE":
        if(!(preCondition.object in vars.objects)){
          reasons.push("Object "+preCondition.object+" does not exist in escape room");
        }
        break;
    default:
        break;
  }
}

const validatePreConditions = (preConditions, vars,reasons) => {
  if (preConditions.operator) {
    if(preConditions.left){
      validatePreConditions(preConditions.left,vars,reasons);
    }
    if(preConditions.right){
      validatePreConditions(preConditions.right,vars,reasons);
    }
  }
  else {
    validatePreCondition(preConditions,vars,reasons)
  }
}

const validateSucessFailt = (posCondition, vars, reasons) => {
  console.log(posCondition)
  if (posCondition.sucess == undefined || posCondition.sucess.length === 0) {
    reasons.push("Sucess of challenge must have at least 1 action.")
  }
  else {
    validatePosConditions(posCondition.sucess,vars,reasons);
  }
  if (posCondition.fail == undefined || posCondition.fail.length === 0) {
    reasons.push("Fail of challenge must have at least 1 action.")
  }
  else {
    validatePosConditions(posCondition.fail,vars,reasons);
  }
}

const validateSucess = (posCondition, vars, reasons) => {
  console.log(posCondition)
  if (posCondition.sucess == undefined || posCondition.sucess.length === 0) {
    reasons.push("Sucess of challenge must have at least 1 action.")
  }
  else {
    validatePosConditions(posCondition.sucess,vars,reasons);
  }
}

const validatePosConditions = (posConditions, vars,reasons) => {

  if (posConditions == undefined || posConditions.length === 0) {
    reasons.push("Events must have at least 1 action.")
    return;
  }

  posConditions.forEach(posCondition => {
    switch(posCondition.type){
      case "END_GAME":
          break;
      case "OBJ_CHANGE_VIEW":
          if(!(posCondition.object in vars.objects)){
            reasons.push("Object "+posCondition.object+" does not exist in escape room");
          }
          else if (!(vars.objects[posCondition.object].views.includes(posCondition.view))){
            reasons.push("View "+posCondition.view+" is not a view of object " + posCondition.object);
          }
          break;
      case "OBJ_CHANGE_POSITION":
          if(!(posCondition.object in vars.objects)){
            reasons.push("Object "+posCondition.object+" does not exist in escape room");
          }
          if(!posCondition.position){
            reasons.push("Action {Object move to} needs a position")
          }
          break;
      case "OBJ_SCALES":
          if(!(posCondition.object in vars.objects)){
            reasons.push("Object "+posCondition.object+" does not exist in escape room");
          }
          if(!posCondition.scale){
            reasons.push("Action {Object scales into} needs a scale")
          }
          break;
      case "SHOW_MESSAGE":
          if(!posCondition.position){
            reasons.push("Action {Show Message} needs a position to message")
          }
          break;
      case "OBJ_PUT_INVENTORY":
          if(!(posCondition.object in vars.objects)){
            reasons.push("Object "+posCondition.object+" does not exist in escape room");
          }
          break;
      case "CHANGE_SCENARIO":
          if(!(posCondition.scenario in vars.scenarios)){
            reasons.push("Scenario "+posCondition.scenario+" does not exist in escape room");
          }
          break;
      case "REMOVE_OBJ":
          if(!(posCondition.object in vars.objects)){
            reasons.push("Object "+posCondition.object+" does not exist in escape room");
          }
          break;
      case "PLAY_SOUND":
          if (posCondition.sourceType === 'OBJECT'){
            if(!(posCondition.sourceId in vars.objects)){
              reasons.push("Object "+posCondition.sourceId+" does not exist in escape room");
            }
            else if(!(vars.objects[posCondition.sourceId].sounds.includes(posCondition.sound))) {
              reasons.push("Object "+posCondition.sourceId+" does not have a sound with the id "+posCondition.sound);
            }
          }
          else if(posCondition.sourceType === 'SCENARIO'){
            if(!(posCondition.sourceId in vars.scenarios)){
              reasons.push("Scenario "+posCondition.sourceId+" does not exist in escape room");
            }
            else if(!(vars.scenarios[posCondition.sourceId].sounds.includes(posCondition.sound))) {
              reasons.push("Scenario "+posCondition.sourceId+" does not have a sound with the id "+posCondition.sound);
            }
          }
          else {
            reasons.push("Don't recognize this type")
          }
          break;
      case "NO_CHALLENGE":
          reasons.push("Action {Start challenge} need a challenge")
          break;
      case "QUESTION":
          validateSucessFailt(posCondition,vars,reasons);
          break;
      case "MULTIPLE_CHOICE":
          validateSucessFailt(posCondition,vars,reasons);
          break;
      case "SEQUENCE":
          validateSucessFailt(posCondition,vars,reasons);
          break;
      case "CONNECTIONS":
          validateSucessFailt(posCondition,vars,reasons);
          break;
      case "PUZZLE":
          validateSucess(posCondition,vars,reasons);
          break;
      case "SLIDEPUZZLE":
          validateSucess(posCondition,vars,reasons);
          break;
      case "TRANSITION":
          if(!(vars.transitions.includes(posCondition.transition))){
            reasons.push("Transition "+posCondition.transition+" does not exist in escape room");
          }
          break;
      default:
          break;
    }
  })
}

const validateEvent = (event, vars,reasons) => {
  if (event.preconditions === null) {
    reasons.push("Events must have at least 1 trigger.")
  }
  else {
    validatePreConditions(event.preconditions,vars,reasons);
  }
  validatePosConditions(event.posconditions,vars,reasons);
}

const validateTransition = (transition,vars,reasons) => {
  vars.transitions.push(transition.id);
  if(transition.view === null){
    reasons.push("Transition must have a view")
  }
  else{
    validateView(transition.view,reasons);
  }
  if(transition.next_type === 'TRANSITION'){
    if(!(vars.transitions.includes(transition.next))){
      reasons.push("Transition "+transition.next + " (next) is not a transition of Escape Room.")
    }
  }
  else if(transition.next_type === 'SCENARIO'){
    if(!(transition.next in vars.scenarios)){
      reasons.push("Scenario "+transition.next + " (next) is not a scenario of Escape Room.")
    }
  }
  else{
    reasons.push("Don't recognize this type")
  }
}


const validate = (er) => {

    console.log("dk",er);
    let scenarios = er.scenarios;
    let events = er.events;
    let transitions = er.transitions;
    let variables = er.variables;
    var reasons = []

    var vars = {
      scenarios : {},
      objects : {},
      events : [],
      transitions : [],
      variables : []
    }

    //Verificar se existe pelo menos 1 cenario
    if (scenarios.length == 0){
      reasons.push("Escape Room must have at least 1 scenario.")
    }
    else {
      // Validar cenarios
      scenarios.forEach(scenario => {
        validateScenario(scenario,vars,reasons);
      });

      // Validar ids transições (preciso de verificar os ids todos antes de validar as transiçoes individualmente porque uma transição pode apontar para outra que ainda nao foi inacializada.)
      transitions.forEach(transition => {
        //Verificar se existem cenarios com o mesmo id
        if (vars.transitions.includes(transition.id)){
          reasons.push("There is more than one transition with the id " + transition.id);
        }
        else {
          vars.transitions.push(transition.id);
        }
      })

      // Validar transições
      transitions.forEach(transition => {
        validateTransition(transition,vars,reasons);
      })

      events.forEach(event => {
        //Verificar se existem eventos com o mesmo id
        if (vars.events.includes(event.id)){
          reasons.push("There is more than one event with the id " + event.id);
        }
        else {
          vars.events.push(event.id);
        }
      })

      // Validar eventos
      events.forEach(event => {
        validateEvent(event,vars,reasons);
      })      

      //Validar start da escape room
      if (er.start_type === 'SCENARIO'){
        if(!(er.start in vars.scenarios)){
          reasons.push("Scenario "+er.start + " (start) is not a scenario of Escape Room.")
        }
      }
      else if(er.start_type === 'TRANSITION') {
        if(!(vars.transitions.includes(er.start))){
          reasons.push("Transition "+er.start + " (start) is not a transition of Escape Room.")
        }
      }
      else {
        reasons.push("Don't recognize this type")
      }

      return reasons;
    }
  }

export {validate};