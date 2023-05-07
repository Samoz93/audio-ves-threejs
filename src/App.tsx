import { Center, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import "./App.css";
import { World } from "./World";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { extend } from "lodash";
extend({ EffectComposer });
function App() {
  return (
    <>
      <Canvas shadows={true} id="canvas">
        <World></World>
        <OrbitControls makeDefault />
        <ambientLight />
        <EffectComposer>
          <Bloom blendFunction={0} />
        </EffectComposer>
      </Canvas>
    </>
  );
}

export default App;
