import { exec, execAsync, GLib } from 'astal';
import { App } from 'astal/gtk3';
import { dependencies, mkdir } from 'core/lib/os';

export class Shoting {
  static DIR = `${GLib.get_home_dir()}/Pictures/Screenshots`;

  static shot(full: boolean = false) {
    const now = GLib.DateTime.new_now_local().format('%Y-%m-%d_%H-%M-%S');
    const file = `${Shoting.DIR}/${now}.png`;

    mkdir(Shoting.DIR);

    try {
      exec(['wayshot', '-f', file, ...(full ? [] : ['-s', exec('slurp')])]);
    } catch (err) {
      console.error(err);
      App.quit();
    }

    execAsync([
      'notify-send',
      'Screenshot',
      file,
      '-a',
      'Screenshot',
      '-i',
      'image-x-generic-symbolic',
      '--hint=string:image:image-x-generic-symbolic',
      '-A',
      'file=Show in Files',
      '-A',
      'view=View',
      '-A',
      'edit=Edit',
    ])
      .then(res => {
        switch (res) {
          case 'file':
            execAsync([GLib.getenv('FILE_MANAGER') || 'xdg-open', Shoting.DIR]);
            break;
          case 'view':
            execAsync(['xdg-open', file]);
            break;
          case 'edit':
            if (dependencies('swappy')) execAsync(['swappy', '-f', file]);
            break;
        }
      })
      .then(() => App.quit());
  }
}
