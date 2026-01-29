# CLAUDE.md

This file provides guidance for AI assistants working on this portfolio project.

## Project Overview

Personal portfolio website for Julien Mori built with Next.js, React Three Fiber, and Three.js. The main visual feature is an interactive water ripple effect that responds to mouse movement.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **3D Rendering**: React Three Fiber + Three.js
- **Shaders**: GLSL with glslify
- **Styling**: Tailwind CSS v4
- **Package Manager**: Bun
- **Language**: TypeScript

## Project Structure

```
app/
├── page.tsx           # Main entry, renders WaterRipple component
├── waterRipple.tsx    # R3F Canvas with water ripple scene
├── layout.tsx         # Root layout
├── globals.css        # Global styles
└── shader.d.ts        # TypeScript declarations for .glsl imports

shaders/
├── waterRipple/
│   ├── vertex.glsl           # Vertex shader for plane
│   ├── buffer_a_fragment.glsl # Buffer pass for ripple simulation
│   └── final_fragment.glsl    # Final render pass
└── waterMario/               # Additional shader experiments

static/                       # Static assets
public/                       # Public assets (favicon, etc.)
```

## Commands

- `bun dev` - Start development server
- `bun run build` - Build for production
- `bun run lint` - Run ESLint

## Water Ripple Implementation

The water ripple effect uses a multi-pass rendering approach:
1. **Buffer Pass**: Simulates ripple physics using ping-pong buffers
2. **Final Pass**: Renders the water surface with lighting/refraction

Key concepts:
- Uses `ShaderMaterial` with custom GLSL shaders
- Mouse position passed as uniform for ripple origin
- Orthographic camera for fullscreen effect
- Render targets for multi-pass rendering

## Shader Files

GLSL shaders are imported via raw-loader and glslify. TypeScript declarations are in `app/shader.d.ts`.

## Code Conventions

- React components use functional style with hooks
- "use client" directive required for R3F components
- Prefer `useMemo` for expensive Three.js object creation
- Use `useFrame` for animation loops instead of requestAnimationFrame
- Keep shader uniforms in refs to avoid recreating objects

## Current State

The project is in early development. The basic structure is in place with:
- R3F Canvas setup with orthographic camera
- Placeholder plane geometry (red mesh)
- Shader files exist but are not yet connected

## Next Steps

1. Connect GLSL shaders to the shader material
2. Implement ping-pong buffer rendering for ripple simulation
3. Add mouse interaction to create ripples
4. Fine-tune water appearance (colors, reflections, distortion)
