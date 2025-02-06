import { Binding, Variable } from 'astal';
import { Widget } from 'astal/gtk3';
import Button, { ButtonProps } from './Button';

interface ToggleButtonProps extends ButtonProps {
  onToggled?: (self: Widget.Button, on: boolean) => void;
  state?: Binding<boolean> | boolean;
}

export default function ToggleButton({ state = false, onToggled, setup, ...props }: ToggleButtonProps) {
  const innerState = Variable(state instanceof Binding ? state.get() : state);

  return Button({
    ...props,
    setup(self) {
      setup?.(self);

      self.toggleClassName('active', innerState.get());
      self.hook(innerState, () => self.toggleClassName('active', innerState.get()));

      if (state instanceof Binding) {
        self.hook(state, () => innerState.set(state.get()));
      }
    },
    onClicked(self) {
      onToggled?.(self, !innerState.get());
    },
  });
}
