import * as THREE from "three";
import { agents } from "@/content/agents";
import { coreFragment, coreVertex, pointsFragment, pointsVertex } from "./shaders";

/**
 * Imperative three.js scene graph for the hero "finance brain": a living
 * noise-displaced core, a neural point shell, two tilted orbits carrying one
 * glowing node per agent, and data streams flowing from every agent into
 * the core. Kept outside React so the per-frame mutation stays simple.
 */

const ORBITS = [
  { radius: 2.55, tilt: new THREE.Euler(1.16, 0, 0.24), speed: 0.11 },
  { radius: 3.3, tilt: new THREE.Euler(1.3, 0, -0.32), speed: -0.075 },
];
const CORE_RADIUS = 1.2;
const CURVE_SEGMENTS = 40;
const PARTICLES_PER_CURVE = 4;
const BRAND = {
  blue: new THREE.Color("#4c7dff"),
  violet: new THREE.Color("#9d6bff"),
  teal: new THREE.Color("#1fe0b5"),
};

export type BrainFrame = {
  time: number;
  delta: number;
  camera: THREE.Camera;
  width: number;
  height: number;
  dpr: number;
  /** Normalized pointer (-1..1) for parallax; null disables parallax. */
  pointer: { x: number; y: number } | null;
  /** DOM labels to position over each node (same order as `agents`). */
  labels: readonly (HTMLElement | null)[];
};

function glowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.45)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

function glowSprite(texture: THREE.Texture, color: THREE.ColorRepresentation, scale: number, opacity: number) {
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      color,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    }),
  );
  sprite.scale.set(scale, scale, 1);
  return sprite;
}

function pointCloud(
  data: { positions: Float32Array; colors: Float32Array; sizes: Float32Array; seeds: Float32Array },
  uniforms: Record<string, THREE.IUniform>,
) {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(data.colors, 3));
  geometry.setAttribute("aSize", new THREE.BufferAttribute(data.sizes, 1));
  geometry.setAttribute("aSeed", new THREE.BufferAttribute(data.seeds, 1));
  const material = new THREE.ShaderMaterial({
    vertexShader: pointsVertex,
    fragmentShader: pointsFragment,
    uniforms,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  return new THREE.Points(geometry, material);
}

/** Points evenly spread on a sphere (Fibonacci lattice). */
function shellData(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);
  const c = new THREE.Color();
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = i * Math.PI * (3 - Math.sqrt(5));
    const jitter = radius * (1 + (Math.random() - 0.5) * 0.06);
    positions.set([Math.cos(theta) * r * jitter, y * jitter, Math.sin(theta) * r * jitter], i * 3);
    c.copy(BRAND.blue).lerp(BRAND.violet, (y + 1) / 2);
    if (Math.random() > 0.78) c.copy(BRAND.teal);
    colors.set([c.r, c.g, c.b], i * 3);
    sizes[i] = 0.5 + Math.random() * 1.1;
    seeds[i] = Math.random();
  }
  return { positions, colors, sizes, seeds };
}

function dustData(count: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);
  const v = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    v.randomDirection().multiplyScalar(4 + Math.random() * 5);
    positions.set([v.x, v.y, v.z], i * 3);
    const b = 0.35 + Math.random() * 0.4;
    colors.set([0.62 * b, 0.67 * b, b], i * 3);
    sizes[i] = 0.3 + Math.random() * 0.7;
    seeds[i] = Math.random();
  }
  return { positions, colors, sizes, seeds };
}

