// 1️⃣ Câmera
const video = document.getElementById('video');
navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } })
.then(stream => { video.srcObject = stream; })
.catch(err => { console.error("Erro ao acessar a câmera:", err); });

// 2️⃣ Three.js
const container = document.getElementById('container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Luz
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5,5,5);
scene.add(light);

// 3️⃣ Carregar Vivi
const loader = new THREE.GLTFLoader();
let vivi;
loader.load('vivi.glb',
  gltf => {
    vivi = gltf.scene;
    vivi.position.set(0,-1,0);
    scene.add(vivi);
    animate();
  },
  undefined,
  err => console.error('Erro ao carregar GLB:', err)
);

// 4️⃣ Loop
function animate() {
  requestAnimationFrame(animate);
  if(vivi) vivi.rotation.y += 0.005;
  renderer.render(scene, camera);
}

// 5️⃣ Botão selfie
document.getElementById('captureBtn').addEventListener('click', () => {
  const canvas = document.createElement('canvas');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(renderer.domElement, 0, 0, canvas.width, canvas.height);

  ctx.font = "bold 48px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText("Estou no Vivari Beach Club", canvas.width / 2, 60);

  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'selfie_vivi.png';
    link.click();
  });
});

// 6️⃣ Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
