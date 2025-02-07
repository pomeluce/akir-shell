import { derive, GLib, Variable } from 'astal';
import { scss } from 'core/theme';
import { range, chunks } from 'core/lib/array';
import { cnames } from 'core/lib/utils';
import Box from 'gtk/primitive/Box';
import Button from 'gtk/primitive/Button';
import { clock } from 'core/lib/date';

void scss`.Calendar {
  box.day-names {
    color: $primary;
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

const abbr = [1, 2, 3, 4, 5, 6, 7].map(d => GLib.DateTime.new_utc(2001, 1, d, 0, 0, 0).format('%a')!);

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
  const firstDay = (new Date(y, m - 1, 1).getDay() + 6) % 7;

  const thisMonth = range(1, (isLeapYear(y) ? leap : days).at(m - 1)!).map(i => ({ i, current: true }) as Day);

  const lastMonth = range(1, (isLeapYear(y) ? leap : days).at(m - 2)!).map(i => ({ i, prev: true }));

  const mx = [...lastMonth.slice(firstDay === 0 ? -7 : -firstDay), ...thisMonth];

  const nextMonth = range(1, 6 * 7 - mx.length).map(i => ({ i, next: true }));

  return chunks(7, mx.concat(nextMonth));
}

type Props = { mark?: (y: number, m: number, d: number) => boolean };

const date = derive([clock], c => {
  const [year, month, day] = c.get_ymd();
  return { day, month, year };
});

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
    <Box vertical className="Calendar raised" p="xl" r="xl">
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
