
uniform float uTime;
uniform vec3 uLightPos;
uniform vec3 uLightColor;
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 eyeVector;
varying vec4 color;
struct lightSource
{
  vec4 position;
  vec4 diffuse;
};
lightSource light0 = lightSource(
    vec4(-1.0, 1.0, -1.0, 0.0),
    vec4(1.0, 1.0, 1.0, 1.0)
);

struct material
{
  vec4 diffuse;
};
material mymaterial = material(vec4(1.0, 0.8, 0.8, 1.0));

void main() {
    vUv = uv;

    vec3 lightDirection = normalize(uLightPos);
    vNormal = normalize(normalMatrix * normal);
    vec3 diffuseReflection
        = vec3(light0.diffuse) * vec3(mymaterial.diffuse)
        * max(0.0, dot(vNormal, lightDirection));

    color = vec4(mix(diffuseReflection, uLightColor, .8), 1.0);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    eyeVector = normalize(worldPosition.xyz - cameraPosition);
   
}