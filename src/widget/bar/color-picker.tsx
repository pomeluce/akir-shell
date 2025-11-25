import options from 'options';
import PanelButton from './panel-button';
import Icon from '@/components/icon';
import ColorPicker from '@/service/colorpicker';

const { flat, label, maxItems } = options.bar.colorpicker;
export default () => {
  const picker = ColorPicker.get_default(maxItems.get());
  return (
    <PanelButton flat={flat()} tooltipText={label()} onClicked={() => picker.pick()}>
      <Icon symbolic iconName="color-select" />
    </PanelButton>
  );
};
