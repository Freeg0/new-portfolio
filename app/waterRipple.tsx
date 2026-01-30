"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import { Canvas, useFrame, useThree, useLoader } from "@react-three/fiber";
import { OrthographicCamera } from "@react-three/drei";
import { TextureLoader } from "three";
import * as THREE from "three";
import waterVertexShader from "../shaders/waterRipple/vertex.glsl";
import waterFragmentBufferShader from "../shaders/waterRipple/buffer_a_fragment.glsl";
import waterFragmentShader from "../shaders/waterRipple/final_fragment.glsl";

/**
 * Water ripple scene: buffer pass runs in useFrame; final fullscreen quad
 * is rendered by R3F so it appears on screen.
 */
function WaterRippleScene() {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const { gl } = useThree();
  const frameRef = useRef(0);
  const mouseRef = useRef(new THREE.Vector4(0, 0, 0, 0));
  const bufferMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const finalMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const planeRef = useRef<THREE.Mesh>(null);

  // Load landscape texture
  const landscapeTexture = useLoader(TextureLoader, "/textures/landscape.jpg");

  // Configure texture wrapping
  const configuredTexture = useMemo(() => {
    const tex = landscapeTexture.clone();
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, [landscapeTexture]);

  // Create ping-pong render targets (created once, resized later)
  const [renderTargetA, renderTargetB] = useMemo(() => {
    const options: THREE.RenderTargetOptions = {
      minFilter: THREE.NearestFilter,
      magFilter: THREE.NearestFilter,
      format: THREE.RGBAFormat,
      type: THREE.FloatType,
    };
    return [
      new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, options),
      new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, options),
    ];
  }, []);

  // Track targets
  const targetsRef = useRef({ read: renderTargetA, write: renderTargetB });

  // Buffer scene for simulation pass
  const bufferScene = useMemo(() => new THREE.Scene(), []);
  const bufferCamera = useMemo(
    () => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1),
    []
  );

  // Create buffer mesh for simulation (created once)
  useEffect(() => {
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: waterVertexShader,
      fragmentShader: waterFragmentBufferShader,
      uniforms: {
        uChannel0: { value: null },
        uResolution: {
          value: new THREE.Vector3(window.innerWidth, window.innerHeight, window.devicePixelRatio),
        },
        uMousePosition: { value: new THREE.Vector4(0, 0, 0, 0) },
        uFrame: { value: 0 },
      },
    });
    bufferMaterialRef.current = material;
    const mesh = new THREE.Mesh(geometry, material);
    bufferScene.add(mesh);

    return () => {
      bufferScene.remove(mesh);
      geometry.dispose();
      material.dispose();
    };
  }, [bufferScene]);

  // Handle resize: update render targets and reset simulation
  useEffect(() => {
    renderTargetA.setSize(width, height);
    renderTargetB.setSize(width, height);

    // Reset frame counter so buffer shader reinitializes
    frameRef.current = 0;

    // Update plane geometry
    if (planeRef.current) {
      planeRef.current.geometry.dispose();
      planeRef.current.geometry = new THREE.PlaneGeometry(width, height);
    }
  }, [width, height, renderTargetA, renderTargetB]);

  // Mouse events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = window.innerHeight - e.clientY;
    };

    const handleMouseDown = () => {
      mouseRef.current.z = 2;
    };

    const handleMouseUp = () => {
      mouseRef.current.z = 0;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  // Animation loop
  useFrame(() => {
    const bufferMaterial = bufferMaterialRef.current;
    const finalMaterial = finalMaterialRef.current;
    if (!bufferMaterial || !finalMaterial) return;

    const { read, write } = targetsRef.current;

    // Update buffer uniforms
    bufferMaterial.uniforms.uChannel0.value = read.texture;
    bufferMaterial.uniforms.uMousePosition.value.copy(mouseRef.current);
    bufferMaterial.uniforms.uFrame.value = frameRef.current;
    bufferMaterial.uniforms.uResolution.value.set(
      window.innerWidth,
      window.innerHeight,
      window.devicePixelRatio
    );

    // Render buffer pass
    gl.setRenderTarget(write);
    gl.render(bufferScene, bufferCamera);
    gl.setRenderTarget(null);

    // Swap targets
    targetsRef.current = { read: write, write: read };

    // Update final material
    finalMaterial.uniforms.uChannel0.value = write.texture;
    finalMaterial.uniforms.uResolution.value.set(
      window.innerWidth,
      window.innerHeight,
      window.devicePixelRatio
    );

    frameRef.current++;
  });

  // Cleanup
  useEffect(() => {
    return () => {
      renderTargetA.dispose();
      renderTargetB.dispose();
    };
  }, [renderTargetA, renderTargetB]);

  // Final shader uniforms (created once)
  const finalUniforms = useMemo(
    () => ({
      uChannel0: { value: null as THREE.Texture | null },
      uChannel1: { value: configuredTexture },
      uResolution: {
        value: new THREE.Vector3(window.innerWidth, window.innerHeight, window.devicePixelRatio),
      },
    }),
    [configuredTexture]
  );

  return (
    <mesh ref={planeRef}>
      <planeGeometry args={[width, height]} />
      <shaderMaterial
        ref={finalMaterialRef}
        vertexShader={waterVertexShader}
        fragmentShader={waterFragmentShader}
        uniforms={finalUniforms}
      />
    </mesh>
  );
}

const WaterRipple = () => {
  const cameraProps = useMemo(
    () => ({
      position: [0, 0, 60] as [number, number, number],
      fov: 50,
      near: 0.1,
      far: 1000,
    }),
    []
  );

  return (
    <Canvas
      className="webgl"
      camera={cameraProps}
      gl={{ antialias: false, alpha: false }}
      dpr={[1, 2]}
    >
      <OrthographicCamera makeDefault near={0} far={1}>
        <WaterRippleScene />
      </OrthographicCamera>
    </Canvas>
  );
};

export default WaterRipple;
