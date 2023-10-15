import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

THREE.ColorManagement.enabled = false

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Load the textures
const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load("/textures/door/color.jpg")
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg")
const doorAmbientOcclusionTexture = textureLoader.load("/textures/door/ambientOcclusion.jpg")
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg")
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg")
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg")
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg")

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
 */

// Let's make the gate of babylon!!
    // Spiral behind figure in hex grid pattern
    // Spawn random sword model
    // Set target?
    // Shoot sword with some velocity
    // Generate spherical explosion when the sword reaches the target

// Mutualising materials is better for performance
const sharedMaterial = new THREE.MeshBasicMaterial({
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
})

const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
const cubeBasicMaterial = new THREE.MeshBasicMaterial({ 
    // color: "red",
    map: doorColorTexture, 
    alphaMap: doorAlphaTexture
 })
const cubeMesh = new THREE.Mesh(cubeGeometry, cubeBasicMaterial)

const sphereGeometry = new THREE.SphereGeometry(0.5)
const sphereBasicMaterial = new THREE.MeshBasicMaterial({ color: "blue" })
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereBasicMaterial)

const torusGeometry = new THREE.TorusGeometry(0.5, 0.2)
const torusBasicMaterial = new THREE.MeshBasicMaterial({ color: "green" })
const torusMesh = new THREE.Mesh(torusGeometry, torusBasicMaterial)

cubeMesh.position.x = -2
torusMesh.position.x = 2

scene.add(cubeMesh, sphereMesh, torusMesh)



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.outputColorSpace = THREE.LinearSRGBColorSpace
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update objects by rotating them
    cubeMesh.rotation.y = 0.1 * elapsedTime 
    cubeMesh.rotation.x = 0.2 * elapsedTime

    torusMesh.rotation.y = 0.1 * elapsedTime
    torusMesh.rotation.x = 0.2 * elapsedTime

    sphereMesh.rotation.y = 0.1 * elapsedTime
    sphereMesh.rotation.x = 0.2 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()