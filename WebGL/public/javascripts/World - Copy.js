import * as THREE from '/three/build/three.module.js';
import { GLTFLoader } from '/three/examples/jsm/loaders/GLTFLoader.js';
//import { OrbitControls } from '/three/examples/jsm/controls/OrbitControls.js';
import { MapControls } from '/three/examples/jsm/controls/OrbitControls.js';
var scene;
var camera;
var cameraControls;
var renderer;
var glftloader;
var raycaster;
const Pages = {
    page1: {
        location: {x:0, y:0, z:0},
        size: { w: 640, h: 480, d: 10 },
        background: {color: 0xFFFFFF}
    }
};
function createGround() {
    var gg = new THREE.PlaneBufferGeometry(16000, 16000);
    var gm = new THREE.MeshPhongMaterial({ color: 0x00FF00 });
    var ground = new THREE.Mesh(gg, gm);
    //make it flat on the ground
    ground.rotation.x = - Math.PI / 2;

    //add shadows
    ground.receiveShadow = true;

    scene.add(ground);
}
function createBox() {
    var geometry = new THREE.BoxBufferGeometry(1, 1, 1);
    var material = new THREE.MeshPhongMaterial({ color: 0x00ff33 });
    var cube = new THREE.Mesh(geometry, material);
    cube.receiveShadow = true;
    cube.castShadow = true;
    scene.add(cube);
}

function loadWunderVision() {
    glftloader.load("/models/wundervision.glb", (obj) => {
        scene.add(obj.scene);
    });
}
function loadArrow() {
    glftloader.load("/models/ArrowButton.glb", (obj) => {
        scene.add(obj.scene);
    });
}

function createLights() {
    scene.add(new THREE.AmbientLight(0x333333));
    var light = new THREE.PointLight(0xFFFFFF, 1, 10, 1);
    light.position.set(2, 2, 2);
    //Not seeing shadows yet...
    light.castShadow = true;
    light.shadow.camera.near = .1;
    light.shadow.camera.far = 25;

    scene.add(light);
}

function init() {
    scene = new THREE.Scene();
    raycaster = new THREE.Raycaster();
    scene.background = new THREE.Color(0x0022FF);
    scene.fog = new THREE.Fog(0xffffff, 1000, 4000);
    glftloader = new GLTFLoader();
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.gammaOutput = true;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.y = 2;
    camera.position.x = -2;
    //cameraControls = new OrbitControls(camera, renderer.domElement);
    //cameraControls.target.set(0, 0, 0);
    //cameraControls.update();
    cameraControls = new MapControls(camera, renderer.domElement);
    //cameraControls.enableDamping = true;
    //cameraControls.dampingFactor = 0.05;
    cameraControls.zoomSpeed = 0.5;
    cameraControls.screenSpacePanning = false;
    cameraControls.minDistance = 0;
    cameraControls.maxDistance = 500;
    cameraControls.maxPolarAngle = Math.PI / 2;
    
    
    createLights();
    createGround();
    //createBox();
    loadArrow();
    loadWunderVision();

    document.body.appendChild(renderer.domElement);
    window.addEventListener('resize', onWindowResize, false);
    onWindowResize();
}

function animate() {
    window.requestAnimationFrame(animate);
    render();
}
function render() {
    //raycaster.setFromCamera(mouse, camera);
    //var intersects = raycaster.intersectObjects(scene.children, true);
    renderer.render(scene, camera);
}


function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
animate();