'use strict';

var sounds = {

  buffers: [
    'src/sounds/fx.mp3',
    'src/sounds/a.mp3',
    'src/sounds/b.mp3',
    'src/sounds/c.mp3',
    'src/sounds/d.mp3',
    'src/sounds/e.mp3',
    'src/sounds/f.mp3',
    'src/sounds/g.mp3',
    'src/sounds/snare.mp3',
    'src/sounds/kick.mp3',
  ],

  sources: {},

  context: undefined,

  init: function () {
    sounds.context = new (window.AudioContext || window.webkitAudioContext)();
    sounds.fetchSoundBuffers();
  },

  play: function (id) {
    if ( id === 48 ) {
      for ( var key in sounds.sources ) {
        sounds.sources[key].loop = false;
        sounds.removeIndicator(key-48);
        delete sounds.sources[key];
      }
    } else if ( !!sounds.sources[id] ) {
      sounds.sources[id].loop = false;
      sounds.removeIndicator(id-48);
      delete sounds.sources[id];
    } else {
      var source = sounds.context.createBufferSource();
      source.connect(sounds.context.destination);
      source.buffer = sounds.buffers[id-48];
      source.loop = true;
      source.start(0);
      sounds.sources[id] = source;
      sounds.addIndicator(id-48);
    }
  },

  fetchSoundBuffers: function () {
    for ( var i = 0; i < 10; i++ ) {
      (function(i) {
        var request = new XMLHttpRequest();
        request.open('GET', sounds.buffers[i], true);
        request.responseType = 'arraybuffer';
        request.onload = function (data) {
          sounds.context.decodeAudioData(request.response, function(buffer) {
            sounds.buffers[i] = buffer;
          }, function (err) {
            console.log('sounds err: ', err);
          });
        }
        request.send();
      })(i);
    }
  },

  addIndicator: function (id) {
    var element = document.createElement('div');
    element.setAttribute('id', 'sound-'+id);
    element.className = 'sound-indicator';
    element.innerHTML = id;
    element.style['top'] = (150 + (id * 25)) + 'px';
    document.body.appendChild(element);
  },

  removeIndicator: function (id) {
    var element = document.getElementById('sound-'+id);
    element.parentNode.removeChild(element);
  },

};
