import * as THREE from "three";

const AUDIO_PATH = "viper.ogg";

const fftSize = 2048; // https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/fftSize
const frequencyRange = {
  bass: [20, 140],
  lowMid: [140, 400],
  mid: [400, 2600],
  highMid: [2600, 5200],
  treble: [5200, 14000],
};

const getFrequencyRangeValue = (data: Uint8Array, _frequencyRange: any[]) => {
  const nyquist = 48000 / 2;
  const lowIndex = Math.round((_frequencyRange[0] / nyquist) * data.length);
  const highIndex = Math.round((_frequencyRange[1] / nyquist) * data.length);
  let total = 0;
  let numFrequencies = 0;

  for (let i = lowIndex; i <= highIndex; i++) {
    total += data[i];
    numFrequencies += 1;
  }
  return total / numFrequencies / 255;
};

const audioThree = (): [THREE.AudioAnalyser, THREE.Audio] => {
  const listener = new THREE.AudioListener();

  // create an Audio source
  const sound = new THREE.Audio(listener);

  // load a sound and set it as the Audio object's buffer
  const audioLoader = new THREE.AudioLoader();
  audioLoader.load(AUDIO_PATH, function (buffer) {
    sound.setBuffer(buffer);
    sound.setLoop(true);
    sound.setVolume(0.5);
  });

  // create an AudioAnalyser, passing in the sound and desired fftSize
  const analyser = new THREE.AudioAnalyser(sound, 32);
  // get the average frequency of the sound
  return [analyser, sound];
};

function calculateDisplacementValues(audioData: any[]) {
  const numSamples = audioData.length;
  let sum = 0;
  let high = 0;
  let low = 255;
  for (let i = 0; i < numSamples; i++) {
    const value = audioData[i];
    sum += value;
    if (value > high) {
      high = value;
    }
    if (value < low) {
      low = value;
    }
  }
  const avg = sum / numSamples;
  const range = (high - low) / 255;
  return {
    uBaseDisplacement: avg / 255, // normalize to 0-1 range
    uDisplacementRange: range,
  };
}

export const [threeAnalyser, threeAudio] = audioThree();
export const getAudioData = () => {
  const data = threeAnalyser.getFrequencyData();
  const uBassRange = getFrequencyRangeValue(data, frequencyRange.bass);
  const uLowMidRange = getFrequencyRangeValue(data, frequencyRange.lowMid);
  const uMidRange = getFrequencyRangeValue(data, frequencyRange.mid);
  const uHighMidRange = getFrequencyRangeValue(data, frequencyRange.highMid);
  const uTrebleRange = getFrequencyRangeValue(data, frequencyRange.treble);

  return {
    uBassRange,
    uLowMidRange,
    uMidRange,
    uHighMidRange,
    uTrebleRange,
  };
};

export default {};
