varying vec2 vUv;
varying vec3 vPosition;
uniform vec3 uCameraPos;
uniform float uTime;

void main()
{
    vec3 color = vec3(.9, .4, .2);
    
    float strength = pow(1.0 - distance(gl_PointCoord, vec2(0.5)), 10.0);
    vec3 mixedColor = mix(vec3(0.0), color.rgb, strength);
    mixedColor *= 10.;
    gl_FragColor = vec4(mixedColor, sin(uTime * vPosition.z * .001));
}