import {  Position, Size, WIDTH, HEIGHT_INV} from './utils';

let SQUARE_SIZE = 80

export class Item {
  constructor(id, size, view, slot, slotPosition) {
    this.id = id;
    this.size = new Size(0, 0);
    this.position = new Position(0, 0);
    this.slot = slot

    this.slotPosition = slotPosition;

    let padding = 10
    let objSize = SQUARE_SIZE - padding*2

    if (size.x >= size.y) {
      this.size.x = objSize;
      this.size.y = size.y * objSize / size.x;
    } else {
      this.size.y = objSize;
      this.size.x = size.x * objSize / size.y;
    }

    this.position.x = this.slotPosition.x + padding;
    this.position.y = this.slotPosition.y + this.size.y/2;
    view.changeSize(this.size);
    this.view = view;
    this.inUse = false;
    this.hover = false;
  }

  // Função que verifica se foi clicado na área do objeto
  haveClicked(x, y) {
    return (
        this.slotPosition.x <= x &&
        x <= this.slotPosition.x + SQUARE_SIZE &&
        this.slotPosition.y <= y &&
        y <= this.slotPosition.y + SQUARE_SIZE
    );
  }

  draw(p5) {
    if(this.inUse){
        p5.fill(0,255,0);
        p5.stroke(0);
        p5.strokeWeight(2);
        p5.rect(this.slotPosition.x, this.slotPosition.y, SQUARE_SIZE,SQUARE_SIZE);
    }
    else if (this.hover){
        p5.fill(255,0,0);
        p5.stroke(0);
        p5.strokeWeight(2);
        p5.rect(this.slotPosition.x, this.slotPosition.y, SQUARE_SIZE,SQUARE_SIZE);
    }
    // Desenha a imagem na posição especificada
    p5.image(this.view.images[0],this.position.x,this.position.y,this.size.x,this.size.y);
  }

  mouseMoved(e) {
    let mX = e.mouseX
    let mY = e.mouseY
    if (this.haveClicked(mX,mY)) {
        this.hover = true
        document.documentElement.style.cursor = 'pointer';
    }
    else {
        this.hover = false
        document.documentElement.style.cursor = 'default';
    }
  }
}

export class Inventory {
  constructor() {
      this.items = 0;
      this.slots = {};
      this.updateInUse = [];
      this.updateAdd = [];
      this.updateRemove = [];
      this.lastActive = null;

      this.inWidth = WIDTH;
      this.invHeight = HEIGHT_INV;
      this.squareSize = SQUARE_SIZE;
      this.padding = (this.invHeight - 80) / 2;
  
      this.numberSquares = WIDTH / (this.squareSize+this.padding);
      this.numberSquares = Math.floor(this.numberSquares);
  
      this.startPadding = (WIDTH - (this.numberSquares * (this.squareSize+this.padding))) / 2
  }

  findEmptySlot() {
      for (let [slot, item] of Object.entries(this.slots)) {
          if (item === null) {
              return slot;
          }
      }
      return this.items;
  }

  add(object, slot) {
      let x = this.startPadding + ((slot) * (this.squareSize + this.padding));
      let y = this.padding
      this.slots[slot] = new Item(object.id, object.views[object.currentView].size, object.views[object.currentView], slot, new Position(x,y));
      this.items += 1;
  }

  remove(itemId) {
      for (let [slot, item] of Object.entries(this.slots)) {
          if (item !== null && item.id === itemId) {
              this.slots[slot] = null;
              this.items -= 1;
          }
      }
  }

  activeItem(itemId) {
      for (let [slot, item] of Object.entries(this.slots)) {
          if (item !== null && item.id === itemId) {
              if (this.lastActive !== null) {
                  this.updateInUse.push([this.lastActive, false]);
              }
              this.updateInUse.push([slot, true]); // Coloca no buffer
              this.lastActive = slot;
              break;
          }
      }
  }

  desactiveItem(itemId) {
      for (let [slot, item] of Object.entries(this.slots)) {
          if (item !== null && item.id === itemId) {
              this.updateInUse.push([slot, false]); // Coloca no buffer
              break;
          }
      }
  }

  updateItems() {
      for (let [slot, inUse] of this.updateInUse) {
          if (this.slots[slot] !== null) {
              this.slots[slot].inUse = inUse;
          }
      }
      for (let [item, slot] of this.updateAdd) {
          this.add(item, slot);
      }
      for (let item of this.updateRemove) {
          this.remove(item);
      }

      this.updateInUse = [];
      this.updateAdd = [];
      this.updateRemove = [];
  }

  checkItemInUse(itemId) {
      for (let item of Object.values(this.slots)) {
          if (item !== null && item.id === itemId) {
              return item.inUse;
          }
      }
      return false;
  }

  getItem(itemId) {
      for (let item of Object.values(this.slots)) {
          if (item !== null && item.id === itemId) {
              return item;
          }
      }
      return null;
  }

  existItem(itemId) {
      for (let item of Object.values(this.slots)) {
          if (item !== null && item.id === itemId) {
              return true;
          }
      }
      return false;
  }

  draw(p5) {
    // Fundo colorido
    
    p5.fill(255);
    p5.stroke(0);
    p5.strokeWeight(2);
    p5.rect(0, 0, this.inWidth, this.invHeight);
    
    let i = 1;
    while (true) {
        let x = this.startPadding + ((i - 1) * (this.squareSize + this.padding));
        if (x < this.inWidth - this.squareSize) {
            p5.fill(255);  // Cor branca
            p5.stroke(0);
            p5.strokeWeight(2);
            p5.rect(x, this.padding, this.squareSize, this.squareSize);
            i++;
        } else {
            break;
        }
    }
    
    // Desenha os itens nos slots
    for (let key in this.slots) {
        if (this.slots[key] !== null) {
            this.slots[key].draw(p5);
        }
    }

  }

  mouseMoved(e) {
    for (let key in this.slots) {
        if (this.slots[key] !== null) {
            this.slots[key].mouseMoved(e);
        }
    }
  }

};
