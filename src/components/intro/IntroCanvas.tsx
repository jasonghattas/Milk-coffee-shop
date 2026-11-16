"use client";

import * as THREE from "three";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles, useProgress } from "@react-three/drei";
import gsap from "gsap";
import { Suspense, useEffect, useMemo, useRef } from "react";
import {
  CUP,
  beanCutGeometry,
  cupRadiusAt,
  cupWrapTexture,
  halfBeanGeometry,
  haloTexture,
  pourCurve,
  roastTexture,
} from "./geometry";

/**
 * The opening film, and afterwards the hero's cup.
 *
 * One GSAP timeline animates a plain object of numbers (`Shot`); every frame
 * the scene reads those numbers and places the bean, the pour, the cup and
 * the camera accordingly. Skipping simply jumps the timeline to its last
 * chapter, and "static" mode starts from the final values.
 *
 *   0.0s  the bean turns in the dark while the camera closes in
 *   3.6s  it cracks: halves part in slow motion, crumbs and drops fly
 *   4.3s  coffee pours out, winds upward and the cup rises with it
 *   7.8s  the camera swings round to the printed wordmark
 *  10.4s  the cup steps aside, the camera pulls back, the page arrives
 */

type Shot = {
  beanScale: number;
  spin: number;
  shake: number;
  split: number;
  beanOut: number;
  burst: number;
  head: number;
  tail: number;
  fill: number;
  glow: number;
  orbit: number;
  dist: number;
  camY: number;
  place: number;
};

const FINAL: Shot = {
  beanScale: 1, spin: 0, shake: 0, split: 1, beanOut: 1, burst: 99,
  head: 1, tail: 1, fill: 1, glow: 1, orbit: 0, dist: 7.5, camY: 0.15, place: 1,
};

const OPENING: Shot = {
  beanScale: 0.001, spin: -Math.PI * 2.25, shake: 0, split: 0, beanOut: 0, burst: -1,
  head: 0, tail: 0, fill: 0, glow: 0, orbit: 0, dist: 9, camY: 0, place: 0,
};

const FOV = 35;
const PACE = 1.28;
const COFFEE = "#1c0f07";

type Props = {
  /** Play the film (true) or show the cup at rest (false). */
  play: boolean;
  /** The curtain has lifted: start the timeline. */
  started: boolean;
  /** Increments when the visitor presses "Skip intro". */
  skipSignal: number;
  /** Render frames only while the hero is on screen. */
  active: boolean;
  /** Phones and modest hardware get a lighter scene. */
  lowPower: boolean;
  /** Reduced motion: no idle sway. */
  still: boolean;
  onProgress: (value: number) => void;
  onReady: () => void;
  onReveal: () => void;
};

