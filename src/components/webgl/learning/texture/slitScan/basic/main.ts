import { LinearFilter, Mesh, MeshBasicMaterial, PlaneBufferGeometry, RGBFormat, VideoTexture } from "three";
import WebGLCanvasBase from "../../../../utils/template/template";

export default class WebGLSlitScanBasic extends WebGLCanvasBase {

    private _realTimeDisplay: Mesh = null
    private _feedbackDisplay: Mesh = null
    private _video: HTMLVideoElement = null

    async _onInit(): Promise<void> {
        await this._initVideo()
        this._initRealTimeDisplay()
        this._initFeedbackDisplay()
        this.endLoading()
    }

    _onDeInit(): void {

    }

    _onResize(): void {

    }

    _onUpdate(): void {

    }

    private async _initFeedbackDisplay(): Promise<void> {
        const geo = new PlaneBufferGeometry(1000/2, 600/2, 10, 10)
        const mat = new MeshBasicMaterial({color: 0xff0000})
        this._feedbackDisplay = new Mesh(geo, mat)
        this._feedbackDisplay.position.set(-200, -150, 0)

        this.scene.add(this._feedbackDisplay)
    }

    private async _initRealTimeDisplay(): Promise<void> {
        const texture = new VideoTexture(this._video)
        texture.magFilter = LinearFilter
        texture.minFilter = LinearFilter
        texture.format = RGBFormat
        const geo = new PlaneBufferGeometry(1000/2, 600/2, 10, 10)
        const mat = new MeshBasicMaterial({color: 0xffffff, map: texture})

        this._realTimeDisplay = new Mesh(geo, mat)
        this._realTimeDisplay.position.set(200, 150, 0)
        this.scene.add(this._realTimeDisplay)
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
