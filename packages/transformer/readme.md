<div align="center"><img height="150" src="https://maily.to/brand/icon.svg" /></div>
<br>

<div align="center"><strong>@maily-to/transformer</strong></div>
<div align="center">Transform React Email markup to <a href="https://maily.to">Maily</a> content.</div>
<br />

<p align="center">
  <a href="https://github.com/arikchakma/maily/blob/main/license">
    <img src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://maily.to">
    	<img src="https://img.shields.io/badge/%E2%9C%A8-Get%20Editor-0a0a0a.svg?style=flat&colorA=0a0a0a" alt="Get Maily Editor" />
    </a>
</p>

<br>

## Install

Install `@maily-to/transformer` from your command line.

```sh
pnpm add @maily-to/transformer
```

## Getting started

Transform JSX content into structured `ParsedNode` JSON.

```ts
import { Transformer } from '@maily-to/transformer';

const transformer = new Transformer();
const parsed = await transformer.transform(
  `<Container style={{ marginLeft: "auto", marginRight: "auto", maxWidth: "600px", minWidth: "300px", padding: "0.5rem", width: "100%", }} > <Heading as="h1" style={{ color: "#111827", fontSize: "36px", fontWeight: 800, lineHeight: "40px", }} > Hello World </Heading> <Img src="https://maily.to/brand/icon.svg" alt="Maily" style={{ width: "20px", height: "20px", }} /> <Text style={{ color: "#374151", textAlign: "left", }} > This is just a simple paragraph text </Text> </Container>`
);

console.log(JSON.stringify(parsed, null, 2));
```

### Output

> In Progress

## Contributions

We welcome contributions of any kind! Feel free to submit pull requests, create issues, or share your ideas.

## License

MIT &copy; [Arik Chakma](https://twitter.com/imarikchakma)
