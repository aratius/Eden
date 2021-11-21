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
	},

	vertexShader: /* glsl */`
		varying highp vec2 v_uv;
			void main() {
				v_uv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
		}`,

	fragmentShader: /* glsl */`
		uniform sampler2D tDiffuse;
		varying highp vec2 v_uv;
		uniform float u_time;

    const float redScale   = 0.298912;
    const float greenScale = 0.586611;
    const float blueScale  = 0.114478;
    const vec3  monochromeScale = vec3(redScale, greenScale, blueScale);

		void main(){
			vec4 color = texture2D(tDiffuse, v_uv);

      float grayColor = dot(color.rgb, monochromeScale);
      color = vec4(vec3(grayColor), 1.0);

			gl_FragColor = color;
		}`

};