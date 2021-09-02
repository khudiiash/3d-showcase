  varying vec2 vUv;
  uniform float uSize;
  uniform float uTime;
  uniform vec3 uLightPos;

  uniform vec3 uMouse;
  varying vec3 vPosition;

  attribute float aScale;


  void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    modelPosition.y -= uLightPos.y / distance(modelPosition.xyz, uLightPos) + position.y * uMouse.y;
    modelPosition.x += uLightPos.x / distance(modelPosition.xyz, uLightPos) * 5.;
    modelPosition.z += uLightPos.z / distance(modelPosition.xyz, uLightPos);

    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    gl_PointSize = 350.;
    gl_PointSize *= (1.0 / - viewPosition.z);

    vPosition = position;
  }