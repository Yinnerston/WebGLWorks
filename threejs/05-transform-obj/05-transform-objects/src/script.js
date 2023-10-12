import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const redGeometry = new THREE.BoxGeometry(1, 0.1, 1);
const greenGeometry = new THREE.BoxGeometry(1, 0.1, 1);
const blueGeometry = new THREE.BoxGeometry(1, 0.1, 1);

const redMaterial = new THREE.MeshBasicMaterial({color: "red"})
const greenMaterial = new THREE.MeshBasicMaterial({color: "green"})
const blueMaterial = new THREE.MeshBasicMaterial({color: "blue"})

const redMesh = new THREE.Mesh(redGeometry, redMaterial)
const greenMesh = new THREE.Mesh(greenGeometry, greenMaterial)
const blueMesh = new THREE.Mesh(blueGeometry, blueMaterial)

redMesh.position.y = 0.2;
greenMesh.position.y = -0.2;
scene.add(redMesh)
scene.add(greenMesh)
scene.add(blueMesh)
/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

/**
 * We're going to animate the stacks using a sin wave
 */
const clock = new THREE.Clock();
const animateStack = () => {
    const elapsedTime = clock.getElapsedTime()

    redMesh.position.y = 0.2 + 0.5 * Math.abs(Math.sin(0.5 * elapsedTime))
    greenMesh.position.y = - 0.2 - 0.5 * Math.abs(Math.sin(0.5 * elapsedTime))
    renderer.render(scene, camera)
    requestAnimationFrame(animateStack);
}
animateStack()