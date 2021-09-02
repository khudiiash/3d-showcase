import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js' 
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js' 
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import {Text} from 'troika-three-text'
import OswaldRegular from './fonts/Oswald/Oswald-Regular.ttf'

import gsap from 'gsap'
import * as dat from 'dat.gui'
import diamondVertex from './shaders/diamond/vertex.glsl'
import diamondFragment from './shaders/diamond/fragment.glsl'
import circleVertex from './shaders/circle/vertex.glsl'
import circleFragment from './shaders/circle/fragment.glsl'
import pVertex from './shaders/particles/vertex.glsl'
import pFragment from './shaders/particles/fragment.glsl'

import postVertex from './shaders/postprocessing/vertex.glsl'
import postFragment from './shaders/postprocessing/fragment.glsl'

import seaVertex from './shaders/sea/vertex.glsl'
import seaFragment from './shaders/sea/fragment.glsl'

import Stats from 'three/examples/jsm/libs/stats.module'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import './style.css'

const gui = new dat.GUI()
const seaLevel = -1000

function guiMesh(mesh, name, addLight) {
    const meshFolder = gui.addFolder(name)
    const positionFolder = meshFolder.addFolder('position')
    const rotationFolder = meshFolder.addFolder('rotation')
    positionFolder.add(mesh.position, 'x', -200, 200, 1)
    positionFolder.add(mesh.position, 'y', -200, 200, 1)
    positionFolder.add(mesh.position, 'z', -200, 200, 1)

    rotationFolder.add(mesh.rotation, 'x', -Math.PI * 2, Math.PI * 2, 0.001)
    rotationFolder.add(mesh.rotation, 'y', -Math.PI * 2, Math.PI * 2, 0.001)
    rotationFolder.add(mesh.rotation, 'z', -Math.PI * 2, Math.PI * 2, 0.001)
    if (addLight) {
        const light = mesh.children.find(c => c.type === 'PointLight')
        const lightFolder =  meshFolder.addFolder('light')
        params[name + 'LightColor'] = `rgb(${light.color.r * 255}, ${light.color.g * 255}, ${light.color.b * 255})`
        lightFolder.addColor(params, name + 'LightColor').name('color').onChange(() => light.color = new THREE.Color(params[name + 'LightColor']).convertSRGBToLinear())
        lightFolder.add(light, 'intensity', 0, 20000, 10)
        lightFolder.add(light.position, 'x', -50, 50, .01)
        lightFolder.add(light.position, 'y', -50, 50, .01)
        lightFolder.add(light.position, 'z', -50, 50, .01)

    }
    meshFolder.add(mesh.scale, 'x', 0, 50, 0.1).name('scale').onChange(() => mesh.scale.setScalar(mesh.scale.x))

    return meshFolder
}

const stats = Stats()
// document.body.appendChild(stats.dom)



const lightColor = '#ffffff'
const bgColor = '#121212'
const params = {
    grain: .1
}

const loadingManager = new THREE.LoadingManager()
const modelLoader = new GLTFLoader(loadingManager)
const fbxLoader = new FBXLoader(loadingManager)
const textureLoader =  new THREE.TextureLoader(loadingManager)

loadingManager.onLoad = () => {
    gsap.to('#video-container', .5, {autoAlpha: 0})
    gsap.to(canvas, {opacity: 1, delay: .5})
}
modelLoader.setDRACOLoader(new DRACOLoader().setDecoderPath('/draco/'))




const darkPaperTexture = textureLoader.load('/textures/dark_paper.jpeg')
const darkPaperNormal = textureLoader.load('/textures/dark_paper_normal.jpg')
const v = document.getElementById('coding')
const videoTexture = new THREE.VideoTexture(v)
v.play()
v.onpause = () => v.play()

const projectsTextures  = [
    textureLoader.load('/images/wooder.jpg'),
    textureLoader.load('/images/audiotika.jpg'),
    textureLoader.load('/images/essay.jpg'),
    textureLoader.load('/images/bring-the-box.jpg'),
    textureLoader.load('/images/2048.jpg')
]

const mouse = new THREE.Vector2()


