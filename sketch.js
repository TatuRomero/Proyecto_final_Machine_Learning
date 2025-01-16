let handPose;
let video;
let hands = [];

// Cargar el modelo de handPose
function preload() {
  handPose = ml5.handPose();
}

function setup() {
  let canvas = createCanvas(640, 480);
  canvas.parent("sketch-container");
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  // Detecta el movimiento de las manos
  handPose.detectStart(video, gotHands);
}

function draw() {
  //Dibujo del video
  image(video, 0, 0, width, height);

  // Dibuja los puntos claves de la mano
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(0, 255, 0);
      noStroke();
      circle(keypoint.x, keypoint.y, 10);
    }
  }
}

// Callback function for when handPose outputs data
function gotHands(results) {
  // save the output to the hands variable
  hands = results;
}
