varying vec2 v_uv;
uniform sampler2D u_timemachine;

// time slice count => 100

void main() {
  vec2 pos = v_uv;

  vec4 map = vec4(vec3(pos.y), 1.);
  // vec4 map = vec4(1.);

  float time = map.r;
  time = floor(time * 99.);
  pos /= 10.;
  pos.x += mod(time, 10.)/10.;
  pos.y += floor(time/10.)/10.;

  // max
  // pos.x += .9;
  // pos.y += .9;

  vec4 col = texture2D(u_timemachine, pos);
  gl_FragColor = col;
}