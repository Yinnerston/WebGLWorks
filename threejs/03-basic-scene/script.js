console.log(THREE)  // Three js object -->  import * as THREE from 'three'

// Create your first scene

// Scene
const scene = new THREE.Scene();

// Objects
// Primitive geometries, imported models, particles, lights, etc

// Mesh: Visible object is a combination of geometry (shape) and material (how it looks)
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({color: "red"});
const boxMesh = new THREE.Mesh(geometry, material);
scene.add(boxMesh);  // create red cube

// Add a perspective camera (default camera)
const sizes = {
    width: 800,
    height: 600
}
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, ); // fov, aspect ratio
// Threejs coordinate system
// z: perpendicular to screen plane
// y: vertical up down
// x: horizontal left right
camera.position.z = 3;
scene.add(camera);

// Renderer: render the scene from the camera pov. Draws on canvas
// we did this in html
canvas = document.querySelector(".webgl");  // Fetch canvas
console.log(canvas)
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);