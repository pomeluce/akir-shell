import GLib from 'gi://GLib?version=2.0';
import PanelButton from './panel-button';
import { createPoll } from 'ags/time';
import { sh } from '@/support/os';
import { configs } from 'options';

export default function () {
  const { action, format, flat, label } = configs.bar.date;
  const time = createPoll('', 1000, () => GLib.DateTime.new_now_local().format(format.peek())!);

  return (
    <PanelButton winName="datemenu" color="primary" flat={flat()} tooltipText={label()} onClicked={() => sh(action.peek())}>
      <label label={time} />
    </PanelButton>
  );
}
