import * as THREE from "three"
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Clouds, Cloud, TrackballControls, Sky as SkyImpl } from "@react-three/drei"

const CLOUD_ANIMATION_SPEED = 1.32
const CLOUD_DRAG_DAMPING = 0.18
const CLOUD_PIXEL_SCALE = 2.7
const CLOUD_OUTLINE_PASS = { value: 0 }

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
  const [isCartoon, setIsCartoon] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(max-width: 640px)")
    const sync = () => setIsMobile(media.matches)
    sync()
    media.addEventListener("change", sync)
    return () => media.removeEventListener("change", sync)
  }, [])

  const camera = useMemo(() => isMobile
    ? { position: [0, -1.25, 10.6], fov: 58 }
    : { position: [0, -4.5, 9.5], fov: 52 }, [isMobile])

  return (
    <div className="cloud-viewer">
      <Canvas frameloop={isCartoon ? "demand" : "always"} dpr={isMobile ? [1, 1.35] : [1, 1.75]} camera={camera}>
      <color attach="background" args={["#eef3f7"]} />
      <ambientLight intensity={Math.PI / 1.7} />
      <directionalLight position={[4, 8, 6]} intensity={2.5} color="#ffffff" />
      <directionalLight position={[-6, 2, 4]} intensity={1.25} color="#dfe8f1" />
      <SingleCloud isMobile={isMobile} isCartoon={isCartoon} />
      <CloudOutline enabled={isCartoon} isMobile={isMobile} />
      <ReturningCameraControls
        key={isMobile ? "mobile" : "desktop"}
        isMobile={isMobile}
        makeDefault
        minDistance={isMobile ? 9.8 : 8.5}
        maxDistance={isMobile ? 11.2 : 10.5}
        noPan
        noZoom
        staticMoving
        dynamicDampingFactor={CLOUD_DRAG_DAMPING}
        rotateSpeed={isMobile ? 0.7 : 0.85}
      />
      </Canvas>
      <button
        className="cartoon-toggle"
        type="button"
        aria-pressed={isCartoon}
        aria-label="Pixel rendering"
        title={isCartoon ? "Turn pixel rendering off" : "Turn pixel rendering on"}
        onClick={() => setIsCartoon((enabled) => !enabled)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" opacity="0.5" />
          <rect x="3" y="14" width="7" height="7" rx="1" opacity="0.5" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      </button>
    </div>
  )
}

