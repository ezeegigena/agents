/** GLSL for the hero "finance brain". */

// 3D simplex noise — Ashima Arts / Stefan Gustavson (MIT).
const simplex3d = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

export const coreVertex = /* glsl */ `
uniform float uTime;
uniform float uAmp;
varying vec3 vNormal;
varying vec3 vViewDir;
varying float vNoise;
${simplex3d}
void main() {
  float n = snoise(normal * 1.4 + vec3(uTime * 0.22));
  float n2 = snoise(normal * 3.2 - vec3(uTime * 0.16)) * 0.35;
  vNoise = n + n2;
  vec3 displaced = position + normal * vNoise * uAmp;
  vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
  vViewDir = normalize(-mv.xyz);
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * mv;
}
`;

export const coreFragment = /* glsl */ `
uniform float uTime;
uniform vec3 uBlue;
uniform vec3 uViolet;
uniform vec3 uTeal;
varying vec3 vNormal;
varying vec3 vViewDir;
varying float vNoise;
void main() {
  vec3 n = normalize(vNormal);
  float facing = max(dot(n, normalize(vViewDir)), 0.0);
  float fres = pow(1.0 - facing, 1.7);
  float t = 0.5 + 0.5 * sin(vNoise * 2.6 + uTime * 0.5 + n.y * 2.2);
  vec3 col = mix(uBlue, uViolet, t);
  float tealMix = smoothstep(0.45, 1.0, 0.5 + 0.5 * sin(vNoise * 3.4 - uTime * 0.35 + n.x * 2.6));
  col = mix(col, uTeal, tealMix * 0.6);
  vec3 deep = vec3(0.025, 0.03, 0.08);
  vec3 color = mix(deep + col * 0.24, col * 1.3, fres);
  // soft inner light so the core reads as glassy rather than flat
  color += mix(uViolet, uBlue, 0.5) * pow(facing, 4.0) * 0.14;
  color += col * pow(fres, 5.0) * 1.4;
  // faint latitude "data bands" sliding over the surface
  float bands = smoothstep(0.94, 1.0, sin((n.y + vNoise * 0.12) * 46.0 + uTime * 1.2));
  color += col * bands * 0.22 * (0.4 + fres);
  gl_FragColor = vec4(color, 1.0);
}
`;

/** Round, soft, additive points with per-point color, size and twinkle. */
export const pointsVertex = /* glsl */ `
uniform float uTime;
uniform float uPixelRatio;
attribute float aSize;
attribute float aSeed;
attribute vec3 color;
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mv;
  float twinkle = 0.55 + 0.45 * sin(uTime * (0.8 + aSeed * 1.6) + aSeed * 40.0);
  vAlpha = twinkle;
  vColor = color;
  gl_PointSize = aSize * uPixelRatio * (12.0 / -mv.z);
}
`;

export const pointsFragment = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vColor * a * vAlpha, a * vAlpha);
}
`;
