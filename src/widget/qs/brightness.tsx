import { Box, Button, Icon, Slider } from '@/components';
import Brightness from '@/service/brightness';
import { createBinding } from 'gnim';
import options from 'options';

const { quicksettings } = options;

export default () => {
  const brightness = Brightness.get_default();
  const { min, max } = quicksettings.brightness;
  return (
    <Box vexpand={false} px="md" pb="2xl" gap="xl">
      <Button flat suggested onClicked={() => (brightness.screen = brightness.screen === min.get() ? max.get() : min.get())}>
        <Icon symbolic iconName="display-brightness" tooltipText={createBinding(brightness, 'screen').as(v => `Screen Brightness: ${Math.floor(v * 100)}%`)} />
      </Button>
      <Slider
        value={createBinding(brightness, 'screen')}
        onChangeValue={({ value }) => {
          brightness.screen = value;
        }}
      />
    </Box>
  );
};