export default function IntroCanvas(props: Props) {
  const { active, lowPower } = props;
  return (
    <Canvas
      dpr={[1, lowPower ? 1.5 : 2]}
      camera={{ fov: FOV, near: 0.1, far: 60, position: [0, 0, 9] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={active ? "always" : "never"}
      onCreated={({ gl }) => {
        gl.localClippingEnabled = true;
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      style={{ pointerEvents: "none" }}
      aria-hidden
    >
      <LoadReporter onProgress={props.onProgress} />
      <Suspense fallback={null}>
        <Film {...props} />
      </Suspense>
    </Canvas>
  );
}

function LoadReporter({ onProgress }: { onProgress: (value: number) => void }) {
  const { progress } = useProgress();
  useEffect(() => {
    onProgress(45 + progress * 0.5);
  }, [progress, onProgress]);
  return null;
}

function Film({ play, started, skipSignal, lowPower, still, onReady, onReveal }: Props) {
  const shot = useRef<Shot>({ ...(play ? OPENING : FINAL) }).current;
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const callbacks = useRef({ onReady, onReveal });
  callbacks.current = { onReady, onReveal };

  // Build the timeline once.
  useEffect(() => {
    if (!play) return;
    const tl = gsap.timeline({ paused: true });
    tl.to(shot, { beanScale: 1, duration: 1.6, ease: "power3.out" }, 0)
      .to(shot, { spin: 0, duration: 3.6, ease: "power1.inOut" }, 0)
      .to(shot, { dist: 4.4, duration: 3.6, ease: "power2.inOut" }, 0)
      // tension, then the crack
      .to(shot, { shake: 1, duration: 0.35, ease: "power2.in" }, 3.25)
      .to(shot, { shake: 0, duration: 0.25, ease: "power2.out" }, 3.6)
      .set(shot, { burst: 0 }, 3.6)
      .to(shot, { burst: 5, duration: 5, ease: "none" }, 3.6)
      .to(shot, { split: 1, duration: 2.8, ease: "expo.out" }, 3.6)
      .to(shot, { dist: 5.3, duration: 1.4, ease: "power3.out" }, 3.6)
      // the pour, and the cup that rises out of it
      .to(shot, { head: 1, duration: 3.4, ease: "power1.inOut" }, 4.3)
      .to(shot, { beanOut: 1, duration: 1.9, ease: "power2.in" }, 4.9)
      .to(shot, { dist: 6.6, camY: 0.55, orbit: -1.9, duration: 3.3, ease: "power2.inOut" }, 4.5)
      .to(shot, { tail: 1, duration: 1.3, ease: "power2.in" }, 6.9)
      .to(shot, { fill: 1, duration: 1.5, ease: "power2.out" }, 7.0)
      // swing round to the wordmark
      .to(shot, { orbit: 0, dist: 5.2, camY: 0.25, duration: 2.6, ease: "power2.inOut" }, 7.8)
      .to(shot, { glow: 1, duration: 1.6, ease: "power1.out" }, 9.4)
      // hand over to the page
      .addLabel("reveal", 10.4)
      .call(() => callbacks.current.onReveal(), [], 10.55)
      .to(shot, { place: 1, dist: FINAL.dist, camY: FINAL.camY, duration: 1.9, ease: "power3.inOut" }, 10.4);
    // The film is cut to play briskly: about nine and a half seconds end to end.
    tl.timeScale(PACE);
    timeline.current = tl;
    return () => {
      tl.kill();
      timeline.current = null;
    };
  }, [play, shot]);

  // Skipped before the film began: go straight to the closing frame.
  useEffect(() => {
    if (!play) Object.assign(shot, FINAL);
  }, [play, shot]);

  useEffect(() => {
    if (started) timeline.current?.play();
  }, [started]);

  useEffect(() => {
    const tl = timeline.current;
    if (!tl || skipSignal === 0) return;
    if (tl.time() < tl.labels.reveal) tl.seek("reveal").timeScale(2.4).play();
  }, [skipSignal]);

  // Tell the page the scene is drawn (two frames in, so shaders are compiled).
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    let frames = 0;
    let id = 0;
    const wait = () => {
      invalidate();
      if (++frames >= 3) callbacks.current.onReady();
      else id = requestAnimationFrame(wait);
    };
    id = requestAnimationFrame(wait);
    return () => cancelAnimationFrame(id);
  }, [invalidate]);

  return (
    <>
      <Rig shot={shot} />
      <Lighting />
      {play && (
        <>
          <Bean shot={shot} detail={lowPower ? 40 : 72} />
          <Burst shot={shot} count={lowPower ? 60 : 150} kind="crumb" />
          <Burst shot={shot} count={lowPower ? 26 : 60} kind="drop" />
          <Pour shot={shot} detail={lowPower ? 220 : 420} />
          <Sparkles count={lowPower ? 24 : 60} scale={[9, 6, 6]} size={1.6} speed={0.25} opacity={0.35} color="#f7e9a0" />
        </>
      )}
      <Cup shot={shot} still={still} />
    </>
  );
}

/** How far the camera must back off so the action fits narrow screens. */
function useFit() {
  const aspect = useThree((state) => state.size.width / state.size.height);
  return { aspect, fit: Math.max(1, 0.8 / aspect) };
}

function Rig({ shot }: { shot: Shot }) {
  const { fit } = useFit();
  useFrame(({ camera }) => {
    const d = shot.dist * fit;
    camera.position.set(Math.sin(shot.orbit) * d, shot.camY, Math.cos(shot.orbit) * d);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.22} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} color="#fff1dc" />
      {/* Rim light in the yellow of the shop sign; a soft warm fill from the other side. */}
      <spotLight position={[-4, 3, -5]} intensity={160} angle={0.7} penumbra={1} color="#f7e21b" />
      <pointLight position={[-5, -1, 3]} intensity={30} color="#ffe9c9" />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3.2} position={[0, 5, -1]} rotation-x={Math.PI / 2} scale={[9, 2.2, 1]} />
        <Lightformer form="rect" intensity={2.2} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[7, 1.2, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[6, 0.5, 3]} rotation-y={-Math.PI / 2} scale={[7, 1, 1]} color="#f7e21b" />
        <Lightformer form="circle" intensity={1.2} position={[0, -1, 7]} scale={3} color="#ffe9c9" />
      </Environment>
    </>
  );
}

