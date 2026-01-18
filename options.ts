import GLib from "gi://GLib?version=2.0"
import { mkOptions, opt } from "@/support/option"
import { createState } from "gnim"

export const themes = mkOptions("theme", {
  dark: {
    primary: opt("#51a4e7"),
    error: opt("#e55f86"),
    success: opt("#00D787"),
    bg: opt("#171717"),
    fg: opt("#eeeeee"),
    widget: opt("#eeeeee"),
    border: opt("#eeeeee"),
  },
  light: {
    primary: opt("#426ede"),
    error: opt("#b13558"),
    success: opt("#009e49"),
    bg: opt("#fffffa"),
    fg: opt("#080808"),
    widget: opt("#080808"),
    border: opt("#080808"),
  },
  blur: opt(5),
  scheme: {
    enable: opt(true),
    mode: opt<"dark" | "light">("dark"),
    theme: {
      light: opt("WhiteSur-Light"),
      dark: opt("WhiteSur-Dark"),
    },
  },
  widget: {
    opacity: opt(94),
  },
  border: {
    width: opt(1),
    opacity: opt(96),
  },
  shadows: opt(true),
  padding: opt(9),
  spacing: opt(9),
  radius: opt(9),
  font: opt("CaskaydiaMono Nerd Font 10"),
  hyprland: {
    enable: opt(false),
    inactiveBorder: {
      dark: opt("#282828"),
      light: opt("#181818"),
    },
    gapsMultiplier: opt(1.7),
  },
  // swww: {
  //   enable: opt(false),
  //   fps: opt(165),
  //   wp: opt(`${GLib.get_user_config_dir()}/wallpapers`),
  //   interval: opt(300),
  // },
  iconSize: opt(15),
})

