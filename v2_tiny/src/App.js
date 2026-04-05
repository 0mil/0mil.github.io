import * as THREE from "three"
import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Clouds, Cloud, CameraControls, Sky as SkyImpl } from "@react-three/drei"

const CLOUD_CONFIG = {
  seed: 7,
  segments: 28,
  bounds: [6, 1.8, 1.6],
  volume: 5.5,
  opacity: 0.82,
  fade: 18,
  growth: 5,
  speed: 0.14,
  color: "#ffffff",
}

export default function App() {
  return (
    <Canvas dpr={[1, 1.75]} camera={{ position: [0, -4.5, 9.5], fov: 52 }}>
      <color attach="background" args={["#eef3f7"]} />
      <ambientLight intensity={Math.PI / 1.8} />
      <directionalLight position={[4, 8, 6]} intensity={2.4} color="#ffffff" />
      <directionalLight position={[-6, 2, 4]} intensity={1.2} color="#dfe8f1" />
      <SingleCloud />
      <CameraControls
        makeDefault
        smoothTime={0.6}
        minDistance={8.5}
        maxDistance={10.5}
        truckSpeed={0}
        dollySpeed={0}
        minPolarAngle={Math.PI / 2.25}
        maxPolarAngle={Math.PI / 1.78}
        azimuthRotateSpeed={0.45}
        polarRotateSpeed={0.3}
      />
    </Canvas>
  )
}

function SingleCloud() {
  const group = useRef()
  const cloud = useRef()

  useFrame((state, delta) => {
    if (!group.current || !cloud.current) {
      return
    }

    const t = state.clock.elapsedTime
    group.current.rotation.y += delta * 0.12
    group.current.rotation.x = Math.sin(t * 0.32) * 0.08
    group.current.position.y = Math.sin(t * 0.45) * 0.16
    cloud.current.rotation.y -= delta * 0.22
  })

  return (
    <>
      <SkyImpl sunPosition={[8, 6, 2]} turbidity={5} rayleigh={0.4} mieCoefficient={0.01} mieDirectionalG={0.85} />
      <group ref={group} position={[0, 0.1, 0]}>
        <Clouds material={THREE.MeshLambertMaterial} limit={180} range={12}>
          <Cloud ref={cloud} {...CLOUD_CONFIG} />
        </Clouds>
      </group>
    </>
  )
}
