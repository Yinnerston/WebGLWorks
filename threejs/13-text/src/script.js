import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
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

// Add AxesHelper to help center the text
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const matcapTexture = textureLoader.load("/textures/matcaps/7.png")
const donutMatcapTexture = textureLoader.load("/textures/matcaps/8.png")

// Load font
const fontLoader = new FontLoader();
const font = fontLoader.load(
    '/fonts/univers/Univers LT Std 55_Regular.json',
    function (font) {
        const textGeometry = new TextGeometry(
            'Hello Three.js',
            {
                font: font,
                size: 0.5,
                height: 0.2,
                
                curveSegments: 6,
                bevelEnabled: true,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 5
            }
        )
        // TODO: Matcap materials --> Applied based on the normal relative to the camera position
        const textMaterial = new THREE.MeshMatcapMaterial({
            matcap: matcapTexture
        })
        const text = new THREE.Mesh(textGeometry, textMaterial)
        // How do we center objects like text?
            // Bounding boxes
        textGeometry.computeBoundingBox()
        console.log(textGeometry.boundingBox)   // Gives you [min, max] vec3 arr
        // Translate GEOMETRY not MESH to allow you to rotate on the centre
            // TODO: Frustrum culling
        textGeometry.translate(
            -(textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x) * 0.5,   // TODO: Subtract bevel
            -(textGeometry.boundingBox.max.y - textGeometry.boundingBox.min.y) * 0.5,   // What do min/max actually mean here?
            -(textGeometry.boundingBox.max.z - textGeometry.boundingBox.min.z) * 0.5 )
        // text.position.x = -2.5
        textGeometry.computeBoundingBox()
        console.log(textGeometry.boundingBox)   // Gives you [min, max] vec3 arr

        scene.add(text)
        
        const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45)
        const donutMaterial = new THREE.MeshMatcapMaterial({
            matcap: donutMatcapTexture
        })
        for (let i = 0; i < 1000; ++i)
        {
            const donutMesh = new THREE.Mesh(donutGeometry, donutMaterial)
            donutMesh.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10)
            const scale = Math.random()
            donutMesh.scale.set(scale, scale, scale)
            donutMesh.rotation.x = Math.random() * Math.PI
            donutMesh.rotation.y = Math.random() * Math.PI
            scene.add(donutMesh)
        }
    }
)

/**
 * Object
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)
cube.position.x = 0
cube.position.y = -0.5
cube.scale.x = 5
cube.scale.y = 0.1
scene.add(cube)

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
camera.position.z = 5
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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()