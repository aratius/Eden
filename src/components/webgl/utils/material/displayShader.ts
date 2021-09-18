import { Texture, Vector2 } from "three";

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
		'u_splash': { value: new Texture() },
		'u_time': {value: 0},
		'u_noise_amount': {value: 0},
		'u_splash_alpha': {value: 0},
		'u_splash_pos': {value: new Vector2(0, 0.4)},
		'u_splash_rot': {value: 0}
	},

	vertexShader: /* glsl */`
		varying highp vec2 vUv;
			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

	fragmentShader: /* glsl */`
		uniform sampler2D tDiffuse;
		uniform sampler2D u_splash;
		varying highp vec2 vUv;
		uniform float u_time;
		uniform float u_noise_amount;
		uniform float u_splash_alpha;
		uniform float u_splash_rot;
		uniform vec2 u_splash_pos;

		float rand(vec2 co) {
			float a = fract(dot(co, vec2(2.067390879775102, 12.451168662908249))) - 0.5;
			float s = a * (6.182785114200511 + a * a * (-38.026512460676566 + a * a * 53.392573080032137));
			float t = fract(s * 43758.5453);
			return t;
		}

		vec2 randPos(vec2 pos, float seed, float radius) {
			float x = (pos.x) + rand(pos+u_time + seed) * radius * 2.0 - radius;
			float y = (pos.y) + rand(vec2(pos.y, pos.x)+u_time + seed) * radius * 2.0 - radius;
			return vec2(x, y);
		}

		// テクスチャを回転させた上でposを返す
		vec2 getRotatedPos(vec2 pos/*座標系*/, vec2 offset/*回転中心*/, float angle/*回転*/) {
			float cosX, sinX;
			float cosY, sinY;
			sinX = sin(angle);
			cosX = cos(angle);
			sinY = sin(angle);
			cosY = cos(angle);
			mat2 rotationMatrix = mat2(cosX, -sinX, sinY, cosX);
			vec2 newcoords = ((pos-offset) * (rotationMatrix));
			newcoords += offset;
			return newcoords;
		}

		void main(){
			vec2 pos = vUv;
			vec2 splash_pos = randPos(pos * vec2(1., 720./1280.), 1., 0.001);
			vec4 splash = texture2D(u_splash, getRotatedPos(splash_pos, vec2(0.5, 0.5) + u_splash_pos, u_splash_rot));
			splash.a *= u_splash_alpha;

			pos.x += splash.a * 0.03;

			vec4 r = texture2D(tDiffuse, randPos(pos, 1., 0.005 * u_noise_amount));
			vec4 g = texture2D(tDiffuse, randPos(pos, 2., 0.005 * u_noise_amount));
			vec4 b = texture2D(tDiffuse, randPos(pos, 3., 0.005 * u_noise_amount));

			vec4 color = vec4(r.r, g.g, b.b, 1.);

			color.rgb -= splash.rgb*vec3(0.04, 0.04, 0.02) * splash.a;

			gl_FragColor = color;
		}`

};