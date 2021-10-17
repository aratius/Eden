varying vec2 v_uv;
uniform sampler2D u_depth_texture;

const vec3 camera_position = vec3(0., 0., 1000.);

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
  v_uv = uv;

  vec4 color = texture2D(u_depth_texture, uv);

  vec4 world_position = modelMatrix * vec4(position, 1.);
  float amount = color.r * 100.;
  world_position.xyz += normalize(camera_position - world_position.xyz) * amount;
  gl_Position = projectionMatrix * viewMatrix * world_position;
}