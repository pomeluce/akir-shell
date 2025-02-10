import GLib from 'gi://GLib';
import App from 'astal/gtk3/app';
import { Process, subprocess, execAsync, exec } from 'astal/process';
import { readFile, writeFile } from 'astal/file';
import { Time, interval } from 'astal/time';
import { mkdir } from 'core/lib/os';

type State = {
  recording: boolean;
  timer: number;
};

export class Recording {
  static RUNTIME = `${GLib.get_user_runtime_dir()}/akir-shell`;
  static DIR = `${GLib.get_home_dir()}/Videos/Screencasting`;
  static STATE = `${this.RUNTIME}/recording.json`;

  static get state(): State {
    return JSON.parse(readFile(this.STATE));
  }

  static set state(state: State) {
    writeFile(this.STATE, JSON.stringify(state));
  }

  private proc!: Process;
  private time!: Time;

  private now = GLib.DateTime.new_now_local().format('%Y-%m-%d_%H-%M-%S');
  private file = `${Recording.DIR}/${this.now}.mp4`;

  static awaiting = 0;
  static instance: Recording;

  private constructor(full: boolean) {
    mkdir(Recording.DIR);

    Recording.awaiting += 1;

    this.proc = subprocess({
      cmd: ['wf-recorder', ...(full ? [] : ['-g', exec('slurp')]), '-f', this.file, '--pixel-format', 'yuv420p'],
      out: print,
      err: printerr,
    });

    let timer = 0;
    this.time = interval(1000, () => {
      Recording.state = {
        recording: true,
        timer: timer++,
      };
    });
  }

  async stop() {
    this.proc.signal(2); // SIGINT
    this.time.cancel();

    Recording.state = {
      recording: false,
      timer: 0,
    };

    if (!GLib.find_program_in_path('notify-send')) return;

    const res = await execAsync([
      'notify-send',
      'Screenrecord',
      this.file,
      '-a',
      'Screenrecord',
      '-i',
      'video-x-generic-symbolic',
      '--hint=string:image:video-x-generic-symbolic',
      '-A',
      'file=Show in Files',
      '-A',
      'view=View',
    ]);

    switch (res) {
      case 'file':
        execAsync([GLib.getenv('FILE_MANAGER') || 'xdg-open', Recording.DIR]);
        break;
      case 'view':
        execAsync(['xdg-open', this.file]);
        break;
    }
  }

  static stop() {
    print(this.instance.file);
    this.instance.stop().then(() => {
      this.awaiting -= 1;
      if (this.awaiting == 0) App.quit();
    });
  }

  static record(full: boolean = false) {
    this.instance = new Recording(full);
  }
}
