import Music from '../assets/audio.mp3';
import Over from '../assets/gameover.mp3';
import Menu from '../assets/menu.mp3';
import Fire from '../assets/fire.mp3';
import Zombie from '../assets/zombie.mp3';
import Hit0 from '../assets/hit0.mp3';
import Hit1 from '../assets/hit1.mp3';
import Hit2 from '../assets/hit2.mp3';
import Hit3 from '../assets/hit3.mp3';

export class Sound {
  audio = new Audio(Music);
  over = new Audio(Over);
  menu = new Audio(Menu);

  effects: any = {
    fire: new Audio(Fire),
    zombie: new Audio(Zombie)
  }

  bpm = 128;
  measuresPerCycle = 8;
  chordsPerCycle = 4;
  beatsPerMeasure = 4;
  numberOfCycles = 10;
  beatsPerCycle = this.measuresPerCycle * this.beatsPerMeasure;
  cycleDurationInSeconds = (this.beatsPerCycle / this.bpm) * 60;
  currentCycle = 0;
  interval = 0;

  hits = [new Audio(Hit0), new Audio(Hit1), new Audio(Hit2), new Audio(Hit3)];

  constructor() {
    this.menu.volume = 0.1;
  }

  isPlaying() {
    return !this.audio.paused;
  }

  gameOver() {
    this.audio.pause();
    this.over.play();

    setTimeout(() => {
      this.progressTo(1);
    }, 2500);
  }

  goToCycle(cycle: number) {
    if (cycle >= this.numberOfCycles) {
      return;
    }

    this.currentCycle = cycle;
    // console.log(`Now playing cycle ${this.currentCycle}`);

    this.audio.currentTime = (this.cycleDurationInSeconds * this.currentCycle) + this.getPlayPositionInCycle();
  }

  playHit() {
    const currentMeasure = Math.ceil((this.getPlayPositionInCycle() / this.cycleDurationInSeconds) * this.chordsPerCycle) || 1;

    const hit = this.hits[currentMeasure - 1].cloneNode() as any;
    hit.volume = 0.3;
    hit.play();
  }

  getPlayPositionInCycle() {
    return this.audio.currentTime % this.cycleDurationInSeconds;
  }

  hitAndProgressTo(progressionFactor: number) {
    this.playHit();
    setTimeout(() => this.progressTo(progressionFactor), 250);
  }

  progressTo(progressionFactor: number) {
    // console.log('progress to', progressionFactor);

    if (progressionFactor === 1) {
      this.audio.pause();
      this.menu.currentTime = 0;
      this.menu.play();
    } else {
      if (this.audio.paused) {
        // console.log('set current time 0');
        this.audio.currentTime = 0;
        this.currentCycle = 0;
        this.audio.play();
        this.refreshInterval();
        this.menu.pause();
      }

      const cycleMatchingProgression = Math.floor(this.numberOfCycles * progressionFactor);

      if (cycleMatchingProgression > this.currentCycle) {
        this.goToCycle(cycleMatchingProgression);
      }
    }
  }

  playEffect(effect: string) {
    const effectToPlay = this.effects[effect].cloneNode();

    if (effect === 'zombie') {
      effectToPlay.volume = 0.2;
    }

    effectToPlay.play();
  }

  private refreshInterval() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    this.interval = setInterval(() => {

      if (this.currentCycle < this.numberOfCycles - 1) {
        this.currentCycle++;

        // console.log(`Now playing cycle ${this.currentCycle}`);
      }
    }, this.cycleDurationInSeconds * 1000);
  }
}
