"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { halfBeanGeometry, roastTexture } from "../intro/geometry";

/**
 * The closing scene: the same roasted beans as the opening film, now
 * floating in the dark around the invitation to visit. They drift and turn
 * on their own, lean with the pointer, step aside when the pointer comes
 * close, and rise as the page scrolls on, like steam off a cup.
 */
type Props = {
  /** Render frames only while the section is on screen. */
  active: boolean;
  lowPower: boolean;
  /** Reduced motion: one still frame. */
  still: boolean;
  /** 0 → 1 as the section scrolls through the window. */
  scroll: MutableRefObject<number>;
  /** Pointer position over the section, -1 → 1 on both axes. */
  pointer: MutableRefObject<{ x: number; y: number; inside: boolean }>;
};

const FOV = 35;
const CAMERA_Z = 12;

export default function BeansCanvas({ active, lowPower, still, scroll, pointer }: Props) {
  return (
    <Canvas
      dpr={[1, lowPower ? 1.25 : 1.6]}
      camera={{ fov: FOV, near: 0.1, far: 60, position: [0, 0, CAMERA_Z] }}
      gl={{ antialias: !lowPower, alpha: true, powerPreference: "high-performance" }}
      frameloop={still ? "demand" : active ? "always" : "never"}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
    >
      <Beans count={lowPower ? 16 : 30} detail={lowPower ? 22 : 36} still={still} scroll={scroll} pointer={pointer} />
      {!lowPower && !still && (
        <Sparkles count={40} scale={[16, 9, 6]} size={1.8} speed={0.22} opacity={0.4} color="#f7e9a0" />
      )}
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 5, -1]} rotation-x={Math.PI / 2} scale={[9, 2.2, 1]} />
        <Lightformer form="rect" intensity={2} position={[-6, 1, 2]} rotation-y={Math.PI / 2} scale={[7, 1.2, 1]} />
        <Lightformer form="rect" intensity={2.4} position={[6, 0.5, 3]} rotation-y={-Math.PI / 2} scale={[7, 1, 1]} color="#f7e21b" />
        <Lightformer form="circle" intensity={1} position={[0, -1, 7]} scale={3} color="#ffe9c9" />
      </Environment>
    </Canvas>
  );
}

type Seed = {
  x: number; y: number; z: number; s: number;
  rx: number; ry: number; rz: number;
  vx: number; vy: number; vz: number;
  bob: number; phase: number;
  px: number; py: number; // current push away from the pointer
};

function Beans({
  count,
  detail,
  still,
  scroll,
  pointer,
}: {
  count: number;
  detail: number;
  still: boolean;
  scroll: Props["scroll"];
  pointer: Props["pointer"];
}) {
  const mesh = useRef<THREE.InstancedMesh>(null!);
  const group = useRef<THREE.Group>(null!);
  const { viewport, camera, invalidate } = useThree();

  const assets = useMemo(() => {
    const bump = roastTexture();
    const halves = [halfBeanGeometry(-1, detail), halfBeanGeometry(1, detail)];
    const geometry = mergeGeometries(halves)!;
    halves.forEach((g) => g.dispose());
    const material = new THREE.MeshPhysicalMaterial({
      color: "#3b2212",
      roughness: 0.48,
      bumpMap: bump,
      bumpScale: 1.4,
      clearcoat: 0.5,
      clearcoatRoughness: 0.3,
      sheen: 0.6,
      sheenColor: new THREE.Color("#8a5a33"),
      sheenRoughness: 0.5,
    });
    return { bump, geometry, material };
  }, [detail]);

  useEffect(
    () => () => {
      assets.geometry.dispose();
      assets.material.dispose();
      assets.bump.dispose();
    },
    [assets],
  );

  // Where each bean lives. The middle of the frame is kept lighter, so the words stay readable.
  const seeds = useMemo<Seed[]>(() => {
    let r = 7;
    const rand = () => ((r = (r * 16807) % 2147483647) / 2147483647);
    return Array.from({ length: count }, (_, i) => {
      const side = i % 2 ? 1 : -1;
      const spreadX = 0.22 + rand() * 0.95;
      return {
        x: side * spreadX,
        y: rand() * 2 - 1,
        z: -5 + rand() * 7.5,
        s: 0.32 + rand() * 0.38,
        rx: rand() * Math.PI * 2,
        ry: rand() * Math.PI * 2,
        rz: rand() * Math.PI * 2,
        vx: (rand() - 0.5) * 0.5,
        vy: (rand() - 0.5) * 0.6,
        vz: (rand() - 0.5) * 0.4,
        bob: 0.12 + rand() * 0.25,
        phase: rand() * Math.PI * 2,
        px: 0,
        py: 0,
      };
    });
  }, [count]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const lean = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (still) invalidate();
  }, [still, invalidate]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const dt = Math.min(delta, 1 / 30);
    // Visible size of the scene at depth 0, so the field always fills the screen.
    const halfH = Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * CAMERA_Z;
    const halfW = halfH * viewport.aspect;
    const p = pointer.current;
    const pointerX = p.x * halfW;
    const pointerY = p.y * halfH;

    // The whole field leans toward the pointer and rises with the scroll.
    lean.current.x += ((p.inside ? p.y * 0.12 : 0) - lean.current.x) * 0.04;
    lean.current.y += ((p.inside ? p.x * 0.18 : 0) - lean.current.y) * 0.04;
    group.current.rotation.set(-lean.current.x, lean.current.y, 0);
    group.current.position.y = (scroll.current - 0.5) * halfH * 0.9;

    for (let i = 0; i < seeds.length; i++) {
      const b = seeds[i];
      // Depth makes far beans spread wider so they still reach the edges.
      const depthScale = (CAMERA_Z - b.z) / CAMERA_Z;
      let x = b.x * halfW * depthScale;
      let y = b.y * halfH * 1.1 * depthScale + Math.sin(t * b.bob + b.phase) * 0.35;

      // Step aside from the pointer (only beans near the front react).
      if (p.inside && !still) {
        const dx = x - pointerX;
        const dy = y - pointerY;
        const dist = Math.hypot(dx, dy) || 1;
        const reach = 2.4;
        const push = b.z > -2 ? Math.max(0, reach - dist) / reach : 0;
        b.px += ((dx / dist) * push * 1.4 - b.px) * 0.08;
        b.py += ((dy / dist) * push * 1.4 - b.py) * 0.08;
      } else {
        b.px *= 0.94;
        b.py *= 0.94;
      }
      x += b.px;
      y += b.py;

      if (!still) {
        b.rx += b.vx * dt;
        b.ry += b.vy * dt;
        b.rz += b.vz * dt;
      }
      dummy.position.set(x, y, b.z);
      dummy.rotation.set(b.rx, b.ry, b.rz);
      dummy.scale.setScalar(b.s);
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    }
    mesh.current.instanceMatrix.needsUpdate = true;
    camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group}>
      <instancedMesh ref={mesh} args={[assets.geometry, assets.material, seeds.length]} frustumCulled={false} />
    </group>
  );
}
