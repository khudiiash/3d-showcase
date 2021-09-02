uniform float uTime;
uniform vec3 uLightPos;
varying vec3 vNormal;

void main() {
    vec3  X = dFdx(vNormal);
    vec3  Y = dFdy(vNormal);
    vec3 normal = normalize(cross(X,Y));

    float diffuse = dot(normal, uLightPos);

    gl_FragColor = vec4(diffuse, diffuse, diffuse,1.);
}