darkPaperTexture.wrapS = THREE.RepeatWrapping
darkPaperTexture.wrapT = THREE.RepeatWrapping


let diamondsMesh = new THREE.Group()
let whaleMixer;
let skullMixer;
let whale;



const uniforms = {
    uTime: {value: 0},
    uLightPos: {value: new THREE.Vector3()},
    uLightColor: {value: hexToRgb(lightColor)},
    uBgColor: {value: hexToRgb(bgColor)},
    uMouse: {value: mouse},
    uResolution: {value: new THREE.Vector2(window.innerWidth, window.innerHeight)},
    uCameraPos: {value: new THREE.Vector3()},
    uScroll: {value: 0},
    uGrain: {value: params.grain}
}

// Gamepad
let gamepad;
modelLoader.load('/models/controller.glb', glb => {
    gamepad = glb.scene
    gamepad.rotation.x = Math.PI / 2
    gamepad.position.set(0, -500, -30)
    gamepad.scale.setScalar(5)
    const gameLight = new THREE.PointLight('rgb(98,106,255)', 2920, 100)
    gamepad.add(gameLight)
    gameLight.position.set(0,-1.74,-10.72)

    scene.add(gamepad)
    guiMesh(gamepad, 'gamepad', true)
   
})

// Notebook

let notebook;
modelLoader.load('/models/notebook.glb', glb => {
    notebook = glb.scene
    notebook.add(video)
    notebook.children.find(c => c.name ==='Screen').material = new THREE.MeshBasicMaterial({color: 0x000000})
    video.position.set(0, 1, -0.97)
    video.scale.set(0.1958, 0.215, .2)
    notebook.scale.setScalar(29.5)
    notebook.position.y = -250
    notebook.position.z = -30
    const notebookLight = new THREE.PointLight('rgb(253,216,149)', 1500)
    notebookLight.position.y = 2

    notebook.add(notebookLight)

    // const gameLight = new THREE.PointLight(0xffffff, 1000)
    // notebook.add(gameLight)
    scene.add(notebook)
    guiMesh(video, 'video')

    guiMesh(notebook, 'notebook', true)
   
})

// Notebook text



// Whale
modelLoader.load('/models/whale3.glb', glb => {
    const animations = glb.animations
    const swim = animations[0]

    whale = glb.scene
    whale.rotation.y = Math.PI / 2
    whale.position.x = -500
    whale.position.y = -300
    whale.position.z = -500
    
    whaleMixer = new THREE.AnimationMixer( whale );

    const action = whaleMixer.clipAction( swim );
    action.play();
   
    scene.add(whale)

    whale.scale.setScalar(10)

})



const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
const canvas = document.querySelector('.webgl')
const isMobile = window.innerWidth < window.innerHeight
const scene = new THREE.Scene()
const clock = new THREE.Clock()
const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 0.01, 10000)
camera.position.set(0,0,200)


const renderer = new THREE.WebGLRenderer({ canvas, powerPreference: 'high-performance', antialias: true})
renderer.colorManagement=true
renderer.toneMapping = 1
renderer.gammaOutput = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.physicallyCorrectLights = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(0x121212)




var bufferScene = new THREE.Scene();
var bufferTexture = new THREE.WebGLRenderTarget( sizes.width * (isMobile ? 1 : .5), sizes.height * (isMobile ? 1 : .5), { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter})

// Controls
//const controls = new OrbitControls(camera, canvas)
// Light
const ambient = new THREE.AmbientLight(0xffffff, 0.9)
scene.add(ambient)
scene.fog = new THREE.Fog(0x121212, 1, 600)
const point = new THREE.Object3D()
point.position.y = 10
const lamp = new THREE.Mesh(new THREE.SphereBufferGeometry(4,32,32), new THREE.MeshBasicMaterial({color: lightColor, depthTest: false}))
lamp.renderOrder = 999
lamp.visible = false
lamp.material.color.set( lightColor ).convertSRGBToLinear()
lamp.material.encoding = THREE.sRGBEncoding
lamp.position.copy(point.position)
point.add(lamp)

