import { HitboxPolygon, HitboxRect } from "./model/hitbox";
import { SCALE_EDIT, HEIGHT_INV } from "./model/utils";
import { Arc, Circle, Ellipse, Line, Polygon, Rect, Triangle} from "./model/view";

export const updateHitbox = (workspaceRef, objectId, viewId, hitbox) => {
    switch(hitbox.constructor){
        case HitboxPolygon:
            let points = []
            for (var i in hitbox.points){
              let point = hitbox.points[i]
              let newx = point.x*1/SCALE_EDIT
              let newy = point.y* 1/SCALE_EDIT-HEIGHT_INV
              points.push({"x" : newx, "y" : newy})
            }

            updateHitboxPolygon(workspaceRef,objectId,viewId,hitbox.id,points);
            break;
        case HitboxRect:
            let newx = hitbox.x* 1/SCALE_EDIT;
            let newy = hitbox.y* 1/SCALE_EDIT-HEIGHT_INV;
            let neww = hitbox.w * (1/SCALE_EDIT);
            let newh = hitbox.h * (1/SCALE_EDIT);
            updateHitboxRect(workspaceRef,objectId,viewId,hitbox.id,newx,newy,neww,newh);
        default:
            break;
    }
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
    switch(draw.constructor){
        case Rect:
          let newx = draw.x* 1/SCALE_EDIT;
          let newy = draw.y* 1/SCALE_EDIT-HEIGHT_INV;
          let neww = 0;
          let newh = 0;
          if(draw.w !== 0){
            neww = draw.w * 1/SCALE_EDIT;
          }
          if(draw.h !== 0){
            newh = draw.h * 1/SCALE_EDIT;
          }
          updateRect(workspaceRef,objectId,viewId,draw.id,newx,newy,neww,newh);
          break;
        case Polygon:
          let points = []

          for (var i in draw.points){
            let newx = draw.points[i].x * 1/SCALE_EDIT
            let newy = draw.points[i].y * 1/SCALE_EDIT-HEIGHT_INV
            points.push({"x" : newx, "y" : newy})
          }

          updatePolygon(workspaceRef,objectId,viewId,draw.id,points);
          break;
        case Triangle:
          let triangle_newx1 = draw.x1* 1/SCALE_EDIT;
          let triangle_newy1 = draw.y1* 1/SCALE_EDIT-HEIGHT_INV;
          let triangle_newx2 = draw.x2* 1/SCALE_EDIT;
          let triangle_newy2 = draw.y2* 1/SCALE_EDIT-HEIGHT_INV;
          let triangle_newx3 = draw.x3* 1/SCALE_EDIT;
          let triangle_newy3 = draw.y3* 1/SCALE_EDIT-HEIGHT_INV;
          updateTriangle(workspaceRef,objectId,viewId,draw.id,triangle_newx1,triangle_newy1,triangle_newx2,triangle_newy2,triangle_newx3,triangle_newy3);
          break;
        case Line:
          let line_newx1 = draw.x1* 1/SCALE_EDIT;
          let line_newy1 = draw.y1* 1/SCALE_EDIT-HEIGHT_INV;
          let line_newx2 = draw.x2* 1/SCALE_EDIT;
          let line_newy2 = draw.y2* 1/SCALE_EDIT-HEIGHT_INV;
          updateLine(workspaceRef,objectId,viewId,draw.id,line_newx1,line_newy1,line_newx2,line_newy2);
          break;
        case Ellipse:
          let ellipse_newx = draw.x* 1/SCALE_EDIT;
          let ellipse_newy = draw.y* 1/SCALE_EDIT-HEIGHT_INV;
          let ellipse_neww = draw.w* 1/SCALE_EDIT;
          let ellipse_newh = draw.h* 1/SCALE_EDIT;
          updateEllipse(workspaceRef,objectId,viewId,draw.id,ellipse_newx,ellipse_newy,ellipse_neww,ellipse_newh);
          break;
        case Circle:
          let circle_newx = draw.x* 1/SCALE_EDIT;
          let circle_newy = draw.y* 1/SCALE_EDIT-HEIGHT_INV;
          let circle_newd = draw.d* 1/SCALE_EDIT;
          updateCircle(workspaceRef,objectId,viewId,draw.id,circle_newx,circle_newy,circle_newd);
          break;
        case Arc:
          let arc_newx = draw.x* 1/SCALE_EDIT;
          let arc_newy = draw.y* 1/SCALE_EDIT-HEIGHT_INV;
          let arc_neww = draw.w* 1/SCALE_EDIT;
          let arc_newh = draw.h* 1/SCALE_EDIT;
          updateArc(workspaceRef,objectId,viewId,draw.id,arc_newx,arc_newy,arc_neww,arc_newh);
        default:
          break;
      }
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

  const updateRect = (workspaceRef,objectId,viewId,rectId,newx,newy,neww,newh) => {
    const objectBlocks = workspaceRef.current.getBlocksByType('object');

    const traverseBlocks = (blocks) => {
      blocks.forEach(block => {
        if (block.getFieldValue('ID') === objectId && block.type === 'object') {
          traverseBlocks(block.getChildren(false)); // Recurse into child blocks
        } else if (block.getFieldValue('ID') === viewId && block.type === 'view_draw') {
          traverseBlocks(block.getChildren(false)); // Recurse into child blocks
        } else if (block.getFieldValue('ID') === rectId && block.type === 'draw_rect') {
          block.setFieldValue(newx, 'X');
          block.setFieldValue(newy, 'Y');
          block.setFieldValue(neww, 'W');
          block.setFieldValue(newh, 'H');
        } else {
          // Continue traversing for other children
          traverseBlocks(block.getChildren(false));
        }
      });
    };

    traverseBlocks(objectBlocks);
  }

  const updateHitboxRect = (workspaceRef,objectId,viewId,hitboxId,newx,newy,neww,newh) => {
    const objectBlocks = workspaceRef.current.getBlocksByType('object');

    const traverseBlocks = (blocks) => {
      blocks.forEach(block => {
        if (block.getFieldValue('ID') === objectId && block.type === 'object') {
          traverseBlocks(block.getChildren(false)); // Recurse into child blocks
        } else if (block.getFieldValue('ID') === viewId && block.type === 'view_draw') {
          traverseBlocks(block.getChildren(false)); // Recurse into child blocks
        } else if (block.getFieldValue('ID') === hitboxId && block.type === 'hitbox_rect') {
          block.setFieldValue(newx, 'X');
          block.setFieldValue(newy, 'Y');
          block.setFieldValue(neww, 'W');
          block.setFieldValue(newh, 'H');
        } else {
          // Continue traversing for other children
          traverseBlocks(block.getChildren(false));
        }
      });
    };

    traverseBlocks(objectBlocks);
  }

  const updatePolygon = (workspaceRef,objectId,viewId,quadId,points) => {
    const objectBlocks = workspaceRef.current.getBlocksByType('object');

    const traverseBlocks = (blocks) => {
      blocks.forEach(block => {
        if (block.getFieldValue('ID') === objectId && block.type === 'object') {
          traverseBlocks(block.getChildren(false)); // Recurse into child blocks
        } else if (block.getFieldValue('ID') === viewId && block.type === 'view_draw') {
          traverseBlocks(block.getChildren(false)); // Recurse into child blocks
        } else if (block.getFieldValue('ID') === quadId && block.type === 'draw_polygon') {
          for(let i in points){
            let point = points[i]
            let j = parseInt(i)+1
            block.setFieldValue(point.x, 'X'+j);
            block.setFieldValue(point.y, 'Y'+j);
          }
        } else {
          // Continue traversing for other children
          traverseBlocks(block.getChildren(false));
        }
      });
    };

    traverseBlocks(objectBlocks);
  }

  const updateHitboxPolygon = (workspaceRef,objectId,viewId,hitboxId,points) => {
    const objectBlocks = workspaceRef.current.getBlocksByType('object');

    const traverseBlocks = (blocks) => {
      blocks.forEach(block => {
        if (block.getFieldValue('ID') === objectId && block.type === 'object') {
          traverseBlocks(block.getChildren(false)); // Recurse into child blocks
        } else if (block.getFieldValue('ID') === viewId && block.type === 'view_draw') {
          traverseBlocks(block.getChildren(false)); // Recurse into child blocks
        } else if (block.getFieldValue('ID') === hitboxId && block.type === 'hitbox_polygon') {
          for(var i in points){
            let point = points[i]
            let j = parseInt(i)+1

            block.setFieldValue(point.x, 'X' + j);
            block.setFieldValue(point.y, 'Y' + j);
          }
        } else {
          // Continue traversing for other children
          traverseBlocks(block.getChildren(false));
        }
      });
    };

    traverseBlocks(objectBlocks);
  }

  const updateTriangle = (workspaceRef,objectId,viewId,quadId,newx1,newy1,newx2,newy2,newx3,newy3) => {
    const objectBlocks = workspaceRef.current.getBlocksByType('object');

    const traverseBlocks = (blocks) => {
      blocks.forEach(block => {
        if (block.getFieldValue('ID') === objectId && block.type === 'object') {
          traverseBlocks(block.getChildren(false)); // Recurse into child blocks
        } else if (block.getFieldValue('ID') === viewId && block.type === 'view_draw') {
          traverseBlocks(block.getChildren(false)); // Recurse into child blocks
        } else if (block.getFieldValue('ID') === quadId && block.type === 'draw_triangle') {
          block.setFieldValue(newx1, 'X1');
          block.setFieldValue(newy1, 'Y1');
          block.setFieldValue(newx2, 'X2');
          block.setFieldValue(newy2, 'Y2');
          block.setFieldValue(newx3, 'X3');
          block.setFieldValue(newy3, 'Y3');
        } else {
          // Continue traversing for other children
          traverseBlocks(block.getChildren(false));
        }
      });
    };

    traverseBlocks(objectBlocks);
  }

  const updateLine = (workspaceRef,objectId,viewId,quadId,newx1,newy1,newx2,newy2) => {
    const objectBlocks = workspaceRef.current.getBlocksByType('object');

    const traverseBlocks = (blocks) => {
      blocks.forEach(block => {
        if (block.getFieldValue('ID') === objectId && block.type === 'object') {
          traverseBlocks(block.getChildren(false)); // Recurse into child blocks
        } else if (block.getFieldValue('ID') === viewId && block.type === 'view_draw') {
          traverseBlocks(block.getChildren(false)); // Recurse into child blocks
        } else if (block.getFieldValue('ID') === quadId && block.type === 'draw_line') {
          block.setFieldValue(newx1, 'X1');
          block.setFieldValue(newy1, 'Y1');
          block.setFieldValue(newx2, 'X2');
          block.setFieldValue(newy2, 'Y2');
        } else {
          // Continue traversing for other children
          traverseBlocks(block.getChildren(false));
        }
      });
    };

    traverseBlocks(objectBlocks);
  }

  const updateCircle = (workspaceRef,objectId,viewId,quadId,newx,newy,newd) => {
    const objectBlocks = workspaceRef.current.getBlocksByType('object');

    const traverseBlocks = (blocks) => {
      blocks.forEach(block => {
        if (block.getFieldValue('ID') === objectId && block.type === 'object') {
          traverseBlocks(block.getChildren(false)); // Recurse into child blocks
        } else if (block.getFieldValue('ID') === viewId && block.type === 'view_draw') {
          traverseBlocks(block.getChildren(false)); // Recurse into child blocks
        } else if (block.getFieldValue('ID') === quadId && block.type === 'draw_circle') {
          block.setFieldValue(newx, 'X');
          block.setFieldValue(newy, 'Y');
          block.setFieldValue(newd, 'D');
        } else {
          // Continue traversing for other children
          traverseBlocks(block.getChildren(false));
        }
      });
    };

    traverseBlocks(objectBlocks);
  }

  const updateEllipse = (workspaceRef,objectId,viewId,quadId,newx,newy,neww,newh) => {
    const objectBlocks = workspaceRef.current.getBlocksByType('object');

    const traverseBlocks = (blocks) => {
      blocks.forEach(block => {
        if (block.getFieldValue('ID') === objectId && block.type === 'object') {
          traverseBlocks(block.getChildren(false)); // Recurse into child blocks
        } else if (block.getFieldValue('ID') === viewId && block.type === 'view_draw') {
          traverseBlocks(block.getChildren(false)); // Recurse into child blocks
        } else if (block.getFieldValue('ID') === quadId && block.type === 'draw_ellipse') {
          block.setFieldValue(newx, 'X');
          block.setFieldValue(newy, 'Y');
          block.setFieldValue(neww, 'W');
          block.setFieldValue(newh, 'H');
        } else {
          // Continue traversing for other children
          traverseBlocks(block.getChildren(false));
        }
      });
    };

    traverseBlocks(objectBlocks);
  }

  const updateArc = (workspaceRef,objectId,viewId,quadId,newx,newy,neww,newh) => {
    const objectBlocks = workspaceRef.current.getBlocksByType('object');

    const traverseBlocks = (blocks) => {
      blocks.forEach(block => {
        if (block.getFieldValue('ID') === objectId && block.type === 'object') {
          traverseBlocks(block.getChildren(false)); // Recurse into child blocks
        } else if (block.getFieldValue('ID') === viewId && block.type === 'view_draw') {
          traverseBlocks(block.getChildren(false)); // Recurse into child blocks
        } else if (block.getFieldValue('ID') === quadId && block.type === 'draw_arc') {
          block.setFieldValue(newx, 'X');
          block.setFieldValue(newy, 'Y');
          block.setFieldValue(neww, 'W');
          block.setFieldValue(newh, 'H');
        } else {
          // Continue traversing for other children
          traverseBlocks(block.getChildren(false));
        }
      });
    };

    traverseBlocks(objectBlocks);
  }
  