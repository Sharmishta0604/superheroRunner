const Engine = Matter.Engine;
const World= Matter.World;
const Bodies = Matter.Bodies;

var engine, world;
var player;
var bomb;
var border1,border2;
var bombs;
var thief,thieves;
var villian,villians;
var gameState="start";
var bullet,bullets;
var life,lives;
var health=10;
var startButton;
var score=0;
var counter=10;
var gameLevel=1;
var shootSound,levelUp,gameSound;
var bombImg, villImg1, villImg2, villImg3, villImg4, playerImg, lifeImg, thiefImg;

function preload(){
bombImg=loadImage("images/bomb.png");
villImg1=loadImage("images/Villian 1.png");
villImg2=loadImage("images/Villian 2.png");
villImg3=loadImage("images/Villian 3.png");
villImg4=loadImage("images/Villian 4.png");
thiefImg=loadImage("images/Thief.png");
lifeImg=loadImage("images/Life.png");
playerImg=loadImage("images/superman.png");
cityImg=loadImage("images/City.png");

shootSound=loadSound('sounds/shoot.mp3');
levelUp=loadSound('sounds/level up.mp3');
hitSound=loadSound('sounds/hit.wav');
bombSound=loadSound('sounds/bomb.wav');
cuffSound=loadSound('sounds/handcuff.mp3');
}

function setup(){
var canvas = createCanvas(windowWidth,windowHeight);

    engine = Engine.create();
    world = engine.world;

    city=createSprite(1100,height-200);
    city.addImage(cityImg);
    city.scale=0.9;
    city.velocityX=-8;

    player=createSprite(60,200,80,20);
    player.addImage(playerImg);
    player.scale=0.125;

    border1=createSprite(300,10,600,10);
    border2=createSprite(300,395,600,10);
    border1.visible=false;
    border2.visible=false;
   
    startButton=createButton("Start");
    startButton.position(width/2,height-100);
    startButton.mousePressed(change);
    bombs=createGroup();
    thieves=createGroup();
    villians=createGroup();
    bullets=createGroup();
    lives=createGroup();
}

