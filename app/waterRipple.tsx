"use client";

import * as THREE from "three";
import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import waterVertexShader from "../shaders/waterRipple/vertex.glsl";
// import waterFragmentBufferShader from "../shaders/waterRipple/buffer_a_fragment.glsl";
// import waterFragmentShader from "../shaders/waterRipple/final_fragment.glsl";

/**
 * Water ripple scene: buffer pass runs in useFrame; final fullscreen quad
 * is rendered by R3F so it appears on screen.
 */
function WaterRippleScene() {
  return (
    <mesh>
      <planeGeometry args={[50, 50]} />
      <meshBasicMaterial color="red" />
    </mesh>
  );
}

const WaterRipple = () => {
  const camera = useMemo(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
    []
  );

  return (
    <Canvas
      className="webgl"
      camera={camera}
      gl={{ antialias: false, alpha: false }}
      dpr={[1, 2]}
    >
      <WaterRippleScene />
    </Canvas>
  );
};

export default WaterRipple;
