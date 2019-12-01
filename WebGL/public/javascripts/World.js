import * as THREE from '/three/build/three.module.js';
import { GLTFLoader } from '/three/examples/jsm/loaders/GLTFLoader.js';
//import { OrbitControls } from '/three/examples/jsm/controls/OrbitControls.js';
import { MapControls } from '/three/examples/jsm/controls/OrbitControls.js';

const Pages = {
    background: { color: 0x0D0D0D },
    pages: [
        {
            rotation: { x: 1, y: -1, z: 0.3 },
            location: {x:-1, y:100, z:3},
            size: { w: 64, h: 48, d: 1 },
            background: {color: 0xFF0000 }
        }
    ]
};

const Models = ["/models/wundervision.glb", "/models/ArrowButton.glb"];

class Page {
    constructor(page, pagebox) {
        this.Location = page.location;
        this.Rotation = page.rotation;
        this.Size = page.size;
        this.Background = page.background;
        this.Scene = new THREE.Scene();
        this.Scene.position.x = page.location.x;
        this.Scene.position.y = page.location.y;
        this.Scene.position.z = page.location.z;
        this.Scene.add(pagebox);
        this.Scene.rotation.set(this.Rotation.x, this.Rotation.y, this.Rotation.z);
        this.Scene.updateMatrixWorld(true);
    }

    add(obj) {
        obj.position.x -= this.Size.w / 2;
        obj.position.z -= this.Size.h / 2;
        obj.position.y += this.Size.d;
        this.Scene.add(obj);
    }

    setViewFocus(camera) {
        var d = (this.Size.h / 2) / Math.atan(37.5 * Math.PI / 180);
        var vec = new THREE.Vector3(0,d,0);                
        var vec2 = this.Scene.localToWorld(vec);                
        camera.position.copy(vec2);
        var vec3 = new THREE.Vector3();
        this.Scene.getWorldDirection(vec3);
        vec3.multiplyScalar(-1);
        camera.up = vec3;
        camera.lookAt(this.Scene.position);
    }

}


class PageCreator {
    constructor(pages) {

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
 
        this.raycaster = new THREE.Raycaster();

        this.scene.background = new THREE.Color(0x0022FF);
        this.scene.fog = new THREE.Fog(0xffffff, 1000, 4000);
        this.Meshes = {};
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.gammaOutput = true;

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.BasicShadowMap;

        document.getElementById("scrollUp").addEventListener("click", () => {
            this.camera.translateY(10);
        });
        document.getElementById("scrollDown").addEventListener("click", () => {
            this.camera.translateY(-10);
        });


        //this.cameraControls = new MapControls(this.camera, this.renderer.domElement);   
        //this.cameraControls.zoomSpeed = 0.2;
        //this.cameraControls.screenSpacePanning = false;
        //this.cameraControls.minDistance = 10;
        //this.cameraControls.maxDistance = 500;


        this.createLights();
        this.createGround(pages.background);


        this.loadingManager = new THREE.LoadingManager();
        this.loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {

            console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

        };
        this.loadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {

            console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

        };

        this.loadingManager.onLoad = ()=>{

            console.log('Loading complete!');

            pages.pages.forEach((p) => {
                let page = this.createPage(p);
                page.add(this.createObject("/models/wundervision.glb", { w: 1, h: 1, d: 1 }, { x: 0, y: 0, z: 0 }));
                page.add(this.createObject("/models/ArrowButton.glb", { w: 1, h: 1, d: 1 }, { x: 24, y: 24, z: 0 }));

                //var vec = new THREE.Vector3(0,125,0);                
                //var vec2 = page.Scene.localToWorld(vec);                
                //this.camera.position.copy(vec2);
                //var vec3 = new THREE.Vector3();
                //page.Scene.getWorldDirection(vec3);
                //vec3.multiplyScalar(-1);
                //this.camera.up = vec3;
                //this.camera.lookAt(page.Scene.position);
                page.setViewFocus(this.camera);
                //this.cameraControls.target.copy(page.Scene.position);
                //this.cameraControls.update();
                

            });

            
            //this.createObject("/models/wundervision.glb", { w: 1, h: 1, d: 1 }, { x: 0, y: 0, z: 0 });

        };
        this.glftloader = new GLTFLoader(this.loadingManager);
        Models.forEach((m) => {
            this.glftloader.load(m, (o) => {
                this.Meshes[m] = o.scene;
            });
        });


        document.body.appendChild(this.renderer.domElement);
        window.addEventListener('resize', () => { this.onWindowResize(); }, false);
        this.onWindowResize();        
    }

    createGround(color) {
        var gg = new THREE.PlaneBufferGeometry(16000, 16000);
        var gm = new THREE.MeshPhongMaterial({ color: color });
        var ground = new THREE.Mesh(gg, gm);
        //make it flat on the ground
        ground.rotation.x = - Math.PI / 2;
        //add shadows
        ground.receiveShadow = true;
        this.scene.add(ground);
    }
    createBox(size, location, color) {
        var geometry = new THREE.BoxBufferGeometry(size.w, size.d, size.h);
        var material = new THREE.MeshPhongMaterial({ color: color });
        var cube = new THREE.Mesh(geometry, material);
        cube.position.x = location.x;
        cube.position.y = location.y + size.d/2;
        cube.position.z = location.z;
        cube.receiveShadow = true;
        cube.castShadow = true;
        this.scene.add(cube);
        return cube;
    }

    createObject(key, scale, location) {
        var newobj = this.Meshes[key].clone();
        newobj.position.x = location.x;
        newobj.position.y = location.z;
        newobj.position.z = location.y;
        return newobj;
    }

    createPage(page) {
        var newscene = new Page(page, this.createBox(page.size, { x: 0, y: 0, z:0}, page.background.color));
        this.scene.add(newscene.Scene);
        return newscene;
    }

    createLights() {
        this.scene.add(new THREE.AmbientLight(0x333333));
        var light = new THREE.PointLight(0xFFFFFF, 1, 10, 1);
        light.position.set(2, 2, 2);
        //Not seeing shadows yet...
        light.castShadow = true;
        light.shadow.camera.near = .1;
        light.shadow.camera.far = 25;

        this.scene.add(light);
    }

    allResourcesLoaded() {

    }

    animate() {
        window.requestAnimationFrame(() => { this.animate(); });
        this.render();
    }
    render() {
        //raycaster.setFromCamera(mouse, camera);
        //var intersects = raycaster.intersectObjects(scene.children, true);
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

const pageCreator = new PageCreator(Pages);
pageCreator.animate();
