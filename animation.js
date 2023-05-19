import * as THREE from 'three';

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 50 );
camera.position.z = 30;

var renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x080808, 1 );
document.body.appendChild( renderer.domElement );

var light = new THREE.PointLight( '#9BC995', 1, 1000 );
light.position.set( 0, 0, 0 );
scene.add( light );

var group = new THREE.Group();

// points generated from lorenz function
var arrayCurve = lorenz();
var curve = new THREE.CatmullRomCurve3(arrayCurve);
var geometry = new THREE.Geometry();
geometry.vertices = curve.getPoints(100000);

// Generating a cloud of point
var pcMat = new THREE.PointsMaterial();
pcMat.color = new THREE.Color(0x5555ff);
pcMat.transparent = true;
pcMat.size = 0.01;
pcMat.blending = THREE.AdditiveBlending;
var pc = new THREE.Points(geometry, pcMat);
pc.sizeAttenuation = true;
pc.sortPoints = true;

group.add(pc);
scene.add( group );

var step = 0;

var render = function () {

    renderer.render( scene, camera );
    requestAnimationFrame( render );

    //Varying the points on each frame
    step+=0.01;
    var geometry = pc.geometry;
    var a = 0.9+Math.random()*6;
    var b = 3.4+Math.random()*7;
    var f = 9.9+Math.random()*8;
    var g = 1+Math.random();
    var t = 0.001;


    geometry.vertices.forEach(function(v){
        v.x = v.x - t*a*v.x +t*v.y*v.y -t*v.z*v.z + t*a*f;
        v.y = v.y - t*v.y + t*v.x*v.y - t*b*v.x*v.z + t*g;
        v.z = v.z - t*v.z + t*b*v.x*v.y + t*v.x*v.z;
    })
    geometry.verticesNeedUpdate = true;

    group.rotation.x += 0.01;
    group.rotation.y += 0.02;
    group.rotation.z += 0.01;


};

window.addEventListener( 'resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}, false );

render();

function lorenz(){

    var arrayCurve=[];

    var x = 0.01, y = 0.01, z = 0.01;
    var a = 0.9;
    var b = 3.4;
    var f = 9.9;
    var g = 1;
    var t = 0.001;
    for (var i=0;i<100000;i++){

    x = x - t*a*x +t*y*y -t*z*z + t*a*f;
    y = y - t*y + t*x*y - t*b*x*z + t*g;
    z = z - t*z + t*b*x*y + t*x*z;
    arrayCurve.push(new THREE.Vector3(x, y, z).multiplyScalar(1));
    }
    return arrayCurve;
}