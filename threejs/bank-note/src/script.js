import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')
const gui = new GUI();

// Scene
const scene = new THREE.Scene()
const noteStates = {
    neutral: 0,
    activated: 1,
    curled: 2,
    activating: 3,
    deactivating: 4
}
const state = {
    note: noteStates.neutral
}

// Create the planes that comprise the bank notes
const planeGeometries = {
    nPlanes: 200,
    maxWidth: 10,
    planeWidth: 0.2,
    planeHeight: 5
}
const planes = []
const planesGroup = new THREE.Group()

// states

for (let j = 0; j < planeGeometries.nPlanes; 
    j++)
{
    const geometry = new THREE.PlaneGeometry(planeGeometries.planeWidth, planeGeometries.planeHeight)
    const material = new THREE.MeshBasicMaterial({
        color: "green",
        wireframe: true,
        side: THREE.DoubleSide
    })
    const plane = new THREE.Mesh(geometry, material)
    plane.position.x = (j * planeGeometries.planeWidth) - (planeGeometries.maxWidth / 2);   // x Ranges from [-5, 5]
    planes.push(plane)
    planesGroup.add(plane)
}
scene.add(planesGroup)

// Sizes
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

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// Animate
const clock = new THREE.Clock()
var prevElapsedTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const getZ = () => Math.sin(elapsedTime * 2 * Math.PI)  + timeDelta * planes[1].position.z
    const shiftPlanes = (val) => {
        for (let i = planeGeometries.nPlanes - 1; i > 0; i--)
        {
            planes[i].position.z = planes[i - 1].position.z
        }
        planes[0].position.z = val;
    }
    // Update controls
    controls.update()
    const timeDelta = elapsedTime - prevElapsedTime;
    // Update the bank note at max 60 times per second
    if (timeDelta > 1 / 60)
    {
        prevElapsedTime = elapsedTime;
        if (state.note === noteStates.neutral)
        {
            shiftPlanes(0);
        } else if (state.note === noteStates.activated)
        {
            shiftPlanes(getZ());
        } else if (state.note === noteStates.activating)
        {
            shiftPlanes(0);
            if (Math.abs(getZ()) < 0.05)    {
                state.note = noteStates.activated
            }
        } else if (state.note === noteStates.deactivating)
        {
            // Copy activated until close to z=0
            shiftPlanes(getZ());
            if (Math.abs(planes[0].position.z) < 0.05)   // If within range, go neutral
            {
                state.note = noteStates.neutral
            }
        }
    
    }
    
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

// Add features to change state
window.addEventListener("keydown", (event) => {
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    if (event.key === "1")
    {
        // Activate the state
        if (state.note === noteStates.neutral)
        {
            state.note = noteStates.activating;
        }
    } else if (event.key === "2")
    {
        // Deactivate the state
        if (state.note === noteStates.activated)
        {
            state.note = noteStates.deactivating;
        }
    }
    
  })



// Add debugging features
gui.add(planesGroup.position, "x").min(-10).max(10).step(0.01)
gui.add(clock, "elapsedTime").min(0).max(1000).step(0.01)