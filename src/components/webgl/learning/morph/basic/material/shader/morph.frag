varying vec3 v_normal;

void main() {
  gl_FragColor = vec4(vec3(v_normal), 1.);
}