uniform float uTime;
uniform float uRadius;
uniform vec3 uLightPos;
uniform vec3 uBgColor;
uniform vec2 uResolution;
uniform vec3 uCameraPos;

uniform sampler2D uTexture;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;
varying vec4 color;


varying vec3 eyeVector;


void main() {
    vec3 X = dFdx(vNormal);
    vec3 Y = dFdy(vNormal);
    vec2 uv = gl_FragCoord.xy / vec2(1000.);
    vec3 normal=normalize(cross(X,Y));
    float diffuse = dot(normal, vec3(1.));
    uv = (uv - 0.5) * .01   + .5;
    vec3  fvNormal         = normalize(normal);
    vec3  fvViewDirection  = normalize(eyeVector);
    vec3  fvReflection     = normalize(reflect(fvViewDirection, fvNormal)); 

    
    vec3 refracted = refract(eyeVector, normal, 1. / 45.);
    uv += refracted.xy * .3;
    uv += fvReflection.xy * .3;
    vec4 textureColor = texture2D(uTexture, uv);

    float Pi = 6.28318530718; // Pi*2
    
    // GAUSSIAN BLUR SETTINGS {{{
    float Directions = 16.0; // BLUR DIRECTIONS (Default 16.0 - More is better but slower)
    float Quality = 2.0; // BLUR QUALITY (Default 4.0 - More is better but slower)
    float Size = 1.0; // BLUR SIZE (Radius)
    // GAUSSIAN BLUR SETTINGS }}}
   
    vec2 Radius = Size/uResolution.xy;
    
    // Pixel colour
    
    // Blur calculations
    for( float d=0.0; d<Pi; d+=Pi/Directions)
    {
		for(float i=1.0/Quality; i<=1.0; i+=1.0/Quality)
        {
			textureColor += texture2D( uTexture, uv+vec2(cos(d),sin(d))*Radius*i);		
        }
    }
    
    // Output to screen
    textureColor /= Quality * Directions - 15.0;
    if (uRadius > 1.) textureColor *= diffuse;
        
    textureColor *= color;
    textureColor *= textureColor;
    textureColor *= 3.;


    textureColor.rgb = mix(textureColor.rgb, uBgColor, smoothstep(1., 500.0, uCameraPos.z));
    gl_FragColor = textureColor;

}