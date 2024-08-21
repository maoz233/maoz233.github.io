import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Timer } from "three/examples/jsm/misc/Timer";
import GUI from "lil-gui";
import earthVertexShader from "@/shaders/earth.vert.glsl";
import earthFragmentShader from "@/shaders/earth.frag.glsl";
import atmosphereVertexShader from "@/shaders/atmosphere.vert.glsl";
import atmosphereFragmentShader from "@/shaders/atmosphere.frag.glsl";

// Debug
const debugObj = {
  earth: {
    atmosphereDayColor: "#00aaff",
    atmosphereTwilightColor: "#ff6600",
  },
};
const gui = new GUI({ width: 300 });
if (window.location.hash !== "#debug") {
  gui.hide();
}

// Canvas
const canvas = document.querySelector("canvas#canvas") as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

// Loaders
const textureLoader = new THREE.TextureLoader();

// Earth: Texture
const earthDayTexture = textureLoader.load("/textures/earth/day.jpg");
earthDayTexture.colorSpace = THREE.SRGBColorSpace;
earthDayTexture.anisotropy = 8;

const earthNightTexture = textureLoader.load("/textures/earth/night.jpg");
earthNightTexture.colorSpace = THREE.SRGBColorSpace;
earthNightTexture.anisotropy = 8;

const earthSpecularCloudsTexture = textureLoader.load(
  "/textures/earth/specularClouds.jpg"
);
earthNightTexture.anisotropy = 8;

// Earth: Mesh
const earthGeometry = new THREE.SphereGeometry(2, 64, 64);
const earthMaterial = new THREE.ShaderMaterial({
  vertexShader: earthVertexShader,
  fragmentShader: earthFragmentShader,
  uniforms: {
    uDayTexture: new THREE.Uniform(earthDayTexture),
    uNightTexture: new THREE.Uniform(earthNightTexture),
    uSpecularCloudsTexture: new THREE.Uniform(earthSpecularCloudsTexture),
    uAtmosphereDayColor: new THREE.Uniform(
      new THREE.Color(debugObj.earth.atmosphereDayColor)
    ),
    uAtmosphereTwilightColor: new THREE.Uniform(
      new THREE.Color(debugObj.earth.atmosphereTwilightColor)
    ),
  },
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
scene.add(earth);
const guiEarth = gui.addFolder("Earth");
guiEarth
  .addColor(debugObj.earth, "atmosphereDayColor")
  .name("Atmosphere Day")
  .onChange(() => {
    earthMaterial.uniforms.uAtmosphereDayColor.value.set(
      debugObj.earth.atmosphereDayColor
    );
    atmosphereMaterial.uniforms.uAtmosphereDayColor.value.set(
      debugObj.earth.atmosphereDayColor
    );
  });
guiEarth
  .addColor(debugObj.earth, "atmosphereTwilightColor")
  .name("Atmosphere Twilight")
  .onChange(() => {
    earthMaterial.uniforms.uAtmosphereTwilightColor.value.set(
      debugObj.earth.atmosphereTwilightColor
    );
    atmosphereMaterial.uniforms.uAtmosphereDayColor.value.set(
      debugObj.earth.atmosphereDayColor
    );
  });

// Atmosphere
const atmosphereMaterial = new THREE.ShaderMaterial({
  vertexShader: atmosphereVertexShader,
  fragmentShader: atmosphereFragmentShader,
  uniforms: {
    uAtmosphereDayColor: new THREE.Uniform(
      new THREE.Color(debugObj.earth.atmosphereDayColor)
    ),
    uAtmosphereTwilightColor: new THREE.Uniform(
      new THREE.Color(debugObj.earth.atmosphereTwilightColor)
    ),
  },
  side: THREE.BackSide,
  transparent: true,
});
const atmosphere = new THREE.Mesh(earthGeometry, atmosphereMaterial);
atmosphere.scale.set(1.04, 1.04, 1.04);
scene.add(atmosphere);

// Camera
const camera = new THREE.PerspectiveCamera(
  25,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(12, 5, 4);
scene.add(camera);

// Orbit Contorls
const orbitContorls = new OrbitControls(camera, canvas);
orbitContorls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Timer
const timer = new Timer();

// Tick
const tick = (timestamp: number) => {
  // Update timer
  timer.update(timestamp);

  // Elapsed time
  const elapsedTime = timer.getElapsed();

  // Update Earth
  earth.rotation.y = elapsedTime * 0.1;

  // Update controls
  orbitContorls.update();

  // Render
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

window.requestAnimationFrame(tick);

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
});

// Fullscreen
const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

window.addEventListener("dblclick", () => {
  toggleFullScreen();
});

window.addEventListener("keydown", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    toggleFullScreen();
  }
});
