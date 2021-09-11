import { Euler, Group, Mesh, Object3D, Texture, TextureLoader, Vector2, Vector3 } from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { EasingFn } from "./interfaces";


/**
 * GLTF(.glb)モデルのローディング
 * @param path
 * @returns
 */
export const loadGLTF = async (path: string): Promise<Group> => {

	return new Promise((res, rej) => {
		const loader: GLTFLoader = new GLTFLoader()
		loader.load(
			path,
			(gltf: GLTF): void => {
				res(gltf.scene)
			},
			(xhr): void => {
				// progress
				console.log(`${( xhr.loaded / xhr.total * 100 )}% loaded`);
			},
			(err): void => {
				rej(err)
			}
		)
	})

}


export const exportGLTF = async (target: Object3D): Promise<void> => {
	await new Promise((res, rej) => {

		const exporter = new GLTFExporter()

		exporter.parse(target, (gltf): void => {
			if ( gltf instanceof ArrayBuffer ) {

				saveArrayBuffer( gltf, 'scene.glb' );

			} else {

				const output = JSON.stringify( gltf, null, 2 );
				console.log( output );

				confirm("save gltf?") && saveString( output, 'scene.gltf' );
			}
			res("hoge")
		}, {})
	})
}


/**
 * Textureローディング
 * @param path
 * @returns
 */
export const loadTexture = async (path: string): Promise<Texture> => {

	return new Promise((res, rej) => {
		const loader: TextureLoader = new TextureLoader
		loader.load(
			path,
			(tex: Texture) => {
				res(tex)
			},
			(err): void => {
				rej(err)
			}
		)
	})

}

const save = ( blob: Blob, filename: string ) => {

	const link = document.createElement( 'a' );
	link.style.display = 'none';
	document.body.appendChild( link ); // Firefox workaround, see #6594

	link.href = URL.createObjectURL( blob );
	link.download = filename;
	link.click();

	// URL.revokeObjectURL( url ); breaks Firefox...

}

const saveString = ( text: string, filename: string ) => {

	save( new Blob( [ text ], { type: 'text/plain' } ), filename );

}


const saveArrayBuffer = ( buffer: ArrayBuffer, filename: string ) => {

	save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );

}

export const doItLater = async (cb: Function, delay: number): Promise<void> => {
	await new Promise((res) => setTimeout(res, delay))
	cb()
}


// イージング
export class Easing {

	/**
	 * x should be normalized from 0 to 1
	 * @param x
	 * @returns
	 */
	static easeInSine: EasingFn = (x: number) => {
		return 1 - Math.cos((x * Math.PI) / 2);
	}

	static easeInOutSine: EasingFn = (x: number) => {
		return - (Math.cos(Math.PI * x) - 1) / 2
	}

	static easeInOutQuad: EasingFn = (x: number) => {
		return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
	}

	static easeOutCubic: EasingFn = (x: number) => {
		return 1 - Math.pow(1 - x, 3)
	}

	static easeOutBounce: EasingFn = (x: number) => {
		const n1 = 7.5625;
		const d1 = 2.75;

		if (x < 1 / d1) {
			return n1 * x * x;
		} else if (x < 2 / d1) {
			return n1 * (x -= 1.5 / d1) * x + 0.75;
		} else if (x < 2.5 / d1) {
			return n1 * (x -= 2.25 / d1) * x + 0.9375;
		} else {
			return n1 * (x -= 2.625 / d1) * x + 0.984375;
		}
	}

	static linear: EasingFn = (x: number) => {
		return x
	}

}

export const getEulerFromAtoB = (a: Vector3, b: Vector3): Euler => {
	const from: Object3D = new Object3D
	from.position.set(b.x, b.y, b.z)
	from.lookAt(a)
	return from.rotation
}

/**
 * 再帰的に検索してMeshインスタンスのみを返却
 * @param group
 * @returns
 */
export const getMeshFromGroup = (group: Group | Object3D): Mesh[] =>{
	const meshes: Mesh[] = []
	for(const i in group.children) {
		if(group.children[i] instanceof Mesh) {
			meshes.push(group.children[i] as Mesh)
		} else if ((group.children[i] instanceof Group) || (group.children[i] instanceof Object3D)) {
			meshes.push(...getMeshFromGroup(group.children[i] as Mesh) as Mesh[])
		}

	}
	return meshes
}

/**
 * 負でも統合そのままVec2の累乗
 * @param p
 * @param val
 * @returns
 */
export const powerVector2 = (p: Vector2, val: number): Vector2 => {
	return new Vector2(Math.sign(p.x) * Math.pow(Math.abs(p.x), val), Math.sign(p.y) * Math.pow(Math.abs(p.y), val))
}