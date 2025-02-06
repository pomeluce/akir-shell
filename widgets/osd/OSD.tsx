import { App, Astal, Gdk } from 'astal/gtk3';
import { timeout } from 'astal/time';
import Variable from 'astal/variable';
import PopupBin from 'gtk/primitive/PopupBin';
import Progress from './Progress';
import Brightness from 'core/service/brightness';
import Wp from 'gi://AstalWp';
import options from './options';
import { scss } from 'core/theme';

function anchor(anchors: Array<'top' | 'bottom' | 'left' | 'right'>) {
  return anchors.reduce((prev, a) => prev | Astal.WindowAnchor[a.toUpperCase()], 0);
}

const icons = {
  indicator: 'display-brightness',
  keyboard: 'keyboard-brightness',
  screen: 'display-brightness',
  speaker: 'audio-speakers',
};

void scss`window.OSD .PopupBin {
  margin: $spacing * 2;
  padding: $padding * .4;

  @if ($radius > 0) {
    border-radius: $radius + ($padding * .4);
  }
}`;

function OnScreenProgress({ vertical, visible }: { vertical: boolean; visible: Variable<boolean> }) {
  const brightness = Brightness.get_default();
  const speaker = Wp.get_default()!.defaultSpeaker;

  const iconName = Variable('');
  const progValue = Variable(0);
  const transitionType = Variable.derive([options.slide, options.anchors], (s, a) => {
    if (!s) return CROSSFADE;
    if (a.includes('top')) return SLIDE_DOWN;
    if (a.includes('bottom')) return SLIDE_UP;
    if (a.includes('left')) return SLIDE_RIGHT;
    if (a.includes('right')) return SLIDE_LEFT;
    return CROSSFADE;
  });

  let count = 0;
  function show(v: number, ico: string) {
    visible.set(true);
    progValue.set(v);
    iconName.set(ico);
    count++;
    timeout(options.timeout.get(), () => {
      count--;

      if (count === 0) visible.set(false);
    });
  }

  return (
    <revealer
      setup={self =>
        self
          .hook(brightness, 'notify::screen', () => show(brightness.screen, icons.screen))
          .hook(brightness, 'notify::kbd', () => show(brightness.kbd, icons.keyboard))
          .hook(speaker, 'notify::volume', () => show(speaker.volume, speaker.volumeIcon))
      }
      revealChild={visible()}
      transitionType={transitionType()}
    >
      <box css={options.margin(m => `margin: ${m}px`)}>
        <PopupBin>
          <Progress value={progValue()} width={vertical ? 42 : 300} height={vertical ? 300 : 42} vertical={vertical} icon={iconName()} />
        </PopupBin>
      </box>
    </revealer>
  );
}

export default function OSD(monitor: Gdk.Monitor) {
  const { vertical, anchors } = options;
  const visible = Variable(false);

  return (
    <window gdkmonitor={monitor} className="OSD" namespace="osd" application={App} layer={Astal.Layer.OVERLAY} keymode={Astal.Keymode.ON_DEMAND} anchor={anchors(anchor)}>
      <eventbox onClick={() => visible.set(false)}>{vertical(vertical => OnScreenProgress({ vertical, visible }))}</eventbox>
    </window>
  );
}
