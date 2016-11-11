'use strict';

var events = {

  raycaster: undefined,

  dragThresholdTimeoutId: undefined,
  dragThresholdDuration: 150,

  moveThresholdTimeoutId: undefined,
  moveThresholdDuration: 150,

  init: function () {
    events.raycaster = new THREE.Raycaster();
    document.addEventListener('mousedown', events.onDocumentMouseDown, false);
    document.addEventListener('wheel', events.onDocumentMouseWheel, false);
    document.addEventListener('touchstart', events.onDocumentTouchStart, false);
    document.addEventListener('keydown', events.onKeyDown, false);
    document.addEventListener('keyup', events.onKeyUp, false);
    window.addEventListener('resize', events.onWindowResize, false);
  },

  getClicked: function (event, list) {
    var mouse = new THREE.Vector2();
    mouse.x = ( event.clientX / app.renderer.domElement.clientWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / app.renderer.domElement.clientHeight ) * 2 + 1;

    events.raycaster.setFromCamera( mouse, app.camera );
    var intersects = events.raycaster.intersectObjects(list);
    if ( !!intersects.length ) {
      return intersects[0].object;
    }
  },

  onDocumentMouseDown: function (event) {
    document.addEventListener('mousemove', events.onDocumentMouseMove, false);
    document.addEventListener('mouseup', events.onDocumentMouseUp, false);

    // Toggle menu on long press, close menu when clicked outside
    if ( event.button === 0 ) {
      animation.reset();
      if ( menu.isActive() ) {
        if ( !menu.isClicked(event) ) {
          menu.close();
        }
      } else if ( help.isActive() ) {
        if ( !help.isClicked(event) ) {
          help.close();
        }
      } else if ( settings.isActive() ) {
        if ( !settings.isClicked(event) ) {
          settings.close();
        }
      } else {
        var clickedFrame = events.getClicked(event, frames.list);
        events.dragThresholdTimeoutId = window.setTimeout(function () {
          if ( !frames.isClicked(event) ) {
            frames.select(event, clickedFrame);
          }
        }, events.dragThresholdDuration);
      }
    }
  },

  onDocumentMouseUp: function (event) {
    document.removeEventListener( 'mousemove', events.onDocumentMouseMove );
    document.removeEventListener( 'mouseup', events.onDocumentMouseUp );
  },

  onDocumentMouseMove: function (event) {
    window.clearTimeout(events.dragThresholdTimeoutId);

    if ( !menu.isActive() && !settings.isActive() && !help.isActive() && !frames.active ) {
      var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
      app.camera.rotation.y += movementX * 0.01;
      app.dirty = true;
    }
  },

  onDocumentMouseWheel: function (event) {
    if ( !menu.isActive() && !settings.isActive() && !help.isActive() && !frames.active ) {
      animation.reset();
      app.camera.rotation.y += event.deltaY * 0.001;
      app.dirty = true;
    }
  },

  touchX: undefined,

  onDocumentTouchStart: function (event) {
    document.addEventListener( 'touchmove', events.onDocumentTouchMove, false );
    document.addEventListener( 'touchend', events.onDocumentTouchEnd, false );

    animation.reset();
    if ( menu.isActive() ) {
      if ( !menu.isClicked(event) ) {
        menu.close();
      }
    } else {
      var touch = event.touches[0];
      events.touchX = touch.screenX;
      events.moveThresholdTimeoutId = window.setTimeout(function () {
        frames.select(event);
      }, events.moveThresholdDuration);
    }
  },

  onDocumentTouchEnd: function (event) {
    document.removeEventListener( 'touchmove', events.onDocumentTouchMove );
    document.removeEventListener( 'touchend', events.onDocumentTouchEnd );
  },

  onDocumentTouchMove: function (event) {
    window.clearTimeout(events.moveThresholdTimeoutId);

    var touch = event.touches[0];
    app.camera.rotation.y += (touch.screenX - events.touchX) * 0.01;
    events.touchX = touch.screenX;
    app.dirty = true;
  },

  onKeyDown: function (event) {
    if ( event.keyCode == 37 ) {
      app.camera.rotation.y += 0.0125;
    } else if ( event.keyCode == 39 ) {
      app.camera.rotation.y -= 0.0125;
    }
    app.dirty = true;
  },

  onKeyUp: function (event) {
    if ( event.keyCode === 27 ) {
      if ( !!frames.active ) {
        frames.close();
      } else if ( help.isActive() ) {
        help.close();
      } else if ( settings.isActive() ) {
        settings.close();
      } else {
        menu.toggleMenu();
      }
    } else if ( event.keyCode === 13 ) {
      if ( !!frames.active ) {
        frames.updateActive();
      }
    }
  },

  onWindowResize: function () {
    app.camera.aspect = window.innerWidth / window.innerHeight;
    app.camera.updateProjectionMatrix();
    app.renderer.setSize( window.innerWidth, window.innerHeight );
    app.dirty = true;
  },

  bindFrameEditButtons: function () {
    document.getElementById('frame-edit-btn--save').addEventListener('click', frames.updateActive, false);
    document.getElementById('frame-edit-btn--delete').addEventListener('click', frames.removeActive, false);
  },

  unbindFrameEditButtons: function () {
    document.getElementById('frame-edit-btn--save').removeEventListener('click', frames.updateActive, false);
    document.getElementById('frame-edit-btn--delete').removeEventListener('click', frames.removeActive, false);
  },

  bindMenuButtons: function () {
    document.getElementById('settings-btn--themes').addEventListener('click', menu.openThemes, false);
    document.getElementById('settings-btn--settings').addEventListener('click', settings.open, false);
    document.getElementById('settings-btn--help').addEventListener('click', help.open, false);
  },

  unbindMenuButtons: function () {
    document.getElementById('settings-btn--themes').removeEventListener('click', menu.openThemes, false);
    document.getElementById('settings-btn--settings').removeEventListener('click', settings.open, false);
    document.getElementById('settings-btn--help').removeEventListener('click', help.open, false);
  },

  bindSettingsButtons: function () {
    document.getElementById('settings-btn--save').addEventListener('click', settings.update, false);
  },

  unbindSettingsButtons: function () {
    document.getElementById('settings-btn--save').removeEventListener('click', frames.update, false);
  },

};
