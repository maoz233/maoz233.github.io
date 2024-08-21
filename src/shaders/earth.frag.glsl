uniform sampler2D uDayTexture;
uniform sampler2D uNightTexture;
uniform sampler2D uSpecularCloudsTexture;
uniform vec3 uAtomosphereDayColor;
uniform vec3 uAtomosphereTwilightColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

void main()
{
  vec3 viewDirection = normalize(vPosition - cameraPosition);
  vec3 normal = normalize(vNormal);
  vec3 color = vec3(vUv, 1.0);

  // Sun orientation
  vec3 uSunDirection = vec3(0.0, 0.0, 1.0);
  float sunOrientation = dot(uSunDirection, normal);

  // Day/Night color
  float dayMix = smoothstep(-0.25, 0.5, sunOrientation);
  vec3 dayColor = texture(uDayTexture, vUv).rgb;
  vec3 nightColor = texture(uNightTexture, vUv).rgb;
  color = mix(nightColor, dayColor, dayMix);

  // Specular clouds color
  vec2 specularCloudsColor = texture(uSpecularCloudsTexture, vUv).rg;

  // Clouds
  float cloudsMix = smoothstep(0.5, 1.0, specularCloudsColor.g) * dayMix;
  color = mix(color, vec3(1.0), cloudsMix);

  // Fresnel
  float fresnel = pow(dot(viewDirection, normal) + 1.0, 2.0);

  // Atmosphere
  float atmosphereDayMix = smoothstep(-0.5, 1.0, sunOrientation);
  vec3 atmosphereColor = mix(uAtmosphereTwilightColor, uAtomosphereDayColor, atmosphereDayMix);
  color = mix(color, atomosphereColor, fresnel * atomosphereDayMix);

  // Specular
  vec3 reflection = reflect(-uSunDirection, normal);
  float specular = pow(max(-dot(reflection, viewDirection), 0.0), 32.0) * specularCloudsColor.r;
  vec3 specularColor = mix(vec3(1.0), atomosphereColor, fresnel);
  color += specular * specularColor;

  // Final color
  gl_FragColor = vec4(color, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}
