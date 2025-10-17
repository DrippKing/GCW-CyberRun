
      import * as THREE from "./three.module.js";
      import { OrbitControls } from "./OrbitControls.js";
      import { STLLoader } from "./STLLoader.js";
      import { GLTFLoader } from "./GLTFLoader.js";
      


const scene = new THREE.Scene();
//´pne color o iamgen de fondo bg2.jpg
   scene.background = new THREE.Color("#252440");//color  34495E   2B1E5D  191970

   //para poner imagen de fonod
 /*  const loader = new THREE.TextureLoader();
loader.load("bg2.jpg", function (texture) {//bg2.jpg  prueba
  scene.background = texture;
});*/


      //camara 
 const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight
      );
 camera.position.set(0, 5, 20);//pos en que inicia

 //encargado de que se actualice
 const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);

      //luces
            const hemisphereLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);//color intensidad
      scene.add(hemisphereLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 5, -1);
      scene.add(directionalLight);

      //´para controlar la cam
 const cameraControl = new OrbitControls(camera, renderer.domElement);

//modelos
/*
const planeGeometry = new THREE.PlaneGeometry(70, 70);//50
const loader = new THREE.TextureLoader();
      const planeMaterial = new THREE.MeshStandardMaterial({
        color: "#302c9b",//slategrey
      });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotateX(-Math.PI / 2);
      scene.add(plane);
*/
      const textureLoader = new THREE.TextureLoader();
textureLoader.load("piso3.png", function (texture) {
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2); //4,4 Puedes ajustar cuántas veces se repite la textura

  const planeGeometry = new THREE.PlaneGeometry(70, 70);
  const planeMaterial = new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide // Por si lo ves desde abajo también
  });

  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);
});

      //cubo
      const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5);
      const material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
        wireframe: true,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(0, 5, 0);
      scene.add(cube);

//impotados

//STL
 const loaderSTL = new STLLoader();
      loaderSTL.load("rock.stl", function (geometry) {
        const material = new THREE.MeshPhongMaterial({ color: "gray" });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.set(35.05, 35.05, 35.05);
       mesh.position.set(18, 0, 0);
    mesh.rotateX(-Math.PI / 2);
    scene.add(mesh);
      });
      
//GLTF
  const loaderGLB = new GLTFLoader();
      loaderGLB.load(
        "shell.glb",
        function (model) {
          const mesh = model.scene;
         mesh.scale.set(85, 85, 85);
          mesh.position.set(28, 0, 0);
          scene.add(mesh);
        }
      );


  function animate() {
       
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }

      animate();
