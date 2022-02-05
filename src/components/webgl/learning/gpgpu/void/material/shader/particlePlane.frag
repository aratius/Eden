varying float v_index;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

const vec3 red = vec3(242. / 255., 70. / 255., 7. / 255.);
const vec3 purp = vec3(150. / 255., 100. / 255., 150. / 255.);
const vec3 skin = vec3(200. / 255., 120. / 255., 80. / 255.);

// VertexShaderから受け取った色を格納するだけ。
void main() {

    // 丸い形に色をぬるための計算
    float f = length( gl_PointCoord - vec2( 0.5, 0.5 ) );
    if ( f > 0.1 ) {
        discard;
    }
    vec2 p = gl_PointCoord;
    float r = rand(vec2(v_index));
    vec3 c = vec3(1.);
    if(r < 0.5) {
        c = red;
    } else if (r < 0.7) {
        c = purp;
    } else {
        c = skin;
    }
    gl_FragColor = vec4(c, 0.8);
}