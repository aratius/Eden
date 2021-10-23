// 現在の位置情報を決定する
#define delta ( 1.0 / 60.0 )
void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec4 tmpPos = texture2D( texturePosition, uv );
    vec3 pos = tmpPos.xyz;

    gl_FragColor = vec4( pos, 1.0 );
}