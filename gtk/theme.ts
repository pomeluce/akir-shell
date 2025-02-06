import { App, Astal } from 'astal/gtk3';
import gtktheme, { scss } from 'core/theme';

export type Size = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

// used in main
export default function theme() {
  return gtktheme({ App, Astal });
}

void scss`
@mixin margin($m: $spacing) {
  &.m-sm { margin: $m * .2; }
  &.m-md { margin: $m * .4; }
  &.m-lg { margin: $m * .6; }
  &.m-xl { margin: $m * .8; }
  &.m-2xl { margin: $m; }

  &.mx-sm { margin-right: ($m * .2); margin-left: ($m * .2); }
  &.mx-md { margin-right: ($m * .4); margin-left: ($m * .4); }
  &.mx-lg { margin-right: ($m * .6); margin-left: ($m * .6); }
  &.mx-xl { margin-right: ($m * .8); margin-left: ($m * .8); }
  &.mx-2xl { margin-right: $m; margin-left: $m }

  &.my-sm { margin-top: ($m * .2); margin-bottom: ($m * .2); }
  &.my-md { margin-top: ($m * .4); margin-bottom: ($m * .4); }
  &.my-lg { margin-top: ($m * .6); margin-bottom: ($m * .6); }
  &.my-xl { margin-top: ($m * .8); margin-bottom: ($m * .8); }
  &.my-2xl { margin-top: $m; margin-bottom: $m; }

  &.mt-sm { margin-top: ($m * .2); }
  &.mt-md { margin-top: ($m * .4); }
  &.mt-lg { margin-top: ($m * .6); }
  &.mt-xl { margin-top: ($m * .8); }
  &.mt-2xl { margin-top: $m; }

  &.mb-sm { margin-bottom: ($m * .2); }
  &.mb-md { margin-bottom: ($m * .4); }
  &.mb-lg { margin-bottom: ($m * .6); }
  &.mb-xl { margin-bottom: ($m * .8); }
  &.mb-2xl { margin-bottom: $m; }

  &.mr-sm { margin-right: ($m * .2); }
  &.mr-md { margin-right: ($m * .4); }
  &.mr-lg { margin-right: ($m * .6); }
  &.mr-xl { margin-right: ($m * .8); }
  &.mr-2xl { margin-right: $m; }

  &.ml-sm { margin-left: ($m * .2); }
  &.ml-md { margin-left: ($m * .4); }
  &.ml-lg { margin-left: ($m * .6); }
  &.ml-xl { margin-left: ($m * .8); }
  &.ml-2xl { margin-left: $m; }
}

@mixin padding($p: $padding) {
  &.p-sm { padding: $p * .2; }
  &.p-md { padding: $p * .4; }
  &.p-lg { padding: $p * .6; }
  &.p-xl { padding: $p * .8; }
  &.p-2xl { padding: $p; }

  &.px-sm { padding-right: ($p * .2); padding-left: ($p * .2); }
  &.px-md { padding-right: ($p * .4); padding-left: ($p * .4); }
  &.px-lg { padding-right: ($p * .6); padding-left: ($p * .6); }
  &.px-xl { padding-right: ($p * .8); padding-left: ($p * .8); }
  &.px-2xl { padding-right: $p; padding-left: $p; }

  &.py-sm { padding-top: ($p * .2); padding-bottom: ($p * .2); }
  &.py-md { padding-top: ($p * .4); padding-bottom: ($p * .4); }
  &.py-lg { padding-top: ($p * .6); padding-bottom: ($p * .6); }
  &.py-xl { padding-top: ($p * .8); padding-bottom: ($p * .8); }
  &.py-2xl { padding-top: $p; padding-bottom: $p; }

  &.pt-sm { padding-top: ($p * .2); }
  &.pt-md { padding-top: ($p * .4); }
  &.pt-lg { padding-top: ($p * .6); }
  &.pt-xl { padding-top: ($p * .8); }
  &.pt-2xl { padding-top: $p; }

  &.pb-sm { padding-bottom: ($p * .2); }
  &.pb-md { padding-bottom: ($p * .4); }
  &.pb-lg { padding-bottom: ($p * .6); }
  &.pb-xl { padding-bottom: ($p * .8); }
  &.pb-2xl { padding-bottom: $p; }

  &.pr-sm { padding-right: ($p * .2); }
  &.pr-md { padding-right: ($p * .4); }
  &.pr-lg { padding-right: ($p * .6); }
  &.pr-xl { padding-right: ($p * .8); }
  &.pr-2xl { padding-right: $p; }

  &.pl-sm { padding-left: ($p * .2); }
  &.pl-md { padding-left: ($p * .4); }
  &.pl-lg { padding-left: ($p * .6); }
  &.pl-xl { padding-left: ($p * .8); }
  &.pl-2xl { padding-left: $p; }
}

@mixin radius($r: $radius) {
  &.r-sm { border-radius: $r * .3; }
  &.r-md { border-radius: $r * .6; }
  &.r-lg { border-radius: $r * .9; }
  &.r-xl { border-radius: $r * 1.2; }
  &.r-2xl { border-radius: $r * 1.5; }
}
`;

void scss`
window.popup {
  >* {
    border: none;
    box-shadow: none;
  }

  menu {
    border-radius: $radius;
    background-color: $bg;
    padding: $padding;
    border: $border-width solid color.mix($fg, $border-color, .4%);

    separator {
      background-color: $border-color;
    }

    menuitem {
      all: unset;
      padding: $padding;
      transition: $transition;
      color: $fg;

      &:hover,
      &:focus {
          color: $primary;
      }

      &:first-child {
          margin-top: 0;
      }

      &:last-child {
          margin-bottom: 0;
      }
    }
  }
}

tooltip {
  * {
    all: unset;
  }

  background-color: transparent;
  border: none;

  >*>* {
    background-color: $bg;
    border-radius: $radius;
    border: $border-width solid color.mix($fg, $border-color, .4%);
    color: $fg;
    padding: 8px;
    margin: 4px;
    box-shadow: 0 0 3px 0 $shadow-color;
  }
}
`;
