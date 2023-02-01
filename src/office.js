import * as THREE from 'three';
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import tile from './images/tile.jpeg';
import whitewall from './images/whitewall.jpg';
import ceiling from './images/ceiling.jpg';
import { models } from './models';

export default function Office() {

    const width = window.innerWidth;
    const height = window.innerHeight;
    const office = new THREE.Group();

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer();
    const clock = new THREE.Clock();
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1500);
    const controls = new FirstPersonControls(camera);
    controls.lookSpeed = 0.14;
    controls.movementSpeed = 140;
    controls.lookVertical = false;

    function create() {
        renderer.setSize(width, height);
        renderer.setClearColor(0xcce0ff, 1);
        document.body.appendChild(renderer.domElement);

        camera.position.set(10, 70, 10)
        camera.lookAt(scene.position);
        const light = new THREE.AmbientLight(0xCCCCCC);
        scene.add(light);

        const axisHelper = new THREE.AxesHelper(1000);
        scene.add(axisHelper);

        createRoom();
        for (let m in models){
            loadGLTFModel(models[m].model, 
                models[m].params[0], 
                models[m].params[1], 
                models[m].params[2], 
                models[m].params[3]);
        }
        scene.add(office);

    }

    function loadFBXModel( model, scale = 1, x=10, y=10, z=10) {
        const loader = new FBXLoader();
        //loader.setPath(path);
        loader.load(model, function(object){
            object.position.x = x;
            object.position.y = y;
            object.position.z = z;
            object.scale.multiplyScalar(scale);
            
            object.traverse(function(child){
                child.castShadow = true;
            });
            
            scene.add(object);
            
        })
    }

    function loadGLTFModel(model, x=10, y=10, z=10, scale=1) {
        const loader = new GLTFLoader();
        loader.load(model, function(gltf){
            gltf.scene.scale.multiplyScalar(scale);
            gltf.scene.translateX(x);
            gltf.scene.translateY(y);
            gltf.scene.translateZ(z);

            gltf.scene.traverse(function(child){
                child.castShadow = true;
            });

            scene.add(gltf.scene);

        });
    }
    
    function setTexture(textureObj) {
        const texture = new THREE.TextureLoader().load(textureObj);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;

    }

    function mapTexture(geometry, texture) {
        const material = new THREE.MeshBasicMaterial({map: texture});
        const result = new THREE.Mesh( geometry, material );
        return result;

    }

    function createFloor() {
        const geometry = new THREE.PlaneGeometry(5000, 5000);
        const texture = setTexture(tile);
        texture.repeat.set( 100, 100 );

        const plane = mapTexture(geometry, texture);
        plane.rotation.x = -0.5 * Math.PI;
        scene.add( plane )

    }

    function createWall(x, y, z, skin = whitewall) {
        const shape = new THREE.Shape();
        shape.moveTo(-x, 0)
        shape.lineTo(x, 0)
        shape.lineTo(x, y)
        shape.lineTo(-x, y);

        const geometry = new THREE.ExtrudeGeometry( shape )
        const texture = setTexture(skin);
        texture.repeat.set(0.01, 0.005);

        const aWall = mapTexture(geometry, texture);
        aWall.position.z = z;
        office.add(aWall);

        return aWall;

    }

    function createRoom() {
        createFloor();
        createWall(300, 150, 300);
        createWall(300, 150, -300);
        createWall(300, 150, 0).rotateY(0.5*Math.PI).position.x = 300;
        createWall(300, 150, 0).rotateY(0.5*Math.PI).position.x = -300;
        createWall(300, 600, -300, ceiling).rotateX(0.5*Math.PI).position.y = 150;

    }

    function onClick( event ) {

        event.preventDefault();
    
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
        raycaster.setFromCamera( pointer, camera );
    
        var intersects = raycaster.intersectObjects( scene.children, true );
    
        if ( intersects.length > 0 ) {
    
            intersects[ 0 ].object.material.color.set( 0xff0000 );
    
        }
    
    }

    function render() {
        const delta = clock.getDelta();
        controls.update(delta);

        renderer.domElement.addEventListener('click', onClick, false);
        renderer.render(scene, camera);
        requestAnimationFrame(render);
    }
    
    create();
    render();


}