export function createFinanceBrain() {
  const root = new THREE.Group();
  const parallax = new THREE.Group();
  const texture = glowTexture();
  const pointUniforms = { uTime: { value: 0 }, uPixelRatio: { value: 1 } };
  const coreUniforms = {
    uTime: { value: 0 },
    uAmp: { value: 0.085 },
    uBlue: { value: BRAND.blue },
    uViolet: { value: BRAND.violet },
    uTeal: { value: BRAND.teal },
  };

  // Halo + heartbeat pulses (not affected by parallax).
  root.add(glowSprite(texture, "#3a3fb8", 9.5, 0.32));
  root.add(glowSprite(texture, "#7a5cff", 5.6, 0.55));
  const pulses = [0, 1].map(() => {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(1, 1.012, 128),
      new THREE.MeshBasicMaterial({
        color: "#b9a4ff",
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    root.add(ring);
    return ring;
  });
  root.add(pointCloud(dustData(320), pointUniforms));
  root.add(parallax);

  // Core
  parallax.add(
    new THREE.Mesh(
      new THREE.IcosahedronGeometry(CORE_RADIUS, 40),
      new THREE.ShaderMaterial({
        vertexShader: coreVertex,
        fragmentShader: coreFragment,
        uniforms: coreUniforms,
      }),
    ),
  );

  const shell = pointCloud(shellData(720, 1.78), pointUniforms);
  parallax.add(shell);

  for (const orbit of ORBITS) {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * orbit.radius, Math.sin(a) * orbit.radius, 0));
    }
    const ring = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: "#8a93c8", transparent: true, opacity: 0.16, depthWrite: false }),
    );
    ring.rotation.copy(orbit.tilt);
    parallax.add(ring);
  }

  // Agent nodes, their data-stream curves and particles.
  const nodes = agents.map((agent, i) => {
    const orbit = i % 2;
    const color = new THREE.Color(agent.accentTo ? "#c4b5fd" : agent.accent);

    const node = new THREE.Group();
    node.add(
      new THREE.Mesh(new THREE.SphereGeometry(0.085, 24, 24), new THREE.MeshBasicMaterial({ color })),
    );
    node.add(glowSprite(texture, color, 0.95, 0.9));
    parallax.add(node);

    const positions = new Float32Array((CURVE_SEGMENTS + 1) * 3);
    const colors = new Float32Array((CURVE_SEGMENTS + 1) * 3);
    for (let s = 0; s <= CURVE_SEGMENTS; s++) {
      const fade = Math.pow(1 - s / CURVE_SEGMENTS, 1.2) * 0.95 + 0.08;
      colors.set([color.r * fade, color.g * fade, color.b * fade], s * 3);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const line = new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    line.frustumCulled = false;
    parallax.add(line);

    return {
      node,
      line,
      color,
      orbit: ORBITS[orbit],
      base: (Math.floor(i / 2) / 4) * Math.PI * 2 + (orbit === 1 ? Math.PI / 4 : 0),
      matrix: new THREE.Matrix4().makeRotationFromEuler(ORBITS[orbit].tilt),
    };
  });

  const particleCount = nodes.length * PARTICLES_PER_CURVE;
  const particleData = {
    positions: new Float32Array(particleCount * 3),
    colors: new Float32Array(particleCount * 3),
    sizes: new Float32Array(particleCount),
    seeds: new Float32Array(particleCount).fill(0.98),
  };
  nodes.forEach((n, i) => {
    for (let k = 0; k < PARTICLES_PER_CURVE; k++) {
      particleData.colors.set([n.color.r, n.color.g, n.color.b], (i * PARTICLES_PER_CURVE + k) * 3);
    }
  });
  const particles = pointCloud(particleData, pointUniforms);
  particles.frustumCulled = false;
  parallax.add(particles);

  // Scratch objects reused every frame.
  const p0 = new THREE.Vector3();
  const p2 = new THREE.Vector3();
  const swirl = new THREE.Vector3();
  const point = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  const curve = new THREE.QuadraticBezierCurve3();

  function update({ time: t, delta, camera, width, height, dpr, pointer, labels }: BrainFrame) {
    coreUniforms.uTime.value = t;
    pointUniforms.uTime.value = t;
    pointUniforms.uPixelRatio.value = dpr;

    if (pointer) {
      const k = 1 - Math.exp(-delta * 2.5);
      parallax.rotation.y += (pointer.x * 0.32 - parallax.rotation.y) * k;
      parallax.rotation.x += (-pointer.y * 0.18 - parallax.rotation.x) * k;
    }
    shell.rotation.y = t * 0.06;

    nodes.forEach((n, i) => {
      const angle = n.base + t * n.orbit.speed;
      p0.set(Math.cos(angle) * n.orbit.radius, Math.sin(angle) * n.orbit.radius, 0).applyMatrix4(n.matrix);
      n.node.position.copy(p0);

      // Bezier from the node into the core surface, with a swirl.
      p2.copy(p0).normalize().multiplyScalar(CORE_RADIUS * 0.98);
      swirl.copy(p0).normalize().cross(up).multiplyScalar(0.85);
      curve.v0.copy(p0);
      curve.v1.copy(p0).add(p2).multiplyScalar(0.5 * 1.25).add(swirl);
      curve.v2.copy(p2);

      const attr = n.line.geometry.getAttribute("position") as THREE.BufferAttribute;
      for (let s = 0; s <= CURVE_SEGMENTS; s++) {
        curve.getPoint(s / CURVE_SEGMENTS, point);
        attr.setXYZ(s, point.x, point.y, point.z);
      }
      attr.needsUpdate = true;

      for (let k = 0; k < PARTICLES_PER_CURVE; k++) {
        const idx = i * PARTICLES_PER_CURVE + k;
        const phase = (t * 0.32 + k / PARTICLES_PER_CURVE + i * 0.137) % 1;
        curve.getPoint(phase, point);
        particleData.positions.set([point.x, point.y, point.z], idx * 3);
        particleData.sizes[idx] = 1.6 + Math.sin(phase * Math.PI) * 3.4;
      }

      const label = labels[i];
      if (label) {
        n.node.getWorldPosition(point);
        const depth = point.z;
        point.project(camera);
        const x = (point.x * 0.5 + 0.5) * width;
        const y = (-point.y * 0.5 + 0.5) * height;
        const behind = depth < -0.35;
        const scale = 0.86 + 0.14 * THREE.MathUtils.clamp((depth + 3.3) / 6.6, 0, 1);
        label.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) translate(-50%, -140%) scale(${scale.toFixed(3)})`;
        // Fade labels near the visual's edges (headline on the left, viewport on the right).
        const u = x / width;
        const edge = THREE.MathUtils.clamp(Math.min((u - 0.14) / 0.12, (0.92 - u) / 0.08), 0, 1);
        label.style.opacity = behind ? "0" : edge.toFixed(2);
        label.style.zIndex = behind ? "0" : "2";
      }
    });

    particles.geometry.getAttribute("position").needsUpdate = true;
    particles.geometry.getAttribute("aSize").needsUpdate = true;

    pulses.forEach((ring, k) => {
      const phase = (t * 0.28 + k * 0.5) % 1;
      ring.scale.setScalar(1.25 + phase * 2.4);
      ring.material.opacity = Math.pow(1 - phase, 2.2) * 0.32;
    });
  }

  function dispose() {
    texture.dispose();
    root.traverse((obj) => {
      if (obj instanceof THREE.Mesh || obj instanceof THREE.Line || obj instanceof THREE.Points || obj instanceof THREE.Sprite) {
        obj.geometry.dispose();
        (obj.material as THREE.Material).dispose();
      }
    });
  }

  return { root, update, dispose };
}
