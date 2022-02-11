varying vec2 v_uv;
uniform sampler2D u_timemachine;

// time slice count => 100

void main() {
  vec2 pos = v_uv;

  vec4 map = vec4(vec3(pos.y), 1.);

  float time_to_pick = floor(map.r*100.);
  pos /= 10.;
  pos += vec2(mod(time_to_pick, 10.)/10., floor(time_to_pick/100.));

  vec4 col = texture2D(u_timemachine, pos);
  gl_FragColor = col;
}