import { GREEN, Position, RED, Size } from './utils';
import { State } from './state';

class Item {
  constructor(id, size, state, slot) {
    this.id = id;
    this.size = new Size(0, 0);
    this.position = new Position(0, 0);

    if (size.x >= size.y) {
      this.size.x = 60;
      this.size.y = size.y * 60 / size.x;
    } else {
      this.size.y = 60;
      this.size.x = size.x * 60 / size.y;
    }

    this.position.x = 80 - this.size.x + 10 + slot * 90;
    this.position.y = 80 - this.size.x + 10;
    state.change_size(this.size);
    this.state = state;
    this.in_use = false;
  }

  have_clicked(x, y) {
    return this.position.x <= x && x <= this.position.x + this.size.x && this.position.y <= y && y <= this.position.y + this.size.y;
  }

  draw(screen) {
  }

}

class Inventory {
  constructor() {
    this.items = 0;
    this.slots = {};
    this.update_in_use = [];
    this.update_add = [];
    this.update_remove = [];
    this.last_active = null;
  }

}
