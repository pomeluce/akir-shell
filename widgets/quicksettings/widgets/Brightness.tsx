import Bs from 'core/service/brightness';
import Box from 'gtk/primitive/Box';
import Icon from 'gtk/primitive/Icon';
import Slider from 'gtk/primitive/Slider';
import Button from 'gtk/primitive/Button';
import { bind } from 'astal';
import options from 'options';

const { quicksettings } = options;

export const Brightness = () => {
  const brightness = Bs.get_default();
  const { min, max } = quicksettings.brightness;
  return (
    <Box vexpand={false} px="md" pb="2xl" gap="xl">
      <Button flat suggested onClicked={() => (brightness.screen = brightness.screen === min.get() ? max.get() : min.get())}>
        <Icon symbolic icon="display-brightness" tooltipText={bind(brightness, 'screen').as(v => `Screen Brightness: ${Math.floor(v * 100)}%`)} />
      </Button>
      <Slider onDragged={({ value }) => (brightness.screen = value)} value={bind(brightness, 'screen')} />
    </Box>
  );
};
