import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { STLLoader } from '../node_modules/three/examples/jsm/loaders/STLLoader.js';

var container, stats, controls;
var camera, scene, projector, renderer;
var particleMaterial;
var objects = [];
init();
animate();
function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight,
        1, 10000);
    camera.position.set(0, 300, 500);
    camera.lookAt(new THREE.Vector3(0, -30, 0));
    scene = new THREE.Scene();

    const envTexture = new THREE.CubeTextureLoader().load([
        '../assets/impudence.jpg',
        '../assets/impudence.jpg',
        '../assets/impudence.jpg',
        '../assets/impudence.jpg',
        '../assets/impudence.jpg',
        '../assets/impudence.jpg',
    ])
    envTexture.mapping = THREE.CubeReflectionMapping

    const material = new THREE.MeshPhysicalMaterial({
        color: 0xb2ffc8,
        envMap: envTexture,
        metalness: 0.25,
        roughness: 0.1,
        opacity: 1.0,
        transparent: true,
        transmission: 0.99,
        clearcoat: 1.0,
        clearcoatRoughness: 0.25
    })

    var geometry = new THREE.CubeGeometry(350, 100, 100);

    const loader = new STLLoader();

    const n_projects = 5
    for (var i = n_projects; i > 0; i--) {

        loader.load(
            '../assets/plane.stl',
            function (geometry) {
                var object = new THREE.Mesh(geometry, material)
                object.position.x = 0;
                object.position.y = i * 10 + i * 100;
                object.position.z = 0;
                console.log(object);


                switch (i) {
                    case n_projects - 1:
                        object.userData = {
                            URL: "../projects/spirit_avionics.html"
                        };
                        break;
                    case n_projects - 2:
                        object.userData = {
                            URL: "http://yahoo.com"
                        };
                        break;
                    case n_projects - 3:
                        object.userData = {
                            URL: "http://msn.com"
                        };
                        break;
                    case n_projects - 4:
                        object.userData = {
                            URL: "http://engadget.com"
                        };
                        break;
                    case 4:
                        object.userData = {
                            URL: "../projects/spirit_avionics.html"
                        };
                        break;
                }

                scene.add(object);
                objects.push(object);
            },
        );
    }


    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    document.addEventListener('mousedown', onDocumentMouseDown, false);
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener("wheel", function(e) {
        camera.position.y -= e.deltaY * 0.1;
     });
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseDown(event) {
    event.preventDefault();
    var vector = new THREE.Vector3((event.clientX / window.innerWidth) * 2 -
        1, -(event.clientY / window.innerHeight) * 2 + 1, 0.5);
        vector.unproject(camera);
    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position)
        .normalize());
    var intersects = raycaster.intersectObjects(objects);
    if (intersects.length > 0) {
        window.open(intersects[0].object.userData.URL);
    }
}

function animate() {
    requestAnimationFrame(animate);
    render();

}

function render() {
    renderer.render(scene, camera);
}