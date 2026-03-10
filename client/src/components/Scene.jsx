import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing'
import Lab from './Lab'
import CameraRig from './CameraRig'

export default function Scene() {
  return (
    <div className="absolute inset-0">
      <Canvas
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [0, 2, 8], fov: 50 }}
        dpr={[1, 2]}
      >
        <color attach="background" args={['#0a0e17']} />
        <fog attach="fog" args={['#0a0e17', 8, 22]} />
        <ambientLight intensity={0.15} />
        <directionalLight position={[5, 8, 5]} intensity={0.8} castShadow shadow-mapSize={1024} />
        <pointLight position={[0, 4, 2]} intensity={2} color="#00fff9" />
        <pointLight position={[-2, 3, 1]} intensity={1} color="#bf00ff" />
        <pointLight position={[2, 2, -1]} intensity={1} color="#39ff14" />
        <Environment preset="night" />
        <Lab />
        <CameraRig />
        <EffectComposer>
          <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.9} intensity={0.8} mipmapBlur />
          <DepthOfField focusDistance={0.01} focalLength={0.05} bokehScale={1.5} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
