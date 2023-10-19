import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
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

/**
 * Lights.
 * You need to define lights otherwise a MeshStandardMaterial will be pitch black
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambientLight)

const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)
// Mutualising materials is better for performance
const sharedMaterial = new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    roughnessMap: doorRoughnessTexture,
    normalMap: doorNormalTexture,
    // Normal scale is a vector2
    // envMap:  What is surrounding the scene --> reflection, refraction, lighting on mesh
})
console.log(sharedMaterial)
gui.add(sharedMaterial, 'roughness').min(0).max(1).step(0.001)
gui.add(sharedMaterial, 'aoMapIntensity').min(0).max(10).step(0.001)
gui.add(sharedMaterial, 'displacementScale').min(0).max(1).step(0.001)


// Load an env map
const cubeTextureLoader = new THREE.CubeTextureLoader()
const envMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/2/px.jpg',
    '/textures/environmentMaps/2/nx.jpg',
    '/textures/environmentMaps/2/py.jpg',
    '/textures/environmentMaps/2/ny.jpg',
    '/textures/environmentMaps/2/pz.jpg',
    '/textures/environmentMaps/2/nz.jpg'
])
const envMapMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.7,
    roughness: 0.2,
    envMap: envMapTexture
})
gui.add(envMapMaterial, 'roughness').min(0).max(1).step(0.001).name("env map roughness")
gui.add(envMapMaterial, 'metalness').min(0).max(1).step(0.001).name("env map metalness")


/**
 * MeshPhysicalMaterial is used to provide more advanced physically-based rendering properties
 * PointsMaterial is used to render particles
 * ShaderMaterial and RawShaderMaterial let you define your custom shaders
 */
const meshPhysicalMaterial = new THREE.MeshPhysicalMaterial()


const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)
// const cubeBasicMaterial = new THREE.MeshBasicMaterial({ 
//     // color: "red",
//     map: doorColorTexture, 
//     alphaMap: doorAlphaTexture
//  })
const cubeMesh = new THREE.Mesh(cubeGeometry, sharedMaterial)

const sphereGeometry = new THREE.SphereGeometry(0.5, 64, 64)
// const sphereBasicMaterial = new THREE.MeshBasicMaterial({ color: "blue" })
const sphereMesh = new THREE.Mesh(sphereGeometry, sharedMaterial)

const sphereEnvMapGeometry = new THREE.SphereGeometry(0.5, 64, 64)
// const sphereBasicMaterial = new THREE.MeshBasicMaterial({ color: "blue" })
const sphereEnvMapMesh = new THREE.Mesh(sphereGeometry, envMapMaterial)
sphereEnvMapMesh.position.y = 2

const torusGeometry = new THREE.TorusGeometry(0.5, 0.2)
// const torusBasicMaterial = new THREE.MeshBasicMaterial({ color: "green" })
const torusMesh = new THREE.Mesh(torusGeometry, sharedMaterial)

cubeMesh.position.x = -2
torusMesh.position.x = 2

scene.add(cubeMesh, sphereMesh, torusMesh, sphereEnvMapMesh)



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
    if (objTransforms.rotateObjects)    {
        // Update objects by rotating them
        cubeMesh.rotation.y = 0.1 * elapsedTime * objTransforms.rotation
        cubeMesh.rotation.x = 0.2 * elapsedTime * objTransforms.rotation

        torusMesh.rotation.y = 0.1 * elapsedTime * objTransforms.rotation
        torusMesh.rotation.x = 0.2 * elapsedTime * objTransforms.rotation

        sphereMesh.rotation.y = 0.1 * elapsedTime * objTransforms.rotation
        sphereMesh.rotation.x = 0.2 * elapsedTime * objTransforms.rotation

    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()