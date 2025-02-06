import Icon from 'gtk/primitive/Icon';
import PanelButton from '../PanelButton';
import { sh } from 'core/lib/os';
import options from 'options';

export default function PowerMenu() {
  const { flat, suggested, action } = options.bar.powermenu;

  return (
    <PanelButton flat={flat()} suggested={suggested()} color="error" tooltipText={action()} onClicked={() => sh(action.get())}>
      <Icon symbolic icon="system-shutdown" />
    </PanelButton>
  );
}
