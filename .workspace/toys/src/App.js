import * as THREE from "three"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Clouds, Cloud, TrackballControls, Sky as SkyImpl } from "@react-three/drei"

const CLOUD_ANIMATION_SPEED = 1.32

const BASE_CLOUD_CONFIG = {
  seed: 7,
  segments: 28,
  bounds: [6, 1.8, 1.6],
  volume: 5.5,
  opacity: 0.82,
  fade: 18,
  growth: 5,
  speed: 0.14 * CLOUD_ANIMATION_SPEED,
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
      <ReturningCameraControls
        key={isMobile ? "mobile" : "desktop"}
        isMobile={isMobile}
        makeDefault
        minDistance={isMobile ? 9.8 : 8.5}
        maxDistance={isMobile ? 11.2 : 10.5}
        noPan
        noZoom
        staticMoving
        rotateSpeed={isMobile ? 0.7 : 0.85}
      />
    </Canvas>
  )
}

function ReturningCameraControls({ isMobile, ...props }) {
  const controls = useRef()
  const home = useRef()
  const returning = useRef(false)
  const offset = useRef(new THREE.Vector3())

  useEffect(() => {
    const cameraControls = controls.current
    const camera = cameraControls.object
    let returnTimer

    cameraControls.update()
    home.current = {
      position: camera.position.clone(),
      quaternion: camera.quaternion.clone(),
      up: camera.up.clone(),
      target: cameraControls.target.clone(),
    }
    returning.current = false

    const onStart = () => {
      window.clearTimeout(returnTimer)
      returning.current = false
    }
    const onEnd = () => {
      window.clearTimeout(returnTimer)
      returnTimer = window.setTimeout(() => {
        returning.current = true
      }, 500)
    }

    cameraControls.addEventListener("start", onStart)
    cameraControls.addEventListener("end", onEnd)
    return () => {
      window.clearTimeout(returnTimer)
      returning.current = false
      cameraControls.removeEventListener("start", onStart)
      cameraControls.removeEventListener("end", onEnd)
    }
  }, [isMobile])

  useFrame((state, delta) => {
    if (!returning.current || !home.current) return

    const cameraControls = controls.current
    const camera = cameraControls.object
    const initial = home.current
    const blend = 1 - Math.exp(-delta / 0.9)
    const radius = THREE.MathUtils.lerp(
      camera.position.distanceTo(cameraControls.target),
      initial.position.distanceTo(initial.target),
      blend
    )

    // Interpolate orientation around the cloud, rather than cutting through it.
    camera.quaternion.slerp(initial.quaternion, blend)
    cameraControls.target.lerp(initial.target, blend)
    camera.position.copy(offset.current.set(0, 0, radius).applyQuaternion(camera.quaternion)).add(cameraControls.target)
    camera.up.set(0, 1, 0).applyQuaternion(camera.quaternion)

    if (camera.quaternion.angleTo(initial.quaternion) < 0.001 && camera.position.distanceTo(initial.position) < 0.001) {
      camera.position.copy(initial.position)
      camera.quaternion.copy(initial.quaternion)
      camera.up.copy(initial.up)
      cameraControls.target.copy(initial.target)
      returning.current = false
    }
  })

  return <TrackballControls ref={controls} {...props} />
}

function SingleCloud({ isMobile }) {
  const group = useRef()
  const cloud = useRef()
  const clouds = useRef()

  useLayoutEffect(() => {
    clouds.current.traverse((node) => {
      if (!node.isMesh || !node.material) return

      const material = node.material
      const compileCloudShader = material.onBeforeCompile
      material.onBeforeCompile = (shader, renderer) => {
        compileCloudShader.call(material, shader, renderer)
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <map_fragment>",
          `#include <map_fragment>
          // Separate wispy edges from dense cores without tinting the white highlights.
          diffuseColor.a = mix(diffuseColor.a, smoothstep(0.04, 0.96, diffuseColor.a), 0.6);`
        )
      }
      material.customProgramCacheKey = () => "cloud-density-contrast-v1"
      material.needsUpdate = true
    })
  }, [])
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

    const t = state.clock.elapsedTime * CLOUD_ANIMATION_SPEED
    const animationDelta = delta * CLOUD_ANIMATION_SPEED
    group.current.rotation.y += animationDelta * (isMobile ? 0.09 : 0.12)
    group.current.rotation.x = Math.sin(t * 0.32) * (isMobile ? 0.06 : 0.08)
    group.current.position.y = Math.sin(t * 0.45) * (isMobile ? 0.12 : 0.16)
    group.current.position.x = Math.sin(t * 0.18) * (isMobile ? 0.08 : 0.04)
    cloud.current.rotation.y -= animationDelta * (isMobile ? 0.16 : 0.22)
  })

  return (
    <>
      <SkyImpl sunPosition={[8, 6, 2]} turbidity={5} rayleigh={0.4} mieCoefficient={0.01} mieDirectionalG={0.85} />
      <group ref={group} position={isMobile ? [0, 0.35, 0] : [0, 0.1, 0]} scale={isMobile ? 1.18 : 1}>
        <Clouds ref={clouds} material={THREE.MeshLambertMaterial} limit={180} range={12}>
          <Cloud ref={cloud} {...config} />
        </Clouds>
      </group>
    </>
  )
}
