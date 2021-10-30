varying vec2 v_uv;

void main() {
  v_uv = uv;

  vec4 world_position = modelMatrix * vec4(position, 1.);
  gl_Position = projectionMatrix * viewMatrix * world_position;
}