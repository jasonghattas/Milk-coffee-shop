import * as THREE from "three";

/** Cup dimensions, shared by the cup, its contents and the pour. */
export const CUP = { height: 2, rTop: 0.78, rBottom: 0.56, wall: 0.04 };

/** Radius of the cup's outer wall at height y (y runs from -1 to 1). */
export function cupRadiusAt(y: number): number {
  const k = THREE.MathUtils.clamp((y + CUP.height / 2) / CUP.height, 0, 1);
  return CUP.rBottom + (CUP.rTop - CUP.rBottom) * k;
}

const BEAN = { width: 0.74, front: 0.44, back: 0.6, groove: 0.6, grooveWidth: 0.2 };

/** Depth of the bean at a point of the unit sphere it is shaped from. */
function beanDepth(x: number, y: number, z: number): number {
  if (z <= 0) return z * BEAN.back;
  const crease = Math.exp(-(x * x) / (BEAN.grooveWidth * BEAN.grooveWidth));
  return z * BEAN.front * (1 - BEAN.groove * crease * (1 - 0.3 * y * y));
}

/**
 * One half of a coffee bean: half an ellipsoid, flattened on the creased
 * side, with the crease itself formed where the two halves meet.
 * side = 1 is the half on +x, side = -1 the half on -x.
 */
export function halfBeanGeometry(side: 1 | -1, segments: number): THREE.BufferGeometry {
  const g = new THREE.SphereGeometry(1, segments, Math.round(segments * 0.75), 0, Math.PI);
  g.rotateY((side * Math.PI) / 2);
  const p = g.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i);
    const y = p.getY(i);
    const z = p.getZ(i);
    const crease = Math.exp(-(x * x) / (BEAN.grooveWidth * BEAN.grooveWidth));
    // A slight S-bend along the crease, as on a real bean.
    const bend = z > 0 ? 0.05 * Math.sin(y * Math.PI) * crease * z : 0;
    const lip = z > 0 ? side * 0.05 * crease * z : 0;
    p.setXYZ(i, x * BEAN.width + lip + bend, y, beanDepth(x, y, z));
  }
  g.computeVertexNormals();
  return g;
}

/** The pale inner face revealed when the bean splits. */
export function beanCutGeometry(): THREE.BufferGeometry {
  const shape = new THREE.Shape();
  const steps = 72;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const y = Math.cos(t);
    const z = beanDepth(0, y, Math.sin(t));
    if (i === 0) shape.moveTo(z, y);
    else shape.lineTo(z, y);
  }
  const g = new THREE.ShapeGeometry(shape, 1);
  g.rotateY(-Math.PI / 2);
  return g;
}

/** Path the coffee takes: out of the bean, up around the cup, over the rim and in. */
export function pourCurve(): THREE.CatmullRomCurve3 {
  const points: THREE.Vector3[] = [];
  const n = 96;
  const smooth = (q: number) => q * q * (3 - 2 * q);
  for (let i = 0; i <= n; i++) {
    const p = i / n;
    const angle = p * Math.PI * 2 * 2.6;
    let r: number;
    let y: number;
    if (p < 0.25) {
      const e = smooth(p / 0.25);
      r = 1.25 * e;
      y = -1.15 * e;
    } else if (p < 0.8) {
      const q = (p - 0.25) / 0.55;
      r = 1.25 - 0.1 * q;
      y = -1.15 + q * 2.75;
    } else {
      const q = (p - 0.8) / 0.2;
      const e = smooth(q);
      r = 1.15 * (1 - e);
      y = 1.6 + Math.sin(q * Math.PI) * 0.25 - e * 0.95;
    }
    points.push(new THREE.Vector3(Math.sin(angle) * r, y, Math.cos(angle) * r));
  }
  return new THREE.CatmullRomCurve3(points);
}

/** Fine grain for the roasted surface, used as a bump map. */
export function roastTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 2600; i++) {
    const v = 90 + Math.random() * 90;
    ctx.fillStyle = `rgba(${v},${v},${v},${0.18 + Math.random() * 0.3})`;
    const r = 0.6 + Math.random() * 2.4;
    ctx.beginPath();
    ctx.ellipse(Math.random() * size, Math.random() * size, r * 2.2, r, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 2);
  return texture;
}

/** Soft yellow halo behind the cup, like the backlight of the shop sign. */
export function haloTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(247,226,27,0.55)");
  g.addColorStop(0.35, "rgba(247,226,27,0.16)");
  g.addColorStop(1, "rgba(247,226,27,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

/**
 * The cup's wrap: milk-white with the wordmark printed on it. The logo
 * image is drawn untouched, only placed and sized.
 */
export function cupWrapTexture(logo: HTMLImageElement): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#f1ede2";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const w = 600;
  const h = (w * logo.height) / logo.width;
  ctx.drawImage(logo, canvas.width / 2 - w / 2, canvas.height / 2 - h / 2 - 10, w, h);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}
