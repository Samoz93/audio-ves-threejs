import vertix from "./shader/partiVertix.glsl";
import frag from "./shader/partiFrag.glsl";
import { useControls } from "leva";
import _ from "lodash";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { getAudioData } from "./libs/audioDecorder";
export const Orbits = () => {
  const rnd = _.random(true);
  const rnd2 = _.random(true);
  const controls = ["uAmp", "uTime"];

  const leva: any = useControls(
    _.reduce(
      controls,
      (prev, curr) => {
        const item = { value: 0.1, min: 0, max: 10, steps: 0.1 };
        return { ...prev, [curr]: item };
      },
      {}
    )
  );

  const uniforms = useMemo(() => {
    const audioData = getAudioData();
    const audioUniforms = _.reduce(
      _.map(audioData, (val, key) => key),
      (prev, curr) => {
        return { ...prev, [curr]: { value: 0 } };
      },
      {}
    );
    const controlUniforms = _.reduce(
      controls,
      (prev, curr) => {
        const item = { value: 0.1 };
        return { ...prev, [curr]: item };
      },
      {}
    );

    return { ...controlUniforms, ...audioUniforms };
  }, []);

  useEffect(() => {
    if (ref.current) {
      _.forEach(controls, (key) => {
        if (key === "uTime") return;
        ref.current!.uniforms[key].value = leva[key];
      });
    }
  }, [leva]);

  const ref = useRef<THREE.ShaderMaterial>();
  const orbit = useRef<THREE.Mesh>();

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.uniforms.uTime.value = state.clock.getElapsedTime();
      const audioData = getAudioData();
      _.forEach(audioData, (val, key) => {
        ref.current!.uniforms[key].value = val;
      });
    }
    orbit.current!.rotation.z += delta * rnd * 0.5;
    orbit.current!.rotation.y += delta * rnd2 * 0.5;
  });
  return (
    <>
      <points
        castShadow
        position={[0, 0, 0]}
        scale={2}
        ref={orbit}
        rotation={[0, _.random(true) * Math.PI, _.random(true) * Math.PI]}
      >
        <sphereBufferGeometry args={[1, 0.01, 100, 100]} />
        <shaderMaterial
          transparent
          ref={ref}
          vertexShader={vertix}
          fragmentShader={frag}
          uniforms={uniforms}
        ></shaderMaterial>
      </points>
    </>
  );
};
