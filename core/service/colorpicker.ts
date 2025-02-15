import { exec, execAsync, GLib, GObject, property, readFile, register, writeFileAsync } from 'astal';
import { dependencies, mkdir } from 'core/lib/os';

@register({ GTypeName: 'ColorPicker' })
export default class ColorPicker extends GObject.Object {
  static INSTATCE: ColorPicker;
  static CACHE_DIR = `${GLib.get_user_cache_dir()}/akir-shell`;
  static COLORS_CACHE = `${ColorPicker.CACHE_DIR}/colorpicker.json`;

  static get_default(maxItems?: number) {
    if (!this.INSTATCE) this.INSTATCE = new ColorPicker(maxItems);
    return this.INSTATCE;
  }

  #colors: string[];
  #maxNum: number;

  constructor(maxNum: number = 10) {
    super();
    mkdir(ColorPicker.CACHE_DIR);
    const isExist = GLib.file_test(ColorPicker.COLORS_CACHE, GLib.FileTest.EXISTS);
    this.#colors = isExist ? JSON.parse(readFile(ColorPicker.COLORS_CACHE) || '[]') : [];
    this.#maxNum = maxNum;
  }

  @property()
  get colors() {
    return [...this.#colors];
  }

  set colors(colors: string[]) {
    this.#colors = colors;
  }

  wlCopy(color: string) {
    if (dependencies('wl-copy')) execAsync(`wl-copy '${color}'`);
  }

  pick() {
    if (!dependencies('hyprpicker')) return;

    const color = exec('bash -c hyprpicker -a -r');
    if (!color) return;

    this.wlCopy(color);

    const list = this.#colors;

    if (!list.includes(color)) {
      list.push(color);
      if (list.length > this.#maxNum) list.shift();

      this.#colors = list;
      this.notify('colors');
      writeFileAsync(ColorPicker.COLORS_CACHE, JSON.stringify(list, null, 2));
    }

    execAsync(['notify-send', color, '-a', 'ColorPicker', '-i', 'color-select-symbolic']);
  }
}