point.position.set(5,20,10);
point.name = 'point'
scene.add(point)



function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : null;
}
// Clounds
const cloudG = new THREE.PlaneBufferGeometry(500, 200)
const clouds = []
for (let i = 1; i <= (isMobile ? 0 : 40); i++) {
    const t =  textureLoader.load(`/textures/Cloud${(i % 5) + 1}.png`)
    const low = -i * 50 + 300 < seaLevel
    const cloud = new THREE.Mesh(
        cloudG,
        new THREE.MeshBasicMaterial({
            map: t,
            transparent: true,
            depthTest: false,
            color: 0x9AD7ED,
            opacity: .1

        })
    )
    clouds.push(cloud)
    const x = (Math.random() - .5) * 400
    const y = low ? seaLevel : -i * 50 + 300
    const z = low ? (i - 27) * 300 - 50 : -50
    cloud.position.set(x, y, z)
    scene.add(cloud)

}




const glassMaterial =  new THREE.ShaderMaterial({
    vertexShader: diamondVertex,
    fragmentShader: diamondFragment,
    transparent: false,
    uniforms: {
        ...uniforms,
        uTexture: {value: bufferTexture},
        uRadius: {value: 1},
    }
})

const diamondGeometry = new THREE.IcosahedronBufferGeometry(5, 1);
for (let i = 0; i < 24; i ++) {
    const diamond = new THREE.Mesh(diamondGeometry, glassMaterial)
    const ringRadius = 60
    diamond.position.set(Math.sin(i) * ringRadius, Math.cos(i) * 60, 0)
    diamondsMesh.add(diamond)
}
diamondsMesh.rotation.x = -Math.PI / 2.5
diamondsMesh.position.y = -700
scene.add(diamondsMesh)
// Particles
const n = 100_000


const pGeometry = new THREE.BufferGeometry()
const pPositions = new Float32Array(n * 3)
const pTargets = new Float32Array(n * 3)

const aScales =  new Float32Array(n)
for (let i = 0; i < n * 3; i ++) {
    pPositions[i] = (Math.random() - 0.5) * 10000
    pTargets[i] = (Math.random() - 0.5) * 10000
    aScales[i] = Math.random() + .3
}

pGeometry.setAttribute('position', new THREE.BufferAttribute(pPositions, 3))
pGeometry.setAttribute('aScale', new THREE.BufferAttribute(aScales, 1))
pGeometry.setAttribute('aTarget', new THREE.BufferAttribute(pTargets, 3))


const pMaterial = new THREE.ShaderMaterial({
   
    transparent: true,
    depthWrite: false,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    vertexShader: pVertex,
    fragmentShader: pFragment,
    uniforms: {
        ...uniforms,
        uSize: {value: 40},
    }
})


const particles = new THREE.Points(pGeometry, pMaterial)
particles.name = 'particles'
scene.add(particles)


// sea
const seaTex = textureLoader.load('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/c39b86f8-55c7-433b-95e2-9d6f62bd4d06/dyvgzg-1361cb52-12de-48d5-9255-65cd6f107c30.jpg/v1/fill/w_600,h_450,q_75,strp/water_texture_10_by_greeneyezz_stock_dyvgzg-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NDUwIiwicGF0aCI6IlwvZlwvYzM5Yjg2ZjgtNTVjNy00MzNiLTk1ZTItOWQ2ZjYyYmQ0ZDA2XC9keXZnemctMTM2MWNiNTItMTJkZS00OGQ1LTkyNTUtNjVjZDZmMTA3YzMwLmpwZyIsIndpZHRoIjoiPD02MDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.tbTazMRgAONrIDGuJELP1Dl1bt99gh8db9F6eB1Wr_U')

const sea = new THREE.Mesh(
    new THREE.BoxBufferGeometry(2500, 1200, 3000, 512, 512),
    new THREE.ShaderMaterial({
        vertexShader: seaVertex,
        fragmentShader: seaFragment,
        uniforms: {...uniforms,
            uTexture: {value: seaTex},
            uRender: {value: bufferTexture}
        }
    })
)
sea.position.y = seaLevel - (1200 / 2) - 200
sea.position.z = -200


