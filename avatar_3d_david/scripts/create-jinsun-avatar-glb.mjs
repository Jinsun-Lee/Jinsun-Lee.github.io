import fs from "node:fs";
import path from "node:path";
import * as THREE from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter.js";

globalThis.FileReader = class {
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then((buffer) => {
      this.result = buffer;
      this.onloadend?.();
    });
  }

  readAsDataURL(blob) {
    blob.arrayBuffer().then((buffer) => {
      const base64 = Buffer.from(buffer).toString("base64");
      this.result = `data:${blob.type || "application/octet-stream"};base64,${base64}`;
      this.onloadend?.();
    });
  }
};

const outArgIndex = process.argv.indexOf("--out");
const outPath =
  outArgIndex >= 0 && process.argv[outArgIndex + 1]
    ? path.resolve(process.argv[outArgIndex + 1])
    : path.resolve("src/assets/models/avatar-jinsun-custom.glb");

const scene = new THREE.Scene();

const mat = {
  skin: new THREE.MeshStandardMaterial({ color: "#f4bd91", roughness: 0.72 }),
  blush: new THREE.MeshStandardMaterial({ color: "#f1a48f", roughness: 0.9 }),
  hair: new THREE.MeshStandardMaterial({ color: "#171312", roughness: 0.78 }),
  hairLine: new THREE.MeshStandardMaterial({ color: "#2a2320", roughness: 0.86 }),
  denim: new THREE.MeshStandardMaterial({ color: "#1d4f7a", roughness: 0.82 }),
  denimFold: new THREE.MeshStandardMaterial({ color: "#8db1ca", roughness: 0.82 }),
  denimStitch: new THREE.MeshStandardMaterial({ color: "#d9a56c", roughness: 0.88 }),
  skirt: new THREE.MeshStandardMaterial({ color: "#d8b98c", roughness: 0.8 }),
  skirtStitch: new THREE.MeshStandardMaterial({ color: "#ead3b3", roughness: 0.86 }),
  belt: new THREE.MeshStandardMaterial({ color: "#5a3824", roughness: 0.75 }),
  buckle: new THREE.MeshStandardMaterial({ color: "#d7ad58", metalness: 0.15, roughness: 0.55 }),
  black: new THREE.MeshStandardMaterial({ color: "#1a1a1a", roughness: 0.68 }),
  dark: new THREE.MeshStandardMaterial({ color: "#2d1a1f", roughness: 0.72 }),
  white: new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.45 }),
  phone: new THREE.MeshStandardMaterial({ color: "#eadfec", roughness: 0.5 }),
  phoneEdge: new THREE.MeshStandardMaterial({ color: "#c7b1d6", roughness: 0.5 }),
  camera: new THREE.MeshStandardMaterial({ color: "#090b10", roughness: 0.35 }),
};

const root = new THREE.Group();
root.name = "jinsun-avatar-custom";
scene.add(root);

function addMesh(name, geometry, material, position, scale = [1, 1, 1], rotation = [0, 0, 0]) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.scale.set(...scale);
  mesh.rotation.set(...rotation);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  root.add(mesh);
  return mesh;
}

function capsule(name, radius, length, material, position, rotation = [0, 0, 0], scale = [1, 1, 1]) {
  return addMesh(name, new THREE.CapsuleGeometry(radius, length, 24, 32), material, position, scale, rotation);
}

function sphere(name, material, position, scale) {
  return addMesh(name, new THREE.SphereGeometry(1, 48, 32), material, position, scale);
}

function box(name, material, position, scale, rotation = [0, 0, 0]) {
  return addMesh(name, new THREE.BoxGeometry(1, 1, 1), material, position, scale, rotation);
}

function cylinder(name, radiusTop, radiusBottom, height, material, position, scale = [1, 1, 1], rotation = [0, 0, 0]) {
  return addMesh(name, new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 48), material, position, scale, rotation);
}

// Legs, socks, and sneakers
capsule("left-leg", 0.16, 0.95, mat.skin, [-0.27, 0.9, 0], [0, 0, 0], [0.92, 1, 0.92]);
capsule("right-leg", 0.16, 0.95, mat.skin, [0.27, 0.9, 0], [0, 0, 0], [0.92, 1, 0.92]);
cylinder("left-sock", 0.17, 0.17, 0.24, mat.white, [-0.27, 0.47, 0]);
cylinder("right-sock", 0.17, 0.17, 0.24, mat.white, [0.27, 0.47, 0]);
box("left-shoe", mat.white, [-0.31, 0.25, 0.12], [0.36, 0.2, 0.58]);
box("right-shoe", mat.white, [0.31, 0.25, 0.12], [0.36, 0.2, 0.58]);
box("left-shoe-sole", mat.black, [-0.31, 0.18, 0.1], [0.4, 0.08, 0.62]);
box("right-shoe-sole", mat.black, [0.31, 0.18, 0.1], [0.4, 0.08, 0.62]);

