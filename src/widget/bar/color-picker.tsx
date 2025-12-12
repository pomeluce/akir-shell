import PanelButton from './panel-button';
import Icon from '@/components/icon';
import ColorPicker from '@/service/colorpicker';
import { configs } from 'options';

const { flat, label, maxItems } = configs.bar.colorpicker;
export default () => {
  const picker = ColorPicker.get_default(maxItems.peek());
  return (
    <PanelButton flat={flat()} tooltipText={label()} onClicked={() => picker.pick()}>
      <Icon symbolic iconName="color-select" />
    </PanelButton>
  );
};
