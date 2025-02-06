import Icon from 'gtk/primitive/Icon';
import Battery from 'gi://AstalBattery';
import PanelButton from '../PanelButton';
import { Gtk } from 'astal/gtk3';
import { bind, Variable } from 'astal';
import { scss } from 'core/theme';
import { cnames } from 'core/lib/utils';
import options from 'options';

const { flat, suggested, bar, percentage, low, size } = options.bar.battery;

function blocks(s: 'sm' | 'md' | 'lg') {
  if (s === 'sm') return 6;
  if (s === 'md') return 8;
  if (s === 'lg') return 10;
  return 4;
}

const PercentageLabel = () => (
  <box>
    <revealer clickThrough revealChild={percentage()} transitionType={SLIDE_RIGHT}>
      <label label={bind(Battery.get_default(), 'percentage').as(p => `${Math.floor(p * 100)}%`)} />
    </revealer>
  </box>
);

const PercentageIcon = () => (
  <Icon symbolic icon={bind(Battery.get_default(), 'percentage').as(p => (p > 0.98 ? 'battery-full-charged' : Battery.get_default().batteryIconName))} />
);

const LevelBar = ({ vfill }: { vfill?: boolean }) => (
  <levelbar
    valign={vfill ? FILL : CENTER}
    mode={Gtk.LevelBarMode.DISCRETE}
    minValue={0}
    maxValue={size(blocks)}
    value={bind(Variable.derive([bind(Battery.get_default(), 'percentage'), size], (p, s) => p * blocks(s)))}
  />
);

export default function () {
  const battery = Battery.get_default();

  const style = Variable.derive([bind(battery, 'charging'), bind(battery, 'percentage'), low], (ch, p, low) => (ch ? 'success' : p * 100 <= low ? 'error' : 'regular'));

  const names = Variable.derive([style, size, bar], (...s) => cnames('Battery', ...s));

  return (
    <PanelButton
      flat={flat()}
      suggested={suggested()}
      onDestroy={() => {
        style.drop();
        names.drop();
      }}
      className={names()}
      color={style()}
      visible={bind(battery, 'isPresent')}
      tooltipText={bind(battery, 'percentage').as(p => `${Math.floor(p * 100)}%`)}
      onClicked={() => percentage.set(!percentage.get())}
    >
      <box>
        <box visible={bar(s => s === 'regular')}>
          <PercentageLabel />
          <LevelBar />
        </box>
        <box visible={bar(s => s === 'hidden')}>
          <PercentageIcon />
          <PercentageLabel />
        </box>
      </box>
    </PanelButton>
  );
}

void scss`
@mixin battery($width, $blocks, $shade) {
    &.regular label { margin-right: $spacing * .3;}
    &.hidden label { margin-left: $spacing * .2;}

    &:active { icon, label {
        color: $bg;
    }}

    levelbar {
        &, * { all: unset; }

        trough {
            border: $border;
            border-radius: $radius;
            background-color: transparentize($widget-bg, $widget-opacity);
        }

        block {
            min-width: $width;
            min-height: .8em;

            &:last-child {
                border-radius: 0 $radius $radius 0;
            }

            &:first-child {
                border-radius: $radius 0 0 $radius;
            }
        }
    }

    @for $i from 1 through $blocks {
        block:nth-child(#{$i}).filled {
            background-color: color.mix($bg, $primary, $i * $shade)
        }

        &:active block:nth-child(#{$i}).filled {
            background-color: color.mix($bg, $bg, $i * $shade);
        }

        &.error block:nth-child(#{$i}).filled {
            background-color: color.mix($bg, $error, $i * $shade)
        }

        &.error:active block:nth-child(#{$i}).filled {
            background-color: color.mix($bg, $bg, $i * $shade)
        }

        &.success block:nth-child(#{$i}).filled {
            background-color: color.mix($bg, $success, $i * $shade)
        }

        &.success:active block:nth-child(#{$i}).filled {
            background-color: color.mix($bg, $bg, $i * $shade)
        }
    }
}

.Bar {
    .Battery {
        &.sm { @include battery(.4em, 6, 6)}
        &.md { @include battery(.5em, 8, 5)}
        &.lg { @include battery(.6em, 10, 4)}
    }

    .panel.transparent .Battery trough {
        border: none;
        box-shadow: $box-shadow;
    }

    .panel:not(.transparent) .Battery trough {
        border: $border;
        box-shadow: none;
    }
}
`;
