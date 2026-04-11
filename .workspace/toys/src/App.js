import * as THREE from "three"
import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Cloud, Clouds, CameraControls, Sky as SkyImpl } from "@react-three/drei"

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
    ? { position: [0, 0.1, 8.2], fov: 50 }
    : { position: [0, -4.5, 9.5], fov: 52 }

  return (
    <Canvas dpr={isMobile ? [1, 1.25] : [1, 1.75]} camera={camera}>
      <color attach="background" args={[isMobile ? "#dde7f0" : "#eef3f7"]} />
      <ambientLight intensity={Math.PI / 1.5} />
      <directionalLight position={[4, 8, 6]} intensity={2.6} color="#ffffff" />
      <directionalLight position={[-6, 2, 4]} intensity={1.4} color="#dfe8f1" />
      <SingleCloud isMobile={isMobile} />
      {!isMobile && (
        <CameraControls
          makeDefault
          smoothTime={0.65}
          minDistance={8.5}
          maxDistance={10.5}
          truckSpeed={0}
          dollySpeed={0}
          minPolarAngle={Math.PI / 2.25}
          maxPolarAngle={Math.PI / 1.78}
          azimuthRotateSpeed={0.45}
          polarRotateSpeed={0.3}
        />
      )}
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
    if (!group.current) {
      return
    }

    const t = state.clock.elapsedTime
    group.current.rotation.y += delta * (isMobile ? 0.07 : 0.12)
    group.current.rotation.x = Math.sin(t * 0.32) * (isMobile ? 0.04 : 0.08)
    group.current.position.y = Math.sin(t * 0.45) * (isMobile ? 0.08 : 0.16)
    group.current.position.x = Math.sin(t * 0.18) * (isMobile ? 0.02 : 0.04)

    if (cloud.current) {
      cloud.current.rotation.y -= delta * 0.22
    }
  })

  return (
    <>
      <SkyImpl sunPosition={[8, 6, 2]} turbidity={5} rayleigh={0.4} mieCoefficient={0.01} mieDirectionalG={0.85} />
      <group ref={group} position={isMobile ? [0, 0.45, 0] : [0, 0.1, 0]} scale={isMobile ? 1.12 : 1}>
        {isMobile ? <SimpleMobileCloud /> : <DesktopCloud cloudRef={cloud} config={config} />}
      </group>
    </>
  )
}

function DesktopCloud({ cloudRef, config }) {
  return (
    <Clouds material={THREE.MeshLambertMaterial} limit={180} range={12}>
      <Cloud ref={cloudRef} {...config} />
    </Clouds>
  )
}

function SimpleMobileCloud() {
  const puffs = useMemo(
    () => [
      { position: [-1.9, 0.15, 0.1], scale: [2.15, 1.55, 1.55] },
      { position: [-0.85, 0.55, 0.05], scale: [2.45, 1.85, 1.8] },
      { position: [0.45, 0.65, 0.1], scale: [2.75, 2.05, 2] },
      { position: [1.8, 0.2, 0], scale: [2.25, 1.6, 1.6] },
      { position: [-0.2, -0.2, 0.25], scale: [3.35, 1.9, 1.95] },
      { position: [1.05, -0.1, 0.2], scale: [2.4, 1.55, 1.6] },
      { position: [-1.15, -0.15, 0.15], scale: [2.25, 1.45, 1.5] },
    ],
    []
  )

  return (
    <group>
      {puffs.map((puff, index) => (
        <mesh key={index} position={puff.position} scale={puff.scale}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial
            color="#fbfdff"
            emissive="#edf4fb"
            emissiveIntensity={0.22}
            roughness={0.82}
            metalness={0}
            transparent
            opacity={0.96}
          />
        </mesh>
      ))}
    </group>
  )
}
