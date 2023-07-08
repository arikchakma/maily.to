interface TiptapMark {
	type: string;
	attrs?: Record<string, string | number>;
}

interface TiptapNode {
	type: string;
	attrs?: Record<string, string | number>;
	text?: string;
	marks?: TiptapMark[];
	content?: TiptapNode[];
}

const startTime = performance.now();
function attributeStyles(attrs: TiptapNode['attrs'] | undefined) {
	if (!attrs) {
		return [];
	}
	return Object.keys(attrs).map((key) => {
		return styleMapping(key, attrs);
	});
}

function nodeTable(html: string) {
	return `<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td>${html}</td></tr></tbody></table>`;
}

function getMappedContent(node: TiptapNode, parent?: TiptapNode) {
	return (
		node?.content
			?.map((node) => {
				return nodeMapping(node, parent);
			})
			.join('') || ''
	);
}

function styleMapping(
	key: string,
	attrs: Record<string, any> | undefined,
	parent?: TiptapNode
): string {
	switch (key) {
		case 'textAlign':
			return `text-align: ${attrs?.textAlign};`;
		case 'h1':
			return [
				'font-size: 36px;',
				'font-weight: 800;',
				'line-height: 40px;',
				'margin-bottom: 12px;',
				'color: rgb(17, 24, 39);',
				...attributeStyles(attrs),
			].join('');
		case 'h2':
			return [
				'font-size: 30px;',
				'font-weight: 700;',
				'line-height: 40px;',
				'margin-bottom: 12px;',
				'color: rgb(17, 24, 39);',
				...attributeStyles(attrs),
			].join('');
		case 'h3':
			return [
				'font-size: 24px;',
				'font-weight: 600;',
				'line-height: 38px;',
				'margin-bottom: 12px;',
				'color: rgb(17, 24, 39);',
				...attributeStyles(attrs),
			].join('');
		case 'p':
			let style = [
				'font-size: 15px;',
				'line-height: 24px;',
				'margin: 16px 0;',
				'margin-top: 0px;',
				'color: rgb(55, 65, 81);',
				'-webkit-font-smoothing: antialiased;',
				'-moz-osx-font-smoothing: grayscale;',
			];
			if (parent?.type === 'listItem') {
				style.push('margin-bottom: 0;');
			} else {
				style.push('margin-bottom: 20px;');
			}
			return [...style, ...attributeStyles(attrs)].join('');
		case 'hr':
			return [
				'width: 100%;',
				'border: none;',
				'border-top: 1px solid #eaeaea;',
				'margin-top: 32px;',
				'margin-bottom: 32px;',
				...attributeStyles(attrs),
			].join('');
		case 'ul':
			return [
				'padding-left: 26px;',
				'margin-bottom: 20px;',
				'margin-top: 0px;',
				'list-style-type: disc;',
				...attributeStyles(attrs),
			].join('');
		case 'ol':
			return [
				'padding-left: 26px;',
				'margin-bottom: 20px;',
				'margin-top: 0px;',
				'list-style-type: decimal;',
				...attributeStyles(attrs),
			].join('');
		case 'li':
			return [
				'margin-bottom: 8px;',
				'padding-left: 6px;',
				'-webkit-font-smoothing: antialiased;',
				'-moz-osx-font-smoothing: grayscale;',
				...attributeStyles(attrs),
			].join('');
		default:
			return '';
	}
}

function markMapping(mark: TiptapMark, text: string): string {
	switch (mark.type) {
		case 'bold':
			return `<strong>${text}</strong>`;
		case 'underline':
			return `<u>${text}</u>`;
		case 'italic':
			return `<em>${text}</em>`;
		case 'strike':
			return `<s style="text-decoration: line-through;">${text}</s>`;
		default:
			return text;
	}
}

function nodeMapping(node: TiptapNode, parent?: TiptapNode): string {
	const { type, attrs, content } = node;
	let style = '';
	let mappedContent = '';

	switch (type) {
		case 'text':
			if (node.marks) {
				return node.marks.reduce((acc, mark) => {
					return markMapping(mark, acc);
				}, node.text || '');
			}
			return node.text || '';

		case 'heading':
			const level = attrs?.level || 1;
			style = styleMapping(`h${level}`, attrs);
			mappedContent = getMappedContent(node);
			return `<h${level} style="${style}">${mappedContent}</h${level}>`;

		case 'paragraph':
			style = styleMapping('p', attrs, parent);
			mappedContent = getMappedContent(node, parent);
			return `<p style="${style}">${mappedContent}</p>`;

		case 'horizontalRule':
			style = styleMapping('hr', attrs);
			return `<hr style="${style}">`;

		case 'listItem':
			style = styleMapping('li', attrs);
			mappedContent = getMappedContent(node);
			return `<li style="${style}">${mappedContent}</li>`;

		case 'bulletList':
			style = styleMapping('ul', attrs);
			mappedContent = getMappedContent(node);
			return nodeTable(`<ul style="${style}">${mappedContent}</ul>`);

		default:
			return '';
	}
}

const tiptapToHtml = (tiptap: TiptapNode[]) => {
	const baseEmailTemplate = (html: string) =>
		`
  <!DOCTYPE html><html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><style>@font-face{font-family:Inter;font-style:normal;font-weight:400;mso-font-alt:Verdana;src:url(https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19) format('woff2')}*{font-family:Inter,Verdana}</style><style>blockquote,h1,h2,h3,img,li,ol,p,ul{margin-top:0;margin-bottom:0}</style></head><body><table align="center" width="100%" role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;margin-left:auto;margin-right:auto;padding:.5rem"><tbody><tr style="width:100%"><td>${html}</td></tr></tbody></table></body></html>`.trim();
	return baseEmailTemplate(
		tiptap
			.map((node) => {
				return nodeMapping(node);
			})
			.join('')
	);
};
