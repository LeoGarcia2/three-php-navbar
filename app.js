import * as THREE from './node_modules/three/build/three.module.js';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';

let scenes = [], camera, renderer, globalContainer, gltfLoader, meshes;

let clock = new THREE.Clock();

let homeMesh, loginMesh, adminLoginMesh, logoutMesh, adminPanelMesh;

let homeContainer, loginContainer, adminLoginContainer, logoutContainer, adminPanelContainer

let viewportWidth;
let viewportHeight;

let navbarItems = [];

let adminLoginAnimation, logoutAnimation;
let adminLoginAnimationData, logoutAnimationData;

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
        './meshes/home.glb',
        './meshes/key.glb',
        './meshes/lock.glb',
        './meshes/door.glb',
        './meshes/gear.glb',
    ];

    gltfLoader = new GLTFLoader();

    for (let i = 0; i < meshes.length; i++) {
        gltfLoader.load(
            meshes[i],
            function(mesh) {
                
                let light = new THREE.AmbientLight();
                //gestion des scenes affichées
                switch (i) {
                    case 0:
                        let homeScene = new THREE.Scene();
                        homeScene.element = homeContainer;
                        scenes.push(homeScene);

                        homeMesh = mesh.scene;
                        homeScene.add(homeMesh);
                        homeScene.add(light);
                        break;

                    case 1:
                        if (loginContainer != undefined) {
                            let loginScene = new THREE.Scene();
                            loginScene.element = loginContainer;
                            scenes.push(loginScene);

                            loginMesh = mesh.scene;
                            loginScene.add(loginMesh);
                            loginScene.add(light);
                        }                        
                        break;
                        
                    case 2:
                        if (adminLoginContainer != undefined) {    
                            let adminLoginScene = new THREE.Scene();
                            adminLoginScene.element = adminLoginContainer;
                            scenes.push(adminLoginScene);

                            adminLoginMesh = mesh.scene;
                            adminLoginScene.add(adminLoginMesh);
                            adminLoginScene.add(light);

                            adminLoginAnimation = mesh.animations;
                            adminLoginAnimationData = {
                                mixer:  new THREE.AnimationMixer(adminLoginMesh),
                                clips: adminLoginAnimation,
                                lockClip: undefined,
                                unlockClip: undefined,
                                lockAction: undefined,
                                unlockAction: undefined,
                            };

                            adminLoginAnimationData.lockClip = THREE.AnimationClip.findByName(adminLoginAnimationData.clips, 'lock');
                            adminLoginAnimationData.unlockClip = THREE.AnimationClip.findByName(adminLoginAnimationData.clips, 'unlock');
                            
                            adminLoginAnimationData.lockAction = adminLoginAnimationData.mixer.clipAction(adminLoginAnimationData.lockClip);
                            adminLoginAnimationData.unlockAction = adminLoginAnimationData.mixer.clipAction(adminLoginAnimationData.unlockClip);

                            adminLoginAnimationData.lockAction.setLoop(THREE.LoopOnce);
                            adminLoginAnimationData.lockAction.clampWhenFinished = true;
                            
                            adminLoginAnimationData.unlockAction.setLoop(THREE.LoopOnce);
                            adminLoginAnimationData.unlockAction.clampWhenFinished = true;
    
                        }                        
                        break;
                        
                    case 3:
                        if (logoutContainer != undefined) {    
                            let logoutScene = new THREE.Scene();
                            logoutScene.element = logoutContainer;
                            scenes.push(logoutScene);

                            logoutMesh = mesh.scene;
                            logoutScene.add(logoutMesh);
                            logoutScene.add(light);

                            logoutAnimation = mesh.animations;
                            logoutAnimationData = {
                                mixer:  new THREE.AnimationMixer(logoutMesh),
                                clips: logoutAnimation,
                                closeClip: undefined,
                                openClip: undefined,
                                closeAction: undefined,
                                openAction: undefined,
                            };
                            console.log(logoutAnimationData.clips);
                            logoutAnimationData.closeClip = THREE.AnimationClip.findByName(logoutAnimationData.clips, 'ferme');
                            logoutAnimationData.openClip = THREE.AnimationClip.findByName(logoutAnimationData.clips, 'ouvre');
                            
                            logoutAnimationData.closeAction = logoutAnimationData.mixer.clipAction(logoutAnimationData.closeClip);
                            logoutAnimationData.openAction = logoutAnimationData.mixer.clipAction(logoutAnimationData.openClip);

                            logoutAnimationData.closeAction.setLoop(THREE.LoopOnce);
                            logoutAnimationData.closeAction.clampWhenFinished = true;
                            
                            logoutAnimationData.openAction.setLoop(THREE.LoopOnce);
                            logoutAnimationData.openAction.clampWhenFinished = true;   
                        }                        
                        break;

                    case 4:
                        if (adminPanelContainer != undefined) {    
                            let adminPanelScene = new THREE.Scene();
                            adminPanelScene.element = adminPanelContainer;
                            scenes.push(adminPanelScene);

                            adminPanelMesh = mesh.scene;
                            adminPanelScene.add(adminPanelMesh);
                            adminPanelScene.add(light);                           
                        }          
                        
                        //hover sur les containers
                        document.querySelectorAll('.container3d').forEach((container) => {
                            container.addEventListener('mouseenter', () => {
                                container.classList.add('hovered');
                                if (container.id == 'adminLoginContainer') {
                                    unlockAnimation();
                                }
                                if (container.id == 'logoutContainer') {
                                    openAnimation();
                                }
                            });
                            container.addEventListener('mouseleave', () => {
                                container.classList.remove('hovered');
                                if (container.id == 'adminLoginContainer') {
                                    lockAnimation();
                                }
                                if (container.id == 'logoutContainer') {
                                    closeAnimation();
                                }
                            });
                        });

                        //liste containers
                        navbarItems = [
                            {container: homeContainer, mesh: homeMesh},
                            {container: loginContainer, mesh: loginMesh},
                            {container: adminLoginContainer, mesh: adminLoginMesh},
                            {container: logoutContainer, mesh: logoutMesh},
                            {container: adminPanelContainer, mesh: adminPanelMesh},
                        ];
                        break;
                }
        
            }
        );
    }    

    //camera
    let fov = 45;
    let aspect = viewportWidth / viewportHeight;
    let near = 1;
    let far = 20;

    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(2, 0, 4);
    camera.lookAt(0, 0, 0);

    //renderer
    renderer = new THREE.WebGLRenderer({antialias:true, alpha: true, canvas: globalContainer});
    renderer.setSize(viewportWidth, viewportHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
  
}

