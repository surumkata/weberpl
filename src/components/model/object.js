// CLASSE DE UM OBJETO
export class Object {
  constructor(id, scenarioId, position, size) {
      this.id = id;
      this.currentView = null;
      this.reference = scenarioId;
      this.position = position;
      this.size = size;
      this.views = {};
      this.sounds = {};
  }

  changeCurrentView(viewId) {
      if (viewId in this.views) {
          this.currentView = viewId;
          this.position = this.views[viewId].position;
          this.size = this.views[viewId].size;
          this.views[viewId].repeate = this.views[viewId].repeateInit;
          this.views[viewId].currentSprite = 0;
      } else {
          this.currentView = null;
      }
  }

  // Função que verifica se foi clicado na área do objeto
  haveClicked(x, y) {
      // TODO: melhorar hitBox
      
    if (this.currentView != null) {
      let position = this.views[this.currentView].position
      let size = this.views[this.currentView].size
      return (
        position.x + size.x * 0.1 <= x &&
        x <= position.x + size.x * 0.9 &&
        position.y + size.y * 0.1 <= y &&
        y <= position.y + size.y * 0.9
      );
    }
    return false;
  }

  // Função que muda a posição do objeto
  changePosition(position) {
      this.position = position;
      for (let view in this.views) {
          this.views[view].changePosition(position);
      }
  }

  // Função que muda o tamanho do objeto
  changeSize(size) {
      this.size = size;
      for (let view in this.views){
        this.views[view].changeSize(size);
      }
  }

  positionIsNone() {
      return this.position.x === null || this.position.y === null;
  }

  sizeIsNone() {
      return this.size.x === null || this.size.y === null;
  }

  addView(view, initial = false) {
      this.views[view.id] = view;
      if (this.positionIsNone()) {
          this.position = { x: view.position.x, y: view.position.y };
      }
      if (this.sizeIsNone()) {
          this.size = { x: view.size.x, y: view.size.y };
      }
      if (initial) {
          this.changeCurrentView(view.id);
      }
  }

  addSound(sound) {
      this.sounds[sound.id] = sound;
  }

  draw(p5){
    if (this.currentView !== null && this.currentView != "null" && this.currentView in this.views){
      this.views[this.currentView].draw(p5);
    }
  }
}
