import { useEffect, useMemo, useRef } from "react";
import { Center } from "./Center";
import { Orbits } from "./Orbit";
import { threeAudio } from "./libs/audioDecorder";
import { useHelper, TransformControls, OrbitControls } from "@react-three/drei";
import { PointLight, PointLightHelper, Vector3 } from "three";

export const World = () => {
  const audio = useMemo(() => threeAudio, []);

  const playMusic = () => {
    if (audio.isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };
  useEffect(() => {
    if (lightRef.current) lightRef.current.lookAt(new Vector3(0, 0, 0));
  });
  const lightRef = useRef<PointLight>();
  useHelper(lightRef, PointLightHelper, 1);
  return (
    <>
      <pointLight receiveShadow castShadow position={[0, 2, 0]} color={"red"} />
      <directionalLight
        ref={lightRef}
        castShadow
        position={[2, 5, 0]}
        color={"blue"}
      />
      <TransformControls object={lightRef}></TransformControls>
      <Center></Center>
      {/* <mesh castShadow receiveShadow>
        <boxGeometry></boxGeometry>
        <meshStandardMaterial color={"blue"}></meshStandardMaterial>
      </mesh> */}
      <group position={[0, 0, 0]} onClick={playMusic}>
        <Orbits></Orbits>
        <Orbits></Orbits>
        <Orbits></Orbits>
        <Orbits></Orbits>
        <Orbits></Orbits>
        <Orbits></Orbits>
        <Orbits></Orbits>
        <Orbits></Orbits>
      </group>
      <mesh
        receiveShadow
        rotation={[-Math.PI * 0.5, 0, 0]}
        position={[0, -4, -5]}
      >
        <planeGeometry args={[100, 100]}></planeGeometry>
        <meshStandardMaterial color={"white"}></meshStandardMaterial>
      </mesh>
    </>
  );
};
