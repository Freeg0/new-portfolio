# Julien Mori - Portfolio

A creative portfolio website featuring interactive 3D water ripple effects built with Next.js and React Three Fiber.

## Features

- Interactive water ripple simulation that responds to mouse movement
- Custom GLSL shaders for realistic water rendering
- Multi-pass rendering with ping-pong buffers for physics simulation
- Smooth, performant animations using React Three Fiber

## Tech Stack

- [Next.js 16](https://nextjs.org/) - React framework with App Router
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - React renderer for Three.js
- [Three.js](https://threejs.org/) - 3D graphics library
- [GLSL](https://www.khronos.org/opengl/wiki/Core_Language_(GLSL)) - Shader programming
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js 18+

### Installation

```bash
# Clone the repository
git clone https://github.com/julienmori/portfolio.git
cd portfolio

# Install dependencies
bun install

# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## Project Structure

```
├── app/                  # Next.js App Router pages and components
│   ├── page.tsx          # Home page
│   ├── waterRipple.tsx   # Water ripple 3D component
│   └── globals.css       # Global styles
├── shaders/              # GLSL shader files
│   └── waterRipple/      # Water effect shaders
│       ├── vertex.glsl
│       ├── buffer_a_fragment.glsl
│       └── final_fragment.glsl
├── public/               # Static assets
└── static/               # Additional static files
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun run build` | Build for production |
| `bun start` | Start production server |
| `bun run lint` | Run ESLint |

## How It Works

The water ripple effect uses a technique inspired by [Shadertoy](https://www.shadertoy.com/):

1. **Ripple Simulation**: A buffer pass simulates water physics using the wave equation, storing height values in a render target
2. **Ping-Pong Rendering**: Two buffers alternate each frame to propagate ripple waves
3. **Mouse Interaction**: Mouse position creates new ripple origins
4. **Final Render**: The water surface is rendered with normals derived from the height map, creating realistic lighting and refraction

## License

MIT

## Author

**Julien Mori**

- Website: [julienmori.com](https://julienmori.com)
- GitHub: [@julienmori](https://github.com/julienmori)
