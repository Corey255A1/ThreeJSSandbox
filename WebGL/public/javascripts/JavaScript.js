import * as THREE from '/three/build/three.module.js';

import { OBJLoader } from '/three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from '/three/examples/jsm/loaders/GLTFLoader.js';
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(2, 1, 1);
var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

var linematerial = new THREE.LineBasicMaterial({ color: 0x00ffff });
var linegeom = new THREE.Geometry();
linegeom.vertices.push(new THREE.Vector3(-2, 0, 0));
linegeom.vertices.push(new THREE.Vector3(0, 2, 0));
linegeom.vertices.push(new THREE.Vector3(2, 0, 0));

var line = new THREE.Line(linegeom, linematerial);

scene.add(line);

var monkeyHead;
var buttonCube;

var gloader = new GLTFLoader();



var animixer;
var secs = 0;
gloader.load('/models/boxmove.gltf',

    function (box) {
        buttonCube = box;
        scene.add(buttonCube.scene);
        console.log(buttonCube.animations);
        animixer = new THREE.AnimationMixer(buttonCube.scene);
        var action = animixer.clipAction(buttonCube.animations[0]);
        action.play();
    }
);



var objLoader = new OBJLoader(new THREE.LoadingManager(() => {
    scene.add(monkeyHead);
}));



objLoader.load('/models/blenderMonkey.obj', (obj) => { monkeyHead = obj; });

var light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);


var light2 = new THREE.PointLight(0xff0000, 1, 100);
light2.position.set(0, 0, 0);
scene.add(light2);


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    //cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    light2.position.x -= 0.05;
    light2.position.y -= 0.1;
    if (monkeyHead) monkeyHead.rotation.x += 0.02;
    if (animixer) animixer.update(0.01);
    //cube.rotation.z += 0.01;
}
animate();