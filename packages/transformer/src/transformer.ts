import { Parser } from './parser';

export class Transformer {
  protected parser: Parser;

  constructor() {
    this.parser = new Parser();
  }

  public transform(content: string) {
    const ast = this.parser.parse(content);
    console.log(ast);
  }
}