scene.add(sea)

const interactiveT = textureLoader.load('/text/INTERACTIVE.png');
interactiveT.offset = new THREE.Vector2(0, 0)

const bigG = new THREE.IcosahedronBufferGeometry(30, 1)
const bigM = new THREE.ShaderMaterial({
    vertexShader: diamondVertex,
    fragmentShader: diamondFragment,
    transparent: false,
    uniforms: {
        ...uniforms,
        uTexture: {value: bufferTexture},
        uRadius: {value: 5},
    }
})
const bigDiamond = new THREE.Mesh(bigG, bigM)


const HELLO = TextMesh('hello', 60, 40, {blending: THREE.AdditiveBlending})
const CIRCLE_TEXT = TextMesh('circleText', 100, 100)

const INTERACTIVE = new THREE.Mesh(new THREE.SphereBufferGeometry(60,128, 128), new THREE.MeshBasicMaterial({map: interactiveT, blending: 1, transparent: true}))
INTERACTIVE.add(bigDiamond)
INTERACTIVE.position.y = -170
// INTERACTIVE.scale.set(0.7, 1.6, 0.7)
guiMesh(bigDiamond, 'bigDiamond')

INTERACTIVE.visible = false


scene.add(HELLO)
scene.add(CIRCLE_TEXT)
scene.add(INTERACTIVE)

// Resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize( sizes.width, sizes.height );
})


function TextMesh(text, width = 10, height = 10, materialConfig = {}) {
    return new THREE.Mesh(
        new THREE.PlaneBufferGeometry(width, height),
        new THREE.MeshBasicMaterial({map: textureLoader.load(`/text/${text}.png`), blending: 1, opacity: .7, transparent: true, ...materialConfig}))
}
// Skull
let skull;
modelLoader.load('/models/skull.glb', glb => {

    skull = glb.scene
    skull.position.y = -750
    skull.position.z -= 40

    
    const skullLight = new THREE.PointLight(lightColor, 1500, 500)
    skullLight.position.z = 1
    skull.add(skullLight)

    skullMixer = new THREE.AnimationMixer(skull)
    const action = skullMixer.clipAction( glb.animations[0]);
    action.play();
    skull.scale.setScalar(35)

    guiMesh(skull, 'skull', true)

    scene.add(skull)
})




// Fisherman
let fisher;

modelLoader.load('/models/fisher.glb', glb => {

    fisher = glb.scene;
    fisher.scale.setScalar(40)
    fisher.position.set(isMobile ? -140 : -202.3, seaLevel - 180, 327)
    fisher.rotation.y = -1.364
    const fisherLight = new THREE.PointLight(lightColor, 1800, 100)
    fisher.add(fisherLight)
    fisherLight.position.set(-0.6, 0.7, -1.3)
    scene.add(fisher)

    guiMesh(fisher, 'fisher', true)

    

})
let touchStart = {x: 0, y: 0}
canvas.addEventListener('touchstart', e => {
    const touch = e.originalEvent?.touches[0] || e.originalEvent?.changedTouches[0] || e.touches[0] || e.changedTouches[0]
    touchStart.x = touch.clientX || touch.pageX
    touchStart.y = touch.clientY || touch.pageY
})

canvas.addEventListener('touchmove', e => {
    const touch = e.originalEvent?.touches[0] || e.originalEvent?.changedTouches[0] || e.touches[0] || e.changedTouches[0]
    const deltaX = touchStart.x - (touch.clientX || touch.pageX)
    const deltaY = touchStart.y - (touch.clientY || touch.pageY)
    
    onScroll(-deltaY * .3)
    touchStart.x =  (touch.clientX || touch.pageX)
    touchStart.y = (touch.clientY || touch.pageY)
    
})
canvas.addEventListener('wheel', e => {
    if (camera.position.y < 0 || (camera.position.y === 0 && e.deltaY < 0)) onScroll(e.deltaY)
    else gsap.to(camera.position, .1, {y: 0})
})
// Updating on mousemove/touchmove
function onMove() {
    const pos = getMousePos()

    pos.z = camera.position.z - 190
    gsap.to(point.position, .5, {x: pos.x, y: pos.y, z: pos.z})

    bigDiamond.rotation.x += pos.y * .01; 
    bigDiamond.rotation.y += pos.x * .01;

    gsap.to(bigDiamond.rotation, {z: pos.z * .01, x: pos.x * .01})
    const tp = {x: point.position.x * 3, y: point.position.y + 50, z: point.position.z - 200}
    
    if (whale) gsap.to(whale.position, 8, tp)
2
    if (notebook) gsap.to(notebook.rotation, .5, {y: mouse.x})
    // if (javascript) gsap.to(javascript.rotation,.5, {y: -mouse.x})

}


