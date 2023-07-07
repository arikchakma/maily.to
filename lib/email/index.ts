interface TiptapMark {
	type: string;
	attrs?: Record<string, any>;
}

interface TiptapNode {
	type: string;
	attrs?: Record<string, any>;
	text?: string;
	marks?: TiptapMark[];
	content?: TiptapNode[];
}

const markMapping: {
	[key: string]: (mark: TiptapMark, text: string) => string;
} = {
	bold: (mark, text) => {
		return `<strong>${text}</strong>`;
	},
	underline: (mark, text) => {
		return `<u>${text}</u>`;
	},
	italic: (mark, text) => {
		return `<em>${text}</em>`;
	},
	strike: (mark, text) => {
		return `<s style="text-decoration: line-through;">${text}</s>`;
	},
};

function attributeStyles(attrs: Record<string, any> | undefined) {
	if (!attrs) {
		return [];
	}
	return Object.keys(attrs).map((key) => {
		if (!styleMapping[key]) {
			return '';
		}
		return styleMapping[key](attrs);
	});
}

const styleMapping: {
	[key: string]: (attrs: Record<string, any> | undefined) => string;
} = {
	textAlign: (attrs) => {
		return `text-align: ${attrs?.textAlign};`;
	},
	h1: (attrs) => {
		return [
			'font-size: 36px;',
			'font-weight: 800;',
			'line-height: 40px;',
			'margin-bottom: 12px;',
			'color: rgb(17, 24, 39);',
			...attributeStyles(attrs),
		].join('');
	},
	h2: (attrs) => {
		return [
			'font-size: 30px;',
			'font-weight: 700;',
			'line-height: 40px;',
			'margin-bottom: 12px;',
			'color: rgb(17, 24, 39);',
			...attributeStyles(attrs),
		].join('');
	},
	h3: (attrs) => {
		return [
			'font-size: 24px;',
			'font-weight: 600;',
			'line-height: 38px;',
			'margin-bottom: 12px;',
			'color: rgb(17, 24, 39);',
			...attributeStyles(attrs),
		].join('');
	},
	p: (attrs) => {
		return [
			'font-size: 15px;',
			'line-height: 24px;',
			'margin: 16px 0;',
			'margin-bottom: 20px;',
			'margin-top: 0px;',
			'color: rgb(55, 65, 81);',
			'-webkit-font-smoothing: antialiased;',
			'-moz-osx-font-smoothing: grayscale;',
			...attributeStyles(attrs),
		].join('');
	},
	hr: (attrs) => {
		return [
			'width: 100%;',
			'border: none;',
			'border-top: 1px solid #eaeaea;',
			'margin-top: 32px;',
			'margin-bottom: 32px;',
			...attributeStyles(attrs),
		].join('');
	},
};

const nodeMapping: { [key: string]: (node: TiptapNode) => string } = {
	text: (node) => {
		if (node.marks) {
			return node.marks.reduce((acc, mark) => {
				return markMapping[mark.type](mark, acc);
			}, node.text || '');
		}

		return node.text || '';
	},
	heading: (node) => {
		return `<h${node?.attrs?.level} style="${styleMapping[
			`h${node?.attrs?.level}`
		](node?.attrs)}">${node.content
			?.map((node) => {
				return nodeMapping[node.type](node);
			})
			.join('')}</h${node?.attrs?.level}>`;
	},
	paragraph: (node) => {
		return `<p style="${styleMapping['p'](node?.attrs)}">${
			node.content
				?.map((node) => {
					return nodeMapping[node.type](node);
				})
				.join('') || ''
		}</p>`;
	},
	horizontalRule: (node) => {
		return `<hr style="${styleMapping['hr'](node?.attrs)}">`;
	},
};

const tiptapToHtml = (tiptap: TiptapNode[]) => {
	const baseEmailTemplate = (html: string) =>
		`
  <!DOCTYPE html><html lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><style>@font-face{font-family:Inter;font-style:normal;font-weight:400;mso-font-alt:Verdana;src:url(https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19) format('woff2')}*{font-family:Inter,Verdana}</style><style>blockquote,h1,h2,h3,img,li,ol,p,ul{margin-top:0;margin-bottom:0}</style></head><body><table align="center" width="100%" role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;margin-left:auto;margin-right:auto;padding:.5rem"><tbody><tr style="width:100%"><td>${html}</td></tr></tbody></table></body></html>`.trim();
	return baseEmailTemplate(
		tiptap
			.map((node) => {
				return nodeMapping[node.type](node);
			})
			.join('')
	);
};
