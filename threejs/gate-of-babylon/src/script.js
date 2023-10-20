import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import GUI from 'lil-gui'

THREE.ColorManagement.enabled = false
const gui = new GUI()
/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

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
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)
gui.add(camera.position, "x").min(-10).max(10).step(0.01).name("Camera X")
gui.add(camera.position, "y").min(-10).max(10).step(0.01).name("Camera Y")
gui.add(camera.position, "z").min(-10).max(10).step(0.01).name("Camera Z")

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Load the among us textures
const textureLoader = new THREE.TextureLoader()
const amongUsColorMap = textureLoader.load("/models/amongus/Textures/yellow_aud_diffuse.png")
const amongUsNormalMap = textureLoader.load("/models/amongus/Textures/amongusdude__nmap.png")
const amongUsRoughnessMap = textureLoader.load("/models/amongus/Textures/amongusdude__rough.png")
const amongUsMetalnessMap = textureLoader.load("/models/amongus/Textures/amongusdude__metalness.png")
/**
 * Define a sphere, cube and torus with MeshBasicMaterial
 * I want to create:
 * - A metal material
 * - A glass material
 * - A dull material
 * Combine material properties:
 * - Simulate a light above a sphere using MeshNormalMaterial where vector .y is ponting downwards?
 * - MeshMatcapMaterial: display colour using normals --> simulate light and shadow based on normals
 *      - TODO: use of matcaps? Is it only for spheres?
 * - MeshDepthMaterial: Colour the geometry white [near, far] black
 * - Add lights (AmbientLight, PointLight)
 *      - How it interacts with lighting materials
 *      - MeshLambertMaterial, MeshPhongMaterial
 */

// Let's make the gate of babylon!!
    // Spiral behind figure in hex grid pattern
    // Spawn random sword model
    // Set target?
    // Shoot sword with some velocity
    // Generate spherical explosion when the sword reaches the target

/**
 * Lights.
 * You need to define lights otherwise a MeshStandardMaterial will be pitch black
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
scene.add(ambientLight)
gui.add(ambientLight, "intensity").min(0).max(10).step(0.01)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 0
pointLight.position.y = 2
pointLight.position.z = -5
scene.add(pointLight)

gui.add(pointLight, "intensity").min(0).max(10).step(0.001).name("PointLight intensity")
gui.add(pointLight.position, 'x').min(-5).max(5).step(0.001).name("PointLight x")
gui.add(pointLight.position, 'y').min(-5).max(5).step(0.001).name("PointLight y")
gui.add(pointLight.position, 'z').min(0).max(10).step(0.001).name("PointLight z")


// Load the among us model and material
const gltfLoader = new GLTFLoader();
gltfLoader.load( '/models/amongus/AmongUsDude.glb', function ( gltf ) {

	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

const amongUsMaterial = new THREE.MeshStandardMaterial({
    map: amongUsColorMap,
    roughnessMap: amongUsRoughnessMap,
    normalMap: amongUsNormalMap,
    metalnessMap: amongUsMetalnessMap
    // Normal scale is a vector2
    // envMap:  What is surrounding the scene --> reflection, refraction, lighting on mesh
})

gui.add(amongUsMaterial, 'roughness').min(0).max(1).step(0.001)
gui.add(amongUsMaterial, 'metalness').min(0).max(10).step(0.001)
gui.add(amongUsMaterial.normalScale, 'x').min(0).max(1).step(0.001)
gui.add(amongUsMaterial.normalScale, 'y').min(0).max(1).step(0.001)


/**
 * MeshPhysicalMaterial is used to provide more advanced physically-based rendering properties
 * PointsMaterial is used to render particles
 * ShaderMaterial and RawShaderMaterial let you define your custom shaders
 */
// Add Among Us standing on a cube to the scene



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

var objTransforms = {
    rotateObjects: true,
    rotation: 1
}
gui.add(objTransforms, 'rotateObjects')
gui.add(objTransforms, 'rotation').min(0).max(5).step(0.01)


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