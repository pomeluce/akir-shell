import Wp from "gi://AstalWp?version=0.1"
import Brightness from "@/service/brightness"
import Progress from "./progress"
import { Astal, Gdk, Gtk } from "ags/gtk4"
import {
  Accessor,
  createComputed,
  createRoot,
  createState,
  Setter,
  With,
} from "gnim"
import { scss } from "@/theme/style"
import { timeout } from "ags/time"
import { configs } from "options"
import app from "ags/gtk4/app"

const { osd } = configs

const icons = {
  indicator: "display-brightness",
  keyboard: "keyboard-brightness",
  screen: "display-brightness",
  speaker: "audio-speakers",
}

function anchor(anchors: Array<"top" | "bottom" | "left" | "right">) {
  return anchors.reduce(
    (prev, a) =>
      prev |
      Astal.WindowAnchor[
        a.toUpperCase() as "TOP" | "BOTTOM" | "LEFT" | "RIGHT"
      ],
    0,
  )
}

function OnScreenProgress({
  vertical,
  visible,
  setVisible,
}: {
  vertical: boolean
  visible: Accessor<boolean>
  setVisible: Setter<boolean>
}) {
  const brightness = Brightness.get_default()
  const speaker = Wp.get_default().defaultSpeaker

  const [iconName, setIconName] = createState("")
  const [progValue, setProgValue] = createState(0)
  const transitionType = createComputed(() => {
    if (!osd.slide()) return CROSSFADE
    if (osd.anchors().includes("top")) return SLIDE_DOWN
    if (osd.anchors().includes("bottom")) return SLIDE_UP
    if (osd.anchors().includes("left")) return SLIDE_RIGHT
    if (osd.anchors().includes("right")) return SLIDE_LEFT
    return CROSSFADE
  })

  let count = 0
  function show(v: number, ico: string) {
    setVisible(true)
    setProgValue(v)
    setIconName(ico)
    count++
    timeout(osd.timeout.peek(), () => {
      count--

      if (count === 0) setVisible(false)
    })
  }

  return (
    <revealer
      $={() => {
        // brightness.connect('notify::screen', () => show(brightness.screen, icons.screen));
        brightness.connect("notify::kbd", () =>
          show(brightness.kbd, icons.keyboard),
        )
        speaker.connect("notify::volume", () =>
          show(speaker.volume, speaker.volumeIcon),
        )
      }}
      revealChild={visible}
      transitionType={transitionType}
    >
      <box css={osd.margin((m) => `margin: ${m}px;`)}>
        <Progress
          value={progValue}
          width={vertical ? 36 : 240}
          height={vertical ? 240 : 36}
          vertical={vertical}
          icon={iconName}
        />
      </box>
    </revealer>
  )
}

export default (monitor: Gdk.Monitor) =>
  createRoot(() => {
    const { vertical, anchors } = osd
    const [visible, setVisible] = createState(false)

    return (
      <window
        visible={visible}
        gdkmonitor={monitor}
        class="osd"
        namespace="akirds-osd"
        application={app}
        layer={Astal.Layer.OVERLAY}
        keymode={Astal.Keymode.ON_DEMAND}
        anchor={anchors(anchor)}
      >
        <box
          $={(self) => {
            const ctrl = new Gtk.GestureClick()
            ctrl.connect("released", () => setVisible(false))
            self.add_controller(ctrl)
          }}
        >
          <With value={vertical}>
            {(vertical) => OnScreenProgress({ vertical, visible, setVisible })}
          </With>
        </box>
      </window>
    )
  })

void scss`window.osd  {
  margin: $spacing * 2;
  padding: $padding * .4;

  box {
    border-radius: $radius;
  }

  @if ($radius > 0) {
    border-radius: $radius + ($padding * .4);
  }
}`
