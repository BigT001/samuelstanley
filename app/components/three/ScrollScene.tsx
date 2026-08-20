"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type ScrollSceneProps = {
  accent?: string;
  secondary?: string;
  variant?: "home" | "project";
};

function SceneRig({
  accent,
  secondary,
  variant,
}: Required<ScrollSceneProps>) {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  const { pointer, viewport } = useThree();
  const scrollTarget = useRef(0);
  const compact = viewport.width < 6;

  const nodes = useMemo(
    () => [
      [-2.2, 1.25, -1.3],
      [2.3, 1.1, -1.7],
      [-2.45, -1.3, -2],
      [2.1, -1.45, -1.2],
      [0.2, 2.05, -2.5],
    ] as [number, number, number][],
    []
  );

  useEffect(() => {
    const updateScroll = () => {
      const distance = document.documentElement.scrollHeight - window.innerHeight;
      scrollTarget.current = distance > 0 ? window.scrollY / distance : 0;
    };
    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    return () => window.removeEventListener("scroll", updateScroll);
  }, []);

  useFrame((state, delta) => {
    if (!group.current || !core.current || !ring.current) return;

    const scroll = scrollTarget.current;
    const targetY = variant === "project" ? scroll * Math.PI * 1.4 : scroll * Math.PI * 2.1;
    const targetX = pointer.y * 0.13 + scroll * 0.28;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY + pointer.x * 0.18, 3.2, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 3.2, delta);
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, -scroll * 0.65, 3, delta);
    core.current.rotation.x += delta * 0.08;
    core.current.rotation.z -= delta * 0.06;
    ring.current.rotation.z += delta * 0.05;
  });

  return (
    <group ref={group} scale={compact ? 0.72 : variant === "project" ? 0.9 : 1}>
      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.22}>
        <mesh ref={core}>
          <icosahedronGeometry args={[1.38, 2]} />
          <meshPhysicalMaterial
            color={accent}
            roughness={0.16}
            metalness={0.58}
            clearcoat={1}
            clearcoatRoughness={0.2}
            transparent
            opacity={0.72}
          />
        </mesh>
        <mesh ref={ring} rotation={[Math.PI / 2.5, 0.2, 0]}>
          <torusGeometry args={[2.02, 0.025, 12, 120]} />
          <meshBasicMaterial color={secondary} transparent opacity={0.7} />
        </mesh>
        <mesh rotation={[0.35, Math.PI / 2.2, 0.5]}>
          <torusGeometry args={[2.42, 0.012, 8, 120]} />
          <meshBasicMaterial color={accent} transparent opacity={0.35} />
        </mesh>
      </Float>

      {nodes.map((position, index) => (
        <Float
          key={position.join("-")}
          speed={0.75 + index * 0.08}
          rotationIntensity={0.18}
          floatIntensity={0.35}
        >
          <group position={position}>
            <mesh>
              <boxGeometry args={[0.38, 0.38, 0.12]} />
              <meshStandardMaterial
                color={index % 2 ? secondary : accent}
                roughness={0.3}
                metalness={0.45}
                transparent
                opacity={0.75}
              />
            </mesh>
            <mesh position={[0, 0, -0.2]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshBasicMaterial color={secondary} />
            </mesh>
          </group>
        </Float>
      ))}
    </group>
  );
}

function Scene({
  accent,
  secondary,
  variant,
}: Required<ScrollSceneProps>) {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 5, 6]} intensity={2.1} color="#ffffff" />
      <pointLight position={[-4, -2, 3]} intensity={18} color={accent} distance={9} />
      <pointLight position={[4, 2, 2]} intensity={14} color={secondary} distance={8} />
      <SceneRig accent={accent} secondary={secondary} variant={variant} />
    </>
  );
}

export default function ScrollScene({
  accent = "#ff5f55",
  secondary = "#59e1d8",
  variant = "home",
}: ScrollSceneProps) {
  const [enabled] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hasWebGL = (() => {
      try {
        const canvas = document.createElement("canvas");
        return Boolean(canvas.getContext("webgl2"));
      } catch {
        return false;
      }
    })();
    return hasWebGL && !reducedMotion.matches;
  });

  if (!enabled) return null;

  return (
    <Canvas
      aria-hidden="true"
      camera={{ position: [0, 0, 7.2], fov: 42 }}
      dpr={[1, 1.45]}
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: "high-performance",
      }}
      performance={{ min: 0.55 }}
    >
      <Scene accent={accent} secondary={secondary} variant={variant} />
    </Canvas>
  );
}
