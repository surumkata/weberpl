export class Scenario {
  constructor(id) {
      this.id = id;
      this.currentView = null;
      this.views = {};
      this.sounds = {};
  }

  changeCurrentView(viewId) {
      this.currentView = viewId;
      this.views[viewId].repeate = this.views[viewId].repeateInit;
      this.views[viewId].currentSprite = 0;
  }

  addView(view, initial = false) {
      this.views[view.id] = view;
      if (initial) {
          this.currentView = view.id;
      }
  }

  draw(screen) {
      if (this.currentView !== null) {
          this.views[this.currentView].draw(screen);
      }
  }

  addSound(sound) {
      this.sounds[sound.id] = sound;
  }

  draw(p5){
    if (this.currentView != null && this.currentView in this.views){
      this.views[this.currentView].draw(p5);
    }
  }
}