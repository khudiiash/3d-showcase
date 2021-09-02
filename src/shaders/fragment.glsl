uniform vec2 uResolution;
varying vec2 vUv;

void main() {
    vec2 p = vec2(vUv.x - .5, vUv.y - .5);
    gl_FragColor = vec4( 5. / (80. * abs(40.*length(p)-1.) ) );

}