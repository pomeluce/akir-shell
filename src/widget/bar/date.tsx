import PanelButton from './panel-button';
import { sh } from '@/support/os';
import { configs } from 'options';
import { pollTime } from '@/support/date';
import { createComputed } from 'gnim';

export default function () {
  const { action, format, flat, label } = configs.bar.date;
  const clock = pollTime(1);
  const time = createComputed(() => clock().format(format())!);

  return (
    <PanelButton winName="datemenu" color="primary" flat={flat()} tooltipText={label()} onClicked={() => sh(action.peek())}>
      <label label={time} />
    </PanelButton>
  );
}