// Updating on scroll

function onScroll(deltaY) {
    console.log(camera.position.y)

    if (uniforms.uScroll.value >= Math.abs(seaLevel) ) {
        uniforms.uScroll.value = Math.abs(seaLevel) + camera.position.z
        scene.fog.far = uniforms.uScroll.value - 1000
        gsap.to(camera.position, isMobile ? 0 : .3, {z: '-=' + (isMobile ? deltaY * 5 : deltaY)})
        gsap.to(point.position, isMobile ? 0 : .3, {z: '-=' + deltaY})
    }
    else {
        uniforms.uScroll.value = -camera.position.y
        scene.fog.far = 600
        gsap.to(camera.position, isMobile ? 0 : .3, {y: '+=' + deltaY})
        gsap.to(point.position, isMobile ? 0 : .3, {y: '+=' + deltaY})
    }
    camera.position.z = Math.max(camera.position.z, 200)

    const pos = getMousePos()
    if (!isMobile) {
        pos.z = camera.position.z - 190
        gsap.to(point.position, .5, {x: pos.x, y: pos.y, z: pos.z})
    }

    if (camera.position.y < seaLevel) gsap.to(camera.position, .1, {y: seaLevel})
     gsap.to(bigDiamond.rotation, .1, {z: '+=' + (deltaY * .01)})
    //  gsap.to(diamondsMesh.rotation, .1, {z: '+=' + (deltaY * .01)})
     gsap.to(INTERACTIVE.rotation, .1, {y: '+=' + (deltaY * .01)})
     const tp = {x: point.position.x * 3, y: point.position.y, z: point.position.z - 200}
     if (whale) gsap.to(whale.position, 6, tp)

     



}

// Video


const videoG = new THREE.PlaneBufferGeometry(16, 9)
const videoM = new THREE.MeshBasicMaterial({map: videoTexture})
const video = new THREE.Mesh(videoG, videoM)
video.scale.setScalar(.2)




// Projects
const projects = []
for (let i = 0; i < 5; i++) {

    const project = new THREE.Mesh(
        new THREE.PlaneBufferGeometry(1424, 1000),
        new THREE.MeshBasicMaterial({map: projectsTextures[i]})
    )
    project.scale.setScalar(.1)
    project.position.set(0, i * 1000 * .12 + 400, 0)
    scene.add(project)
}


// Events

document.addEventListener('touchmove', (e) => {
    const touch = e.originalEvent?.touches[0] || e.originalEvent?.changedTouches[0] || e.touches[0] || e.changedTouches[0]
    mouse.x = ( (touch.clientX || touch.pageX) / window.innerWidth ) * 2 - 1
    mouse.y = - ( (touch.clientY || touch.pageY) / window.innerHeight ) * 2 + 1
    
})
document.addEventListener('mousemove', (e) => {
    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1
    mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1
    onMove()
})


const getMousePos = () => {
    var vector = new THREE.Vector3(mouse.x, mouse.y, 0)
    vector.unproject( camera );
    var dir = vector.sub( camera.position ).normalize();
    var distance = - camera.position.z / dir.z;
    distance = 200
    const pos = camera.position.clone().add( dir.multiplyScalar( distance ) );
    pos.y -= 10
    return pos
    
}



// Model
let oldElapsedTime = 0

scene.traverse((object) => {
   bufferScene.add(object.clone())
})