// A-line skirt and belt
cylinder("beige-a-line-skirt", 0.5, 0.86, 0.88, mat.skirt, [0, 1.4, 0]);
cylinder("belt", 0.58, 0.59, 0.11, mat.belt, [0, 1.9, 0]);
box("belt-buckle", mat.buckle, [0, 1.91, 0.6], [0.24, 0.14, 0.045]);
box("belt-loop-left", mat.skirtStitch, [-0.29, 1.89, 0.6], [0.045, 0.2, 0.03]);
box("belt-loop-right", mat.skirtStitch, [0.29, 1.89, 0.6], [0.045, 0.2, 0.03]);
box("skirt-front-seam", mat.skirtStitch, [0, 1.38, 0.86], [0.035, 0.72, 0.018]);
box("skirt-hem", mat.skirtStitch, [0, 0.96, 0.76], [1.36, 0.035, 0.025]);

// Denim shirt
cylinder("denim-shirt", 0.48, 0.6, 0.82, mat.denim, [0, 2.3, 0]);
box("shirt-collar-left", mat.denimFold, [-0.18, 2.73, 0.45], [0.3, 0.08, 0.12], [0.2, 0, 0.46]);
box("shirt-collar-right", mat.denimFold, [0.18, 2.73, 0.45], [0.3, 0.08, 0.12], [0.2, 0, -0.46]);
box("shirt-placket", mat.denimFold, [0, 2.32, 0.58], [0.055, 0.62, 0.035]);
for (const y of [2.56, 2.38, 2.2, 2.02]) {
  sphere("shirt-button", mat.white, [0, y, 0.61], [0.035, 0.035, 0.012]);
}
box("shirt-pocket", mat.denim, [0.28, 2.37, 0.61], [0.22, 0.18, 0.025]);
box("shirt-pocket-stitch", mat.denimStitch, [0.28, 2.28, 0.63], [0.2, 0.018, 0.012]);
box("left-shirt-stitch", mat.denimStitch, [-0.34, 2.31, 0.55], [0.018, 0.64, 0.012]);
box("right-shirt-stitch", mat.denimStitch, [0.34, 2.31, 0.55], [0.018, 0.64, 0.012]);

// Arms: phone hand and thumbs-up hand
capsule("left-upper-arm", 0.14, 0.46, mat.skin, [-0.68, 2.48, 0.08], [0.2, 0.0, -0.75]);
capsule("left-rolled-sleeve", 0.17, 0.17, mat.denimFold, [-0.48, 2.58, 0.05], [0.2, 0.0, -0.75]);
capsule("left-forearm", 0.13, 0.5, mat.skin, [-0.8, 2.1, 0.24], [1.0, -0.02, -0.28]);
sphere("left-hand", mat.skin, [-0.82, 1.83, 0.42], [0.17, 0.15, 0.14]);

capsule("right-upper-arm", 0.14, 0.44, mat.skin, [0.68, 2.48, 0.06], [0.15, 0.0, 0.7]);
capsule("right-rolled-sleeve", 0.17, 0.17, mat.denimFold, [0.49, 2.59, 0.05], [0.15, 0.0, 0.7]);
capsule("right-forearm", 0.13, 0.44, mat.skin, [0.83, 2.18, 0.28], [1.0, 0.08, 0.18]);
sphere("right-hand", mat.skin, [0.84, 1.92, 0.44], [0.16, 0.14, 0.13]);
capsule("thumbs-up", 0.055, 0.3, mat.skin, [0.88, 2.15, 0.44], [0, 0, -0.2], [1, 1, 1]);

// Phone and S Pen
box("pale-lavender-samsung-galaxy-s23-ultra", mat.phone, [-0.88, 1.98, 0.58], [0.3, 0.55, 0.045], [0, 0.12, -0.08]);
box("phone-edge", mat.phoneEdge, [-0.88, 1.98, 0.61], [0.32, 0.57, 0.018], [0, 0.12, -0.08]);
for (const [x, y, r] of [
  [-0.99, 2.16, 0.045],
  [-0.99, 2.02, 0.043],
  [-0.99, 1.88, 0.043],
  [-0.87, 2.11, 0.03],
  [-0.87, 1.99, 0.03],
]) {
  cylinder("phone-camera", r, r, 0.018, mat.camera, [x, y, 0.61], [1, 1, 1], [Math.PI / 2, 0, 0]);
}
box("samsung-wordmark-block", mat.white, [-0.9, 1.78, 0.605], [0.16, 0.025, 0.01]);
capsule("s-pen", 0.016, 0.46, mat.phoneEdge, [-0.66, 1.91, 0.54], [0.08, 0, -0.18]);

