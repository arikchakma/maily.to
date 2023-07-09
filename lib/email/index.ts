interface TiptapMark {
	type: string;
	attrs?: Record<string, any>;
	[key: string]: any;
}

interface TiptapNode {
	type?: string;
	attrs?: Record<string, any>;
	content?: TiptapNode[];
	marks?: {
		type: string;
		attrs?: Record<string, any>;
		[key: string]: any;
	}[];
	text?: string;
	[key: string]: any;
}

function attributeStyles(
	attrs: TiptapNode['attrs'] | undefined,
	parent?: TiptapNode | undefined,
	nextNode?: TiptapNode,
	prevNode?: TiptapNode
) {
	if (!attrs) {
		return [];
	}
	return Object.keys(attrs).map((key) => {
		return styleMapping(key, attrs, parent, nextNode, prevNode);
	});
}

function nodeTable(
	html: string,
	attrs?: TiptapNode['attrs'] | undefined,
	parent?: TiptapNode | undefined
) {
	const style = [...attributeStyles(attrs, parent)].join('');
	return `<table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="${style}"><tbody><tr><td>${html}</td></tr></tbody></table>`;
}

function getMappedContent(node: TiptapNode, parent?: TiptapNode) {
	return (
		node?.content
			?.map((node) => {
				return nodeMapping(node, parent);
			})
			.join('') || '&nbsp'
	);
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
		case 'link':
			return `<a href="${
				mark?.attrs?.href || ''
			}" target="_blank" style="${styleMapping('a', mark?.attrs)}">${text}</a>`;

		default:
			console.log('Unknown mark type', mark.type);
			return text;
	}
}

function styleMapping(
	key: string,
	attrs: Record<string, any> | undefined,
	parent?: TiptapNode,
	nextNode?: TiptapNode,
	prevNode?: TiptapNode
): string {
	let style = [];
	switch (key) {
		case 'textAlign':
			return `text-align: ${attrs?.textAlign};`;

		case 'alignment':
			if (attrs?.alignment === 'center') {
				return 'margin-left: auto; margin-right: auto;';
			} else if (attrs?.alignment === 'right') {
				return 'margin-left: auto;';
			}
			return '';

		case 'size':
			switch (parent?.type) {
				case 'logo':
					if (attrs?.size === 'sm') {
						return styleMapping('height', { height: '40px' });
					} else if (attrs?.size === 'md') {
						return styleMapping('height', { height: '48px' });
					} else if (attrs?.size === 'lg') {
						return styleMapping('height', { height: '64px' });
					}
					return '';
				default:
					return '';
			}

		case 'height':
			let height = attrs?.height || 'auto';
			if (parent?.type === 'spacer') {
				switch (attrs?.height) {
					case 'sm':
						height = '8px';
						break;
					case 'md':
						height = '16px';
						break;
					case 'lg':
						height = '32px';
						break;
					case 'xl':
						height = '64px';
						break;
					default:
						height = 'auto';
						break;
				}
			}
			return `height: ${height};`;
		case 'h1':
			style = [
				'font-size: 36px;',
				'font-weight: 800;',
				'margin-bottom: 12px;',
				'line-height: 40px;',
				'color: rgb(17, 24, 39);',
				...attributeStyles(attrs, parent, nextNode, prevNode),
			];
			if (nextNode?.type === 'spacer') {
				style = style.filter((s) => !s.startsWith('margin-bottom'));
				style.push('margin-bottom: 0px;');
			}
			return style.join('');

		case 'h2':
			style = [
				'font-size: 30px;',
				'font-weight: 700;',
				'line-height: 40px;',
				'margin-bottom: 12px;',
				'color: rgb(17, 24, 39);',
				...attributeStyles(attrs),
			];
			if (nextNode?.type === 'spacer') {
				style = style.filter((s) => !s.startsWith('margin-bottom'));
				style.push('margin-bottom: 0px;');
			}
			return style.join('');
		case 'h3':
			style = [
				'font-size: 24px;',
				'font-weight: 600;',
				'line-height: 38px;',
				'margin-bottom: 12px;',
				'color: rgb(17, 24, 39);',
				...attributeStyles(attrs),
			];
			if (nextNode?.type === 'spacer') {
				style = style.filter((s) => !s.startsWith('margin-bottom'));
				style.push('margin-bottom: 0px;');
			}
			return style.join('');
		case 'p':
			style = [
				'font-size: 15px;',
				'line-height: 24px;',
				'margin: 16px 0;',
				'margin-top: 0px;',
				'margin-bottom: 20px;',
				'color: rgb(55, 65, 81);',
				'-webkit-font-smoothing: antialiased;',
				'-moz-osx-font-smoothing: grayscale;',
				...attributeStyles(attrs, parent, nextNode, prevNode),
			];
			if (parent?.type === 'listItem') {
				style = style.filter((s) => !s.startsWith('margin'));
				style.push('margin-bottom: 0;');
			}
			return style.join('');
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

		case 'img':
			return [
				'display: block;',
				'outline: none;',
				'border: none;',
				'text-decoration: none;',
				'margin-bottom: 32px;',
				'margin-top: 0px;',
				'height: auto;',
				'width: auto;',
				'max-width: 100%;',
			].join('');

		case 'logo':
			style = [
				'display: block;',
				'outline: none;',
				'border: none;',
				'text-decoration: none;',
				'margin-bottom: 32px;',
				'margin-top: 0px;',
				...attributeStyles(attrs, parent, nextNode, prevNode),
			];
			if (nextNode?.type === 'spacer') {
				style = style.filter((s) => !s.startsWith('margin-bottom'));
				style.push('margin-bottom: 0px;');
			}
			return style.join('');

		case 'footer':
			style = [
				'font-size: 13px;',
				'line-height: 24px;',
				'margin: 16px 0;',
				'margin-bottom: 20px;',
				'margin-top: 0px;',
				'-webkit-font-smoothing: antialiased;',
				'-moz-osx-font-smoothing: grayscale;',
				'color: rgb(100, 116, 139);',
				...attributeStyles(attrs),
			];
			if (nextNode?.type === 'spacer') {
				style = style.filter((s) => !s.startsWith('margin-bottom'));
				style.push('margin-bottom: 0px;');
			}
			return style.join('');

		case 'a':
			return [
				'font-weight: 500;',
				'color: rgb(17, 24, 39);',
				'text-decoration-line: underline;',
			].join('');

		default:
			console.log('Unknown style key', key);
			return '';
	}
}