function Bean({ shot, detail }: { shot: Shot; detail: number }) {
  const group = useRef<THREE.Group>(null!);
  const left = useRef<THREE.Group>(null!);
  const right = useRef<THREE.Group>(null!);

  const assets = useMemo(() => {
    const bump = roastTexture();
    return {
      halves: [halfBeanGeometry(-1, detail), halfBeanGeometry(1, detail)] as const,
      cut: beanCutGeometry(),
      skin: new THREE.MeshPhysicalMaterial({
        color: "#3b2212",
        roughness: 0.5,
        bumpMap: bump,
        bumpScale: 1.4,
        clearcoat: 0.45,
        clearcoatRoughness: 0.35,
        sheen: 0.6,
        sheenColor: new THREE.Color("#8a5a33"),
        sheenRoughness: 0.5,
      }),
      flesh: new THREE.MeshStandardMaterial({
        color: "#6e4526",
        roughness: 0.85,
        bumpMap: bump,
        bumpScale: 2,
        side: THREE.DoubleSide,
      }),
      bump,
    };
  }, [detail]);

  useEffect(
    () => () => {
      assets.halves.forEach((g) => g.dispose());
      assets.cut.dispose();
      assets.skin.dispose();
      assets.flesh.dispose();
      assets.bump.dispose();
    },
    [assets],
  );

  useFrame(({ clock }) => {
    const g = group.current;
    g.visible = shot.beanOut < 0.999;
    if (!g.visible) return;
    const t = clock.elapsedTime;
    const tremble = shot.shake * 0.018;
    g.position.set(Math.sin(t * 95) * tremble, Math.cos(t * 83) * tremble, 0);
    g.rotation.set(0.12, shot.spin, 0.45);
    g.scale.setScalar(shot.beanScale * (1 + shot.shake * 0.035));

    const drift = Math.max(0, shot.burst) * 0.07;
    const away = shot.split * 1.15 + shot.beanOut * 3.2;
    const shrink = 1 - shot.beanOut;
    left.current.position.set(-away, shot.split * 0.18 + shot.beanOut * 1.2, shot.split * 0.35);
    left.current.rotation.set(-shot.split * 0.35 - drift, -shot.split * 0.85 - drift, shot.split * 0.5);
    left.current.scale.setScalar(shrink);
    right.current.position.set(away, -shot.split * 0.12 + shot.beanOut * 0.8, shot.split * 0.15);
    right.current.rotation.set(shot.split * 0.25 + drift, shot.split * 0.7 + drift * 1.3, -shot.split * 0.42);
    right.current.scale.setScalar(shrink);
  });

  return (
    <group ref={group}>
      <group ref={left}>
        <mesh geometry={assets.halves[0]} material={assets.skin} />
        <mesh geometry={assets.cut} material={assets.flesh} />
      </group>
      <group ref={right}>
        <mesh geometry={assets.halves[1]} material={assets.skin} />
        <mesh geometry={assets.cut} material={assets.flesh} />
      </group>
    </group>
  );
}