gsap.timeline({delay: 1})
    .from(CIRCLE_TEXT.scale, 1, {x: 0, y: 0})
    .from(HELLO.material, 1, {opacity: 0}, '<.3')
    .from(HELLO.scale, 1, {x: 0, y: 0}, '<')


// Postprocessing

//COMPOSER

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);



//custom shader pass

let counter = 0.0;
const myEffect = {
  uniforms: {
    "tDiffuse": { value: null },
    "amount": { value: counter },
    uGrain: {value: 0.05}
  },
  vertexShader: postVertex,
  fragmentShader: postFragment
}

var customPass = new ShaderPass(myEffect);
customPass.renderToScreen = true;
composer.addPass(customPass);

guiMesh(INTERACTIVE, 'interactive')

setTimeout(() => gui.add(customPass.uniforms.uGrain, 'value', 0, 1, 0.001).name('grain'), 0)


// Texts


// Create:
// const javascript = new Text()
// const nodejs = new Text()
// const words = [javascript, nodejs]
// const texts = ['I used to coding a lot to develop my skills allowing me to create whole worlds inside the browser tab', 'Node JS']
// scene.add(javascript)

// // Set properties to configure:
// words.map((w,i) => {
//     w.anchorX = '50%'
//     w.anchorY = '50%'
//     w.font = OswaldRegular
//     w.text = texts[i]
//     w.fontSize = .2
//     w.sync()

// })

const seaOfIdeas = new Text()
seaOfIdeas.text = 'I HAVE A SEA OF IDEAS'
seaOfIdeas.font = OswaldRegular
seaOfIdeas.fontSize = 50
seaOfIdeas.position.y = seaLevel
seaOfIdeas.position.z = 300
seaOfIdeas.material = sea.material
scene.add(seaOfIdeas)


const tick = () => {
    requestAnimationFrame(tick)
    const elapsedTime = clock.getElapsedTime()
    const delta = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime
    //controls.update()
    //cube.rotation.y = elapsedTime
    INTERACTIVE.rotation.y -= .01
    

    renderer.setRenderTarget(bufferTexture);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);

    if (whaleMixer) whaleMixer.update( delta  * 2);
    if (skullMixer) skullMixer.update( delta * 2 );

    diamondsMesh.rotation.y = Math.sin(elapsedTime) * .1
    diamondsMesh.rotation.x = Math.sin(elapsedTime) * .1 - Math.PI / 2

    diamondsMesh.rotation.z = -elapsedTime * .5


    // diamondsMesh.children.map(d => d.rotation.x = elapsedTime * .3 )
    pMaterial.uniforms.uTime.value = elapsedTime;
    particles.rotation.y = elapsedTime * .05
    clouds.map((c,i) => {
        c.position.x = Math.sin(elapsedTime + (i * 100) * .01) * 20
    })
    stats.update()
    uniforms.uTime.value = elapsedTime
    uniforms.uLightPos.value = new THREE.Vector3(point.position.x, point.position.y, point.position.z)
    Object.assign(uniforms.uCameraPos.value, camera.position)

    counter += 0.01;
    customPass.uniforms["amount"].value = counter;
    composer.render();
    
   if (fisher) {
       fisher.position.y += Math.sin(elapsedTime * 2) * .1
       fisher.rotation.x += Math.sin(elapsedTime) * .003
   }
   if (skull) skull.lookAt(point.position)
   if (gamepad ) {
       gamepad.rotation.x += Math.sin(elapsedTime * 2) * .005
       gamepad.rotation.y += Math.sin(elapsedTime * 2) * .005

}
if (notebook ) {
    notebook.rotation.x += Math.sin(elapsedTime * .4) * .0005
    notebook.rotation.y += Math.sin(elapsedTime * .4) * .0005
    notebook.rotation.y += Math.sin(elapsedTime * .4) * .001

}
   if (isMobile) bigDiamond.rotation.y = elapsedTime * .1
   else    bigDiamond.rotation.y =  elapsedTime


   CIRCLE_TEXT.rotation.z = elapsedTime * .5
   if (whale) whale.lookAt(point.position)

}   

gui.hide()
tick()