// Neck, head, face
cylinder("neck", 0.18, 0.2, 0.25, mat.skin, [0, 2.78, 0]);
sphere("head", mat.skin, [0, 3.38, 0.03], [0.64, 0.72, 0.56]);
sphere("hair-back", mat.hair, [0, 3.3, -0.1], [0.76, 0.95, 0.54]);
sphere("hair-left-front", mat.hair, [-0.24, 3.6, 0.35], [0.4, 0.26, 0.12]);
sphere("hair-right-front", mat.hair, [0.24, 3.6, 0.35], [0.4, 0.26, 0.12]);
capsule("center-hair-part-left", 0.018, 0.52, mat.hairLine, [-0.06, 3.74, 0.55], [1.22, 0, 0.18]);
capsule("center-hair-part-right", 0.018, 0.52, mat.hairLine, [0.06, 3.74, 0.55], [1.22, 0, -0.18]);
for (const x of [-0.44, -0.34, -0.24, 0.24, 0.34, 0.44]) {
  capsule("front-hair-strand", 0.012, 0.42, mat.hairLine, [x, 3.42, 0.54], [1.15, 0, x < 0 ? -0.22 : 0.22]);
}
capsule("left-long-hair", 0.18, 1.55, mat.hair, [-0.62, 2.78, 0.0], [0.02, 0.1, -0.03], [0.9, 1, 0.8]);
capsule("right-long-hair", 0.18, 1.55, mat.hair, [0.62, 2.78, 0.0], [0.02, -0.1, 0.03], [0.9, 1, 0.8]);

sphere("left-eye", mat.dark, [-0.23, 3.42, 0.56], [0.11, 0.13, 0.03]);
sphere("right-eye", mat.dark, [0.23, 3.42, 0.56], [0.11, 0.13, 0.03]);
sphere("left-eye-highlight", mat.white, [-0.19, 3.48, 0.59], [0.03, 0.035, 0.01]);
sphere("right-eye-highlight", mat.white, [0.27, 3.48, 0.59], [0.03, 0.035, 0.01]);
capsule("left-eyebrow", 0.025, 0.17, mat.hair, [-0.25, 3.62, 0.57], [Math.PI / 2, 0.1, Math.PI / 2 + 0.12]);
capsule("right-eyebrow", 0.025, 0.17, mat.hair, [0.25, 3.63, 0.57], [Math.PI / 2, -0.1, Math.PI / 2 - 0.12]);
sphere("left-blush", mat.blush, [-0.39, 3.28, 0.56], [0.11, 0.045, 0.012]);
sphere("right-blush", mat.blush, [0.39, 3.28, 0.56], [0.11, 0.045, 0.012]);
box("mouth-shadow", mat.dark, [0, 3.22, 0.595], [0.44, 0.12, 0.018]);
box("toothy-grin", mat.white, [0, 3.213, 0.611], [0.39, 0.07, 0.018]);

// Headset around neck
capsule("headset-band", 0.035, 0.68, mat.black, [0, 2.78, 0.2], [Math.PI / 2, 0, Math.PI / 2], [1, 1, 1]);
sphere("left-headset-cup", mat.black, [-0.31, 2.68, 0.34], [0.16, 0.18, 0.1]);
sphere("right-headset-cup", mat.black, [0.31, 2.68, 0.34], [0.16, 0.18, 0.1]);

// Sneaker details
for (const x of [-0.31, 0.31]) {
  box("shoe-toe-cap", mat.white, [x, 0.26, 0.42], [0.31, 0.12, 0.16]);
  box("shoe-lace-horizontal", mat.black, [x, 0.34, 0.16], [0.22, 0.015, 0.02]);
  box("shoe-lace-left", mat.black, [x - 0.045, 0.34, 0.17], [0.018, 0.015, 0.16], [0, 0.35, 0]);
  box("shoe-lace-right", mat.black, [x + 0.045, 0.34, 0.17], [0.018, 0.015, 0.16], [0, -0.35, 0]);
}

// Simple labels as mesh names only, no visible text in the model.
root.scale.setScalar(1.15);
root.position.y = -0.35;

const exporter = new GLTFExporter();
const glb = await exporter.parseAsync(scene, {
  binary: true,
  trs: false,
  onlyVisible: true,
});

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, Buffer.from(glb));
console.log(`Wrote ${outPath}`);
