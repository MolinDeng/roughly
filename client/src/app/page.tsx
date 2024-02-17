// import RoughCanvas from '@/components/RoughCanvas';
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
      <div className="inline absolute bottom-0 left-0 m-2 text-slate-800">
        By{' '}
        <a
          className="underline text-blue-700"
          href="https://molin7.vercel.app/"
          target="_blank"
        >
          @molin
        </a>
        <br />
        View source on{' '}
        <a
          className="underline text-blue-700"
          href="https://github.com/MolinDeng/doodle"
          target="_blank"
        >
          Github
        </a>
      </div>
    </main>
  );
}
