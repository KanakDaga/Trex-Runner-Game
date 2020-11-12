var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloudImage;
var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var obstaclesGroup,cloudsGroup;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver,gameOverImage;
var restartImage,restart;

var score = 0;

var checkPointSound,dieSound,jumpSound;


function preload() {
  trex_running = loadAnimation("trex1.png", "trex2.png", "trex3.png");
  trex_collided = loadImage("trex_collided.png");

  groundImage = loadImage("ground2.png");

  cloudImage = loadImage("cloud.png");
  
  gameOverImage = loadImage("gameOver.png");
  
  restartImage = loadImage("restart.png");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  checkPointSound = loadSound("checkPoint.mp3");
  dieSound = loadSound("die.mp3");
  jumpSound = loadSound("jump.mp3");
}

function setup() {
  background(220)
  createCanvas(600, 200)

  //create a trex sprite
  trex = createSprite(50, 160, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  //trex.debug = true;
  trex.setCollider("rectangle",0,0,60,60);
  

  //create a ground sprite
  ground = createSprite(200, 180, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 2;
  ground.velocityX = -(4+score/100);

  //creating invisible ground
  invisibleGround = createSprite(200, 190, 400, 10);
  invisibleGround.visible = false;

  //generate random numbers
  var rand = Math.round(random(1, 100))
  console.log(rand)
  
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  gameOver = createSprite(300,50,20,20);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 2;
  gameOver.visible = false;
  restart = createSprite(300,100,20,20);
  restart.addImage(restartImage);
  restart.scale = 0.5;
  restart.visible = false;
}

function draw() {
  //set background color
  background(255);
  text("score "+score,500,50)
  if(gameState === PLAY){
     score = score + Math.round(getFrameRate()/60)  ;
     if(trex.isTouching(obstaclesGroup)){
       gameState = END;
       dieSound.play();
       //trex.velocityY = -10;
       //jumpSound.play();
     }
    ground.velocityX = -(4+score/100);

    if(score%100 === 0&&score>0 ){
      checkPointSound.play(); 
      fill("white");
      noStroke(); 
      rect(500,50,100,10);
    }

  // jump when the space key is pressed
  if (keyDown("space") && trex.y >= 100) {
    trex.velocityY = -10;
    jumpSound.play();
  }

  trex.velocityY = trex.velocityY + 0.8

  if (ground.x < 0) {
    ground.x = ground.width / 2;
  }
  //console.log("Hi " + "Kanak " + ground.x);

  //stop trex from falling down
  trex.collide(invisibleGround);

  //Spawn Clouds
  spawnClouds();
  spawnObstacles();
  }
  if(gameState === END){
    ground.velocityX = 0;
    trex.collide(invisibleGround);
    cloudsGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    trex.changeAnimation("collided", trex_collided);
    gameOver.visible = true;
    restart.visible = true;
    trex.velocityY = 0;
    if(mousePressedOver(restart)){
      reset();
    }
  }
  drawSprites();
}

//function to spawn the clouds
function spawnClouds() {
  // write your code here 
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600, 100, 20, 10);
    cloud.y = Math.round(random(80, 120));
    cloud.velocityX = -(3+score/100);
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;

    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloud.lifetime = 200;
    cloudsGroup.add(cloud);
  }
  

}
function spawnObstacles(){
  if(frameCount%100 ===0){
    var obstacle = createSprite(600,170,20,20);
    obstacle.velocityX = -(3+score/100);
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1:obstacle.addImage(obstacle1);break;
      case 2:obstacle.addImage(obstacle2);break;
      case 3:obstacle.addImage(obstacle3);break;
      case 4:obstacle.addImage(obstacle4);break;
      case 5:obstacle.addImage(obstacle5);break;
      case 6:obstacle.addImage(obstacle6);break;
      default:break;
      
    }
    obstacle.scale = 0.5;
    obstacle.lifetime = 200;
    obstaclesGroup.add(obstacle);
  }
}
function reset(){
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  restart.visible = false;
  gameOver.visible = false;
  trex.changeAnimation("running",trex_running);
  ground.velocityX = -3;
  score = 0;
}