varying vec2 v_uv;
uniform sampler2D u_current_texture;
uniform sampler2D u_old_texture;

vec2 get_pos(vec2 pos, int x, int y) {
  return pos * vec2(10., 10.) - vec2(float(x), float(y));
}

void main () {
  vec4 col = vec4(0.);

  for(int x = 0; x < 10; x++) {
    for(int y = 0; y < 10; y++) {
      // current texture
      if(x == 0 && y == 0) {
        vec2 pos = get_pos(v_uv, x, y);
        if(pos.x > 0. && pos.x < 1. && pos.y > 0. && pos.y < 1.) {
          col += texture2D(u_current_texture, pos);
        }
      } else {
        vec2 pos = get_pos(v_uv, x, y);
        // oldTextureの一個前を取得
        if(pos.x > 0. && pos.x < 1. && pos.y > 0. && pos.y < 1.) {
          int bx = x;
          int by = y;
          if(x == 0) {
            by-=1;
            bx=9;
          }
          else bx-=1;

          pos = pos/10. + vec2(float(bx)/10., float(by)/10.);
          // if(pos.x > 0. && pos.x < 1. && pos.y > 0. && pos.y < 1.) {
            col += texture2D(u_old_texture, pos);
            // col.rg += pos;
          // }
        }
      }
    }
  }

  gl_FragColor = col;
}