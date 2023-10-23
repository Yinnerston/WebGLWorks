import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

import * as dat from 'lil-gui'

THREE.ColorManagement.enabled = false

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Axeshelper
scene.add(new THREE.AxesHelper())

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.4

// Objects
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32)
const sphere = new THREE.Mesh(
    sphereGeometry,
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

const targetSphere = new THREE.Mesh(
    sphereGeometry,
    new THREE.MeshBasicMaterial({color: "white"})
)
targetSphere.scale.set(0.1, 0.1, 0.1)
targetSphere.position.set(2, 1, 2)
scene.add(targetSphere)

const spotlightTargetSphere = new THREE.Mesh(
    sphereGeometry,
    new THREE.MeshBasicMaterial({color: "red"})
)
spotlightTargetSphere.scale.set(0.1, 0.1, 0.1)
spotlightTargetSphere.position.set(-2, -0.5, -2)
scene.add(spotlightTargetSphere)

/**
 * Lights
 */
const lightState = {
    animateDirectionalTarget: true
}

// Light costs
    // Minimal: AmbientLight, HemisphereLight
    // Moderate: DirectionalLight, PointLight
    // High: SpotLight, RectAreaLight
// How to mitigate performance costs?
    // Baking: Bake light into the texture. Drawback is light cannot be removed
// Helpers
    // Each type of light has a helper

const ambientLight = new THREE.AmbientLight(new THREE.Color("blue"), 0.5)
scene.add(ambientLight)
// Can simulate light bouncing with a dim ambient light
gui.add(ambientLight, "intensity").min(0).max(1).step(0.01).name("Ambient Intensity")
gui.addColor(ambientLight, "color").name("Ambient Color")

// Directional light is light that emits from a point in all directions
// Directional lights assume the light comes from infinitely far away --> Like sunlight
    // Light rays are all parallel, does not have fall off
    // Directional light tracks a .target Object3D
const directionalLight = new THREE.DirectionalLight(new THREE.Color("red"), 0.3)
directionalLight.target = targetSphere
gui.add(directionalLight, "intensity").min(0).max(1).step(0.01).name("Directional Intensity")
gui.addColor(directionalLight, "color").name("Directional Color")
// directional lights don't exist from a point, so position really only just is the vector that
// target - position = vector for direction
gui.add(directionalLight.position, "x").min(-10).max(10).step(0.01).name("Directional position X")
gui.add(directionalLight.position, "y").min(-10).max(10).step(0.01).name("Directional position Y")
gui.add(directionalLight.position, "z").min(-10).max(10).step(0.01).name("Directional position Z")
gui.add(lightState, "animateDirectionalTarget")
gui.add(targetSphere.position, "x").min(-10).max(10).step(0.01).name("Directional target X")
gui.add(targetSphere.position, "y").min(-10).max(10).step(0.01).name("Directional target Y")
gui.add(targetSphere.position, "z").min(-10).max(10).step(0.01).name("Directional target Z")
scene.add(directionalLight)
// Directional light helper
const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
scene.add(directionalLightHelper)

// Hemisphere Light is light positioned directly above the scene, with color fading from the sky color to the ground color.
// Similar to ambient light but with different color from the sky compared to the ground
const hemisphereLight = new THREE.HemisphereLight(new THREE.Color(0x87CEEB), new THREE.Color("green"), 0.5)
gui.add(hemisphereLight.position, "y").min(-10).max(10).step(0.01).name("Hemisphere position y")
gui.add(hemisphereLight, "intensity").min(0).max(1).step(0.01).name("Hemisphere Intensity")
scene.add(hemisphereLight)

// Point lights are infinitely small points that illuminate in every direction
// Specify distance with falloff
const pointLight = new THREE.PointLight(0xffffff, 0.5)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
gui.add(pointLight.position, "x").min(-10).max(10).step(0.01).name("Point X")
gui.add(pointLight.position, "y").min(-10).max(10).step(0.01).name("Point Y")
gui.add(pointLight.position, "z").min(-10).max(10).step(0.01).name("Point Z")
scene.add(pointLight)

// RectAreaLight is a mix of directional light and diffuse light
const rectLight = new THREE.RectAreaLight( 0xffffff, 1,  2, 2 );
rectLight.position.set( 2,  2, 2 );
rectLight.lookAt( 2, -10, 2 );
// The direction you are looking at needs to be set after the position chagnes
gui.add(rectLight.position, "x").min(-10).max(10).step(0.01).name("Rect Area X")
gui.add(rectLight.position, "y").min(-10).max(10).step(0.01).name("Rect Area Y")
gui.add(rectLight.position, "z").min(-10).max(10).step(0.01).name("Rect Area Z")

rectLight.lookAt( 0, 0, 0 );
scene.add( rectLight )
// import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
const rectLightHelper= new RectAreaLightHelper( rectLight );
scene.add(rectLightHelper)

// SpotLight: Light that tracks an object
const spotlight = new THREE.SpotLight(new THREE.Color("red"), 10, 5, Math.PI * 0.1, 0.25, 1)
spotlight.position.set(0, 2, 3)
spotlight.target = spotlightTargetSphere
scene.add(spotlight)
const spotlightHelper = new THREE.SpotLightHelper(spotlight)
scene.add(spotlightHelper)
gui.add(spotlight.position, "x").min(-10).max(10).step(0.01).name("spotlight X")
gui.add(spotlight.position, "y").min(-10).max(10).step(0.01).name("spotlight Y")
gui.add(spotlight.position, "z").min(-10).max(10).step(0.01).name("spotlight Z")

gui.add(ambientLight, "visible").name("Visible ambientLight")
gui.add(directionalLight, "visible").name("Visible directionalLight")
gui.add(hemisphereLight, "visible").name("Visible hemisphereLight")
gui.add(pointLight, "visible").name("Visible pointLight")
gui.add(rectLight, "visible").name("Visible rectLight")
gui.add(spotlight, "visible").name("Visible spotlight")


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

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // target sphere rotates around the center
    if (lightState.animateDirectionalTarget)
    {
        targetSphere.position.x = 2 * Math.cos(elapsedTime)
        targetSphere.position.z = 2 * Math.sin(elapsedTime)    
        
        spotlightTargetSphere.position.x = 2 * Math.cos(elapsedTime + Math.PI)
        spotlightTargetSphere.position.z = 2 * Math.sin(elapsedTime + Math.PI)    
    }
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()