//render loop
function animate() {
    let delta = clock.getDelta();
    if (adminLoginAnimationData != undefined) {
        adminLoginAnimationData.mixer.update(delta);
    }
    if (logoutAnimationData != undefined) {
        logoutAnimationData.mixer.update(delta);
    }
    
    navbarItems.forEach((navbarItem) => {

        if(navbarItem.mesh != undefined) {

            if (navbarItem.container.classList.contains('hovered')) {
                if (navbarItem.mesh.rotation.y < Math.PI/4) {
                    navbarItem.mesh.rotation.y += 0.01;
                }
            } else {
                if (navbarItem.mesh.rotation.y > 0) {
                    navbarItem.mesh.rotation.y -= 0.01;
                }
            }

        }

    });

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
      let sceneTop = viewportHeight - sceneBoundingRect.top - sceneHeight;
  
      renderer.setViewport(sceneLeft, sceneTop, sceneWidth, sceneHeight);
      renderer.setScissor(sceneLeft, sceneTop, sceneWidth, sceneHeight);
  
      camera.aspect = sceneWidth / sceneHeight;
      camera.updateProjectionMatrix();
  
      renderer.render(scene, camera);
  
    });

    renderer.setScissorTest(false);

}

//ONREADY
document.addEventListener('DOMContentLoaded', () => {

    init();
    animate();

    //responsive
    window.addEventListener('resize', () => {

        viewportWidth = document.querySelector('#sizeWindow').clientWidth;
        viewportHeight = document.querySelector('#sizeWindow').clientHeight;

        camera.aspect = viewportWidth / viewportHeight;

        renderer.setSize(viewportWidth, viewportHeight);

        camera.updateProjectionMatrix();

    });

});

function unlockAnimation() {
    adminLoginAnimationData.lockAction.stop();
    adminLoginAnimationData.unlockAction.stop();
    adminLoginAnimationData.unlockAction.play();
}

function lockAnimation() {
    adminLoginAnimationData.lockAction.stop();
    adminLoginAnimationData.unlockAction.stop();
    adminLoginAnimationData.lockAction.play();    
}

function openAnimation() {
    logoutAnimationData.closeAction.stop();
    logoutAnimationData.openAction.stop();
    logoutAnimationData.openAction.play();
}

function closeAnimation() {
    logoutAnimationData.closeAction.stop();
    logoutAnimationData.openAction.stop();
    logoutAnimationData.closeAction.play();    
}