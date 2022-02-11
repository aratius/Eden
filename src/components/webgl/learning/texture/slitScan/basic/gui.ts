import { EventEmitter } from "events"
const isBrowser = typeof window !== 'undefined';
// const dat = isBrowser ? require("lil-gui") : undefined
import GUI from "lil-gui"

export default class _GUI extends EventEmitter {

  private _gui: GUI = null
  private _config = {
    timeslice_resolution: 4096,
    time_map_type: "hoge",
    slide: () => {},
  }

  public static SLIDE: string = "slide"
  public static CHANGE_RES: string = "changeres"
  public static CHANGE_MAP: string = "changemap"

  constructor() {
    super()

    this._init()
  }

  private _init(): void {
    this._gui = new GUI()

    this._gui.add(this._config, "timeslice_resolution", [1028, 2048, 4096])
    this._gui.add(this._config, "time_map_type", {"linear": 1, "noise": 2, circular: 3})
    this._gui.add(this._config, "slide")
  }

}