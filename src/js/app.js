'use strict';

var app = {

  dirty: false,
  scene: undefined,
  camera: undefined,
  controls: undefined,
  renderer: undefined,

  init: function () {
    if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

    app.rendererCSS = new THREE.CSS3DRenderer();
    app.rendererCSS.setSize( window.innerWidth, window.innerHeight );
    app.rendererCSS.domElement.style.position = 'absolute';
    app.rendererCSS.domElement.style.top = 0;
    app.rendererCSS.domElement.style.margin = 0;
    app.rendererCSS.domElement.style.padding = 0;
    document.body.appendChild( app.rendererCSS.domElement );

    app.sceneCSS = new THREE.Scene();

    app.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    app.renderer.setPixelRatio( window.devicePixelRatio );
    app.renderer.setSize( window.innerWidth, window.innerHeight );
    app.renderer.setClearColor( 0x000000, 0 );
    document.body.appendChild( app.renderer.domElement );

    app.scene = new THREE.Scene();

    app.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 5000000 );
    app.camera.position.y = 100000;
    app.camera.rotation.y = Math.PI * 2;

    var light = new THREE.AmbientLight( 0xffffff );
    app.scene.add(light);

    if ( device.isMobile() ) {
      app.controls = new THREE.DeviceOrientationControls( app.camera );
    }

    //sync.init();
    notes.init();
    groups.init();
    skybox.init();
    events.init();
    animation.init();

    app.render();
  },

  render: function () {
    requestAnimationFrame(app.render);

    // Update device orientation
    if ( !!app.controls ) {
      app.controls.update();
      app.dirty = true;
    }

    // Render if that is necessary
    if ( app.dirty ) {
      app.renderer.render(app.scene, app.camera);
      app.rendererCSS.render(app.sceneCSS, app.camera);
      app.dirty = false;
    }
  },

};

document.addEventListener('DOMContentLoaded', app.init);
