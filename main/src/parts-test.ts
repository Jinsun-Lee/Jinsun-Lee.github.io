import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type ModelDef = { label: string; url: string; rotateY?: number };

const MODELS: ModelDef[] = [
  { label: "avatar (composed)", url: "/testmodels/avatar.glb" },
  { label: "ori_avatar", url: "/testmodels/ori_avatar.glb" },
  { label: "detail_avatar", url: "/testmodels/detail_avatar.glb", rotateY: -Math.PI / 2 },
  { label: "detail_avatar_v2", url: "/testmodels/detail_avatar_v2.glb", rotateY: -Math.PI / 2 },
];

const TARGET_H = 2.2; // normalize every model to this height
const SPACING = 3.4;

const view = document.getElementById("view")!;
const panel = document.getElementById("panel")!;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
view.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeee7da);
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 5000);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.HemisphereLight(0xffffff, 0x555555, 2.2));
const dir = new THREE.DirectionalLight(0xffffff, 2.0);
dir.position.set(4, 10, 6);
scene.add(dir);

function makeLabel(text: string): THREE.Sprite {
  const cv = document.createElement("canvas");
  cv.width = 512;
  cv.height = 128;
  const ctx = cv.getContext("2d")!;
  ctx.fillStyle = "rgba(40,40,40,0.7)";
  ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 44px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, cv.width / 2, cv.height / 2);
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false }));
  spr.scale.set(2.0, 0.5, 1);
  return spr;
}

const loader = new GLTFLoader();

async function loadAll() {
  const status = document.createElement("div");
  status.id = "hint";
  status.textContent = "로딩 중... (detail_avatar_v2 는 29MB라 느릴 수 있음)";
  panel.appendChild(status);

  const n = MODELS.length;
  const results = await Promise.all(
    MODELS.map((m) =>
      loader
        .loadAsync(m.url)
        .then((g) => ({ m, g }))
        .catch((e) => {
          console.error("load fail", m.url, e);
          return null;
        }),
    ),
  );

  results.forEach((r, i) => {
    if (!r) return;
    const root = r.g.scene;

    if (r.m.rotateY) {
      root.rotation.y = -r.m.rotateY;
      root.updateMatrixWorld(true);
    }

    // ground + center on its own origin
    let box = new THREE.Box3().setFromObject(root);
    const c = box.getCenter(new THREE.Vector3());
    root.position.x -= c.x;
    root.position.z -= c.z;
    root.position.y -= box.min.y;
    root.updateMatrixWorld(true);

    box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const h = size.y || 1;

    // normalize height, place in a row along X
    const group = new THREE.Group();
    group.add(root);
    group.scale.setScalar(TARGET_H / h);
    group.position.x = (i - (n - 1) / 2) * SPACING;
    scene.add(group);

    const parts: Part[] = [];
    root.traverse((o) => {
      const mm = o as THREE.Mesh;
      if (mm.isMesh) {
        mm.frustumCulled = false;
        parts.push(partInfo(mm));
      }
    });

    const label = makeLabel(r.m.label);
    label.position.set(group.position.x, TARGET_H + 0.45, 0);
    scene.add(label);

    buildModelPanel(r.m.label, h, parts);
  });

  // ground grid spanning the row
  const grid = new THREE.GridHelper(SPACING * n + TARGET_H, Math.round(SPACING * n + TARGET_H) * 2, 0xbfb6a6, 0xd8d0c2);
  scene.add(grid);

  // frame the whole row from the front (-Z)
  const all = new THREE.Box3().setFromObject(scene);
  const size = all.getSize(new THREE.Vector3());
  const center = all.getCenter(new THREE.Vector3());
  const dist = Math.max(size.x, size.y) * 1.3 + 2;
  controls.target.set(center.x, TARGET_H * 0.5, 0);
  camera.position.set(center.x, TARGET_H * 0.65, -dist);
  camera.near = 0.01;
  camera.far = dist * 20;
  camera.updateProjectionMatrix();
  controls.update();

  status.textContent = "왼쪽→오른쪽 순서. 드래그=회전, 휠=줌, 우클릭=이동. 정면=-Z. 높이는 비교용으로 정규화함.";
}

type Part = {
  mesh: THREE.Mesh;
  name: string;
  color: string | null; // css hex, null if no solid color
  textured: boolean;
  row?: HTMLElement;
};

function partInfo(mesh: THREE.Mesh): Part {
  const mat = (Array.isArray(mesh.material) ? mesh.material[0] : mesh.material) as
    | (THREE.Material & { color?: THREE.Color; map?: THREE.Texture | null })
    | undefined;
  const color = mat?.color ? "#" + mat.color.getHexString() : null;
  return { mesh, name: mesh.name || "(unnamed)", color, textured: !!mat?.map };
}

function swatch(part: Part): HTMLElement {
  const s = document.createElement("span");
  s.className = "sw";
  if (part.textured) s.style.background = "repeating-linear-gradient(45deg,#cbb,#cbb 3px,#977 3px,#977 6px)";
  else s.style.background = part.color ?? "#bbb";
  return s;
}

function buildModelPanel(label: string, origH: number, parts: Part[]) {
  const section = document.createElement("div");
  section.className = "model";

  const head = document.createElement("div");
  head.className = "model-head";
  head.innerHTML = `${label} <span class="muted">${parts.length}개 · h ${origH.toFixed(2)}</span>`;
  section.appendChild(head);

  const refresh = () => {
    for (const p of parts) p.row?.classList.toggle("off", !p.mesh.visible);
  };

  const actions = document.createElement("div");
  actions.className = "actions";
  const allBtn = document.createElement("button");
  allBtn.textContent = "전체";
  allBtn.onclick = () => {
    parts.forEach((p) => (p.mesh.visible = true));
    refresh();
  };
  const noneBtn = document.createElement("button");
  noneBtn.textContent = "끄기";
  noneBtn.onclick = () => {
    parts.forEach((p) => (p.mesh.visible = false));
    refresh();
  };
  actions.append(allBtn, noneBtn);
  section.appendChild(actions);

  // group by color (textured parts share the "texture" group)
  const groups = new Map<string, Part[]>();
  for (const p of parts) {
    const key = p.textured ? "texture" : (p.color ?? "none");
    (groups.get(key) ?? groups.set(key, []).get(key)!).push(p);
  }

  groups.forEach((groupParts, key) => {
    const gRow = document.createElement("div");
    gRow.className = "row group";
    const nm = document.createElement("span");
    nm.className = "nm";
    nm.textContent = `${key} (${groupParts.length})`;
    gRow.append(swatch(groupParts[0]!), nm);
    gRow.onclick = () => {
      const turnOn = groupParts.some((p) => !p.mesh.visible);
      groupParts.forEach((p) => (p.mesh.visible = turnOn));
      refresh();
    };
    section.appendChild(gRow);

    for (const p of groupParts) {
      const row = document.createElement("div");
      row.className = "row part";
      const nm2 = document.createElement("span");
      nm2.className = "nm";
      nm2.textContent = p.name;
      row.append(swatch(p), nm2);
      row.onclick = () => {
        p.mesh.visible = !p.mesh.visible;
        refresh();
      };
      p.row = row;
      section.appendChild(row);
    }
  });

  panel.appendChild(section);
}

loadAll();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
