import { HitboxArc, HitboxCircle, HitboxEllipse, HitboxLine, HitboxPolygon, HitboxRect, HitboxSquare, HitboxTriangle } from "./model/hitbox";
import { SCALE_EDIT, HEIGHT_INV } from "./model/utils";
import { Arc, Circle, Ellipse, Line, Polygon, Rect, Square, Triangle} from "./model/view";

export const updateHitbox = (workspaceRef, objectId, viewId, hitbox) => {
    var newvalues = {}
    var hitbox_type = ''
    switch(hitbox.constructor){
        case HitboxPolygon:
            for (var i in hitbox.points){
              let point = hitbox.points[i]
              let j = parseInt(i)+1
              newvalues['X'+j] = point.x*1/SCALE_EDIT
              newvalues['Y'+j] = point.y* 1/SCALE_EDIT-HEIGHT_INV
            }
            hitbox_type = 'hitbox_polygon'
            break;
        case HitboxRect:
            newvalues['X'] = hitbox.x* 1/SCALE_EDIT;
            newvalues['Y'] = hitbox.y* 1/SCALE_EDIT-HEIGHT_INV;
            newvalues['W'] = hitbox.w* (1/SCALE_EDIT);
            newvalues['H'] = hitbox.h* (1/SCALE_EDIT);
            hitbox_type = 'hitbox_rect'
            break;
        case HitboxArc:
            newvalues['X'] = hitbox.x* 1/SCALE_EDIT;
            newvalues['Y'] = hitbox.y* 1/SCALE_EDIT-HEIGHT_INV;
            newvalues['W'] = hitbox.w* 1/SCALE_EDIT;
            newvalues['H'] = hitbox.h* 1/SCALE_EDIT;
            hitbox_type = 'hitbox_arc'
            break;
        case HitboxCircle:
            newvalues['X'] = hitbox.x* 1/SCALE_EDIT;
            newvalues['Y'] = hitbox.y* 1/SCALE_EDIT-HEIGHT_INV;
            newvalues['RADIUS'] = (hitbox.w/2)* 1/SCALE_EDIT;
            hitbox_type = 'hitbox_circle'
            break;
        case HitboxEllipse:
            newvalues['X'] = hitbox.x* 1/SCALE_EDIT;
            newvalues['Y'] = hitbox.y* 1/SCALE_EDIT-HEIGHT_INV;
            newvalues['W'] = hitbox.w* 1/SCALE_EDIT;
            newvalues['H'] = hitbox.h* 1/SCALE_EDIT;
            hitbox_type = 'hitbox_ellipse'
            break;
        case HitboxLine:
            newvalues['X1'] = hitbox.x1* 1/SCALE_EDIT;
            newvalues['Y1'] = hitbox.y1* 1/SCALE_EDIT-HEIGHT_INV;
            newvalues['X2'] = hitbox.x2* 1/SCALE_EDIT;
            newvalues['Y2'] = hitbox.y2* 1/SCALE_EDIT-HEIGHT_INV;
            hitbox_type = 'hitbox_line'
            break;
        case HitboxSquare:
            newvalues['X'] = hitbox.x* 1/SCALE_EDIT;
            newvalues['Y'] = hitbox.y* 1/SCALE_EDIT-HEIGHT_INV;
            newvalues['S'] = hitbox.w* 1/SCALE_EDIT;
            hitbox_type = 'hitbox_square'
            break;
        case HitboxTriangle:
            newvalues['X1'] = hitbox.x1* 1/SCALE_EDIT;
            newvalues['Y1'] = hitbox.y1* 1/SCALE_EDIT-HEIGHT_INV;
            newvalues['X2'] = hitbox.x2* 1/SCALE_EDIT;
            newvalues['Y2'] = hitbox.y2* 1/SCALE_EDIT-HEIGHT_INV;
            newvalues['X3'] = hitbox.x3* 1/SCALE_EDIT;
            newvalues['Y3'] = hitbox.y3* 1/SCALE_EDIT-HEIGHT_INV;
            hitbox_type = 'hitbox_triangle'
            break;
        default:
            break;
    }
    updateBlocks(workspaceRef,objectId,viewId,hitbox.id,hitbox_type,newvalues)
}


export const updateView = (workspaceRef,objectId,view) => {
    let newPosx = view.position.x * 1/SCALE_EDIT;
    let newPosy = (view.position.y* 1/SCALE_EDIT-HEIGHT_INV);
    let newSizex = 0;
    let newSizey = 0;
    if(view.size.x !== 0){
      newSizex = view.size.x * 1/SCALE_EDIT;
    }
    if(view.size.y !== 0){
      newSizey = view.size.y * 1/SCALE_EDIT;
    }
    updateViewPositionAndSize(workspaceRef,objectId,view.id,newPosx,newPosy,newSizex,newSizey);
}

