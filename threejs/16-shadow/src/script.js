import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
/**
 * Enable shadows
 * renderer.shadowMap.enabled = true
 * enable .castShadow on objects that cast shadows
 * enable .receiveShadow on objects that receive shadow
 * enable shadows on the lights --> Works with PointLight, DirectionalLight, SpotLight
 */

/**
 * Shadow map optimisations:
 * Change shadow map size on the light (keep it to a power of two) due to mipmapping
 * Control near and far planes --> affects precision and avoid shadow glitches
 * Control the blur with .shadow.radius property (general blur)
 * Change the shadow map algorithm:
 *  - BasicShadowMap: Performant but lousy quality
 *  - PCFShadowMap: Less performant but smoother edges
 *  - PCFSoftShadowMap: Less performant but event softer edges <-- bruno recommends this one
 *  - VSMShadowMap: Less performant, more constraints, possible unexpected results?
 * Change .shadow.camera.fov on perspective lights to reduce amplitude
 * BAKING SHADOWS
 *  --> You can make them movable based on the object
 */

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

// Baked shadow
const textureLoader = new THREE.TextureLoader()
const bakedShadow = textureLoader.load("/textures/bakedShadow.jpg")
const simpleShadow = textureLoader.load("/textures/simpleShadow.jpg")

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3)
directionalLight.position.set(2, 2, - 1)
directionalLight.castShadow = true
// change map size
directionalLight.shadow.mapSize.width = 1024    // power of 2 due to mipmapping
directionalLight.shadow.mapSize.height = 1024
// Change near and far planes
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 7
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// directionalLightCameraHelper.visible = false
scene.add(directionalLightCameraHelper)
// Reduce the amplitude of the camera frustrum
// Camera frustrum: The pyramid (perspective) or rectangular prism (orthogonal) inside
    // which the contents are rendered in the camera view
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.right = 2
// Control the blur of the shadow
    // Changes the resolution of the shadow map also changes the blur
directionalLight.shadow.radius = 10 // is a general blur
gui.add(directionalLight.shadow, 'radius').min(0).max(100).step(0.001).name("Shadow blur")

gui.add(directionalLight, 'intensity').min(0).max(1).step(0.001)
gui.add(directionalLight.position, 'x').min(- 5).max(5).step(0.001).name("Light x")
gui.add(directionalLight.position, 'y').min(- 5).max(5).step(0.001).name("Light y")
gui.add(directionalLight.position, 'z').min(- 5).max(5).step(0.001).name("Light z")


const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight)
directionalLightHelper.visible = false
scene.add(directionalLight)
scene.add(directionalLightHelper)

// SpotLight
const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3)
spotLight.castShadow = true
spotLight.position.set(0, 2, 2)
scene.add(spotLight)
scene.add(spotLight.target)

spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
spotLight.shadow.camera.far = 7
spotLight.shadow.camera.fov = 30    // Change FOV to reduce amplitude

const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(spotLightCameraHelper)


// PointLight
const pointLight = new THREE.PointLight(0xffffff, 0.3)
pointLight.castShadow = true
pointLight.position.set(-1, 1, 0)
scene.add(pointLight)
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
pointLight.shadow.camera.far = 0.1
pointLight.shadow.camera.far = 5

// PointLight has six perspective cameras in all directions ending in the one pointing downwards (0, -1, 0)
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera)
scene.add(pointLightCameraHelper)

gui.add(directionalLight, "visible")
gui.add(spotLight, "visible")
gui.add(pointLight, "visible")

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    new THREE.MeshStandardMaterial({
        map: bakedShadow
    })
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.5

sphere.castShadow = true
plane.receiveShadow = true

scene.add(sphere, plane)

const shadowPlane = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0xff0000,
        alphaMap: simpleShadow,
        transparent: true
    })
)
shadowPlane.rotateX(3 * Math.PI / 2)
shadowPlane.position.y = plane.position.y + 0.01
scene.add(shadowPlane)
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

renderer.shadowMap.enabled = true   // Enable shadow
// Change the shadow map
// renderer.shadowMap.type = THREE.PCFSoftShadowMap    // radius doesn't work with this shadow map

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // Update the sphere
    sphere.position.x = 2 * Math.sin(elapsedTime)
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))
    sphere.position.z = 2 * Math.cos(elapsedTime)
    // Update the shadow
    shadowPlane.material.opacity = Math.max(1 - sphere.position.y, 0.2)
    shadowPlane.scale.x = Math.max(1 - sphere.position.y, 0.2)
    shadowPlane.scale.y = Math.max(1 - sphere.position.y, 0.2)
    shadowPlane.position.x = sphere.position.x
    shadowPlane.position.z = sphere.position.z

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()