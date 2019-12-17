// Made with Zdog

let isSpinning = true;

let illo = new Zdog.Illustration({
  element: ".zdog-canvas",
  dragRotate: true,
  // stop spinning when drag starts
  onDragStart: function() {
    isSpinning = false;
  }
});

let illCone = new Zdog.Illustration({
  element: ".canvas",
  dragRotate: true,
  // stop spinning when drag starts
  onDragStart: function() {
    isSpinning = false;
  }
});

// circle
// new Zdog.Ellipse({
//   addTo: illo,
//   diameter: 80,
//   translate: { z: 40 },
//   stroke: 20,
//   color: "#636",
//   fill: false
// });

// // square
// new Zdog.Rect({
//   addTo: illo,
//   width: 80,
//   height: 80,
//   translate: { z: -40 },
//   stroke: 12,
//   color: "#E62",
//   fill: false
// });

new Zdog.Hemisphere({
  addTo: illo,
  diameter: 90,
  length: 80,
  stroke: false,
  color: "#C25",
  backface: "#EA0"
});

new Zdog.Cone({
  addTo: illCone,
  diameter: 70,
  length: 90,
  inline: "Prakah",
  stroke: false,
  color: "#636",
  backface: "#C25"
});

function animate() {
  illo.rotate.y += isSpinning ? 0.03 : 0;
  illCone.rotate.y += isSpinning ? 0.06 : 0;
  illo.updateRenderGraph();
  illCone.updateRenderGraph();
  requestAnimationFrame(animate);
}

animate();
