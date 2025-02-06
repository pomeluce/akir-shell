import { GObject, register, property } from 'astal/gobject';
import { monitorFile, readFile, readFileAsync } from 'astal/file';
import { bash, sh, dependencies } from '../lib/os';

const screenDevice = await bash`ls -w1 /sys/class/backlight | head -1`;
const kbdDevice = await bash`ls -w1 /sys/class/leds | head -1`;

const screen = `/sys/class/backlight/${screenDevice}`;
const kbd = `/sys/class/leds/${kbdDevice}`;

@register({ GTypeName: 'Brightness' })
export default class Brightness extends GObject.Object {
  static instance: Brightness;
  static get_default() {
    if (!this.instance) this.instance = new Brightness();

    return this.instance;
  }

  #kbdMax = Number(readFile(`${kbd}/max_brightness`));
  #kbd = Number(readFile(`${kbd}/brightness`));
  #screenMax = Number(readFile(`${screen}/max_brightness`));
  #screen = Number(readFile(`${screen}/brightness`)) / this.#screenMax;

  @property(Number)
  get kbd() {
    return this.#kbd;
  }

  set kbd(value) {
    if (!dependencies('brightnessctl')) return;

    if (value < 0 || value > this.#kbdMax) return;

    sh(`brightnessctl -d ${kbd} s ${value} -q`).then(() => {
      this.#kbd = value;
      this.notify('kbd');
    });
  }

  @property(Number)
  get screen() {
    return this.#screen;
  }

  set screen(percent) {
    if (!dependencies('brightnessctl')) return;

    if (percent < 0) percent = 0;

    if (percent > 1) percent = 1;

    sh(`brightnessctl set ${Math.floor(percent * 100)}% -q`).then(() => {
      this.#screen = percent;
      this.notify('screen');
    });
  }

  constructor() {
    super();

    monitorFile(`${screen}/brightness`, async f => {
      const v = await readFileAsync(f);
      this.#screen = Number(v) / this.#screenMax;
      this.notify('screen');
    });

    monitorFile(`${kbd}/brightness`, async f => {
      const v = await readFileAsync(f);
      this.#kbd = Number(v) / this.#kbdMax;
      this.notify('kbd');
    });
  }
}
