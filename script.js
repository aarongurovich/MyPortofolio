const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('cursor-follow').appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x404040);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 1, 0);
scene.add(ambientLight);
scene.add(directionalLight);

const transitionMaterial = new THREE.ShaderMaterial({
    uniforms: {
        currentColor: { type: "vec3", value: new THREE.Color(Math.random(), Math.random(), Math.random()).toArray() },
        targetColor: { type: "vec3", value: new THREE.Color(Math.random(), Math.random(), Math.random()).toArray() },
        transitionProgress: { type: "f", value: 0.0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 currentColor;
        uniform vec3 targetColor;
        uniform float transitionProgress;
        void main() {
            vec3 color = mix(currentColor, targetColor, transitionProgress);
            gl_FragColor = vec4(color, 1.0);
        }
    `
});

const geometry = new THREE.BoxGeometry();
const cube = new THREE.Mesh(geometry, transitionMaterial);
scene.add(cube);

camera.position.z = 5;

let hoveredIcon = null;

function animate() {
    requestAnimationFrame(animate);
    transitionMaterial.uniforms.transitionProgress.value += 0.01;
    if (transitionMaterial.uniforms.transitionProgress.value >= 1.0) {
        transitionMaterial.uniforms.transitionProgress.value = 0.0;
        transitionMaterial.uniforms.currentColor.value = transitionMaterial.uniforms.targetColor.value;
        transitionMaterial.uniforms.targetColor.value = new THREE.Color(Math.random(), Math.random(), Math.random()).toArray();
    }
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);

}

animate();

document.addEventListener('mousemove', event => {
    cube.position.x = (event.clientX / window.innerWidth) * 2 - 1;
    cube.position.y = -(event.clientY / window.innerHeight) * 2 + 1;
});