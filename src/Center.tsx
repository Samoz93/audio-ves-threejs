import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";
import _ from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import frag from "./shader/frag.glsl";
import vertix from "./shader/vertix.glsl";
import { getAudioData } from "./libs/audioDecorder";

export const Center = () => {
  const { soundAmp, uNoise, uNoise2 } = useControls({
    soundAmp: {
      value: 1,
      step: 0.1,
      max: 10,
      min: 0,
    },
    uNoise: {
      value: 1,
      step: 0.1,
      max: 10,
      min: 0,
    },
    uNoise2: {
      value: 1,
      step: 0.1,
      max: 10,
      min: 0,
    },
  });

  useEffect(() => {
    if (ref.current) {
      ref.current.uniforms.uAmp.value = soundAmp;
      ref.current.uniforms.uNoise.value = uNoise;
      ref.current.uniforms.uNoise2.value = uNoise2;
    }
  }, [soundAmp, uNoise, uNoise2]);

  const vec3 = useMemo(() => {
    return new THREE.Vector3(0, 0, 0);
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      const {
        uBassRange,
        uLowMidRange,
        uMidRange,
        uHighMidRange,
        uTrebleRange,
      } = getAudioData();

      ref.current.uniforms.uBassRange.value = uBassRange;
      ref.current.uniforms.uLowMidRange.value = uLowMidRange;
      ref.current.uniforms.uMidRange.value = uMidRange;
      ref.current.uniforms.uHighMidRange.value = uHighMidRange;
      ref.current.uniforms.uTrebleRange.value = uTrebleRange;

      // // vec3.set(_.random(true), _.random(true), _.random(true));
      // vec3.set(x, y, z);
      ref.current!.uniforms.uTime.value = state.clock.getElapsedTime();
      // ball.current.rotation.y += delta * 0.1;
    }
  });
  const uniforms = useMemo(
    () => ({
      uColor: new THREE.Uniform(new THREE.Color("red")),
      uSound: {
        value: 0,
      },
      uAmp: {
        value: 0.1,
      },
      uTime: {
        value: 0,
      },
      uSound2: { value: vec3 },
      uBassRange: { value: 0 },
      uLowMidRange: { value: 0 },
      uMidRange: { value: 0 },
      uHighMidRange: { value: 0 },
      uTrebleRange: { value: 0 },
      uNoise: { value: 1 },
      uNoise2: { value: 1 },
    }),
    []
  );

  const setGeometry = async () => {
    const verticesBuffer = await (await fetch("./viper.ogg")).arrayBuffer();
    let vertices = new Float32Array(verticesBuffer).map((g) => {
      if (isNaN(g) || !isFinite(g)) return 0;
      return g;
    });

    const min = _.min(vertices)!;
    const max = _.max(vertices)!;
    vertices = vertices.map((g) => {
      return (g - min) / (max - min);
    });

    const realBuffer = new Float32Array(
      Math.floor(vertices.length / 3) * 3 * 3
    );

    _.range(realBuffer.length / 3).forEach((index) => {
      realBuffer[index * 3 + 0] = index * 0.0001;
      realBuffer[index * 3 + 1] = vertices[index];
      realBuffer[index * 3 + 2] = 0;
    });

    setBuffer(realBuffer);
  };

  const [bufferAttribute, setBuffer] = useState<Float32Array>();

  const ref = useRef<THREE.ShaderMaterial | undefined>(undefined);
  const ball = useRef<THREE.PlaneGeometry>(undefined);
  const parti = useRef<THREE.Points>(undefined);

  // const ballGeometry = useRef<THREE.SphereGeometry>(undefined);

  useEffect(() => {
    setGeometry();
  }, []);

  return bufferAttribute ? (
    <>
      <mesh castShadow position={[0, 0, 0]} scale={0.3}>
        <sphereBufferGeometry ref={ball} args={[5, 100, 100]} />
        <shaderMaterial
          ref={ref}
          vertexShader={vertix}
          fragmentShader={frag}
          uniforms={uniforms}
          toneMapped={false}
        ></shaderMaterial>
      </mesh>
    </>
  ) : (
    <></>
  );
};
