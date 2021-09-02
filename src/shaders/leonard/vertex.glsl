 varying vec2 vUv;
  varying vec3 vPosition;
  varying vec3 vNormal;
  varying vec2 vScreenCoords;

  void main() {
    vUv = uv;
    vPosition = position;
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vScreenCoords = gl_Position.xy / gl_Position.w;
  }