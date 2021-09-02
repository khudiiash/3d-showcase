  varying vec2 vUv;
  uniform float uSize;
  uniform float uTime;
  uniform vec3 uMouse;
  varying vec3 vPosition;

  attribute float aScale;

  attribute vec3 aTarget;


  void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.x += sin(uTime * .1) * 10.;
    modelPosition.y -= -sin(uTime * .1) * 10.;

    modelPosition.x += aTarget.x * .1;
    modelPosition.y += aTarget.y * .1;
    modelPosition.z += aTarget.z * .1;


    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;

    gl_PointSize = 10000. * aScale;
    gl_PointSize *= (1.0 / - viewPosition.z);

    vPosition = position;
  }