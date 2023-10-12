import {
  BoxBufferGeometry,
  SphereGeometry,
  BufferGeometry,
  BufferAttribute,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  TextureLoader,
} from 'three';

function createMaterial() {
  // create a texture loader.
  const textureLoader = new TextureLoader();

  // load a texture
  const bwTexture = textureLoader.load(
    '/assets/textures/uv-test-bw.png',
  );
  const texture = textureLoader.load(
    '/assets/textures/uv-test-col.png',
  );
  
  console.log(texture)
  // create a "standard" material using
  // the texture we just loaded as a color map
  const material = new MeshStandardMaterial({
    map: texture,
    // lightMap: bwTexture,
    // lightMapIntensity: 0.1
  });

  return material;
}

function createCube() {
  const geometry = new SphereGeometry();
  
  const material = createMaterial();
  const cube = new Mesh(geometry, material);

  cube.rotation.set(-0.5, -0.1, 0.8);

  const radiansPerSecond = MathUtils.degToRad(30);

  cube.tick = (delta) => {
    // increase the cube's rotation each frame
    cube.rotation.z += delta * radiansPerSecond;
    cube.rotation.x += delta * radiansPerSecond;
    cube.rotation.y += delta * radiansPerSecond;
  };

  return cube;
}

export { createCube };
