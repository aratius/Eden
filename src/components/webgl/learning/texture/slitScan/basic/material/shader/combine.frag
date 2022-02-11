varying vec2 v_uv;
uniform sampler2D u_current_texture;
uniform sampler2D u_old_texture;

const int segX = 10;
const int segY = 7;

void main () {
  vec4 col = vec4(0.);

  for(int x = 0; x < 10; x++) {
    for(int y = 0; y < 10; y++) {
      vec2 pos = v_uv * vec2(10., 10.) - vec2(float(x), float(y));
      if(pos.x > 0. && pos.x < 1. && pos.y > 0. && pos.y < 1.) {
        col += texture2D(u_current_texture, pos);
      }
    }
  }

  gl_FragColor = col;
}