import { Editor } from '@/components/editor';

export default function Home() {
	const defaultContent = [
		{
			type: 'paragraph',
			attrs: {
				textAlign: 'left',
			},
		},
		{
			type: 'logo',
			attrs: {
				src: 'https://binsta.dev/api/v1/files/4eR1893USp/transform?format=webp&size=lg&quality=md',
				alt: null,
				title: null,
				'mailbox-component': 'logo',
				size: 'sm',
				alignment: 'left',
			},
		},
		{
			type: 'spacer',
			attrs: {
				'mailbox-component': 'spacer',
				height: 'xl',
			},
		},
		{
			type: 'paragraph',
			attrs: {
				textAlign: 'left',
			},
			content: [
				{
					type: 'text',
					text: 'Hey ',
				},
				{
					type: 'variable',
					attrs: {
						id: 'username',
						label: null,
					},
				},
				{
					type: 'text',
					text: ',',
				},
			],
		},
		{
			type: 'paragraph',
			attrs: {
				textAlign: 'left',
			},
			content: [
				{
					type: 'text',
					text: 'Thank you so much for joining the waitlist. We are excited to welcome you to the [product name] community.',
				},
			],
		},
		{
			type: 'paragraph',
			attrs: {
				textAlign: 'left',
			},
			content: [
				{
					type: 'text',
					text: "Stay tuned. And we're just an email away if you have any questions. We'd be more than happy to answer your questions.",
				},
			],
		},
		{
			type: 'spacer',
			attrs: {
				'mailbox-component': 'spacer',
				height: 'xl',
			},
		},
		{
			type: 'paragraph',
			attrs: {
				textAlign: 'left',
			},
			content: [
				{
					type: 'text',
					text: 'Cheers,',
				},
				{
					type: 'hardBreak',
				},
				{
					type: 'text',
					text: 'James, ',
				},
				{
					type: 'text',
					marks: [
						{
							type: 'italic',
						},
					],
					text: 'creator of [product name]',
				},
			],
		},
		{
			type: 'horizontalRule',
		},
		{
			type: 'footer',
			attrs: {
				'mailbox-component': 'footer',
			},
			content: [
				{
					type: 'text',
					text: 'You are receiving this email because you joined the waitlist for [product name].',
				},
			],
		},
		{
			type: 'footer',
			attrs: {
				'mailbox-component': 'footer',
			},
			content: [
				{
					type: 'text',
					text: '© 2023 [Product name]',
				},
				{
					type: 'hardBreak',
				},
				{
					type: 'text',
					text: '[address]',
				},
			],
		},
		{
			type: 'footer',
			attrs: {
				'mailbox-component': 'footer',
			},
			content: [
				{
					type: 'text',
					text: 'Unsubscribe from emails',
				},
			],
		},
	];

	return (
		<div className="p-10 bg-white opacity-100 bg-[radial-gradient(#000000_0.65px,transparent_0.65px),radial-gradient(#000000_0.65px,#ffffff_0.65px)] [background-size:26px_26px] [background-position:0_0,13px_13px] min-h-screen">
			<Editor contentJson={defaultContent} />
		</div>
	);
}
