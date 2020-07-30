import * as THREE from './node_modules/three/build/three.module.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';

let scenes = [], camera, renderer, globalContainer, gltfLoader, meshes;

let homeMesh, loginMesh, adminLoginMesh, logoutMesh, adminPanelMesh;

let homeContainer, loginContainer, adminLoginContainer, logoutContainer, adminPanelContainer

let viewportWidth;
let viewportHeight;


function init() {  

    //containers
    viewportWidth = document.querySelector('#sizeWindow').clientWidth;
    viewportHeight = document.querySelector('#sizeWindow').clientHeight;
    
    homeContainer = document.querySelector('#homeContainer');  
    loginContainer = document.querySelector('#loginContainer');  
    adminLoginContainer = document.querySelector('#adminLoginContainer');  
    logoutContainer = document.querySelector('#logoutContainer');  
    adminPanelContainer = document.querySelector('#adminPanelContainer');

    globalContainer = document.querySelector('#globalContainer');

    //loader
    meshes = [
        './meshes/home.gltf',
        './meshes/key.gltf',
        './meshes/lock.gltf',
        './meshes/door.gltf',
        './meshes/gear.gltf'
    ];

    gltfLoader = new GLTFLoader();

    for (let i = 0; i < meshes.length; i++) {
        gltfLoader.load(
            meshes[i],
            function(mesh) {
        
                console.log(mesh.scene);
        
            }
        );
    }    

    //camera
    let fov = 45;
    let aspect = viewportWidth / viewportHeight;
    let near = 1;
    let far = 20;

    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(0, 0, 2);
    
    //scenes
    let light = THREE.AmbientLight(0xffffff, 2);

    let homeScene = new THREE.Scene();
    homeScene.element = homeContainer;
    homeScene.add(homeMesh);
    homeScene.add(light);
    scenes.push(homeScene);

    //renderer
    renderer = new THREE.WebGLRenderer({antialias:true, alpha: true, canvas: globalContainer});
    renderer.setSize(viewportWidth, viewportHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    // document.body.appendChild(renderer.domElement);
  
}

//render loop
function animate() {

    requestAnimationFrame(animate);

    render();

}

function render() {

    renderer.setScissorTest(true);
    scenes.forEach((scene) => {

      let sceneElement = scene.element;
  
      let sceneBoundingRect = sceneElement.getBoundingClientRect();
  
      //is inside screen ?
      if (sceneBoundingRect.bottom < 0 || sceneBoundingRect.top  > renderer.domElement.clientHeight ||
         sceneBoundingRect.right  < 0 || sceneBoundingRect.left > renderer.domElement.clientWidth) {
        return;
      }
  
      let sceneWidth = sceneBoundingRect.right - sceneBoundingRect.left;
      let sceneHeight = sceneBoundingRect.bottom - sceneBoundingRect.top;
      let sceneLeft = sceneBoundingRect.left;
      let sceneTop = sceneBoundingRect.top;
  
      renderer.setViewport(sceneLeft, sceneTop, sceneWidth, sceneHeight);
      renderer.setScissor(sceneLeft, sceneTop, sceneWidth, sceneHeight);
  
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
  
      renderer.render(scene, camera);
  
    } );
    renderer.setScissorTest(false);

}

//responsive
window.addEventListener('resize', () => {

    camera.aspect = viewportWidth / viewportHeight;

    renderer.setSize(viewportWidth, viewportHeight);

    camera.updateProjectionMatrix();

});

//ONREADY
document.addEventListener('DOMContentLoaded', () => {

    init();
    animate();

});