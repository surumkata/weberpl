// CLASSE DE UM OBJETO
export class Object {
  constructor(id, scenarioId) {
      this.id = id;
      this.currentView = null;
      this.reference = scenarioId;
      this.views = {};
      this.sounds = {};
  }

  changeCurrentView(viewId) {
      if (viewId in this.views) {
          this.currentView = viewId;
          //CASO SEJA ANIMADA TEM DE RESETAR O SPRITE
          this.views[viewId].repeate = this.views[viewId].repeateInit;
          this.views[viewId].currentSprite = 0;
      } else {
          this.currentView = null;
      }
  }

  // Função que verifica se foi clicado na área  (da view atual) do objeto
  haveClicked(x, y) {
    if (this.currentView != null) {
        return this.views[this.currentView].collide(x,y);
    }
    return false;
  }

  // Função que muda a posição do objeto
  changePosition(position) {
      for (let view in this.views) {
          this.views[view].changePosition(position);
      }
  }

  // Função que muda o tamanho do objeto
  changeSize(size) {
      for (let view in this.views){
        this.views[view].changeSize(size);
      }
  }

  addView(view, initial = false) {
      this.views[view.id] = view;
      if (initial) {
          this.changeCurrentView(view.id);
      }
  }

  addSound(sound) {
      this.sounds[sound.id] = sound;
  }

  draw(p5,invisibleViews=0,hitboxs=false){
    if (this.currentView !== null && this.currentView !== "null" && this.currentView in this.views){
      this.views[this.currentView].draw(p5);
    }
    if(invisibleViews!==0){
        for (var view in this.views){
            if(view !== "null" && view !== null && view !== this.currentView){
                let semi_opacity = false;
                if(invisibleViews===1){
                    semi_opacity = true;
                }
                this.views[view].draw(p5,semi_opacity);
            }
        }
    }
    //TODO: draw hitboxs if true
    if (hitboxs){
        p5.push();
        let alpha = 0.5;
        p5.fill(`rgba(0, 255, 0, ${alpha})`);
        if (this.currentView !== null && this.currentView !== "null" && this.currentView in this.views){
            this.views[this.currentView].drawHitbox(p5);
        }
        if(invisibleViews!==0){
            if(invisibleViews === 1){
                alpha*=0.5;
            }
            p5.fill(`rgba(0, 255, 0, ${alpha})`);
            for (var view in this.views){
                if(view !== "null" && view !== null && view !== this.currentView){
                    this.views[view].drawHitbox(p5);
                }
            }
        }
        p5.pop();
    }
  }
}