function CloudOutline({ enabled, isMobile }) {
  const resources = useMemo(() => {
    // Keep depth labels discrete: blended labels can create broken inner strokes.
    const target = new THREE.WebGLRenderTarget(1, 1, {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
    })
    const material = new THREE.ShaderMaterial({
      uniforms: { mask: { value: target.texture }, texel: { value: new THREE.Vector2() } },
      vertexShader: `varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader: `uniform sampler2D mask;
        uniform vec2 texel;
        varying vec2 vUv;
        void main() {
          // Use the same solid coverage for inner and outer strokes.
          // Selective gap filling could cut a continuous outline into dashes.
          vec4 centerSample = texture2D(mask, vUv);
          float center = centerSample.a;
          float edge = 0.0;
          float overlap = 0.0;
          float depth = centerSample.r / max(centerSample.a, 0.001);
          for (int i = 0; i < 16; i++) {
            float angle = float(i) * 6.2831853 / 16.0;
            vec2 direction = vec2(cos(angle), sin(angle)) * texel;
            vec2 uv = vUv + direction;
            vec4 neighborSample = texture2D(mask, uv);
            float neighbor = neighborSample.a;
            // Sample inside the stroke too, so narrow gaps cannot break its coverage.
            edge = max(edge, max(neighbor, texture2D(mask, vUv + direction * 0.5).a));
            // Draw on the foreground side of a substantial depth boundary.
            float neighborDepth = neighborSample.r / max(neighborSample.a, 0.001);
            overlap = max(overlap, step(0.035, depth - neighborDepth) *
              step(0.995, neighborSample.a) * step(0.995, centerSample.a));
          }
          float outer = (1.0 - smoothstep(0.35, 0.65, center)) * smoothstep(0.35, 0.65, edge);
          float inner = step(0.7, center) * overlap;
          float ink = max(outer, inner);
          if (ink < 0.01) discard;
          gl_FragColor = vec4(vec3(0.29), ink);
        }`,
      depthTest: false,
      depthWrite: false,
      transparent: true,
      toneMapped: false,
    })
    const geometry = new THREE.PlaneGeometry(2, 2)
    const overlay = new THREE.Scene()
    overlay.add(new THREE.Mesh(geometry, material))
    return { target, material, geometry, overlay, camera: new THREE.Camera(), size: new THREE.Vector2(), clearColor: new THREE.Color(), hidden: [] }
  }, [])

  useEffect(() => () => {
    resources.target.dispose()
    resources.material.dispose()
    resources.geometry.dispose()
  }, [resources])

  useFrame(({ gl, scene, camera }) => {
    if (!enabled) {
      gl.render(scene, camera)
      return
    }
    gl.getDrawingBufferSize(resources.size)
    const { x: width, y: height } = resources.size
    if (resources.target.width !== width || resources.target.height !== height) {
      resources.target.setSize(width, height)
    }
    const thickness = (isMobile ? 3.5 : 5.0) * gl.getPixelRatio()
    resources.material.uniforms.texel.value.set(thickness / width, thickness / height)
    const hidden = resources.hidden
    hidden.length = 0
    const background = scene.background
    const clearColor = gl.getClearColor(resources.clearColor)
    const clearAlpha = gl.getClearAlpha()
    const previousTarget = gl.getRenderTarget()
    // Render just the cloud into an alpha mask; leave the sky out of the outline.
    scene.traverse((node) => {
      if (node.isMesh && node.visible && !node.userData.cloudSilhouette) {
        hidden.push(node)
        node.visible = false
      }
    })
    scene.background = null
    gl.setClearColor(0x000000, 0)
    gl.setRenderTarget(resources.target)
    CLOUD_OUTLINE_PASS.value = 1
    gl.render(scene, camera)
    CLOUD_OUTLINE_PASS.value = 0
    hidden.forEach((node) => { node.visible = true })
    scene.background = background
    gl.setClearColor(clearColor, clearAlpha)
    gl.setRenderTarget(previousTarget)
    gl.render(scene, camera)
    const autoClear = gl.autoClear
    gl.autoClear = false
    gl.render(resources.overlay, resources.camera)
    gl.autoClear = autoClear
  }, 1)

  return null
}

function ReturningCameraControls({ isMobile, ...props }) {
  const invalidate = useThree((state) => state.invalidate)
  const controls = useRef()
  const home = useRef()
  const returning = useRef(false)
  const dragging = useRef(false)
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
      dragging.current = true
      invalidate()
      window.clearTimeout(returnTimer)
      returning.current = false
      // Catch the cloud immediately when grabbed again, clearing any old momentum.
      cameraControls.staticMoving = false
      cameraControls.dynamicDampingFactor = 1
      cameraControls.update()
      cameraControls.staticMoving = true
      cameraControls.dynamicDampingFactor = CLOUD_DRAG_DAMPING
    }
    const onEnd = () => {
      dragging.current = false
      invalidate()
      window.clearTimeout(returnTimer)
      cameraControls.staticMoving = false
      returnTimer = window.setTimeout(() => {
        // Let the toss decay during the pause, then hand over to the home transition.
        cameraControls.dynamicDampingFactor = 1
        cameraControls.update()
        cameraControls.staticMoving = true
        returning.current = true
        invalidate()
      }, 500)
    }

    cameraControls.addEventListener("start", onStart)
    cameraControls.addEventListener("end", onEnd)
    return () => {
      window.clearTimeout(returnTimer)
      returning.current = false
      dragging.current = false
      cameraControls.removeEventListener("start", onStart)
      cameraControls.removeEventListener("end", onEnd)
    }
  }, [isMobile, invalidate])

  useFrame((state, delta) => {
    // Trackball updates run before this callback; keep drag and return frames alive.
    if (dragging.current) state.invalidate()
    if (!returning.current || !home.current) return

    const cameraControls = controls.current
    const camera = cameraControls.object
    const initial = home.current
    const blend = 1 - Math.exp(-Math.min(delta, 0.05) / 0.9)
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
    if (returning.current) state.invalidate()
  })

  return <TrackballControls ref={controls} {...props} />
}

function SingleCloud({ isMobile, isCartoon }) {
  const group = useRef()
  const cloud = useRef()
  const clouds = useRef()
  const cartoonUniform = useRef({ value: 0 })
  const pixelUnitsUniform = useRef({ value: 4 })
  const viewDistanceUniform = useRef({ value: 10.5 })
  const contourSmoothingUniform = useRef({ value: 0.1 })

  useLayoutEffect(() => {
    cartoonUniform.current.value = isCartoon ? 1 : 0
    // Flat opaque sprites need real depth occlusion, rather than transparency sorting.
    clouds.current.traverse((node) => {
      if (node.isMesh && node.material) node.material.depthWrite = isCartoon
    })
  }, [isCartoon])

  useLayoutEffect(() => {
    contourSmoothingUniform.current.value = isMobile ? 0.05 : 0.1
  }, [isMobile])

  useLayoutEffect(() => {
    const originals = []
    clouds.current.traverse((node) => {
      if (!node.isMesh || !node.material) return
      node.userData.cloudSilhouette = true

      const material = node.material
      const compileCloudShader = material.onBeforeCompile
      originals.push({ material, compileCloudShader, cacheKey: material.customProgramCacheKey })
      material.onBeforeCompile = (shader, renderer) => {
        compileCloudShader.call(material, shader, renderer)
        shader.uniforms.cloudCartoon = cartoonUniform.current
        shader.uniforms.cloudPixelUnits = pixelUnitsUniform.current
        shader.uniforms.cloudViewDistance = viewDistanceUniform.current
        shader.uniforms.cloudOutlinePass = CLOUD_OUTLINE_PASS
        shader.uniforms.cloudContourSmoothing = contourSmoothingUniform.current
        shader.vertexShader = `uniform float cloudCartoon;\nuniform float cloudPixelUnits;\nuniform float cloudViewDistance;\nvarying vec2 vCloudPixelGrid;\nvarying float vCloudFront;\nvarying float vCloudDepth;\n${shader.vertexShader}`
        shader.vertexShader = shader.vertexShader.replace(
          "#include <project_vertex>",
          `#include <project_vertex>
          // Ignore each sprite's spin in pixel mode: all squares share the screen axes.
          mat4 cloudModelView = modelViewMatrix * instanceMatrix;
          vec4 cloudCenter = cloudModelView * vec4(0.0, 0.0, 0.0, 1.0);
          vCloudDepth = clamp((cloudCenter.z + cloudViewDistance + 6.0) / 12.0, 0.0, 1.0);
          vCloudFront = clamp(floor((cloudCenter.z + cloudViewDistance + 1.6) / 0.8), 0.0, 4.0) / 4.0;
          if (cloudCartoon > 0.5) {
            vec2 cloudScale = vec2(length(cloudModelView[0].xyz), length(cloudModelView[1].xyz));
            mvPosition = cloudCenter + vec4(transformed.xy * cloudScale, 0.0, 0.0);
            gl_Position = projectionMatrix * mvPosition;
          }`
        )
        shader.vertexShader = shader.vertexShader.replace(
          "#include <fog_vertex>",
          `#include <fog_vertex>
          vCloudPixelGrid = max(vec2(4.0), floor(vec2(length(instanceMatrix[0].xyz), length(instanceMatrix[1].xyz)) * cloudPixelUnits + 0.5));`
        )
        shader.fragmentShader = `uniform float cloudCartoon;\nuniform float cloudOutlinePass;\nuniform float cloudContourSmoothing;\nvarying vec2 vCloudPixelGrid;\nvarying float vCloudFront;\nvarying float vCloudDepth;\n${shader.fragmentShader}`
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <map_fragment>",
          `if (cloudCartoon < 0.5) {
          #include <map_fragment>
          }
          #ifdef USE_MAP
          if (cloudCartoon > 0.5) {
            // Keep the pixel pattern attached to each cloud instead of re-sampling screen cells.
            vec2 pixelUv = (floor(vMapUv * vCloudPixelGrid) + 0.5) / vCloudPixelGrid;
            // Smooth density at a fixed mip, never across a pixel's interior.
            // UV blending produced partially filled cells and hairline cracks.
            float contourMip = 3.5 + cloudContourSmoothing * 2.0;
            vec4 pixelSample = texture2DLodEXT(map, pixelUv, contourMip);
            diffuseColor = vec4(diffuse, opacity) * pixelSample;
            // Average neighboring cells to remove small spikes and isolated pixels.
            vec2 tap = 1.0 / vCloudPixelGrid;
            diffuseColor.a = opacity * (
              pixelSample.a * 4.0 +
              texture2DLodEXT(map, pixelUv + vec2(tap.x, 0.0), contourMip).a * 2.0 +
              texture2DLodEXT(map, pixelUv - vec2(tap.x, 0.0), contourMip).a * 2.0 +
              texture2DLodEXT(map, pixelUv + vec2(0.0, tap.y), contourMip).a * 2.0 +
              texture2DLodEXT(map, pixelUv - vec2(0.0, tap.y), contourMip).a * 2.0 +
              texture2DLodEXT(map, pixelUv + tap, contourMip).a +
              texture2DLodEXT(map, pixelUv - tap, contourMip).a +
              texture2DLodEXT(map, pixelUv + vec2(tap.x, -tap.y), contourMip).a +
              texture2DLodEXT(map, pixelUv + vec2(-tap.x, tap.y), contourMip).a
            ) / 16.0;
          }
          #endif
          // Separate wispy edges from dense cores without tinting the white highlights.
          diffuseColor.a = mix(diffuseColor.a, smoothstep(0.04, 0.96, diffuseColor.a), 0.6);
          if (cloudCartoon > 0.5) {
            if (diffuseColor.a < 0.24) discard;
            // The mask needs only coverage and depth, not lighting or cel shading.
            if (cloudOutlinePass > 0.5) {
              gl_FragColor = vec4(vCloudDepth, 0.0, 0.0, 1.0);
              return;
            }
          }`
        )
        shader.fragmentShader = shader.fragmentShader.replace(
          "gl_FragColor = vec4(outgoingLight, diffuseColor.a * vOpacity);",
          `gl_FragColor = vec4(outgoingLight, diffuseColor.a * vOpacity);
          if (cloudCartoon > 0.5) {
            float density = diffuseColor.a;
            // Give each cloud its own broad, stable cel-shading bands.
            // Opaque pixels prevent overlapping layers from creating mottled colors.
            float shade = vCloudFront;
            #ifdef USE_MAP
            vec2 shadeUv = (floor(vMapUv * vCloudPixelGrid) + 0.5) / vCloudPixelGrid;
            vec2 sphereXY = (shadeUv - 0.5) * 2.0;
            // Read broad density changes, rather than the texture's wispy noise.
            vec2 densityTap = max(vec2(0.055), 1.2 / vCloudPixelGrid);
            // A fixed mip level avoids derivative seams at the quantized UV boundaries.
            float densityCenter = texture2DLodEXT(map, shadeUv, 3.5).a;
            float densityLeft = texture2DLodEXT(map, shadeUv - vec2(densityTap.x, 0.0), 3.5).a;
            float densityRight = texture2DLodEXT(map, shadeUv + vec2(densityTap.x, 0.0), 3.5).a;
            float densityBottom = texture2DLodEXT(map, shadeUv - vec2(0.0, densityTap.y), 3.5).a;
            float densityTop = texture2DLodEXT(map, shadeUv + vec2(0.0, densityTap.y), 3.5).a;
            float broadDensity = (densityCenter * 4.0 + densityLeft + densityRight + densityBottom + densityTop) / 8.0;
            vec2 densitySlope = vec2(densityLeft - densityRight, densityBottom - densityTop);
            // Two broad puffs break the concentric sphere bands into cloud-like lobes.
            // UV-anchored detail stays still when the cloud is idle.
            vec2 puffA = (shadeUv - vec2(0.31, 0.63)) * vec2(4.2, 4.6);
            vec2 puffB = (shadeUv - vec2(0.70, 0.43)) * vec2(4.8, 4.0);
            vec2 puffSlope = 0.55 * puffA * exp(-dot(puffA, puffA)) +
              0.45 * puffB * exp(-dot(puffB, puffB));
            vec3 cloudNormal = normalize(vec3(sphereXY + densitySlope * 0.8 + puffSlope,
              sqrt(max(0.02, 1.0 - dot(sphereXY, sphereXY)))));
            float localLight = max(0.0, dot(cloudNormal, normalize(vec3(-0.45, 0.65, 0.8))));
            float cloudLight = localLight * 0.78 + vCloudFront * 0.12 + broadDensity * 0.10;
            // Preserve a broad white highlight instead of scattering bright speckles.
            cloudLight = mix(cloudLight, max(cloudLight, 0.84), smoothstep(0.88, 0.96, localLight));
            shade = floor(clamp(cloudLight, 0.0, 0.999) * 5.0) / 4.0;
            #endif
            vec3 paint = mix(vec3(0.48, 0.65, 0.85), vec3(1.8), shade);
            float silhouette = step(0.24, density);
            // Transparent sprite corners must not occlude clouds behind them.
            if (silhouette < 0.5) discard;
            gl_FragColor = vec4(paint, silhouette);
          }`
        )
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <colorspace_fragment>",
          `#include <colorspace_fragment>
          if (cloudCartoon > 0.5) {
            // Increase displayed contrast by 20%, anchored to the original white.
            vec3 highlight = vec3(1.8);
            #if defined(TONE_MAPPING)
            highlight = toneMapping(highlight);
            #endif
            highlight = linearToOutputTexel(vec4(highlight, 1.0)).rgb;
            gl_FragColor.rgb = clamp(highlight + (gl_FragColor.rgb - highlight) * 1.2, 0.0, 1.0);
          }`
        )
      }
      material.customProgramCacheKey = () => "cloud-flat-aligned-pixel-v15"
      material.needsUpdate = true
    })
    return () => {
      originals.forEach(({ material, compileCloudShader, cacheKey }) => {
        material.onBeforeCompile = compileCloudShader
        material.customProgramCacheKey = cacheKey
        material.needsUpdate = true
      })
    }
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
    const pixelSize = (isMobile ? 4 : 6) * CLOUD_PIXEL_SCALE
    const distance = state.controls
      ? state.camera.position.distanceTo(state.controls.target)
      : state.camera.position.length()
    viewDistanceUniform.current.value = distance
    pixelUnitsUniform.current.value = state.size.height * (isMobile ? 1.18 : 1) /
      (2 * distance * Math.tan(THREE.MathUtils.degToRad(state.camera.fov / 2)) * pixelSize)
    if (isCartoon || !group.current || !cloud.current) {
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
          <Cloud ref={cloud} {...config} speed={isCartoon ? 0 : config.speed} />
        </Clouds>
      </group>
    </>
  )
}
