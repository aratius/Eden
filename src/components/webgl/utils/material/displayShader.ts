interface DisplayShader {
	uniforms: {
		[key: string]: {
			value: any
		}
	},
	vertexShader: string,
	fragmentShader: string
}

/**
 * レンダリング前にスクリーンに直接かけるシェーダー
 */
export const displayShader: DisplayShader = {
	uniforms: {
		// tDiffuseという名前はShaderPass組み込み
		'tDiffuse': { value: null },
		'u_time': {value: 0},
		'u_noise_amount': {value: 0}
	},

	vertexShader: /* glsl */`
		varying highp vec2 vUv;
			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

	fragmentShader: /* glsl */`
		uniform sampler2D tDiffuse;
		varying highp vec2 vUv;
		uniform float u_time;
		uniform float u_noise_amount;

		float rand(vec2 co) {
			float a = fract(dot(co, vec2(2.067390879775102, 12.451168662908249))) - 0.5;
			float s = a * (6.182785114200511 + a * a * (-38.026512460676566 + a * a * 53.392573080032137));
			float t = fract(s * 43758.5453);
			return t;
		}

		vec2 randPos(vec2 pos, float seed) {
			float radius = 0.005 * u_noise_amount;
			float x = (pos.x) + rand(pos+u_time + seed) * radius * 2.0 - radius;
			float y = (pos.y) + rand(vec2(pos.y, pos.x)+u_time + seed) * radius * 2.0 - radius;
			return vec2(x, y);
		}

		void main(){
			vec4 r = texture2D(tDiffuse, randPos(vUv, 1.));
			vec4 g = texture2D(tDiffuse, randPos(vUv, 2.));
			vec4 b = texture2D(tDiffuse, randPos(vUv, 3.));
			gl_FragColor = vec4(r.r, g.g, b.b, 1.);
		}`

};