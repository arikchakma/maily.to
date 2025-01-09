<div align="center"><img height="150" src="https://maily.to/brand/icon.svg" /></div>
<br>

<div align="center"><strong>@maily-to/hydrate</strong></div>
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

Install `@maily-to/hydrate` from your command line.

```sh
pnpm add @maily-to/hydrate
```

## Getting started

Transform JSX content into structured `ParsedNode` JSON.

```ts
import { hydrate } from '@maily-to/hydrate';

const hydratedJSON = await hydrate(
  `<Html>
    <Head>
      <Font
        fallbackFontFamily="sans-serif"
        fontFamily="Inter"
        fontStyle="normal"
        fontWeight={400}
        webFont={{
          format: "woff2",
          url: "https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19",
        }}
      />
      <style
        dangerouslySetInnerHTML={{
          __html:
            "blockquote,h1,h2,h3,img,li,ol,p,ul{margin-top:0;margin-bottom:0}@media only screen and (max-width:425px){.tab-row-full{width:100%!important}.tab-col-full{display:block!important;width:100%!important}.tab-pad{padding:0!important}}",
        }}
      />
      <meta content="width=device-width" name="viewport" />
      <meta content="IE=edge" httpEquiv="X-UA-Compatible" />
      <meta name="x-apple-disable-message-reformatting" />
      <meta
        content="telephone=no,address=no,email=no,date=no,url=no"
        name="format-detection"
      />
      <meta content="light" name="color-scheme" />
      <meta content="light" name="supported-color-schemes" />
    </Head>
    <Body
      style={{
        margin: 0,
      }}
    >
      <Container
        style={{
          marginLeft: "auto",
          marginRight: "auto",
          maxWidth: "600px",
          minWidth: "300px",
          padding: "0.5rem",
          width: "100%",
        }}
      >
        <Text
          style={{
            MozOsxFontSmoothing: "grayscale",
            WebkitFontSmoothing: "antialiased",
            color: "#374151",
            fontSize: "15px",
            marginBottom: "20px",
            marginTop: "0px",
            textAlign: "left",
          }}
        >
          Hello World!
        </Text>
      </Container>
    </Body>
  </Html>`
);

console.log(JSON.stringify(hydratedJSON, null, 2));
```

### Output

```json
{
  "type": "doc",
  "content": [
    {
      "type": "paragraph",
      "content": [
        {
          "type": "text",
          "text": "Hello World!"
        }
      ]
    }
  ]
}
```

You can play more with the hydration process here: [Maily Transformer Playground](https://transformer.maily.to)

## Contributions

We welcome contributions of any kind! Feel free to submit pull requests, create issues, or share your ideas.

## License

MIT &copy; [Arik Chakma](https://twitter.com/imarikchakma)
