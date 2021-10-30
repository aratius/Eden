varying vec2 v_uv;
uniform sampler2D u_texture_last_frame;
uniform vec2 u_mouse_pos;
uniform vec2 u_mouse_speed;

float ease_in_out_quad(float x) {
  if(x < 0.5) {
    return 2. * x * x;
  } else {
    return 1. - pow(-2. * x + 2., 2.) / 2.;
  }
}

float ease_in_back(float x) {
  float c1 = 1.70158;
  float c3 = c1 + 1.;

  return c3 * x * x * x - c1 * x * x;
}

void main() {

  vec2 pos = v_uv;

  float dist = length(u_mouse_pos - pos);

  float touch_threshold = length(u_mouse_speed) / 500.;

  if(dist < touch_threshold && touch_threshold < 0.5) {
    float normScale = 1./touch_threshold;
    float dist = (1. - dist*normScale);
    pos += ease_in_back(dist)/(normScale) * u_mouse_speed/100.;
  }

  vec4 tex = texture2D(u_texture_last_frame, pos);

  gl_FragColor = tex;
}