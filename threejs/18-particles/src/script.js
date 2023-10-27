import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
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

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load("/textures/particles/9.png")
console.log(particleTexture)
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
            let random = Math.random() * 0.03
            particlesPositions[particleIdx] = startingX + i * gap
            particlesPositions[particleIdx + 1] = startingY
            particlesPositions[particleIdx + 1] = Math.random() * 1000
            // particlesPositions[particleIdx + 2] = Math.min(1, 10 / z ) < 1 ? Math.min(1, 10 / z ) : 0
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
points.scale.x = 0.3
points.scale.y = 0.3
scene.add(points)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

scene.add(new THREE.AxesHelper())

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
    /**
     * We can update the geometry manually like:
     * but it's better to write a custom shader for performance
     */
    // for(let i = 0; i < count * 3; i++) // Multiply by 3 for same reason
    // {
    //     positions[i] = (Math.random() - 0.5) * 10 // Math.random() - 0.5 to have a random value between -0.5 and +0.5
    // }

    // particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) // Create the Three.js BufferAttribute and specify that each information is composed of 3 values
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()