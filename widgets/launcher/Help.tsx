import Binding from 'astal/binding';
import Separator from 'gtk/primitive/Separator';
import Box from 'gtk/primitive/Box';
import FlatButton from 'gtk/primitive/FlatButton';
import plugins from './plugins/plugin';

type Props = {
  visible: Binding<boolean>;
  onClicked: (perfix: string) => void;
  plugins: ReturnType<typeof plugins>;
};

export default function ({ visible, onClicked, plugins }: Props) {
  return (
    <revealer revealChild={visible} transitionType={SLIDE_DOWN}>
      <Box vertical pb="xl" visible={plugins(ps => Object.keys(ps).length > 0)}>
        {plugins(plugins =>
          Object.entries(plugins)
            .filter(([, p]) => p?.description)
            .map(([prefix, p]) => (
              <box vertical>
                <Separator />
                <FlatButton onClicked={() => onClicked(prefix)}>
                  <Box hexpand={false} px="2xl" m="md">
                    <label label={`:${prefix}`} />
                    <box hexpand />
                    <label css="font-size: .8em" className="flat" useMarkup label={p!.description} />
                  </Box>
                </FlatButton>
              </box>
            )),
        )}
      </Box>
    </revealer>
  );
}
