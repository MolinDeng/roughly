// import RoughCanvas from '@/components/RoughCanvas';
import { ToolBar } from '@/components/ToolBar';
import dynamic from 'next/dynamic';

const RoughCanvasNoSSR = dynamic(() => import('@/components/RoughCanvas'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <ToolBar />
      <RoughCanvasNoSSR />
    </main>
  );
}
