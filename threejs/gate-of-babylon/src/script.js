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
camera.position.y = 5
camera.position.z = 30
scene.add(camera)
gui.add(camera.position, "x").min(-100).max(100).step(0.01).name("Camera X")
gui.add(camera.position, "y").min(-100).max(100).step(0.01).name("Camera Y")
gui.add(camera.position, "z").min(-100).max(100).step(0.01).name("Camera Z")

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// // Load the among us textures
const textureLoader = new THREE.TextureLoader()
// const amongUsColorMap = textureLoader.load("/models/amongus/Textures/yellow_aud_diffuse.png")
// const amongUsNormalMap = textureLoader.load("/models/amongus/Textures/amongusdude__nmap.png")
// const amongUsRoughnessMap = textureLoader.load("/models/amongus/Textures/amongusdude__rough.png")
// const amongUsMetalnessMap = textureLoader.load("/models/amongus/Textures/amongusdude__metalness.png")
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

// TODO: Delete this pointlight, make portal miasma glow
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 0
pointLight.position.y = 2
pointLight.position.z = -5
scene.add(pointLight)

gui.add(pointLight, "intensity").min(0).max(10).step(0.001).name("PointLight intensity")
gui.add(pointLight.position, 'x').min(-5).max(5).step(0.001).name("PointLight x")
gui.add(pointLight.position, 'y').min(-5).max(5).step(0.001).name("PointLight y")
gui.add(pointLight.position, 'z').min(0).max(10).step(0.001).name("PointLight z")

// Add the ground plane for the desert
const groundPlaneGeometry = new THREE.PlaneGeometry(250, 250)
const GROUND_MAP_REPEAT_DISTANCE = 5
// set textures
const sandColourTexture = textureLoader.load("/textures/sand/Stylized_Sand_001_basecolor.jpg")
sandColourTexture.repeat.set(GROUND_MAP_REPEAT_DISTANCE, GROUND_MAP_REPEAT_DISTANCE)
sandColourTexture.wrapS = THREE.RepeatWrapping
sandColourTexture.wrapT = THREE.RepeatWrapping
const sandAOTexture = textureLoader.load("/textures/sand/Stylized_Sand_001_ambientOcclusion.jpg")
sandAOTexture.repeat.set(GROUND_MAP_REPEAT_DISTANCE, GROUND_MAP_REPEAT_DISTANCE)
sandAOTexture.wrapS = THREE.RepeatWrapping
sandAOTexture.wrapT = THREE.RepeatWrapping
const sandHeightTexture = textureLoader.load("/textures/sand/Stylized_Sand_001_height.png")
sandHeightTexture.repeat.set(GROUND_MAP_REPEAT_DISTANCE, GROUND_MAP_REPEAT_DISTANCE)
sandHeightTexture.wrapS = THREE.RepeatWrapping
sandHeightTexture.wrapT = THREE.RepeatWrapping
const sandNormalTexture = textureLoader.load("/textures/sand/Stylized_Sand_001_normal.jpg")
sandNormalTexture.repeat.set(GROUND_MAP_REPEAT_DISTANCE, GROUND_MAP_REPEAT_DISTANCE)
sandNormalTexture.wrapS = THREE.RepeatWrapping
sandNormalTexture.wrapT = THREE.RepeatWrapping
const sandRoughnessTexture = textureLoader.load("/textures/sand/Stylized_Sand_001_roughness.jpg")
sandRoughnessTexture.repeat.set(GROUND_MAP_REPEAT_DISTANCE, GROUND_MAP_REPEAT_DISTANCE)
sandRoughnessTexture.wrapS = THREE.RepeatWrapping
sandRoughnessTexture.wrapT = THREE.RepeatWrapping
const groundPlaneMaterial = new THREE.MeshStandardMaterial({
    map: sandColourTexture,
    aoMap: sandAOTexture,
    displacementMap: sandHeightTexture,
    normalMap: sandNormalTexture,
    roughness: sandRoughnessTexture
})
const groundPlane = new THREE.Mesh(groundPlaneGeometry, groundPlaneMaterial)
groundPlane.rotateX(Math.PI * 1.5)
scene.add(groundPlane)

// TODO: Add background plane wrapping around scene?
// const nightSkyTexture = textureLoader.load("/textures/nightsky.jpg")
// const nightSkyMaterial = new THREE.MeshStandardMaterial({
//     map: nightSkyTexture
// })
// console.log(controls.maxDistance)
// const backgroundPlane = new THREE.Mesh(groundPlaneGeometry, nightSkyMaterial)
// backgroundPlane.position.z = 125
// scene.add(backgroundPlane)