/** Crumbs of bean and drops of coffee thrown out by the crack. */
function Burst({ shot, count, kind }: { shot: Shot; count: number; kind: "crumb" | "drop" }) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(() => {
    const rand = (a: number, b: number) => a + Math.random() * (b - a);
    return Array.from({ length: count }, () => {
      const dir = new THREE.Vector3(rand(-1, 1) * 1.7, rand(-0.5, 1), rand(-0.4, 1)).normalize();
      return {
        v: dir.multiplyScalar(kind === "crumb" ? rand(0.7, 3.4) : rand(0.5, 2.2)),
        size: kind === "crumb" ? rand(0.012, 0.05) : rand(0.02, 0.06),
        spin: new THREE.Vector3(rand(-4, 4), rand(-4, 4), rand(-4, 4)),
        life: rand(2.4, 4.6),
      };
    });
  }, [count, kind]);

  useFrame(() => {
    const m = mesh.current;
    const t = shot.burst;
    m.visible = t > 0 && t < 5;
    if (!m.visible) return;
    const drag = 1.7;
    const travel = (1 - Math.exp(-drag * t)) / drag;
    for (let i = 0; i < seeds.length; i++) {
      const s = seeds[i];
      const fade = t > s.life ? 0 : Math.min(1, t * 10) * (1 - THREE.MathUtils.smoothstep(t, s.life * 0.55, s.life));
      dummy.position.set(s.v.x * travel, s.v.y * travel - 0.16 * t * t, s.v.z * travel);
      dummy.rotation.set(s.spin.x * travel, s.spin.y * travel, s.spin.z * travel);
      // Drops stretch along their flight while they are fast.
      const stretch = kind === "drop" ? 1 + 1.2 * Math.exp(-2.4 * t) : 1;
      dummy.scale.set(s.size * fade, s.size * fade * stretch, s.size * fade);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false} visible={false}>
      {kind === "crumb" ? <icosahedronGeometry args={[1, 0]} /> : <sphereGeometry args={[1, 14, 12]} />}
      {kind === "crumb" ? (
        <meshStandardMaterial color="#4a2c17" roughness={0.8} flatShading />
      ) : (
        <meshPhysicalMaterial color={COFFEE} roughness={0.06} clearcoat={1} clearcoatRoughness={0.05} envMapIntensity={1.6} />
      )}
    </instancedMesh>
  );
}

/** The stream of coffee: a glossy tube drawn progressively along its path. */
function Pour({ shot, detail }: { shot: Shot; detail: number }) {
  const RADIAL = 10;
  const tube = useRef<THREE.Mesh>(null!);
  const head = useRef<THREE.Mesh>(null!);
  const tail = useRef<THREE.Mesh>(null!);
  const curve = useMemo(() => pourCurve(), []);
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, detail, 0.062, RADIAL, false), [curve, detail]);
  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: COFFEE,
        roughness: 0.05,
        clearcoat: 1,
        clearcoatRoughness: 0.04,
        envMapIntensity: 1.8,
      }),
    [],
  );
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );
  const point = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const from = Math.floor(shot.tail * detail);
    const to = Math.floor(shot.head * detail);
    const flowing = to - from > 1;
    tube.current.visible = head.current.visible = tail.current.visible = flowing;
    if (!flowing) return;
    geometry.setDrawRange(from * RADIAL * 6, (to - from) * RADIAL * 6);
    curve.getPointAt(to / detail, point);
    head.current.position.copy(point);
    curve.getPointAt(from / detail, point);
    tail.current.position.copy(point);
  });

  return (
    <>
      <mesh ref={tube} geometry={geometry} material={material} frustumCulled={false} visible={false} />
      <mesh ref={head} material={material} visible={false}>
        <sphereGeometry args={[0.105, 20, 16]} />
      </mesh>
      <mesh ref={tail} material={material} visible={false}>
        <sphereGeometry args={[0.062, 16, 12]} />
      </mesh>
    </>
  );
}

