#define PI 3.1415926535


varying float vElevation;
varying vec2 vUv;
varying vec3 vNormal;
uniform vec3 uBgColor;
uniform vec3 uCameraPos;
varying vec3 eyeVector;
uniform float uTime;
varying vec4 color;
varying vec3 vPosition;


uniform sampler2D uTexture;
uniform sampler2D uRender;
//	Classic Perlin 2D Noise 
//	by Stefan Gustavson

vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec2 rotateUV(vec2 uv, float rotation)
{
    float mid = 0.5;
    return vec2(
        cos(rotation) * (uv.x - mid) + sin(rotation) * (uv.y - mid) + mid,
        cos(rotation) * (uv.y - mid) - sin(rotation) * (uv.x - mid) + mid
    );
}

void main() 
{
    float mixStregth = (vElevation + 5.) * .01;
    vec2 uv = (vUv - vec2(.5)) * 1. + vec2(.5);
    uv.y = 1.0 - uv.y;
    //uv = rotateUV(uv, -PI );
    float noise = cnoise(rotateUV(uv, uTime * .1) * 10.0);
    vec4 t = texture2D(uTexture, rotateUV(uv, uTime * .1));
    t.rgb += (vElevation  + 10.)* .01;
    vec4 r = texture2D(uRender, uv);
    vec4 m = mix(t, r, .85);
    m.rgb = mix(m.rgb, uBgColor, smoothstep(1., 1900., gl_FragCoord.z / gl_FragCoord.w));
    gl_FragColor = m;
}