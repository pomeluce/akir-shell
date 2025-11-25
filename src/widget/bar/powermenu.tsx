import PanelButton from './panel-button';
import { Icon } from '@/components';
import { sh } from '@/support/os';
import options from 'options';

export default () => {
  const { flat, suggested, action } = options.bar.powermenu;

  return (
    <PanelButton flat={flat()} suggested={suggested()} color="error" tooltipText={action()} onClicked={() => sh(action.get())}>
      <Icon symbolic iconName="system-shutdown" />
    </PanelButton>
  );
};
