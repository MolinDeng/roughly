// import RoughCanvas from '@/components/RoughCanvas';
import dynamic from 'next/dynamic'
 
const RoughCanvasNoSSR = dynamic(() => import('@/components/RoughCanvas'), {
  ssr: false,
})

export default function Home() {
  return (
    <main className="h-screen w-screen">
      <RoughCanvasNoSSR />
    </main>
  );
}