export const updateViewSketch = (workspaceRef,objectId,viewId,draw) => {
    var newvalues = {}
    var draw_type = ''
    switch(draw.constructor){
        case Rect:
          newvalues['X'] = draw.x* 1/SCALE_EDIT;
          newvalues['Y'] = draw.y* 1/SCALE_EDIT-HEIGHT_INV;
          newvalues['W'] = draw.w* (1/SCALE_EDIT);
          newvalues['H'] = draw.h* (1/SCALE_EDIT);
          draw_type = 'draw_rect'
          break;
        case Polygon:
          for (var i in draw.points){
            let point = draw.points[i]
            let j = parseInt(i)+1
            newvalues['X'+j] = point.x*1/SCALE_EDIT
            newvalues['Y'+j] = point.y* 1/SCALE_EDIT-HEIGHT_INV
          }
          draw_type = 'draw_polygon'
          break;
        case Triangle:
          newvalues['X1'] = draw.x1* 1/SCALE_EDIT;
          newvalues['Y1'] = draw.y1* 1/SCALE_EDIT-HEIGHT_INV;
          newvalues['X2'] = draw.x2* 1/SCALE_EDIT;
          newvalues['Y2'] = draw.y2* 1/SCALE_EDIT-HEIGHT_INV;
          newvalues['X3'] = draw.x3* 1/SCALE_EDIT;
          newvalues['Y3'] = draw.y3* 1/SCALE_EDIT-HEIGHT_INV;
          draw_type = 'draw_triangle'
        case Line:
          newvalues['X1'] = draw.x1* 1/SCALE_EDIT;
          newvalues['Y1'] = draw.y1* 1/SCALE_EDIT-HEIGHT_INV;
          newvalues['X2'] = draw.x2* 1/SCALE_EDIT;
          newvalues['Y2'] = draw.y2* 1/SCALE_EDIT-HEIGHT_INV;
          draw_type = 'draw_line'
          break;
        case Ellipse:
          newvalues['X'] = draw.x* 1/SCALE_EDIT;
          newvalues['Y'] = draw.y* 1/SCALE_EDIT-HEIGHT_INV;
          newvalues['W'] = draw.w* 1/SCALE_EDIT;
          newvalues['H'] = draw.h* 1/SCALE_EDIT;
          draw_type = 'draw_ellipse'
          break;
        case Circle:
          newvalues['X'] = draw.x* 1/SCALE_EDIT;
          newvalues['Y'] = draw.y* 1/SCALE_EDIT-HEIGHT_INV;
          newvalues['RADIUS'] = (draw.w/2)* 1/SCALE_EDIT;
          draw_type = 'draw_circle'
          break;
        case Arc:
          newvalues['X'] = draw.x* 1/SCALE_EDIT;
          newvalues['Y'] = draw.y* 1/SCALE_EDIT-HEIGHT_INV;
          newvalues['W'] = draw.w* 1/SCALE_EDIT;
          newvalues['H'] = draw.h* 1/SCALE_EDIT;
          draw_type = 'draw_arc'
        case Square:
          newvalues['X'] = draw.x* 1/SCALE_EDIT;
          newvalues['Y'] = draw.y* 1/SCALE_EDIT-HEIGHT_INV;
          newvalues['S'] = draw.w* 1/SCALE_EDIT;
          draw_type = 'draw_square'
        default:
          break;
      }
      updateBlocks(workspaceRef,objectId,viewId,draw.id,draw_type,newvalues)
}

const updateViewPositionAndSize = (workspaceRef, objectId, viewId, newPosx, newPosy, newSizex, newSizey) => {
  const objectBlocks = workspaceRef.current.getBlocksByType('object');

  objectBlocks.forEach(objectBlock => {
    // Verificar se este bloco 'object' tem o ID que estamos procurando
    if (objectBlock.getFieldValue('ID') === objectId) {
      // Encontrar todos os sub-blocos do tipo 'view' dentro do bloco 'object'
      let viewBlocks = objectBlock.getChildren(false).filter(childBlock => childBlock.type === 'view');
      const turnBlocks = objectBlock.getChildren(false).filter(childBlock => childBlock.type === 'turn');

      turnBlocks.forEach(turnBlock => {
        const turnViewBlocks = turnBlock.getChildren(false).filter(childBlock => childBlock.type === 'view');
        viewBlocks = viewBlocks.concat(turnViewBlocks);
      });

      viewBlocks.forEach(viewBlock => {
        // Verificar se este bloco 'view' tem o ID que estamos procurando
        if (viewBlock.getFieldValue('ID') === viewId) {
          // Encontrar o sub-bloco 'position' dentro do bloco 'view'
          const positionBlock = viewBlock.getInputTargetBlock('POSITION');
          if (positionBlock && positionBlock.type === 'point') {
            // Alterar os valores dos campos 'x' e 'y' para o bloco 'position'
            positionBlock.setFieldValue(newPosx, 'x');
            positionBlock.setFieldValue(newPosy, 'y');
          }
          
          // Encontrar o sub-bloco 'size' dentro do bloco 'view'
          const sizeBlock = viewBlock.getInputTargetBlock('SIZE');
          if (sizeBlock && sizeBlock.type === 'point') {
            // Alterar os valores dos campos 'x' e 'y' para o bloco 'size'
            sizeBlock.setFieldValue(newSizex, 'x');
            sizeBlock.setFieldValue(newSizey, 'y');
          }
        }
      });
    }
  });
};



  const updateBlocks = (workspaceRef,objectId,viewId,id,type,newvalues) => {
    const objectBlocks = workspaceRef.current.getBlocksByType('object');

    const traverseBlocks = (blocks) => {
      blocks.forEach(block => {
        if (block.getFieldValue('ID') === objectId && block.type === 'object') {
          traverseBlocks(block.getChildren(false)); // Recurse into child blocks
        } else if (block.getFieldValue('ID') === viewId && block.type === 'view_draw') {
          traverseBlocks(block.getChildren(false)); // Recurse into child blocks
        } else if (block.getFieldValue('ID') === id && block.type === type) {
          for(let value in newvalues){
            console.log(value)
            block.setFieldValue(newvalues[value], value);
          }
        } else {
          // Continue traversing for other children
          traverseBlocks(block.getChildren(false));
        }
      });
    };

    traverseBlocks(objectBlocks);
  }