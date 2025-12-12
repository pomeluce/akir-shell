import PanelButton from './panel-button';
import { Icon } from '@/components';
import { sh } from '@/support/os';
import { configs } from 'options';

export default () => {
  const { flat, suggested, action } = configs.bar.powermenu;

  return (
    <PanelButton flat={flat()} suggested={suggested()} color="error" tooltipText={action()} onClicked={() => sh(action.peek())}>
      <Icon symbolic iconName="system-shutdown" />
    </PanelButton>
  );
};
