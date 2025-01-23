let video; // Variable para almacenar el video de la cámara
let handPose; // Variable para el modelo de detección de manos
let hands = []; // Arreglo para almacenar los datos de las manos detectadas
let painting; // Objeto para el lienzo donde se dibuja
let px = 0; // Posición previa en X para el trazo
let py = 0; // Posición previa en Y para el trazo

// Preload: carga el modelo de handPose antes de iniciar
function preload() {
  handPose = ml5.handPose({ flipped: true }); // Inicializa el modelo con la opción de reflejar el video
}

// Función que se ejecuta al presionar el mouse (útil para depuración)
function mousePressed() {
  console.log(hands); // Muestra en consola los datos de las manos detectadas
}

// Callback para guardar los datos de las manos detectadas
function gotHands(results) {
  hands = results; // Actualiza el arreglo con los datos de las manos detectadas
}

// Configuración inicial
function setup() {
  const canvas = createCanvas(640, 480); // Crea el lienzo principal
  canvas.parent("sketch-container"); // Enlaza el canvas al contenedor con ID 'sketch-container'

  painting = createGraphics(640, 480); // Crea un lienzo secundario para dibujar

  video = createCapture(VIDEO, { flipped: true }); // Activa la cámara con imagen reflejada
  video.size(640, 480); // Ajusta el tamaño del video al canvas
  video.hide(); // Oculta el elemento de video en la página

  handPose.detectStart(video, gotHands); // Inicia la detección de manos con el video como fuente
}

// Dibuja en el lienzo
function draw() {
  // Muestra el video de la cámara en el lienzo principal
  image(video, 0, 0);

  // Si se detectan manos
  if (hands.length > 0) {
    let hand = hands[0]; // Toma la primera mano detectada

    // Obtiene los puntos clave del índice y el pulgar
    let index = hand.index_finger_tip;
    let thumb = hand.thumb_tip;

    // Calcula el punto medio entre el índice y el pulgar
    let x = (index.x + thumb.x) * 0.5;
    let y = (index.y + thumb.y) * 0.5;

    // Calcula la distancia entre el índice y el pulgar
    let d = dist(index.x, index.y, thumb.x, thumb.y);

    // Si los dedos están lo suficientemente cerca, dibuja en el lienzo secundario
    if (d < 20) {
      painting.stroke(255, 255, 0); // Color del trazo
      painting.strokeWeight(10); // Grosor del trazo
      painting.line(px, py, x, y); // Dibuja una línea desde la posición previa hasta la actual
    }

    // Actualiza las posiciones previas para el siguiente trazo
    px = x;
    py = y;
  }

  // Muestra el contenido del lienzo secundario en el lienzo principal
  image(painting, 0, 0);
}

// Función que se ejecuta al presionar una tecla
function keyPressed() {
  // Si se presiona la tecla 'D' o 'd', borra el contenido del lienzo
  if (key === "D" || key === "d") {
    painting.clear(); // Limpia el lienzo secundario
    console.log("Lienzo limpiado"); // Mensaje de depuración en la consola
  }
}
