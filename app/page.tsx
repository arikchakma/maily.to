import { Editor } from '@/components/editor';

export default function Home() {
	return (
		<div className="p-10 bg-white opacity-100 bg-[radial-gradient(#000000_0.65px,transparent_0.65px),radial-gradient(#000000_0.65px,#ffffff_0.65px)] [background-size:26px_26px] [background-position:0_0,13px_13px] min-h-screen">
			<Editor />
		</div>
	);
}
