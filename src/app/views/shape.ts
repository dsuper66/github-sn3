export class Shape {
    type: string;
    xInner:number;
    yInner:number;
    wInner:number;
    hInner:number;   
    xOuter:number;
    yOuter:number;
    wOuter:number;
    hOuter:number;
    //Whether the adjustment is a resize (as opposed to a move)
    //Always false for gen and load
    doResize? = false;
    path1?:string;
    path2?:string; 
}