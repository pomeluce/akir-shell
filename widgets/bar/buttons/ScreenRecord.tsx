import Icon from 'gtk/primitive/Icon';
import AstalIO from 'gi://AstalIO?version=0.1';
import { GLib, Variable } from 'astal';
import { monitorFile, readFileAsync, writeFile } from 'astal/file';
import PanelButton from '../PanelButton';
import { lengthStr } from 'core/lib/utils';
import { mkdir } from 'core/lib/os';

export default function ScreenRecord() {
  const file = `${GLib.get_user_runtime_dir()}/marble/recording.json`;
  const visible = Variable(false);
  const time = Variable(0);

  mkdir(GLib.path_get_dirname(file));
  if (!GLib.file_test(file, GLib.FileTest.EXISTS)) writeFile(file, JSON.stringify({ recording: false, timer: 0 }));

  const monitor = () =>
    readFileAsync(file).then(content => {
      const { recording, timer } = JSON.parse(content) as {
        recording: boolean;
        timer: number;
      };
      visible.set(recording);
      time.set(timer);
    });

  const mon = monitorFile(file, monitor);

  return (
    <PanelButton visible={visible()} color="error" suggested onClicked={() => AstalIO.send_message('recording', 'stop')} setup={monitor} onDestroy={() => mon.cancel()}>
      <box>
        <label label={time(lengthStr)} css="margin-right: .2em;" />
        <Icon symbolic icon="media-record" />
      </box>
    </PanelButton>
  );
}