export const configs = mkOptions("config", {
  bar: {
    bold: opt(true),
    anchor: opt<"top" | "bottom">("top"),
    corners: opt<"none" | "sm" | "md" | "lg" | "xl">("md"),
    transparent: opt(false),
    layout: {
      start: opt<Array<BarWidget>>([
        "launcher",
        "workspaces",
        "taskbar",
        "spacer",
        "messages",
      ]),
      center: opt<Array<BarWidget>>(["date"]),
      end: opt<Array<BarWidget>>([
        "media",
        "spacer",
        "systray",
        "colorpicker",
        "screenrecord",
        "system",
        "battery",
        "powermenu",
      ]),
    },
    launcher: {
      suggested: opt(false),
      flat: opt(true),
      icon: opt(GLib.get_os_info("LOGO") || "system-search-symbolic"),
      label: opt("Applications"),
      // action: opt(`ags request eval launcher app -i akirds`),
      action: opt(`akirds eval launcher app`),
    },
    date: {
      flat: opt(true),
      format: opt("%m-%d %H:%M:%S - %A"),
      // action: opt(`ags request toggle datemenu -i akirds`),
      action: opt(`akirds -t datemenu`),
      label: opt("Calendar"),
    },
    battery: {
      suggested: opt(true),
      flat: opt(true),
      bar: opt<"hidden" | "regular">("regular"),
      percentage: opt(true),
      low: opt(30),
      size: opt<"sm" | "md" | "lg">("md"),
    },
    workspaces: {
      flat: opt(true),
      workspaces: opt(7),
      label: opt("Workspaces"),
    },
    taskbar: {
      flat: opt(true),
      monochrome: opt(true),
    },
    messages: {
      flat: opt(true),
      // action: opt(`ags request toggle datemenu -i akirds`),
      action: opt(`akirds -t datemenu`),
    },
    colorpicker: {
      flat: opt(true),
      maxItems: opt(10),
      label: opt("Color Picker"),
    },
    systray: {
      flat: opt(true),
      ignore: opt(["KDE Connect Indicator", "spotify-client"]),
    },
    media: {
      flat: opt(true),
      monochrome: opt(true),
      preferred: opt("spotify"),
      direction: opt<"left" | "right">("right"),
      format: opt("{artist} - {title}"),
      maxChars: opt(40),
      timeout: opt(5000), // for how long to reveal on new song
    },
    powermenu: {
      suggested: opt(true),
      flat: opt(true),
      // action: opt('ags request toggle powermenu -i akirds'),
      action: opt("akirds -t powermenu"),
    },
    systemIndicators: {
      flat: opt(true),
      // action: opt('ags request toggle quicksettings -i akirds'),
      action: opt("akirds -t quicksettings"),
      label: opt("System Indicators"),
    },
  },
  launcher: {
    anchor: opt<Array<"top" | "bottom" | "left" | "center" | "right">>([
      "top",
      "center",
    ]),
    width: opt(35),
    separator: opt<"none" | "padded" | "full">("padded"),
    margin: opt(7),

    app: {
      // maxItems: opt(7),
      placeholder: opt("Search applications..."),
      icon: {
        size: opt(6),
        monochrome: opt(false),
      },
      sort: opt<"frequency" | "alphabetical">("frequency"),
    },
    clipboard: {
      // maxItems: opt(10),
      height: opt(4),
      imagePreview: opt(true),
      placeholder: opt("Search clipboard..."),
    },
    // cmd: {
    //   placeholder: opt('Search commands...'),
    //   height: opt(4),
    //   maxItems: opt(10),
    // },
  },
  powermenu: {
    layout: opt<"1x6" | "2x3">("1x6"),
    labels: opt(true),
    iconSize: opt(8),

    hibernate: opt("systemctl hibernate"),
    sleep: opt("systemctl suspend"),
    reboot: opt("systemctl reboot"),
    logout: opt("niri msg action quit"),
    shutdown: opt("shutdown now"),
    lockscreen: opt("swaylock -eF"),
  },
  quicksettings: {
    position: opt<"left" | "center" | "right">("right"),
    avatar: {
      image: opt(`/var/lib/AccountsService/icons/${USER}`),
      size: opt(90),
    },
    width: opt(380),
    audio: {
      mixer: {
        names: opt(true),
      },
    },
    brightness: {
      min: opt(0.5),
      max: opt(0.75),
    },
    volume: opt("env XDG_CURRENT_DESKTOP=gnome gnome-control-center sound"),
    bluetooth: opt(
      "env XDG_CURRENT_DESKTOP=gnome gnome-control-center bluetooth",
    ),
    network: opt("env XDG_CURRENT_DESKTOP=gnome gnome-control-center wifi"),
    media: {
      maxItems: opt(10),
      coverSize: opt(6),
      icon: {
        size: opt(1),
        monochrome: opt(false),
      },
    },
    chunkSize: opt(3),
    colors: opt([
      { dark: "#e55f86", light: "#d15577" },
      { dark: "#00D787", light: "#43c383" },
      { dark: "#EBFF71", light: "#d8e77b" },
      { dark: "#51a4e7", light: "#426ede" },
      { dark: "#9077e7", light: "#8861dd" },
      { dark: "#ffffff", light: "#080808" },
    ]),
  },
  dock: {
    anchor: opt<"top" | "bottom">("bottom"),
    // action: opt(`ags request eval launcher app -i akirds`),
    action: opt(`akirds eval launcher app`),
    icon: {
      size: opt(5),
      monochrome: opt(false),
    },
    display: opt<number | Array<string>>([
      "IDEA",
      "code",
      "firefox",
      "telegram",
      "typora",
      "Spotify",
    ]),
  },
  osd: {
    vertical: opt(true),
    timeout: opt(2000),
    margin: opt(0),
    slide: opt(true),
    anchors: opt<Array<"top" | "bottom" | "left" | "right">>(["top", "right"]),
  },
  datemenu: {
    position: opt<"left" | "center" | "right">("center"),
    calendar: {
      app: opt("gnome-calendar"),
    },
  },
  notifications: {
    anchor: opt<Array<"top" | "bottom" | "left" | "right">>(["top", "right"]),
    blacklist: opt(["Spotify"]),
    width: opt(24),
    text: opt("当前没有任何通知"),
    iconSize: opt(5),
    maxItems: opt(10),
    dissmissOnHover: opt(false),
  },
})

export const [compositor, setCompositor] = createState<string>(
  GLib.getenv("XDG_CURRENT_DESKTOP")!.toLowerCase(),
)
