import options from 'options';
import PanelButton from '../PanelButton';
import Icon from 'gtk/primitive/Icon';
import ColorPicker from 'core/service/colorpicker';

const { flat, label, maxItems } = options.bar.colorpicker;

export default function () {
  const picker = ColorPicker.get_default(maxItems.get());

  return (
    <PanelButton flat={flat()} tooltipText={label()} onClicked={() => picker.pick()}>
      <Icon symbolic icon="color-select" />
    </PanelButton>
  );
}
