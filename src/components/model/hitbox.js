//export class Hitbox {
//    constructor(type){
//        this.type = type;
//    }
//
//    collide(px,py){
//        // Abstract method to be implemented in subclasses
//    }
//};
//
//export class HitboxRect extends Hitbox {
//    constructor(x,y,w,h) {
//        super('RECT');
//        this.x = x;
//        this.y = y;
//        this.w = w;
//        this.h = h;
//    }
//
//    collide(px,py){
//        return collidePointRect(px,py,this.x,this.y,this.w,this.h);
//    }
//}
//
//export class HitboxQuad extends Hitbox {
//    constructor(x1,y1,x2,y2,x3,y3,x4,y4){
//        this.vertices = [
//            {x:x1,y:y1},
//            {x:x2,y:y2},
//            {x:x3,y:y3},
//            {x:x4,y:y4}
//        ]
//    }
//
//    collide(px,py){
//        var collision = false;
//
//        // go through each of the vertices, plus the next vertex in the list
//        var next = 0;
//
//        for (var current=0; current<this.vertices.length; current++) {
//    
//            // get next vertex in list if we've hit the end, wrap around to 0
//            next = current+1;
//            if (next === this.vertices.length) next = 0;
//        
//            // get the PVectors at our current position this makes our if statement a little cleaner
//            var vc = this.vertices[current];    // c for "current"
//            var vn = this.vertices[next];       // n for "next"
//        
//            // compare position, flip 'collision' variable back and forth
//            if (((vc.y >= py && vn.y < py) || (vc.y < py && vn.y >= py)) &&
//                 (px < (vn.x-vc.x)*(py-vc.y) / (vn.y-vc.y)+vc.x)) {
//                    collision = !collision;
//            }
//          }
//        return collision;
//    }
//
//}
//
//export class HitboxSquare extends Hitbox {
//    constructor(x,y,s){
//        super('SQUARE');
//        this.x = x;
//        this.y = y;
//        this.s = s;
//    }
//
//    collide(px,py){
//        return collidePointRect(px,py,this.x,this.y,this.s,this.s);
//    }
//}
//
//export class HitboxTriangle extends Hitbox {
//    constructor(x1,y1,x2,y2,x3,y3){
//        super('TRIANGLE');
//        this.x1 = x1;
//        this.y1 = y1;
//        this.x2 = x2;
//        this.y2 = y2;
//        this.x3 = x3;
//        this.y3 = y3;
//    }
//
//    collide(px,py){
//        return collidePointTriangle(px,py,this.x1,this.y1,this.x2,this.y2,this.x3,this.y3);
//    }
//}
//
//export class HitboxArc extends Hitbox {
//    constructor(){}
//
//    collide(px,py){
//        
//    }
//}