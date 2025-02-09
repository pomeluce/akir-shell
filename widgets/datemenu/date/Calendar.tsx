import { GLib, Variable } from 'astal';
import { scss } from 'core/theme';
import { range, chunks } from 'core/lib/array';
import { cnames } from 'core/lib/utils';
import Box from 'gtk/primitive/Box';
import Button from 'gtk/primitive/Button';
import Separator from 'gtk/primitive/Separator';
import Icon from 'gtk/primitive/Icon';
import { App, Gtk, hook } from 'astal/gtk3';
import { bash } from 'core/lib/os';
import options from 'options';

void scss`.Calendar {
  box.day-names {
    color: $primary;
  }

  .calendar-toolbar {
    button.Button {
      &:focus>box {
        background-color: transparent;
        box-shadow: none;
        color: $widget-bg;
      }

      &:hover>box {
        box-shadow: inset 0 0 0 $border-width $border-color;
        background-color: transparentize($widget-bg, $hover-opacity);
        color: $fg;
      }

      &:active,
      &:checked {
        >box {
          box-shadow: inset 0 0 0 $border-width $border-color;
          background-color: $primary;
          color: $accent-fg;
        }
      }

      &:checked {
        &:hover,
        &:focus {
          >box {
              box-shadow: inset 0 0 0 ($border-width*2) $accent-fg, inset 0 0 0 $border-width $primary;
          }
        }
      }
    }
  }

  button.prev,
  button.next {
    label {
      transition: $transition;
      color: transparentize($fg, .8);
    }

    &:focus,
    &:hover {
      label {
        color: transparentize($fg, .6);
      }
    }
  }

  button.Button {
    box.dot {
      min-height: .2em;
      min-width: .2em;
      border-radius: $radius;
      border: $border;
      transition: $transition;
      background-color: $fg;
    }

    &:active,
    &.active {
      box.dot {
        background-color: $bg;
      }
    }

    &:hover box.dot {
      background-color: $primary;
    }

    &.prev,
    &.next {
      box.dot {
        background-color: transparentize($fg, .8);
      }

      &:focus,
      &:hover {
        box.dot {
          background-color: transparentize($fg, .6);
        }
      }
    }
  }
}`;

const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const leap = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const abbr = [7, 1, 2, 3, 4, 5, 6].map(d => GLib.DateTime.new_utc(2001, 1, d, 0, 0, 0).format('%a')!);

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

type Day = {
  i: number;
  current?: boolean;
  next?: boolean;
  prev?: boolean;
};

/** @param m - 1-12 jan-dec */
function matrix(y: number, m: number): Day[][] {
  // monday-sunday 0-6
  const firstDay = new Date(y, m - 1, 1).getDay() % 7;

  const thisMonth = range(1, (isLeapYear(y) ? leap : days).at(m - 1)!).map(i => ({ i, current: true }) as Day);

  const lastMonth = range(1, (isLeapYear(y) ? leap : days).at(m - 2)!).map(i => ({ i, prev: true }));

  const mx = [...lastMonth.slice(firstDay === 0 ? -7 : -firstDay), ...thisMonth];

  const nextMonth = range(1, 6 * 7 - mx.length).map(i => ({ i, next: true }));

  return chunks(7, mx.concat(nextMonth));
}

type Props = { mark?: (y: number, m: number, d: number) => boolean };

const ymd = GLib.DateTime.new_now_local().get_ymd();
const date = Variable({ day: ymd[2], month: ymd[1], year: ymd[0] });

function ClockLabel({ type, className }: { type: 'year' | 'month'; className?: string }) {
  function toogle(isPrev: boolean, isYear: boolean) {
    let { month: m, year: y, day: d } = date.get();
    let year = isYear ? (isPrev ? y - 1 : y + 1) : isPrev ? (m === 1 ? y - 1 : y) : m === 12 ? y + 1 : y;
    let month = isYear ? m : isPrev ? (m === 1 ? 12 : m - 1) : m === 12 ? 1 : m + 1;
    let count = isLeapYear(year) ? leap[month - 1] : days[month - 1];
    let day = count < d ? count : d;
    date.set({ day, month, year });
  }
  return (
    <Box className={className} py="xl" gap="lg" hexpand halign={CENTER}>
      <Button hfill flat color="primary" onClick={() => toogle(true, type === 'year')}>
        <Box p="md">
          <Icon symbolic icon="pan-start-symbolic" />
        </Box>
      </Button>
      <Box>
        <label label={date(({ year, month }) => GLib.DateTime.new_utc(year, month, 1, 0, 0, 0).format(type === 'month' ? '%b' : '%Y')!)} />
      </Box>
      <Button hfill flat color="primary" onClick={() => toogle(false, type === 'year')}>
        <Box p="md">
          <Icon symbolic icon="pan-end-symbolic" />
        </Box>
      </Button>
    </Box>
  );
}

export default function Calendar({ mark }: Props) {
  function onClick(d: Day) {
    let { month, year } = date.get();
    if (d.next) {
      if (month == 12) {
        month = 0;
        year += 1;
      } else {
        month += 1;
      }
    }
    if (d.prev) {
      if (month == 0) {
        month = 12;
        year -= 1;
      } else {
        month -= 1;
      }
    }
    date.set({ day: d.i, month, year });
  }

  function className({ prev, next, i }: Day) {
    return date(({ day }) => cnames({ prev, next }, !prev && !next && i === day && 'active'));
  }

  return (
    <Box
      vertical
      className="Calendar raised"
      p="xl"
      r="xl"
      setup={self => {
        hook(self, App, 'window-toggled', (_, win: Gtk.Window) => {
          const name = win.name;
          const visible = win.visible;
          if (name === 'datemenu' && visible) {
            const [year, month, day] = GLib.DateTime.new_now_local().get_ymd();
            date.set({ year, month, day });
          }
        });
      }}
    >
      <Box className="calendar-toolbar">
        <ClockLabel type="month" />
        <Button
          hfill
          flat
          color="primary"
          tooltipText={date(({ year, month, day }) => GLib.DateTime.new_utc(year, month, day, 0, 0, 0).format('%Y-%m-%d')!)}
          onClicked={() => {
            bash(options.datemenu.calendar.app.get()).catch(printerr);
            App.get_window('datemenu')!.visible = false;
          }}
        >
          <Box py="md" px="xl">
            <Icon symbolic icon="x-office-calendar" />
          </Box>
        </Button>
        <ClockLabel type="year" />
      </Box>
      <Separator />
      <Box className="day-names" pb="sm" homogeneous>
        {abbr}
      </Box>
      <Box gap="lg" className="days" vertical>
        {date(({ year, month }) =>
          matrix(year, month).map(row => (
            <Box gap="lg" homogeneous>
              {row.map(day => (
                <Button hfill flat color="primary" className={className(day)} onClicked={() => onClick(day)}>
                  <Box halign={CENTER} hexpand>
                    <overlay>
                      <Box p="lg">{day.i}</Box>
                      <box visible={(mark && mark(year, month, day.i)) ?? false} className="dot" valign={END} halign={CENTER} />
                    </overlay>
                  </Box>
                </Button>
              ))}
            </Box>
          )),
        )}
      </Box>
    </Box>
  );
}
