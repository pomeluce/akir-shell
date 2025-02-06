import PopupWindow from '~gtk3/PopupWindow';
import Box from '~gtk3/Box';
import Icon from '~gtk3/Icon';
import PopupBin from '~gtk3/PopupBin';
import Button from '~gtk3/Button';
import { scss } from '~lib/theme';
import { dependencies, mkdir } from '~lib/os';
import { writeFile } from 'astal/file';
import Gio from 'gi://Gio?version=2.0';
import { Gdk, Gtk } from 'astal/gtk3';
import { execAsync } from 'astal';

void scss`window#info {
    .PopupBin {
        min-width: 14rem;
    }

    .Logo {
        min-width: 8rem;
        min-height: 8rem;
        border-radius: 99rem;
        background-size: cover;
        background-position: center;
        margin: $spacing 0;
        background-image: url('http://marble-shell.pages.dev/logo.png')
    }

    .program-name {
        font-size: 1.1em;
        font-weight: bold;
    }

    .author {
        color: transparentize($fg, 0.5);
    }
}`;

export default function Info() {
  let win: ReturnType<typeof PopupWindow>;

  const wiki = 'https://marble-shell.pages.dev/';
  const github = DEV ? 'https://github.com/marble-shell/shell/issues/new' : 'https://github.com/Aylur/dotfiles/issues/new';

  function shouldShow() {
    return false;
    // return !GLib.file_test(`${CACHE}/info`, GLib.FileTest.EXISTS);
  }

  function dontShow() {
    mkdir(CACHE);
    writeFile(`${CACHE}/info`, 'O1G');
    win.hide();
  }

  function open(link: string) {
    return function () {
      Gio.AppInfo.launch_default_for_uri_async(link, null, null, null);
      win.hide();
    };
  }

  function copy() {
    Gtk.Clipboard.get_default(Gdk.Display.get_default()!).set_text(VERSION, -1);

    if (dependencies('notify-send')) {
      execAsync(['notify-send', '-a', 'Akir', '-i', 'edit-copy-symbolic', `Copied ${DEV ? 'revision' : 'version'} to clipboard`, VERSION]);
    }
  }

  return (
    <PopupWindow setup={self => (win = self)} visible={shouldShow()} name="info">
      <PopupBin r="xl" p="2xl">
        <Box vertical p="md">
          <box halign={CENTER} className="Logo" />

          <label className="program-name" label="Akir Shell" />
          <label className="author" label="Aylur" />

          <Button my="sm" color="primary" suggested onClicked={copy}>
            <Box p="lg">
              <label label={VERSION} />
            </Box>
          </Button>

          <Box my="lg" />

          <Button hfill m="sm" tooltipText={wiki} onClicked={open(wiki)}>
            <Box p="lg">
              <label hexpand xalign={0} label="Browse Wiki" />
              <Icon symbolic icon="external-link" />
            </Box>
          </Button>

          <Button hfill m="sm" tooltipText={github} onClicked={open(github)}>
            <Box p="lg">
              <label hexpand xalign={0} label="Report an issue" />
              <Icon symbolic icon="external-link" />
            </Box>
          </Button>

          <Button suggested color="error" hfill m="sm" onClicked={dontShow}>
            <Box p="lg">
              <label hexpand xalign={0} label="Don't Show Again" />
              <Icon symbolic icon="window-close" />
            </Box>
          </Button>
        </Box>
      </PopupBin>
    </PopupWindow>
  );
}
