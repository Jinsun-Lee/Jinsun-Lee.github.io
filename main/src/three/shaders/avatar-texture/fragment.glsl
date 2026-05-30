#include ../includes/avatar-progress/fragment.glsl;
#include ../includes/about-ambient.glsl;

uniform sampler2D uTexture;

varying vec2 vUv;

void main() {
    vec3 color = texture2D(uTexture, vUv).rgb;

    float progress = getProgress();

    color = applyAmbient(color);

    gl_FragColor = vec4(color, progress);
}
