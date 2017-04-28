

import AudioContext from './AudioContext';

export class AudioSampleLoader {
  loaded = 0;
  ctx?:AudioContext;
  src:string|string[];
  response:AudioBuffer|AudioBuffer[];
  onload?:()=>void;
  onerror?:()=>void;
  constructor() {
  }

  send() {
    var i;
    if (!this.hasOwnProperty('ctx')) {
      this.ctx = new AudioContext();
    } else if (!(this.ctx instanceof AudioContext)) {
      //TODO: Post an error, but do not overwrite the variable with a valid context.
      logError('ctx not an instance of AudioContext');
      return;
    }

    if (!this.hasOwnProperty('onload')) {
      logError('Callback onload does not exist');
      return;
    } else if (typeof this.onload !== 'function') {
      logError('Callback onload not a function');
      return;
    }

    if (!this.hasOwnProperty('onerror') || typeof this.onerror !== 'function') {
      this.onerror = function () { };
    }

    if (Array.isArray(this.src)) {
      for (i = 0; i < this.src.length; i += 1) {
        if (typeof this.src[i] !== 'string') {
          logError('src[' + i + '] is not a string');
          this.onerror();
          return;
        }
      }

      //If src is a valid list of strings.
      this.response = new Array(this.src.length);
      this.src.forEach((value, index) => this.loadOneOfBuffers(value, index));
     

    } else if (typeof this.src === 'string') {

      //If src is just a single string.
      this.loadOneBuffer(this.src);

    } else {
      logError('src not string or list of strings');
      this.onerror();
      return;
    }
  }

  loadOneBuffer(url) {
    const XHR = new XMLHttpRequest();
    XHR.open('GET', url, true);
    XHR.responseType = 'arraybuffer';

    XHR.onload = () => {
      this.ctx.decodeAudioData(
        XHR.response,
        buffer => {
          this.response = buffer;
          this.onload();
        },
        () => {
          logError('ctx.decodeAudioData() called onerror');
          this.onerror();
        }
      );
    }

    const onerror = () => {
      logError('XMLHttpRequest called onerror');
      this.onerror();
    };
    XHR.send();
  }

  loadOneOfBuffers(url, index) {
    const XHR = new XMLHttpRequest();
    XHR.open('GET', url, true);
    XHR.responseType = 'arraybuffer';

    XHR.onload = () => {
      this.ctx.decodeAudioData(
        XHR.response,
        buffer => {
          this.response[index] = buffer;
          this.loaded += 1;
          if (this.loaded === this.src.length) {
            this.loaded = 0;
            this.onload();
          }
        },
        () => {
          logError('ctx.decodeAudioData() called onerror');
          this.onerror();
        }
      );
    };

    XHR.onerror = () => {
      logError('XMLHttpRequest called onerror');
      this.onerror();
    };
    XHR.send();
  }
}


function logError(message:string) {
  window.console.error(`AudioSampleLoader: ${message}`);
}