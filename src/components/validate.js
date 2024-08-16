const validate = (er) => {
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
      reasons.push("Escape Room must have at least 1 scenario.")
    }
    else {
      // Validar cenarios
      scenarios.forEach(scenario => {
        //Verificar se existem cenarios com o mesmo id
        if (scenario.id in vars.scenarios){
          reasons.push("There is more than one scenario with the id " + scenario.id);
        }
        else {
          vars.scenarios[scenario.id] = {
            views : []
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
              reasons.push("There is more than one view in scenario" + scenario.id + "with id" + view.id)
            }
            else {
              vars.scenarios[scenario.id].views.push(view.id)
              //Verificar se view tem posiçao
              if(view.type == 'VIEW_IMAGE'){
                if (!view.position) {
                  reasons.push("View "+view.id+" does not have a position")
                }
                //Verificar se view tem tamanho
                if (!view.size) {
                  reasons.push("View "+view.id+" does not have a size")
                }
                //Verificar se view tem source
                if (!view.src) {
                  reasons.push("View "+view.id+" does not have a source")
                }
              }
              else if (view.type == 'VIEW_SKETCH'){
                //TODO:
              }
            }
          });
          //Verificar se a initial view de uma cena existe
          if (!(vars.scenarios[scenario.id].views.includes(scenario.initial_view))){
            reasons.push("View "+scenario.initial_view+" is not a view of scenario "+scenario.id)
          }
          let objects = scenario.objects
          //Validar objetos de um cenario
          objects.forEach(object => {
            //Verificar se existem id ja existe entre os objetos
            if (object.id in vars.objects){
              reasons.push("There is more than one object with id " + object.id)
            }
            else {
              vars.objects[object.id] = {
                views : []
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
                  if(view.type == 'VIEW_IMAGE'){
                    //Verificar se view tem posiçao
                    if (!view.position) {
                      reasons.push("View "+view.id+" does not have a position")
                    }
                    //Verificar se view tem tamanho
                    if (!view.size) {
                      reasons.push("View "+view.id+" does not have a size")
                    }
                    //Verificar se view tem source
                    if (!view.src) {
                      reasons.push("View "+view.id+" does not have a source")
                    }
                  }
                  else if (view.type == 'VIEW_SKETCH'){
                    //TODO:
                  }
                  
                }
              });
              //Verificar se a initial view de um objeto existe
              if (!(vars.objects[object.id].views.includes(object.initial_view))){
                reasons.push("View "+object.initial_view + " is not a view of object " + object.id)
              }
            }
          })
        }  
      });

      events.forEach(event => {
        //Verificar se existem cenarios com o mesmo id
        if (event.id in vars.events){
          reasons.push("There is more than one event with the id " + event.id);
        }
        //else {
        //}
      })

      transitions.forEach(transition => {
        //Verificar se existem cenarios com o mesmo id
        if (transition.id in vars.transitions){
          reasons.push("There is more than one event with the id " + transition.id);
        }
        //else {
        //}
      })


  
      return reasons;
    }
  }

export {validate};