function draw(){
    background(0,0,50);
    if(gameState==="start"){
        
        player.visible=false;
        city.visible=false;
        screen();  

    }
    if(gameState==="play"){
        //gameSound.play();
        player.visible=true;
        city.visible=true;

        player.collide(border1);
        player.collide(border2);
    

    if(city.x<-700){
        city.x=1070;
    }    

    if(keyWentDown(UP_ARROW)){
        player.velocityY=-gameLevel*5;
    }

    if(keyWentUp(UP_ARROW)){
        player.velocityY=0;
    }

    if(keyWentDown(DOWN_ARROW)){
        player.velocityY=gameLevel*5;
    }

    if(keyWentUp(DOWN_ARROW)){
        player.velocityY=0;
    }


     if(keyWentDown("d")){
         shoot();
     }

     if(keyDown("c")){
         
     }
    
spawnBomb();
  spawnTheives();  
spawnVillians();
spawnLife();
text("Lives: "+ health,10,50);
text("Score: "+ score,500,50);



for(i=0;i<villians.length;i++){
    for(k=0;k<bullets.length;k++){   
    if(villians.get(i).isTouching(bullets.get(k))){
        //var k=villians.get(i);
        //console.log(k);
        villians.get(i).destroy();
        bullets.get(k).destroy();
        score+=20;
    }
}
    }

for(var i=0;i<thieves.length;i++){
    if(thieves.get(i).isTouching(player) && keyDown("c")){
        //console.log(thieves.get(i).x);
        //console.log(player.x);
        thieves.get(i).destroy();
        //health=health+1;
        cuffSound.play();
        score+=10;
    }
    
}

for(i=0;i<thieves.length;i++){
    if(thieves.get(i).isTouching(player) && (thieves.get(i).x)<(player.x)){
        thieves.get(i).destroy();
    health=health-1;
    hitSound.play();
    //score=score-10;
}

}  
  
for(i=0;i<villians.length;i++){
    if(villians.get(i).isTouching(player)){
        villians.get(i).destroy();
    health=health-2;
    hitSound.play();
   // score=score-20;
}

}

for(i=0;i<lives.length;i++){
    if(lives.get(i).isTouching(player)){
        lives.get(i).destroy();
    health=health+1;
    
}

}


    }
    drawSprites();
    if(gameState==="play" && score<100){
        
        text("Level 1",290,100);
        }

        if(score===100 || score===110){
            levelUp.play();
            counter=counter-1;
            if(counter<=0){
                levelUp.stop();
            }
        }

        if(score>=100 && score<300){
        gameLevel=2;
        text("Level 2",290,100);
        
        }
        
        if(counter<-1000){
            counter=10;
        }

        if(score===300 || score===310){
            
            levelUp.play();
            counter=counter-1;
            if(counter<=0){
                levelUp.stop();
            }
        }

        if(score>=300 && score<500){
            gameLevel=3;
            text("Level 3",290,100);
            
        }
        
        if(score>=500){
            
            gameState="goodEnd";
            text("Congrats! You finished the game",290,200);
        }
        
        if(player.isTouching(bombs) || health===0 || score<0){
            health=0;
            player.visible=false;
            //bombSound.play();
            
            gameState="end";
            text("GAME OVER",300,250);
            
        }

    if(gameState==="end"){
        background("black");
        //bombSound.stop();
        player.visible=false;
        thieves.visible=false;
        villians.visible=false;
        bombs.visible=false;
        lives.visible=false;
        city.visible=false;
        
        textSize(25);
        fill("blue");
        text("GAME OVER",220,150);
        
        
        textSize(12);
        fill("red");
        text("Press 'r' to restart",250,300);
        text("Score: "+ score,500,50);
        if(keyDown("r")){
            gameState="play";
            reset();
            
            
        }
    }

    if(gameState==="goodEnd"){
        background("white");
        player.visible=false;
        thieves.visible=false;
        villians.visible=false;
        bombs.visible=false;
        lives.visible=false;
        city.visible=false;
        
        textSize(25);
        fill("black");
        text("CONGRATS!You finished the game",220,150);
        
        
        textSize(12);
        fill("red");
        text("Press 'r' to restart",250,300);
       // text("Score: "+ score,500,50);
        if(keyDown("r")){
            gameState="play";
            reset();
            
            
        }
    }

    
    
    console.log(counter);
}
function spawnBomb(){
if(gameLevel===1){
    if(frameCount%300===0){
    bomb=createSprite(random(600,700),random(20,380),20,20);
    bomb.addImage(bombImg);
    bomb.scale=0.01;
    bomb.velocityX=-(4+score/10);
    //console.log(bomb.velocityX);
    bomb.lifetime=150;
    bombs.add(bomb);
}
}
else if(gameLevel===2 && frameCount%200===0){
    bomb=createSprite(random(600,700),random(20,380),20,20);
    bomb.addImage(bombImg);
    bomb.scale=0.01;
    bomb.velocityX=-(3+score/10);
    //console.log(bomb.velocityX);
    bomb.lifetime=150;
    bombs.add(bomb);

}

else if(gameLevel===3 && frameCount%100===0){
    bomb=createSprite(random(600,700),random(20,380),20,20);
    bomb.addImage(bombImg);
    bomb.scale=0.01;
    bomb.velocityX=-(3+score/15);
    //console.log(bomb.velocityX);
    bomb.lifetime=150;
    bombs.add(bomb);
}
}

