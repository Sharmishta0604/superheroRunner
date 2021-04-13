class Hero{
    constructor(x,y){
        this.body=Bodies.rectangle(50,y,30,10);
        this.width=30;
        this.height=10;
        World.add(world,this.body);
    }

    display(){
        var pos=this.body.position;
        rectMode(CENTER);
        rect(pos.x,pos.y,80,20);
    }
}