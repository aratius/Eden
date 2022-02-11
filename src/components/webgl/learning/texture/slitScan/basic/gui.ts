import { EventEmitter } from "events"
const isBrowser = typeof window !== 'undefined';
// const dat = isBrowser ? require("lil-gui") : undefined
import GUI from "lil-gui"

export default class _GUI extends EventEmitter {

  private _gui: GUI = null
  private _config = {
    timeslice_resolution: "high",
    time_map_type: "linear",
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
    const config = {
      ...this._config,
      slide: () => this.emit(_GUI.SLIDE)
    }

    this._gui = new GUI()

    this._gui.add(config, "timeslice_resolution", {"high": 3, "medium": 2, "low": 1}).onChange(() => this.emit(_GUI.CHANGE_RES, config.timeslice_resolution))
    this._gui.add(config, "time_map_type", {"linear": 1, "noise": 2, circular: 3}).onChange(() => this.emit(_GUI.CHANGE_MAP, config.time_map_type))
    this._gui.add(config, "slide")
  }

}