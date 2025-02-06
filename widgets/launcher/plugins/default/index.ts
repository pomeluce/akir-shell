import Apps from "gi://AstalApps"
import { Variable } from "astal"
import { Plugin } from "../plugin"
import options from "../../options"
import ApplicationList from "./ApplicationList"

const { maxItems } = options.default

export default function plug(): Plugin {
    const apps = new Apps.Apps({
        minScore: 1,
    })

    const list = Variable([] as Apps.Application[])
    const visible = Variable([] as string[])
    const q = (s: string) => apps.exact_query(s)
    const populate = () => list.set(q(""))

    return {
        ui: ApplicationList({
            list: list(),
            visible: visible(),
        }),
        reload: populate,
        search(search) {
            visible.set(q(search)
                .slice(0, maxItems.get())
                .map(app => app.entry!))
        },
        enter(entered) {
            q(entered)[0]?.launch()
        },
    }
}
