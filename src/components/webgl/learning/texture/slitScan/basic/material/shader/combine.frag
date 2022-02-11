varying vec2 v_uv;
uniform sampler2D u_current_texture;

void main () {
  vec4 col = texture2D(u_current_texture, v_uv);
  gl_FragColor = col;
}