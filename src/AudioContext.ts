
//Forward-declare AudioContext for Safari and older Google Chrome.
const wac = (window['AudioContext'] || window['webkitAudioContext']) as typeof AudioContext;
export default wac;
