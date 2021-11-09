import { MathUtils, Vector3 } from "three";
import { Sky } from "three/examples/jsm/objects/Sky";
import MainRenderer from "../../../../utils/template/renderer";
const isBrowser = typeof window !== 'undefined';
const dat = isBrowser ? require("dat.gui") : undefined

interface Effects {
	turbidity: number,
	rayleigh: number,
	mieCoefficient: number,
	mieDirectionalG: number,
	elevation: number,
	azimuth: number,
	exposure: number
}

export default class EffectController {

  private sky: Sky = null
  private sun: Vector3 = null
  private renderer: MainRenderer = null

  private effects: Effects = {
		turbidity: 10,
		rayleigh: 3,
		mieCoefficient: 0.005,
		mieDirectionalG: 0.7,
		elevation: 2,
		azimuth: 180,
		exposure: 0
	};

  constructor(sky: Sky, sun: Vector3, renderer: MainRenderer, effects: Effects) {
    this.sky = sky
    this.sun = sun
    this.renderer = renderer
    this.effects = effects

    const gui: dat.GUI = new dat.GUI();

		gui.add( this.effects, 'turbidity', 0.0, 20.0, 0.1 ).onChange( this.guiChanged );
		gui.add( this.effects, 'rayleigh', 0.0, 4, 0.001 ).onChange( this.guiChanged );
		gui.add( this.effects, 'mieCoefficient', 0.0, 0.1, 0.001 ).onChange( this.guiChanged );
		gui.add( this.effects, 'mieDirectionalG', 0.0, 1, 0.001 ).onChange( this.guiChanged );
		gui.add( this.effects, 'elevation', 0, 90, 0.1 ).onChange( this.guiChanged );
		gui.add( this.effects, 'azimuth', - 180, 180, 0.1 ).onChange( this.guiChanged );
		gui.add( this.effects, 'exposure', 0, 1, 0.0001 ).onChange( this.guiChanged );

		this.guiChanged();
  }

	private guiChanged = (): void => {
		/// GUI

		const uniforms = this.sky.material.uniforms;
		uniforms[ 'turbidity' ].value = this.effects.turbidity;
		uniforms[ 'rayleigh' ].value = this.effects.rayleigh;
		uniforms[ 'mieCoefficient' ].value = this.effects.mieCoefficient;
		uniforms[ 'mieDirectionalG' ].value = this.effects.mieDirectionalG;

		const phi = MathUtils.degToRad( 90 - this.effects.elevation );
		const theta = MathUtils.degToRad( this.effects.azimuth );

		this.sun.setFromSphericalCoords( 1, phi, theta );

		uniforms[ 'sunPosition' ].value.copy( this.sun );

		this.renderer.toneMappingExposure = this.effects.exposure;

	}

}