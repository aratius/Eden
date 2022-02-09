import { LinearFilter, Mesh, MeshBasicMaterial, PlaneBufferGeometry, RGBFormat, VideoTexture } from "three";
import WebGLCanvasBase from "../../../../utils/template/template";

export default class WebGLSlitScanBasic extends WebGLCanvasBase {

    private _display: Mesh = null
    private _video: HTMLVideoElement = null

    async _onInit(): Promise<void> {
        await this._initVideo()
        this._initDisplay()
        this.endLoading()
    }

    _onDeInit(): void {

    }

    _onResize(): void {

    }

    _onUpdate(): void {

    }

    private async _initDisplay(): Promise<void> {
        const texture = new VideoTexture(this._video)
        texture.magFilter = LinearFilter
        texture.minFilter = LinearFilter
        texture.format = RGBFormat
        const geo = new PlaneBufferGeometry(1280/2, 720/2, 10, 10)
        const mat = new MeshBasicMaterial({color: 0xffffff, map: texture})

        this._display = new Mesh(geo, mat)
        this.scene.add(this._display)
    }

    private async _initVideo(): Promise<void> {
        return new Promise<void>((res) => {
            navigator.getUserMedia(
                {video: true, audio: false},
                (localMediaStream: MediaStream) => {
                    console.log(localMediaStream)
                    this._video = document.createElement("video")
                    this._video.srcObject = localMediaStream
                    this._video.addEventListener("loadeddata", () => {
                        this._video.play()
                        res()
                    })
                },
                (err: any) => {
                    console.log(err)
                }
            )
        })
    }

}