function nodeMapping(
	node: TiptapNode,
	parent?: TiptapNode,
	nextNode?: TiptapNode,
	prevNode?: TiptapNode
): string {
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
			return node.text || '&nbsp';

		case 'heading':
			const level = attrs?.level || 1;
			style = styleMapping(`h${level}`, attrs, parent, nextNode, prevNode);
			return `<h${level} style="${style}">${getMappedContent(
				node
			)}</h${level}>`;

		case 'paragraph':
			style = styleMapping('p', attrs, parent, nextNode, prevNode);
			return `<p style="${style}">${getMappedContent(node)}</p>`;

		case 'horizontalRule':
			style = styleMapping('hr', attrs, parent, nextNode, prevNode);
			return `<hr style="${style}">`;

		case 'listItem':
			style = styleMapping('li', attrs, parent, nextNode, prevNode);
			return `<li style="${style}">${getMappedContent(node)}</li>`;

		case 'bulletList':
			style = styleMapping('ul', attrs, parent, nextNode, prevNode);
			return nodeTable(`<ul style="${style}">${getMappedContent(node)}</ul>`);

		case 'spacer':
			return nodeTable('', attrs, parent);

		case 'hardBreak':
			return '<br>';

		case 'logo':
			style = styleMapping('logo', attrs, parent, nextNode, prevNode);
			return `<img alt="${attrs?.alt || ''}" src="${
				attrs?.src
			}" style="${style}">`;

		case 'image':
			style = styleMapping('img', attrs, parent, nextNode, prevNode);
			return `<img alt="${attrs?.alt || attrs?.title || ''}" src="${
				attrs?.src
			}" style="${style}">`;

		case 'footer':
			style = styleMapping('footer', attrs, parent, nextNode, prevNode);
			return `<p style="${style}">${getMappedContent(node)}</p>`;

		case 'variable':
			return `{{${attrs?.id}}}`;

		default:
			console.log(`Node type ${type} not supported`);
			return '';
	}
}

export const tiptapToHtml = (tiptap: TiptapNode[]) => {
	const baseEmailTemplate = (html: string) =>
		`
  <!DOCTYPE html><html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><style>@font-face{font-family:'Inter';font-style:normal;font-weight:400;mso-font-alt:'Verdana';src:url(https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19) format('woff2')}*{font-family:'Inter',Verdana}</style><style>blockquote,h1,h2,h3,img,li,ol,p,ul{margin-top:0;margin-bottom:0}</style></head><body><table align="center" width="100%" role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;margin-left:auto;margin-right:auto;padding:.5rem"><tbody><tr style="width:100%"><td>${html}</td></tr></tbody></table></body></html>`.trim();
	return baseEmailTemplate(
		tiptap
			.map((node, index) => {
				const nextNode = tiptap[index + 1] || null;
				const prevNode = tiptap[index - 1] || null;
				return nodeMapping(node, node, nextNode, prevNode);
			})
			.join('')
	);
};
