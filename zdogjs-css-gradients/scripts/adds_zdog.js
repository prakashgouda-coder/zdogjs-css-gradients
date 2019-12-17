// Made with Zdog

var navy = "#369";
var green = "#692";
var egg = "#FED";
var ochre = "#E83";

var TAU = Zdog.TAU;

[Zdog.Shape, Zdog.Rect, Zdog.Ellipse, Zdog.Cylinder, Zdog.Cone].forEach(
  function(ItemClass) {
    ItemClass.defaults.fill = true;
    ItemClass.defaults.stroke = false;
  }
);

// triangle
var isoTriangle = new Zdog.Shape({
  path: [{ x: 1, y: 1 }, { x: -1, y: 1 }, { x: 0, y: -1 }],
  color: egg
});

function Shifter(options) {
  var shifterAnchor = (this.anchor = new Zdog.Anchor(options));

  this.pyramid = (function() {
    var pyramid = new Zdog.Group({
      addTo: shifterAnchor,
      visible: false,
      // translate: { x: -3, y: -3 },
      updateSort: true
    });

    var base = new Zdog.Rect({
      addTo: pyramid,
      width: 2,
      height: 2,
      translate: { y: 1 },
      rotate: { x: -TAU / 4 },
      color: navy
    });

    var triangle = new Zdog.Shape({
      addTo: base,
      path: [
        { x: 1, y: -1, z: 0 },
        { x: -1, y: -1, z: 0 },
        { x: 0, y: 0, z: -2 }
      ],
      color: ochre
    });
    triangle.copy({
      rotate: { z: TAU / 4 }
    });
    triangle.copy({
      rotate: { z: TAU / 2 }
    });
    triangle.copy({
      rotate: { z: (TAU * 3) / 4 }
    });

    return pyramid;
  })();

  // cylinder 1
  this.cylinder1 = new Zdog.Cylinder({
    addTo: shifterAnchor,
    visible: false,
    diameter: 2,
    length: 2,
    // translate: { x: 0, y: -3 },
    rotate: { y: TAU / 4 },
    color: navy,
    backface: egg
  });

  // cone 1
  // isoTriangle.copy({
  //   translate: { x: 3, y: -3, z: -2 },
  //   color: green,
  // });

  this.cone = (function() {
    var anchor = new Zdog.Group({
      addTo: shifterAnchor,
      visible: false,
      // translate: { x: 3, y: -3 },
      updateSort: true
    });

    new Zdog.Cone({
      addTo: anchor,
      diameter: 2,
      length: 2,
      rotate: { x: TAU / 4 },
      translate: { y: 1 },
      color: ochre,
      backface: egg
    });

    return anchor;
  })();

  // triangular prism

  this.prism = (function() {
    var prism = new Zdog.Group({
      addTo: shifterAnchor,
      visible: false,
      // translate: { x: -3, y: 0 },
      updateSort: true
    });

    var triangle = isoTriangle.copy({
      addTo: prism,
      scale: { y: -1 },
      rotate: { y: TAU / 4 },
      translate: { x: -1 },
      color: ochre
    });
    triangle.copy({
      translate: { x: 1 }
    });

    var angleFace = new Zdog.Shape({
      addTo: prism,
      path: [
        { x: -1, y: -1, z: 1 },
        { x: 1, y: -1, z: 1 },
        { x: 1, y: 1, z: 0 },
        { x: -1, y: 1, z: 0 }
      ],
      color: navy
    });
    angleFace.copy({
      scale: { z: -1 }
    });

    // base
    new Zdog.Rect({
      addTo: prism,
      width: 2,
      height: 2,
      rotate: { x: TAU / 4 },
      translate: { y: -1 },
      color: green
    });

    return prism;
  })();

  // eccentric cylinder, triangle contour

  this.triCylinder = (function() {
    var cylinder = new Zdog.Group({
      addTo: shifterAnchor,
      visible: false
      // translate: { x: 3 },
    });

    isoTriangle.copy({
      translate: {},
      addTo: cylinder,
      color: ochre
    });

    var tilt = Math.atan(1 / 2);

    var capAnchor = new Zdog.Anchor({
      addTo: cylinder,
      translate: { x: -0.5 },
      rotate: { y: TAU / 4 }
    });

    // left outside cap
    var cap = new Zdog.Ellipse({
      addTo: capAnchor,
      diameter: 2,
      color: egg,
      rotate: { x: tilt },
      scale: { y: 1 / Math.cos(tilt) },
      backface: false
    });
    cap.copy({
      // left inside cap
      rotate: { y: TAU / 2, x: tilt },
      color: ochre
    });

    capAnchor.copyGraph({
      translate: { x: 0.5 },
      rotate: { y: -TAU / 4 }
    });

    return cylinder;
  })();

  this.cylinder2 = this.cylinder1.copy({
    translate: {},
    visible: false,
    rotate: { x: TAU / 4 }
  });
}

Shifter.prototype.update = function(t) {
  var turn = Math.floor(t % 6);

  var easeT = (Zdog.easeInOut(t % 1, 4) * TAU) / 4;
  this.pyramid.rotate.x = easeT;
  this.cylinder1.rotate.y = easeT + TAU / 4;
  this.cone.rotate.x = easeT + TAU / 4;
  this.prism.rotate.y = easeT + TAU / 4;
  this.cylinder2.rotate.x = easeT + TAU / 4;
  this.triCylinder.rotate.y = easeT + TAU / 4;

  if (turn === 0) {
    this.triCylinder.visible = false;
    this.pyramid.visible = true;
  } else if (turn == 1) {
    this.pyramid.visible = false;
    this.cylinder1.visible = true;
  } else if (turn == 2) {
    this.cylinder1.visible = false;
    this.cone.visible = true;
  } else if (turn == 3) {
    this.cone.visible = false;
    this.prism.visible = true;
  } else if (turn == 4) {
    this.prism.visible = false;
    this.cylinder2.visible = true;
  } else if (turn == 5) {
    this.cylinder2.visible = false;
    this.triCylinder.visible = true;
  }
};

// ----- setup ----- //

var illoElem = document.querySelector(".illoadds");
var illoSize = 10;
var minWindowSize = Math.min(window.innerWidth - 20, window.innerHeight - 20);
var zoom = Math.floor(minWindowSize / illoSize);
illoElem.setAttribute("width", illoSize * zoom);
illoElem.setAttribute("height", illoSize * zoom);

var illoadds = new Zdog.Illustration({
  element: illoElem,
  zoom: zoom,
  dragRotate: true
});

// ----- model ----- //

var shifterA = new Shifter({
  addTo: illoadds,
  translate: { x: -3 }
});
var shifterB = new Shifter({
  addTo: illoadds
});
var shifterC = new Shifter({
  addTo: illoadds,
  translate: { x: 3 }
});

// ----- animate ----- //

var ticker = 0;
var cycleCount = 80;

function animate() {
  // update
  var progress = ticker / cycleCount;
  shifterA.update(progress + 4);
  shifterB.update(progress + 2);
  shifterC.update(progress + 0);
  ticker++;

  illoadds.updateRenderGraph();
  requestAnimationFrame(animate);
}

animate();
