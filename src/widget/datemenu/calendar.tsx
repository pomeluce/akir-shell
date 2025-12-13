import GLib from 'gi://GLib?version=2.0';
import { Box, Button, Icon, Separator } from '@/components';
import { chunks, range } from '@/support/array';
import { bash } from '@/support/os';
import { cnames } from '@/support/utils';
import { createState, For } from 'gnim';
import { configs } from 'options';
import app from 'ags/gtk4/app';
import { scss } from '@/theme/style';

type Day = {
  i: number;
  current?: boolean;
  next?: boolean;
  prev?: boolean;
};

type Props = { mark?: (y: number, m: number, d: number) => boolean };

function isLeapYear(year: number) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

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

const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const leap = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const abbr = [7, 1, 2, 3, 4, 5, 6].map(d => GLib.DateTime.new_utc(2001, 1, d, 0, 0, 0).format('%a')!);

const ymd = GLib.DateTime.new_now_local().get_ymd();
const [date, setDate] = createState({ day: ymd[2], month: ymd[1], year: ymd[0] });

function ClockLabel({ type, class: cname }: { type: 'year' | 'month'; class?: string }) {
  function toogle(isPrev: boolean, isYear: boolean) {
    let { month: m, year: y, day: d } = date.peek();
    let year = isYear ? (isPrev ? y - 1 : y + 1) : isPrev ? (m === 1 ? y - 1 : y) : m === 12 ? y + 1 : y;
    let month = isYear ? m : isPrev ? (m === 1 ? 12 : m - 1) : m === 12 ? 1 : m + 1;
    let count = isLeapYear(year) ? leap[month - 1] : days[month - 1];
    let day = count < d ? count : d;
    setDate({ day, month, year });
  }
  return (
    <Box class={cname} py="xl" gap="lg" hexpand halign={CENTER}>
      <Button hfill flat color="primary" onClicked={() => toogle(true, type === 'year')}>
        <Box p="md">
          <Icon symbolic iconName="pan-start-symbolic" />
        </Box>
      </Button>
      <Box>
        <label label={date(({ year, month }) => GLib.DateTime.new_utc(year, month, 1, 0, 0, 0).format(type === 'month' ? '%b' : '%Y')!)} />
      </Box>
      <Button hfill flat color="primary" onClicked={() => toogle(false, type === 'year')}>
        <Box p="md">
          <Icon symbolic iconName="pan-end-symbolic" />
        </Box>
      </Button>
    </Box>
  );
}

export default function Calendar({ mark }: Props) {
  function onClick(d: Day) {
    let { month, year } = date.peek();
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
    setDate({ day: d.i, month, year });
  }

  function classes({ prev, next, i }: Day) {
    return date(({ day }) => cnames({ prev, next }, !prev && !next && i === day && 'active'));
  }

  return (
    <Box
      vertical
      class="calendar raised"
      p="xl"
      r="xl"
      $={() => {
        app.connect('window-toggled', (_, win) => {
          const name = win.name;
          const visible = win.visible;
          if (name === 'datemenu' && visible) {
            const [year, month, day] = GLib.DateTime.new_now_local().get_ymd();
            setDate({ year, month, day });
          }
        });
      }}
    >
      <Box class="calendar-toolbar">
        <ClockLabel type="month" />
        <Button
          hfill
          flat
          color="primary"
          tooltipText={date(({ year, month, day }) => GLib.DateTime.new_utc(year, month, day, 0, 0, 0).format('%Y-%m-%d')!)}
          onClicked={() => {
            bash(configs.datemenu.calendar.app.peek()).catch(printerr);
            app.get_window('datemenu')!.visible = false;
          }}
        >
          <Box py="md" px="xl">
            <Icon symbolic iconName="x-office-calendar" />
          </Box>
        </Button>
        <ClockLabel type="year" />
      </Box>
      <Separator />
      <Box class="day-names" pb="sm" homogeneous>
        {abbr}
      </Box>
      <Box gap="lg" class="days" vertical>
        <For each={date(({ year, month }) => matrix(year, month))}>
          {(row: Day[]) => (
            <Box gap="lg" homogeneous>
              {row.map(day => (
                <Button hfill flat color="primary" class={classes(day)} onClicked={() => onClick(day)}>
                  <Box halign={CENTER} hexpand>
                    <Box p="lg">{day.i}</Box>
                    <box visible={(mark && date(({ year, month }) => mark(year, month, day.i))) ?? false} class="dot" valign={END} halign={CENTER} />
                  </Box>
                </Button>
              ))}
            </Box>
          )}
        </For>
      </Box>
    </Box>
  );
}

void scss`.calendar {
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

  button.button {
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
