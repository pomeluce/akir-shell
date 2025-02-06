import PanelButton from '../PanelButton';
import { Variable, GLib } from 'astal';
import { sh } from 'core/lib/os';
import options from 'options';

export default function () {
  const now = () => GLib.DateTime.new_now_local();
  const date = Variable(now()).poll(1000, now);

  const { action, format, flat, label } = options.bar.date;
  const time = Variable.derive([date, format], (c, f) => c.format(f) || '');

  return (
    <PanelButton
      flat={flat()}
      onDestroy={() => {
        date.drop();
        time.drop();
      }}
      tooltipText={label()}
      onClicked={() => sh(action.get())}
    >
      <label label={time()} />
    </PanelButton>
  );
}
