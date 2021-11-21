import { BufferAttribute, InstancedBufferAttribute, InstancedBufferGeometry, Mesh, SphereBufferGeometry } from "three";
import BubbleMaterial from "./material/bubbleMat";

export default class Bubbles extends Mesh {

  constructor(geo: InstancedBufferGeometry, mat: BubbleMaterial) {
    super(geo, mat)
  }

  public static create(): [InstancedBufferGeometry, BubbleMaterial] {
    const mat: BubbleMaterial = new BubbleMaterial()
    const originGeo: SphereBufferGeometry = new SphereBufferGeometry(0.03, 20, 12)

    const instances: number = 500

    const geo: InstancedBufferGeometry = new InstancedBufferGeometry()
    const verts = originGeo.attributes.position.clone()
    geo.setAttribute("position", verts)
    const uvs = originGeo.attributes.uv.clone()
    geo.setAttribute("uv", uvs)
    const normals = originGeo.attributes.normal.clone()
    geo.setAttribute("normal", normals)
    const rawIndices = originGeo.index.array
    const indices = new BufferAttribute(new Uint16Array(rawIndices), 1)
    geo.setIndex(indices)

    const offsetPos: InstancedBufferAttribute = new InstancedBufferAttribute(new Float32Array(instances * 3), 3)
    const index: InstancedBufferAttribute = new InstancedBufferAttribute(new Float32Array(instances), 1)

    for(let i = 0; i < instances; i++) {
      offsetPos.setXYZ(i, (Math.random()-0.5) * 3, (Math.random()-0.5) * 3, (Math.random()-0.5) * 3)
      index.setX(i, i)
    }
    geo.setAttribute("offsetPos", offsetPos)
    geo.setAttribute("index", index)

    geo.attributes.position.needsUpdate = true
    geo.attributes.uv.needsUpdate = true
    geo.attributes.normal.needsUpdate = true
    geo.attributes.offsetPos.needsUpdate = true

    return [geo, mat]
  }

}