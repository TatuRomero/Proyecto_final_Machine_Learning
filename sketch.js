// Array con las URLs de las imágenes
let images = [
  "https://i.pinimg.com/564x/95/b6/57/95b657229390663eb69ea8a2850c21e7.jpg",
  "https://es.web.img3.acsta.net/pictures/14/06/05/13/56/127570.jpg",
  "https://i0.wp.com/eltallerdehector.com/wp-content/uploads/2022/06/d785f-sponge-bob-48.png?resize=900%2C1263&ssl=1",
  "https://www.tshaonline.org/images/handbook/entries/PP/popeye-sailor-man-cartoon.jpg",
  "https://i.pinimg.com/736x/f9/14/3b/f9143b97b3a57a3cc3719947a7ba3827.jpg",
  "https://pbs.twimg.com/media/F0XR5jbWwAcZaMF.jpg:large",
  "https://i.pinimg.com/736x/b1/c7/43/b1c743852dec51da5aaaadc5d06a2e55.jpg",
  "https://i0.wp.com/stickersmed.com/wp-content/uploads/2023/11/bellota.jpg?fit=800%2C800&ssl=1",
  "https://i.pinimg.com/736x/3e/4a/42/3e4a4286cfeba082d7f3ed4512d3bd4c.jpg",
  "https://i.pinimg.com/736x/7c/4b/c1/7c4bc1551fa3c7ce97fce84027509861.jpg",
];

let currentImageIndex = 0;

// Variables del sketch
let video; // Variable para almacenar el video de la cámara
let handPose; // Variable para el modelo de detección de manos
let hands = []; // Arreglo para almacenar los datos de las manos detectadas
let painting; // Objeto para el lienzo donde se dibuja
let px = 0; // Posición previa en X para el trazo
let py = 0; // Posición previa en Y para el trazo

// Variables para controlar el color del trazo
let strokeColor = [255, 255, 0]; // Color inicial (amarillo)

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

  // Configura el botón "Siguiente" para cambiar de imagen
  let nextButton = select("#next-button");
  nextButton.mousePressed(changeImage); // Cambiar imagen cuando se hace clic
}

// Cambia la imagen mostrada
function changeImage() {
  currentImageIndex++;
  if (currentImageIndex >= images.length) {
    currentImageIndex = 0; // Vuelve al principio si ya se alcanzó el final del array
  }
  let imageElement = select("#character-image");
  imageElement.attribute("src", images[currentImageIndex]);
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
      painting.stroke(strokeColor); // Usamos el color del trazo actual
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
  // Cambia el color del trazo dependiendo de la tecla presionada
  if (key === "R" || key === "r") {
    strokeColor = [255, 0, 0]; // Rojo
  } else if (key === "V" || key === "v") {
    strokeColor = [0, 255, 0]; // Verde
  } else if (key === "A" || key === "a") {
    strokeColor = [0, 0, 255]; // Azul
  } else if (key === "Y" || key === "y") {
    strokeColor = [255, 255, 0]; // Amarillo
  } else if (key === "P" || key === "p") {
    strokeColor = [218, 73, 141]; // Rosado
  } else if (key === "D" || key === "d") {
    painting.clear(); // Limpia el lienzo
    console.log("Lienzo limpio"); // Mensaje de depuración en la consola
  }
}
