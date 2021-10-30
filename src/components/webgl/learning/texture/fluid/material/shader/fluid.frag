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

void main() {

  vec2 pos = v_uv;

  float dist = length(u_mouse_pos - pos);

  if(dist < 0.1) {
    pos += ease_in_out_quad(1.-dist*10.)/10. * u_mouse_speed/100.;
  }

  vec4 tex = texture2D(u_texture_last_frame, pos);

  gl_FragColor = tex;
}