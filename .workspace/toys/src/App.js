import * as THREE from "three"
import { useEffect, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Clouds, Cloud, CameraControls, Sky as SkyImpl } from "@react-three/drei"

const BASE_CLOUD_CONFIG = {
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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)")
    const sync = () => setIsMobile(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  const camera = isMobile
    ? { position: [0, -1.25, 10.6], fov: 58 }
    : { position: [0, -4.5, 9.5], fov: 52 }

  return (
    <Canvas dpr={isMobile ? [1, 1.35] : [1, 1.75]} camera={camera}>
      <color attach="background" args={["#eef3f7"]} />
      <ambientLight intensity={Math.PI / 1.7} />
      <directionalLight position={[4, 8, 6]} intensity={2.5} color="#ffffff" />
      <directionalLight position={[-6, 2, 4]} intensity={1.25} color="#dfe8f1" />
      <SingleCloud isMobile={isMobile} />
      <CameraControls
        makeDefault
        smoothTime={0.65}
        minDistance={isMobile ? 9.8 : 8.5}
        maxDistance={isMobile ? 11.2 : 10.5}
        truckSpeed={0}
        dollySpeed={0}
        minPolarAngle={Math.PI / (isMobile ? 2.15 : 2.25)}
        maxPolarAngle={Math.PI / (isMobile ? 1.82 : 1.78)}
        azimuthRotateSpeed={isMobile ? 0.28 : 0.45}
        polarRotateSpeed={isMobile ? 0.22 : 0.3}
      />
    </Canvas>
  )
}

function SingleCloud({ isMobile }) {
  const group = useRef()
  const cloud = useRef()
  const config = isMobile
    ? {
        ...BASE_CLOUD_CONFIG,
        bounds: [5.8, 1.8, 1.55],
        volume: 5.2,
        opacity: 0.88,
      }
    : BASE_CLOUD_CONFIG

  useFrame((state, delta) => {
    if (!group.current || !cloud.current) {
      return
    }

    const t = state.clock.elapsedTime
    group.current.rotation.y += delta * (isMobile ? 0.09 : 0.12)
    group.current.rotation.x = Math.sin(t * 0.32) * (isMobile ? 0.06 : 0.08)
    group.current.position.y = Math.sin(t * 0.45) * (isMobile ? 0.12 : 0.16)
    group.current.position.x = Math.sin(t * 0.18) * (isMobile ? 0.08 : 0.04)
    cloud.current.rotation.y -= delta * (isMobile ? 0.16 : 0.22)
  })

  return (
    <>
      <SkyImpl sunPosition={[8, 6, 2]} turbidity={5} rayleigh={0.4} mieCoefficient={0.01} mieDirectionalG={0.85} />
      <group ref={group} position={isMobile ? [0, 0.35, 0] : [0, 0.1, 0]} scale={isMobile ? 1.18 : 1}>
        <Clouds material={THREE.MeshLambertMaterial} limit={180} range={12}>
          <Cloud ref={cloud} {...config} />
        </Clouds>
      </group>
    </>
  )
}
