import Icon from 'gtk/primitive/Icon';
import PanelButton from '../PanelButton';
import options from '../options';
import { sh } from 'core/lib/os';

export default function PowerMenu() {
  const { flat, suggested, action } = options.powermenu;

  return (
    <PanelButton flat={flat()} suggested={suggested()} color="error" tooltipText={action()} onClicked={() => sh(action.get())}>
      <Icon symbolic icon="system-shutdown" />
    </PanelButton>
  );
}
