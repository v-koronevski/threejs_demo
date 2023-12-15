import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
// const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene();


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load('/textures/matcaps/8.png');
matcapTexture.colorSpace = THREE.SRGBColorSpace
const fontLoader  = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    console.log(font);
    const textGeometry = new TextGeometry('Valentine Test', {
        font: font,
		size: 0.5,
		height: 0.2,
		curveSegments: 50,
		bevelEnabled: true,
		bevelThickness: 0.03,
		bevelSize: 0.02,
		bevelOffset: 0,
		bevelSegments: 9
    });
    // textGeometry.computeBoundingBox();
    // textGeometry.translate(
    //     - (textGeometry.boundingBox.max.x - 0.2) * 0.5,
    //     - (textGeometry.boundingBox.max.y - 0.2) * 0.5,
    //     - (textGeometry.boundingBox.max.z - 0.3) * 0.5
    // )
    textGeometry.center();
    const textMaterial = new THREE.MeshMatcapMaterial();
    textMaterial.matcap = matcapTexture;
    const text = new THREE.Mesh(textGeometry, textMaterial);
    scene.add(text);
    const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 40, 65);

    console.time('donut');
    for (let i = 0; i < 200; i++) {
        const donutMesh = new THREE.Mesh(donutGeometry, textMaterial);
        donutMesh.position.x = (Math.random() - 0.5) * 10;
        donutMesh.position.y = (Math.random() - 0.5) * 10;
        donutMesh.position.z = (Math.random() - 0.5) * 10;
        donutMesh.rotation.x = Math.random() * Math.PI;
        donutMesh.rotation.y = Math.random() * Math.PI;
        const randomScale = Math.random();
        donutMesh.scale.set(randomScale,randomScale,randomScale)

        scene.add(donutMesh);
    }
    console.timeEnd('donut');
});


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0.5
camera.position.y = 0.5
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()