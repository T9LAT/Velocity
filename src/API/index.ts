import ExtensionReader from "./AddonReader";
import Bookmark from "./Bookmark";
import ContextItem from "./ContextItem";
import History from "./History";
import Keybind from "./Keybind";
import Protocol from "./Protocol";
import RuntimeModifier from "./RuntimeModifier";
import Tab from "./Tab";
import { bindIFrameMousemove } from "~/components/ContextMenu";
import { bookmarks, protocols, tabs, keybinds } from "~/data/appState";

const velocity = new Proxy(
  {
    Tab,
    getTabs: tabs,
    Protocol,
    getProtocols: protocols,
    Bookmark,
    getBookmarks: bookmarks,
    ContextItem,
    Keybind,
    getKeybinds: keybinds,
    getKeybind: (query: Partial<Keybind>) =>
      keybinds().find((keybind) => {
        for (let [k, v] of Object.entries(query)) {
          if (keybind[k as keyof Keybind] === v) return true;
        }
        return false;
      }),
    bindIFrameMousemove,
    history: new History(),
    postManifest: false,
    ExtensionReader,
    RuntimeModifier
  },
  {
    get(target, prop: string, reciever) {
      if (!["RuntimeModifier", "history"].includes(prop)) {
        console.warn(
          `Using Velocity.${prop} is deprecated, please use RuntimeModifier instead.`
        );
      }

      return Reflect.get(target, prop, reciever);
    }
  }
);

declare global {
  var Velocity: typeof velocity;
  interface Window {
    Velocity: typeof velocity;
  }
}
globalThis.Velocity = velocity;
if (!import.meta.env.SSR) window.Velocity = velocity;

export default velocity;