// Load the among us model and material
const gltfLoader = new GLTFLoader();
// Load stone gate
const GATE_SCALE = 2.5
gltfLoader.load( '/models/stone_gate.glb', function ( gltf ) {

	scene.add( gltf.scene );
    gltf.scene.children[0].scale.set(GATE_SCALE, GATE_SCALE, GATE_SCALE)
}, undefined, function ( error ) {

	console.error( error );

} );
const particleTexture = textureLoader.load("/particles/9.png")
/**
 * Particles
 */
// Each triange has 3 vertices, each vertex has 3 values
const particlesGeometry = new THREE.BufferGeometry()
const maxHeight = 5
const gap = 1
const firstWidth = 6
const particlesPerPoint = 5000
var particleIdx = 0
const particlesPositions = new Float32Array((maxHeight * firstWidth + Math.floor(maxHeight / 2)) * 3 * particlesPerPoint)

for (let height = 0; height < maxHeight; ++height)    {
    let startingX = 0
    let startingY = 0 - height * gap
    let rowLength = firstWidth
    if (height % 2) {
        // Displace every second row, by gap / 2
        startingX -= gap / 2
        rowLength = firstWidth + 1
    }
    for (let i = 0; i < rowLength; ++i)
    {
        for (let z = 0; z < particlesPerPoint; z++)
        {
            particlesPositions[particleIdx] = startingX + i * gap + Math.random() * 0.05
            particlesPositions[particleIdx + 1] = startingY + Math.random() * 0.05
            particlesPositions[particleIdx + 2] = Math.min(1, 10 / z ) < 1 ? Math.min(1, 10 / z ) : 0
            particleIdx += 3    
        }
    }
}
const particlesAttributes = new THREE.BufferAttribute(particlesPositions, 3)
particlesGeometry.setAttribute("position", particlesAttributes)
const particlesMaterial = new THREE.PointsMaterial({
    color: 0xFFD700,
    size: 0.02,
    sizeAttenuation: true,
    transparent: true,
    alphaMap: particleTexture,
    // alphaTest: 0.001,    // Basically opacity thresholding
    // depthTest: false,   // Draws particles regardless of depth --> Doesn't work when you have other things in the scene
    depthWrite: false,  // Depth is stored in a depth buffer. Flag to deactivate in depth buffer
    blending: THREE.AdditiveBlending,   // Pixels that overlap have their colours blended additively

})
const points = new THREE.Points(particlesGeometry, particlesMaterial)
// points.scale.x = 4
// points.scale.y = 4
scene.add(points)


gui.add(points.position, "x").min(-50).max(50).step(0.001).name("points x")
gui.add(points.position, "y").min(0).max(50).step(0.001).name("points y")
gui.add(points.position, "z").min(-50).max(50).step(0.001).name("points z")

var amongUsObj;
gltfLoader.load( '/models/amongus/AmongUsDude.glb', function ( gltf ) {

    amongUsObj = gltf.scene.children[0]
    console.log(amongUsObj)
    amongUsObj.position.y = GATE_SCALE * 0.7    // offset by gate model
    amongUsObj.position.z = GATE_SCALE * 1
    // Points are positioned relative to among us
    points.position.x = amongUsObj.position.x - 2.5
    points.position.y = amongUsObj.position.y + 5

    gui.add(gltf.scene.children[0].position, "x").min(-10).max(10).step(0.001).name("AmongUs x")
    gui.add(gltf.scene.children[0].position, "y").min(-10).max(10).step(0.001).name("AmongUs y")
    gui.add(gltf.scene.children[0].position, "z").min(-10).max(10).step(0.001).name("AmongUs z")
    gui.add(gltf.scene.children[0].scale, "x").min(0).max(10).step(0.001).name("AmongUs scale x")
    gui.add(gltf.scene.children[0].scale, "y").min(0).max(10).step(0.001).name("AmongUs scale y")
    gui.add(gltf.scene.children[0].scale, "z").min(0).max(10).step(0.001).name("AmongUs scale z")
	scene.add( gltf.scene );

}, undefined, function ( error ) {

	console.error( error );

} );

gltfLoader.load( '/models/necoarc/scene.gltf', function ( gltf ) {

	scene.add( gltf.scene );
    gltf.scene.children[0].position.y = 0.3 // TODO: Translate neco arc up the y axis based on height map of  
    gltf.scene.children[0].position.z = 20
    gltf.scene.children[0].rotateZ(Math.PI * 0.5)
    gui.add(gltf.scene.children[0].position, "x").min(-50).max(50).step(0.001).name("Neco Arc x")
    gui.add(gltf.scene.children[0].position, "y").min(0).max(1).step(0.001).name("Neco Arc y")
    gui.add(gltf.scene.children[0].position, "z").min(-50).max(50).step(0.001).name("Neco Arc z")

}, undefined, function ( error ) {

	console.error( error );

} );


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