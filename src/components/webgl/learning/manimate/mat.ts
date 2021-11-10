import { ShaderMaterial, Texture } from "three";

export default class MyMat extends ShaderMaterial {

    _opacity: number = 0

    constructor(map: Texture) {
        super({
            uniforms: {
                u_tex: {value: map},
                u_appear: {value: 0},
                u_alpha: {value: 0},
                u_anim_type: {value: 1}
            },
            transparent: true,
            fragmentShader: `
                uniform sampler2D u_tex;
                uniform float u_appear;
                uniform float u_alpha;
                uniform float u_anim_type;
                varying vec2 v_uv;

                float rand(vec2 co){
                    return fract(sin(dot(co ,vec2(12.9898,78.233))) * 43758.5453);
                }

                vec2 random2(vec2 st){
                    st = vec2( dot(st,vec2(127.1,311.7)),
                              dot(st,vec2(269.5,183.3)) );
                    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
                }

                // Gradient Noise by Inigo Quilez - iq/2013
                // https://www.shadertoy.com/view/XdXGW8
                float noise(vec2 st) {
                    vec2 i = floor(st);
                    vec2 f = fract(st);

                    vec2 u = f*f*(3.0-2.0*f);

                    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
                }

                void main() {
                    if(u_anim_type == 1.) {

                        vec4 color = texture2D(u_tex, v_uv);
                        color.a *= u_alpha;
                        color.a *= step(v_uv.y + rand(v_uv)*(1.-u_appear), u_appear);
                        gl_FragColor = color;

                    } else if (u_anim_type == 2.) {

                        float noise = noise(v_uv*10.);
                        vec2 pos = v_uv + noise * max(0., (1. - u_appear-0.3)*0.07);
                        vec4 color = texture2D(u_tex, pos);
                        color.a *= u_alpha;
                        float al = (noise-0.3)*(1.-u_appear) + u_appear;
                        // color.a *= al;
                        color.a *= u_appear;
                        if(al < 0.4 && al > 0.3) {
                            color.rgb = vec3(0.);
                        } else if(al < 0.3 && al > 0.25) {
                            color.rgb = vec3(180./255., 50./255., 14./255.);
                        } else if(al < 0.25 && al > 0.2) {
                            color.rgb = vec3(251./255., 100./255., 24./255.);
                        }
                        gl_FragColor = color;

                    } else if (u_anim_type == 3.) {
                        vec2 r = vec2(1419., 892.);
                        vec2 p = (gl_FragCoord.xy * 2.0 - r) / min(r.x, r.y);
                        float back_l = 1./(length(p+vec2(0.5, 0.4)) * 5.);
                        back_l *= (1. - u_appear);

                        vec4 tex = texture2D(u_tex, v_uv);
                        tex.rgb *= u_appear;

                        vec4 color = vec4(back_l);
                        if(tex.a != 0.) {
                            color = tex;
                        }
                        gl_FragColor = color;

                    }

                }
            `,
            vertexShader: `
                varying vec2 v_uv;
                // 2D Random
                void main() {
                    v_uv = uv;
                    vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
                    vec4 mvPosition =  viewMatrix * worldPosition;
                    gl_Position = projectionMatrix * mvPosition;
                }
            `
        })
    }

    public get alpha(): number {
        return this._opacity
    }

    public set alpha (val: number) {
        this._opacity = val
        this.uniforms.u_alpha.value = this._opacity
    }

}