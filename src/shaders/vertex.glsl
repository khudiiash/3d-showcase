
uniform float uTime;
varying vec2 vUv;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 mvPosition = viewMatrix * modelPosition;
    vec4 pmvPosition = projectionMatrix * mvPosition;
    gl_Position = pmvPosition;
    vUv = uv;
}