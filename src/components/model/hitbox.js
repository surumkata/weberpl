import { collidePointCircle, collidePointEllipse, collidePointLine, collidePointPoint, collidePointPoly, collidePointRect, collidePointTriangle } from "p5collide";

export class Hitbox {
    constructor(type){
        this.type = type;
    }

    collide(px,py){
        // Abstract method to be implemented in subclasses
    }
};


export class HitboxRect extends Hitbox {
    constructor(x,y,w,h) {
        super('RECT');
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    collide(px,py){
        return collidePointRect(px,py,this.x,this.y,this.w,this.h);
    }

    draw(p5){
        p5.rect(this.x,this.y,this.w,this.h);
    }
}

export class HitboxQuad extends Hitbox {
    constructor(x1,y1,x2,y2,x3,y3,x4,y4){
        super('QUAD');
        this.vertices = [
            {x:x1,y:y1},
            {x:x2,y:y2},
            {x:x3,y:y3},
            {x:x4,y:y4}
        ]
    }

    draw(p5){
        p5.quad(this.x1,this.y1,this.x2,this.y2,this.x3,this.y3,this.x4,this.y4);
    }

    collide(px,py){
        return collidePointPoly(px,py,this.vertices);
    }

}

export class HitboxSquare extends Hitbox {
    constructor(x,y,s){
        super('SQUARE');
        this.x = x;
        this.y = y;
        this.s = s;
    }

    collide(px,py){
        return collidePointRect(px,py,this.x,this.y,this.s,this.s);
    }

    draw(p5){
        p5.square(this.x,this.y,this.s);
    }
}

export class HitboxTriangle extends Hitbox {
    constructor(x1,y1,x2,y2,x3,y3){
        super('TRIANGLE');
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.x3 = x3;
        this.y3 = y3;
    }

    collide(px,py){
        return collidePointTriangle(px,py,this.x1,this.y1,this.x2,this.y2,this.x3,this.y3);
    }

    draw(p5){
        p5.triangle(this.x1,this.y1,this.x2,this.y2,this.x3,this.y3);
    }
}

export class HitboxArc extends Hitbox {
    constructor(x,y,w,h,start,stop,mode){
        super("ARC");
        this.arcX = x;
        this.arcY = y;
        this.arcW = w;
        this.arcH = h;
        this.arcStart = start;
        this.arcStop = stop;
        this.mode = mode;
      }

    draw(p5){
        p5.arc(this.arcX,this.arcY,this.arcW,this.arcH,this.arcStop,this.arcStop,this.mode);
    }

    pointOfEllipse(angle) {
        // Semi-eixos da elipse
        const a = this.arcW / 2; // Semi-eixo maior
        const b = this.arcH / 2; // Semi-eixo menor
    
        // Coordenadas do ponto na elipse
        const x = this.arcX + a * Math.cos(angle);
        const y = this.arcY + b * Math.sin(angle);
    
        return { x: x, y: y };
    }

    collide(px, py){
        const inside = collidePointEllipse(px,py,this.arcX,this.arcY,this.arcW,this.arcH);
        if (!inside){return false;}
      
        const angle = (Math.atan2(py - this.arcY, px - this.arcX) + 2*Math.PI) % (2*Math.PI);
        let insideSlice;
        if(this.arcStop < this.arcStart){
            const angle2 = angle+2*Math.PI;
            insideSlice = ((angle > this.arcStart) && (angle < this.arcStop+2*Math.PI) || (angle2 > this.arcStart) && (angle2 < this.arcStop+2*Math.PI)) ;
        }
        else {
            insideSlice = (angle > this.arcStart) && (angle < this.arcStop);
        }

        if (inside && (this.mode == 'chord' || this.mode == 'open')){
            let p1 = this.pointOfEllipse(this.arcStart);
            let p2 = this.pointOfEllipse(this.arcStop);
            
            let insideTriangle = collidePointTriangle(px,py,this.arcX,this.arcY,p1.x,p1.y,p2.x,p2.y);

            let angStop = this.arcStop
            if (angStop < this.arcStart){
                angStop += Math.PI*2;
            }
            let difAngle = angStop - this.arcStart;
            if(difAngle < Math.PI){
                console.log("CHORD1")
                return (inside && insideSlice && !insideTriangle)
            }
            else{
                console.log("CHORD2")
                return (inside && (insideSlice || insideTriangle))
            }
        }
      
        return (inside && insideSlice);
    }
}

export class HitboxCircle extends Hitbox {
    constructor(id,x,y,d){
        super("CIRCLE");
        this.x = x;
        this.y = y;
        this.d = d;
      }
    
      collide(px,py){
        return collidePointCircle(px, py,this.x, this.y, this.d);
      }

      draw(p5){
        p5.circle(this.x,this.y,this.d);
    }
}

export class HitboxLine extends Hitbox {
    constructor(id,x1,y1,x2,y2){
        super(id);
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
      }
    
      collide(px,py){
        return collidePointLine(px, py,this.x1, this.y1,this.x2,this.y2);
      }

      draw(p5){
        p5.line(this.x1,this.y1,this.x2,this.y2);
    }
}

export class HitboxPoint extends Hitbox {
    constructor(id,x,y){
        super(id);
        this.x = x;
        this.y = y;
    }
    
      collide(px,py){
        return collidePointPoint(px, py,this.x, this.y);
      }

      draw(p5){
        p5.point(this.x,this.y);
    }
}


export class HitboxEllipse extends Hitbox {
    constructor(x,y,w,h){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    collide(px,py){
        return collidePointEllipse(px,py,this.x,this.y,this.w,this.h);
    }

    draw(p5){
        p5.ellipse(this.x,this.y,this.w,this.h);
    }
}