import { Accessor, createComputed } from 'gnim';
import { tmpl } from '@/support/utils';
import { themes } from 'options';

const { dark, light, scheme, padding, spacing, radius, shadows, widget, border, blur } = themes;

function t(dark: Accessor<string>, light: Accessor<string>): Accessor<string>;
function t(dark: string, light: string): Accessor<string>;
function t(dark: Accessor<string> | string, light: Accessor<string> | string) {
  if (typeof dark === 'string' && typeof light === 'string') return scheme.mode(s => (s === 'dark' ? dark : light));
  if (dark instanceof Accessor && light instanceof Accessor) return createComputed(track => (track(scheme.mode) === 'dark' ? dark : light));
}

export default tmpl`
@use 'sass:color';

$bg: transparentize(${t(dark.bg, light.bg)}, (${blur()} * .01));
$fg: ${t(dark.fg, light.fg)};
$primary: ${t(dark.primary, light.primary)};
$error: ${t(dark.error, light.error)};
$success: ${t(dark.success, light.success)};
$accent-fg: ${t(dark.bg, light.bg)};

$padding: ${padding()}pt;
$spacing: ${spacing()}pt;
$radius: ${radius()}px;
$transition: 250ms;

$shadows: ${shadows()};

$widget-opacity: ${widget.opacity(v => v * 0.01)};
$hover-opacity: ${widget.opacity(v => v * 0.0097)};
$widget-bg: ${t(dark.widget, light.widget)};

$border-width: ${border.width()}px;
$border-color: transparentize(${t(dark.border, light.border)}, ${border.opacity(v => v * 0.01)});
$border: $border-width solid $border-color;

$shadow-color: rgba(0,0,0,.6);
$text-shadow: 2px 2px 2px $shadow-color;
$box-shadow: 1px 1px 2px 0 $shadow-color, inset 0 0 0 $border-width $border-color;

$popover-padding: ${padding(v => v * 1.6)}pt;
`;
