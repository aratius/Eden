import { EventEmitter } from "events"
const isBrowser = typeof window !== 'undefined';
// const dat = isBrowser ? require("lil-gui") : undefined
import GUI from "lil-gui"

export default class _GUI extends EventEmitter {

  private _gui: GUI = null
  private _config = {
    timeslice_resolution: 3,
    time_map_type: 1,
    slide: () => {},
  }

  public static SLIDE: string = "slide"
  public static CHANGE_RES: string = "changeres"
  public static CHANGE_MAP: string = "changemap"

  constructor() {
    super()

    this._init()
  }

  public get config(): {[key: string]: (number|Function)} {
    return this._config
  }

  /**
   * GUI初期化
   */
  private _init(): void {
    this._config = {
      ...this._config,
      slide: () => this.emit(_GUI.SLIDE)
    }

    // タッチデバイスのとき、デフォルトで解像度一個落とす
    if(window.ontouchstart != undefined) this._config = {
      ...this._config,
      timeslice_resolution: 2,
    }

    // localStorageにデータが有る場合はそれで初期化
    const lastConfig = localStorage.getItem("guiConf")
    if(lastConfig != null) {

      this._config = {
        ...this._config,
        ...JSON.parse(lastConfig)
      }
    }

    this._gui = new GUI()

    this._gui.add(this._config, "timeslice_resolution", {"very high": 4,"high": 3, "medium": 2, "low": 1, "very low": 0.5}).onChange(() => this.emit(_GUI.CHANGE_RES, this._config.timeslice_resolution))
    this._gui.add(this._config, "time_map_type", {"vertical": 1, "horizontal": 2, "noise": 3, "circular": 4, "slit": 5, "circular slit": 6, "check": 7}).onChange(() => this.emit(_GUI.CHANGE_MAP, this._config.time_map_type))
    this._gui.add(this._config, "slide")

    this._gui.onChange(() => {
      localStorage.setItem("guiConf", JSON.stringify(this._config))
    })
  }

}