function spawnTheives(){
    if(gameLevel===1 && frameCount%270===0){
        thief=createSprite(random(600,700),random(20,380),40,20);
        thief.addImage(thiefImg);
        thief.scale=0.1;
        thief.velocityX=-(5+score/10);
        thief.lifetime=500;
        thieves.add(thief);
    }
    else if(gameLevel===2 && frameCount%180===0){
        thief=createSprite(random(600,700),random(20,380),40,20);
        thief.addImage(thiefImg);
        thief.scale=0.1;
        thief.velocityX=-(4+score/10);
        thief.lifetime=500;
        thieves.add(thief);
    }
    else if(gameLevel===3 && frameCount%90===0){
        thief=createSprite(random(600,700),random(20,380),40,20);
        thief.addImage(thiefImg);
        thief.scale=0.1;
        thief.velocityX=-(4+score/15);
        thief.lifetime=500;
        thieves.add(thief);
    }
}

    function spawnVillians(){
        if(gameLevel===1 && frameCount%450===0){
            villian=createSprite(random(600,700),random(20,380),40,60);
            var rand = Math.round(random(1,4));
            switch(rand){
                case 1: villian.addImage(villImg1);
                villian.scale=0.015;
                break;
                case 2: villian.addImage(villImg2);
                villian.scale=0.1;
                break;
                case 3: villian.addImage(villImg3);
                villian.scale=0.15;
                break;
                case 4: villian.addImage(villImg4);
                villian.scale=0.25;
                break;
            }
                
            villian.velocityX=-(2+score/10);
            villian.lifetime=600;
            villians.add(villian);
        }
        else if(gameLevel===2 && frameCount%300===0){
            villian=createSprite(random(600,700),random(20,380),40,60);
            var rand = Math.round(random(1,4));
            switch(rand){
                case 1: villian.addImage(villImg1);
                villian.scale=0.015;
                break;
                case 2: villian.addImage(villImg2);
                villian.scale=0.1;
                break;
                case 3: villian.addImage(villImg3);
                villian.scale=0.15;
                break;
                case 4: villian.addImage(villImg4);
                villian.scale=0.25;
                break;
            }
                
            villian.velocityX=-(1.5+score/10);
            villian.lifetime=600;
            villians.add(villian);
        }
        else if(gameLevel===3 && frameCount%150===0){
            villian=createSprite(random(600,700),random(20,380),40,60);
            var rand = Math.round(random(1,4));
            switch(rand){
                case 1: villian.addImage(villImg1);
                villian.scale=0.015;
                break;
                case 2: villian.addImage(villImg2);
                villian.scale=0.1;
                break;
                case 3: villian.addImage(villImg3);
                villian.scale=0.15;
                break;
                case 4: villian.addImage(villImg4);
                villian.scale=0.25;
                break;
            }
                
            villian.velocityX=-(1.5+score/15);
            villian.lifetime=600;
            villians.add(villian);
        }
    }

        function spawnLife(){
            if(frameCount%500===0){
                life=createSprite(random(600,700),random(20,380),20,20);
                life.addImage(lifeImg);
                life.scale=0.01;
                life.velocityX=-7;
                //console.log(bomb.velocityX);
                life.lifetime=400;
                lives.add(life);
            }}

        function shoot(){
            
                bullet=createSprite(player.x+40,player.y-10,20,5);
                bullet.velocityX=10;
                bullet.shapeColor="red";
                bullet.lifetime=100;
                shootSound.play();
                bullets.add(bullet);
        }

        function screen(){
            background("black");
            
            textSize(35);
            fill("yellow");
            text("Superhero Runner",width/2-100,height/5);
            textSize(20);
            fill("red");
            text("Instructions:",width-width+200,height*3/10);
            text("Press D to defeat the villians",width-width+200,height*5/10);
            text("Press C when near the theives to catch them",width-width+200,height*6/10);
            text("Avoid the bombs, or else you will die",width-width+200,height*7/10);
            text("Touch the medicines to gain one life",width-width+200,height*8/10);
        }

        function change(){
            gameState="play";
            startButton.hide();
        }

        function reset(){
            health=10;
            player.visible=true;
            score=0;
        }