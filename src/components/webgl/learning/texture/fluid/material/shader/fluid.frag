varying vec2 v_uv;
uniform sampler2D u_texture_last_frame;
uniform vec2 u_mouse_pos;
uniform vec2 u_mouse_speed;

void main() {

  vec2 pos = v_uv;

  pos += u_mouse_speed / 1000.;

  vec4 tex = texture2D(u_texture_last_frame, pos);

  gl_FragColor = tex;
}