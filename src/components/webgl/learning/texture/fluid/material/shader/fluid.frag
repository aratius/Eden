varying vec2 v_uv;
uniform sampler2D u_texture_last_frame;
uniform vec2 u_mouse_pos;
uniform vec2 u_mouse_speed;

void main() {

  vec4 tex = texture2D(u_texture_last_frame, v_uv);

  gl_FragColor = tex;
}