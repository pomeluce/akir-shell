import GLib from 'gi://GLib?version=2.0';
import PanelButton from './panel-button';
import AstalIO from 'gi://AstalIO?version=0.1';
import { Icon } from '@/components';
import { monitorFile, readFileAsync, writeFile } from 'ags/file';
import { createState } from 'gnim';
import { mkdir } from '@/support/os';
import { lengthStr } from '@/support/utils';

export default () => {
  const file = `${TMP}/recording.json`;
  const [visible, setVisible] = createState(false);
  const [time, setTime] = createState(0);

  mkdir(GLib.path_get_dirname(file));

  if (!GLib.file_test(file, GLib.FileTest.EXISTS)) writeFile(file, JSON.stringify({ recording: false, timer: 0 }));

  const monitor = () =>
    readFileAsync(file).then(content => {
      const { recording, timer } = JSON.parse(content) as {
        recording: boolean;
        timer: number;
      };
      setVisible(recording);
      setTime(timer);
    });

  const mon = monitorFile(file, monitor);
  return (
    <PanelButton visible={visible} color="error" suggested onClicked={() => AstalIO.send_message('recording', 'stop')} $={monitor} onDestroy={() => mon.cancel()}>
      <box>
        <label label={time(lengthStr)} css="margin-right: .2em;" />
        <Icon symbolic iconName="media-record" />
      </box>
    </PanelButton>
  );
};
