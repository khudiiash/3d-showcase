
varying vec2 vUv;
varying vec3 vPosition;
uniform vec3 uBgColor;
uniform vec3 uLightColor;

uniform float uTime;
uniform float uScroll;

void main() {
    float circle = step(.5, 1.0 - distance(gl_PointCoord, vec2(.5)));
    vec3 color = mix(vec3(0.0), vec3(gl_FragCoord.y * .1, gl_FragCoord.x * .1, gl_FragCoord.z * .1), circle);

    vec3 m = mix(color * 20., uBgColor, smoothstep(1., 400., gl_FragCoord.z / gl_FragCoord.w));
    m.r *= gl_PointCoord.y;
    gl_FragColor = vec4(m, 1.);
}