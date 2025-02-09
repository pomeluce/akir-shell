import PanelButton from '../PanelButton';
import { Variable } from 'astal';
import { pollTime } from 'core/lib/date';
import { sh } from 'core/lib/os';
import options from 'options';

export default function () {
  const { action, format, flat, label } = options.bar.date;
  const clock = pollTime(1);
  const time = Variable.derive([clock, format], (c, f) => c.format(f) || '');

  return (
    <PanelButton
      winName="datemenu"
      color="primary"
      flat={flat()}
      onDestroy={() => {
        clock.drop();
        time.drop();
      }}
      tooltipText={label()}
      onClicked={() => sh(action.get())}
    >
      <label label={time()} />
    </PanelButton>
  );
}
