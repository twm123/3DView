
if (!Detector.webgl) {
  Detector.addGetWebGLMessage();
}

var container, CANVAS_WIDTH, CANVAS_HEIGHT;
var camera, controls, scene, model, renderer;
var lighting, ambient, keyLight, fillLight, backLight;
init();

animate();

function init() {

  container = document.getElementById('canvas');
  document.body.appendChild(container);

  CANVAS_WIDTH = container.clientWidth;
  CANVAS_HEIGHT = container.clientHeight;

  /* Camera */
  camera = new THREE.PerspectiveCamera(45, CANVAS_WIDTH / CANVAS_HEIGHT, 1, 1000);
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 10;

  /* Scene */
  scene = new THREE.Scene();
  lighting = false;
  ambient = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambient);
  keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
  keyLight.position.set(-100, 0, 100);
  fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
  fillLight.position.set(100, 0, 100);
  backLight = new THREE.DirectionalLight(0xffffff, 1.0);
  backLight.position.set(100, 0, -100).normalize();

  /* Model */
  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.setBaseUrl('assets/');
  mtlLoader.setPath('assets/');

  mtlLoader.load('galaxy.mtl', function(materials) {
    materials.preload();
    /*
    materials.materials.default.map.magFilter = THREE.NearestFilter;
    materials.materials.default.map.minFilter = THREE.LinearFilter;
    */
    var objLoader = new THREE.OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.setPath('assets/');

    objLoader.load('galaxy.obj', function(object) {
      scene.add(object);
      model = object;
    });
  });

  /* Renderer */
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
  renderer.setClearColor(new THREE.Color("hsl(0, 0%, 10%)"));
  container.appendChild(renderer.domElement);

  /* Controls */
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.25;
  controls.enableZoom = false;

  /* Events */
  window.addEventListener('resize', onWindowResize, false);
  window.addEventListener('keydown', onKeyboardEvent, false);
}

function onWindowResize() {
  camera.aspect = CANVAS_WIDTH / CANVAS_HEIGHT;
  camera.updateProjectionMatrix();
  renderer.setSize(CANVAS_WIDTH, CANVAS_HEIGHT);
}

function onKeyboardEvent(e) {
  if (e.code === 'KeyL') {
    lighting = !lighting;
    if (lighting) {
      ambient.intensity = 0.25;
      scene.add(keyLight);
      scene.add(fillLight);
      scene.add(backLight);
    } else {
      ambient.intensity = 1.0;
      scene.remove(keyLight);
      scene.remove(fillLight);
      scene.remove(backLight);
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}

function render() {
  model.rotation.y += 0.0125;
  renderer.render(scene, camera);
}
