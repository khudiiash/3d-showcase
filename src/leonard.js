import * as THREE from 'three'
import vertexShader from './shaders/leonard/vertex.glsl'
import fragmentShader from './shaders/leonard/fragment.glsl'

export default class LeonardSphere {
    constructor(config) {
        let {radius, rings, number, animation} = config
        const geometry = new THREE.SphereBufferGeometry(radius, rings, rings)
        geometry.attributes.position.array = geometry.attributes.position.array.map((v,i) => 
            i % 3 === 0 ? Math.abs(v) : v // cut half of the sphere
        )
        this.material = new THREE.ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: {
                uLightPos: {value: new THREE.Vector3(1,1,1)},
                uTexture: {value: new THREE.TextureLoader().load('/textures/dark_paper.jpeg')}
            }
        })
        const meshes = []
        const supermesh = new THREE.Group()
        supermesh.rotation.z = Math.PI / 2
        for (let i = 0; i < number; i ++) {
            const mesh = new THREE.Mesh(geometry, this.material)
            mesh.scale.set(1 - i * .015, 1 - i * .015, 1 - i * .015)
            supermesh.add(mesh)
            meshes.push(mesh)
        }
        this.mesh = supermesh
        this.children = supermesh.children
    }
    
}

