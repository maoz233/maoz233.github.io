import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Canvas
const canvas = document.querySelector("canvas#canvas") as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 2, 3);
scene.add(camera);

// orbit Contorls
const orbitContorls = new OrbitControls(camera, canvas);
orbitContorls.enableDamping = true;

// Light
const directional = new THREE.DirectionalLight(0xffffff, 3.0);
directional.position.set(2, 2, 3);
scene.add(directional);

// Mesh
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial()
);
cube.rotation.y = -Math.PI * 0.25;
scene.add(cube);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Tick
const tick = () => {
  // Update controls
  orbitContorls.update();

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

window.requestAnimationFrame(tick);

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});
