// import RoughCanvas from '@/components/RoughCanvas';
import Author from '@/components/Author';
import { ToolBar } from '@/components/ToolBar';
import dynamic from 'next/dynamic';

// No SSR for canvas
const RoughCanvasNoSSR = dynamic(() => import('@/components/RoughCanvas'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <ToolBar />
      <RoughCanvasNoSSR />
      <Author />
    </main>
  );
}
