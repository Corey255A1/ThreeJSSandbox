import * as THREE from '/three/build/three.module.js';

import { OBJLoader } from '/three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from '/three/examples/jsm/loaders/GLTFLoader.js';
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//var geometry = new THREE.BoxGeometry(2, 1, 1);
//var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
//var intersectables = [];
//const video = document.getElementById('video');
//video.play();
//const videoTexture = new THREE.VideoTexture(video);
//videoTexture.encoding = THREE.sRGBEncoding;
//var parameters = { color: 0xffffff, map: videoTexture };
//const videoMaterial = new THREE.MeshBasicMaterial(parameters);
////const videoMaterial = new THREE.MeshLambertMaterial(parameters);
//var cube = new THREE.Mesh(geometry, videoMaterial);
//var cube = new THREE.Mesh(geometry);
//scene.add(cube);
//intersectables.push(cube);
camera.position.z = 5;

//var linematerial = new THREE.LineBasicMaterial({ color: 0x00ffff });
//var linegeom = new THREE.Geometry();
//linegeom.vertices.push(new THREE.Vector3(-2, 0, 0));
//linegeom.vertices.push(new THREE.Vector3(0, 2, 0));
//linegeom.vertices.push(new THREE.Vector3(2, 0, 0));

//var line = new THREE.Line(linegeom, linematerial);

//scene.add(line);

var monkeyHead;
var buttonCube;

var gloader = new GLTFLoader();



var animixer;
var secs = 0;
//gloader.load('/models/boxmove.gltf',

//    function (box) {
//        buttonCube = box;
//        //var butt = new THREE.Mesh(buttonCube.geometry, videoMaterial);
//        buttonCube.scene.traverse(function (child) {
//            if (child.isMesh) child.material.map = videoTexture;
//        });
//        scene.add(buttonCube.scene);
//        //scene.add(butt);
//        buttonCube.scene.rotation.x = Math.PI;
//        buttonCube.scene.scale.x = 0.5;
//        console.log(buttonCube.animations);
//        //animixer = new THREE.AnimationMixer(buttonCube.scene);
//        //var action = animixer.clipAction(buttonCube.animations[0]);
//        //action.play();
//    }
//);

var switchModel;

gloader.load('/models/switch.glb',

    function (box) {
        switchModel = box;
        scene.add(switchModel.scene);
        switchModel.scene.rotation.x = Math.PI/2;
        switchModel.scene.rotation.y = Math.PI / 2;
        //intersectables.push(switchModel.scene);
        //switchModel.scene.scale.x = 0.5;
        console.log(switchModel.animations);
        animixer = new THREE.AnimationMixer(switchModel.scene);
        var action = animixer.clipAction(switchModel.animations[0]);
        action.play();
    }
);


//var objLoader = new OBJLoader(new THREE.LoadingManager(() => {
//    scene.add(monkeyHead);

//}));



//objLoader.load('/models/blenderMonkey.obj', (obj) => {
//    monkeyHead = obj;
//    monkeyHead.traverse(function (child) {
//        if (child.isMesh) child.material.map = videoTexture;
//    });
//});

var light = new THREE.AmbientLight(0x404040); // soft white light
scene.add(light);


var light2 = new THREE.PointLight(0x808080, 1, 100);
light2.position.set(0, 0, 2);
scene.add(light2);


renderer.gammaOutput = true;
renderer.gammaFactor = 2.2;

var raycaster = new THREE.Raycaster();

var INTERSECTED;
var mouse = new THREE.Vector2();
var newMouse = false;

function onDocumentMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
    newMouse = true;
    //console.log(mouse);
}
//document.addEventListener('mousemove', onDocumentMouseMove, false);
document.addEventListener('click', onDocumentMouseMove, false);

console.log(scene.children);

function animate() {
    requestAnimationFrame(animate);

    //console.log(mouse);
    if (newMouse) {

        newMouse = false;
        raycaster.setFromCamera(mouse, camera);
        var intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length > 0) {        
            if (INTERSECTED !== intersects[0].object) {
                INTERSECTED = intersects[0].object;
                console.log(INTERSECTED);
            }
        } else {
            INTERSECTED = null;
        }
    }




    renderer.render(scene, camera);
    //cube.rotation.x += 0.01;
    //cube.rotation.y += 0.01;
    //light2.position.x -= 0.05;
    //light2.position.y -= 0.1;
    //if (monkeyHead) monkeyHead.rotation.x += 0.02;
    if (animixer) animixer.setTime(0.08);//update(0.01);
    //if (buttonCube) { buttonCube.scene.rotation.x += 0.01; buttonCube.scene.rotation.y += 0.01; }
}
animate();