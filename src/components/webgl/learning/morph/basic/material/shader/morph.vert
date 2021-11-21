attribute vec3 position_before;
attribute vec3 position_after;
uniform float u_morph_amount;
varying vec3 v_normal;

void main() {

  vec3 pos = position_before * u_morph_amount + position_after * (1. - u_morph_amount);
  v_normal = normal;

  vec4 world_position = modelMatrix * vec4(pos, 1.);
  gl_Position = projectionMatrix * viewMatrix * world_position;
}