function Cup({ shot, still }: { shot: Shot; still: boolean }) {
  const group = useRef<THREE.Group>(null!);
  const coffee = useRef<THREE.Group>(null!);
  const ring = useRef<THREE.Mesh>(null!);
  const halo = useRef<THREE.Mesh>(null!);
  const { aspect, fit } = useFit();

  const logo = useLoader(THREE.TextureLoader, "/brand/logo-black.png");
  const clip = useMemo(() => new THREE.Plane(new THREE.Vector3(0, -1, 0), -2), []);
  const assets = useMemo(() => {
    const wrap = cupWrapTexture(logo.image as HTMLImageElement);
    const glaze = { roughness: 0.32, clearcoat: 0.7, clearcoatRoughness: 0.18, clippingPlanes: [clip] };
    return {
      wrap,
      halo: haloTexture(),
      outer: new THREE.MeshPhysicalMaterial({ map: wrap, ...glaze }),
      inner: new THREE.MeshPhysicalMaterial({ color: "#f1ede2", side: THREE.BackSide, ...glaze }),
      solid: new THREE.MeshPhysicalMaterial({ color: "#f1ede2", ...glaze }),
      coffee: new THREE.MeshPhysicalMaterial({ color: "#2a160a", roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.08 }),
      crema: new THREE.MeshStandardMaterial({ color: "#b98452", roughness: 0.6, transparent: true, opacity: 0.85 }),
      liquid: new THREE.MeshPhysicalMaterial({ color: COFFEE, roughness: 0.05, clearcoat: 1, envMapIntensity: 1.8 }),
    };
  }, [logo, clip]);

  useEffect(
    () => () => {
      Object.values(assets).forEach((asset) => asset.dispose());
    },
    [assets],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    // The cup rises out of the coffee as the stream climbs around it.
    const rise = THREE.MathUtils.clamp((shot.head - 0.27) / 0.5, 0, 1);
    const level = -1.06 + rise * 2.16;
    const formed = rise >= 1;
    clip.constant = formed ? 1000 : level;
    group.current.visible = rise > 0;

    const forming = rise > 0 && !formed;
    ring.current.visible = forming;
    if (forming) {
      const r = cupRadiusAt(level) + 0.015;
      const swell = 0.4 + 0.6 * Math.sin(rise * Math.PI);
      ring.current.position.y = level;
      ring.current.scale.set(r, r, swell);
    }

    // Coffee level inside the cup.
    const surface = -0.9 + shot.fill * 1.66;
    const surfaceRadius = cupRadiusAt(surface) - CUP.wall - 0.004;
    coffee.current.visible = shot.fill > 0.01;
    coffee.current.position.y = surface;
    coffee.current.scale.set(surfaceRadius, 1, surfaceRadius);

    // Final placement: beside the headline on wide screens, below it on tall ones.
    const visibleHeight = 2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * FINAL.dist * fit;
    const wide = aspect >= 1;
    const targetX = wide ? visibleHeight * aspect * 0.075 : visibleHeight * aspect * 0.22;
    const targetY = wide ? -visibleHeight * 0.17 : -visibleHeight * 0.33;
    const targetScale = wide ? 0.6 : 0.56;
    const idle = still ? 0 : shot.place;
    group.current.position.set(targetX * shot.place, targetY * shot.place + Math.sin(t * 0.8) * 0.035 * idle, 0);
    group.current.rotation.y = Math.sin(t * 0.45) * 0.24 * idle;
    group.current.scale.setScalar(1 + (targetScale - 1) * shot.place);

    (halo.current.material as THREE.MeshBasicMaterial).opacity = shot.glow * (0.8 - 0.45 * shot.place);
    halo.current.rotation.y = -group.current.rotation.y;
  });

  const h = CUP.height;
  return (
    <group ref={group} visible={false}>
      {/* outer wall, turned so the print faces the front */}
      <mesh rotation-y={Math.PI} material={assets.outer}>
        <cylinderGeometry args={[CUP.rTop, CUP.rBottom, h, 96, 1, true]} />
      </mesh>
      <mesh material={assets.inner}>
        <cylinderGeometry args={[CUP.rTop - CUP.wall, CUP.rBottom - CUP.wall, h - 0.04, 72, 1, true]} />
      </mesh>
      <mesh position-y={h / 2} rotation-x={Math.PI / 2} material={assets.solid}>
        <torusGeometry args={[CUP.rTop - CUP.wall / 2, CUP.wall / 2 + 0.004, 16, 96]} />
      </mesh>
      <mesh position-y={-h / 2} rotation-x={Math.PI / 2} material={assets.solid}>
        <circleGeometry args={[CUP.rBottom, 64]} />
      </mesh>
      <mesh position-y={-h / 2 + 0.04} rotation-x={-Math.PI / 2} material={assets.solid}>
        <circleGeometry args={[CUP.rBottom - CUP.wall, 64]} />
      </mesh>

      <group ref={coffee} visible={false}>
        <mesh rotation-x={-Math.PI / 2} material={assets.coffee}>
          <circleGeometry args={[1, 72]} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} position-y={0.002} material={assets.crema}>
          <ringGeometry args={[0.8, 1, 72]} />
        </mesh>
      </group>

      {/* the lip of liquid that travels up as the cup forms */}
      <mesh ref={ring} rotation-x={Math.PI / 2} material={assets.liquid} visible={false}>
        <torusGeometry args={[1, 0.06, 14, 72]} />
      </mesh>

      <mesh ref={halo} position={[0, 0, -1.4]}>
        <planeGeometry args={[6.4, 6.4]} />
        <meshBasicMaterial
          map={assets.halo}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
