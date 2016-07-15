import { ParserError } from './models/error';

interface Dict<T> {
  [index: string]: T;
}

const enum Lexeme {
  Literal,
  ZeroOrOne,
  ZeroOrMore,
  OneOrMore,
  Escape,
  EOF
}

const OPERATORS: Dict<Lexeme> = {
  '?':  Lexeme.ZeroOrOne,
  '*':  Lexeme.ZeroOrMore,
  '+':  Lexeme.OneOrMore,
  '\\': Lexeme.Escape
};

type LexToken = [Lexeme, string];

class Lexer implements IterableIterator<LexToken> {
  private position: number;
  private end: number;

  constructor(private input: string) {
    this.position = 0;
    this.end = this.input.length;
  }

  public scan(): LexToken {
    if (this.position >= this.end) {
      return [Lexeme.EOF, null];
    }

    const currentChar = this.read();
    const operator = OPERATORS[currentChar];

    if (operator) {
      return [operator, currentChar];
    }

    this.unread();
    return this.scanLiteral();
  }

  public read(): string {
    return this.input[this.position++];
  }

  public unread(): void {
    this.position--;
  }

  private scanLiteral(): LexToken {
    let literal = '';
    let temp = this.read();

    while (!OPERATORS[temp] && temp != null) {
      literal += temp;
      temp = this.read();
    }

    this.unread();
    return [Lexeme.Literal, literal];
  }

  public next(): IteratorResult<LexToken> {
    const token = this.scan();

    if (token[0] === Lexeme.EOF) {
      return { done: true };
    }

    return { done: false, value: token };
  }

  [Symbol.iterator](): IterableIterator<LexToken> {
    return this;
  }
}

interface SyntaxNode {
  tag: string;
}

class LiteralNode implements SyntaxNode {
  public tag: string;

  constructor(
    public value: string
  ) {
    this.tag = 'literal';
  }
}

/*
{
  operator: '%',
  left: {
    value: 'a'
  },
  right: {
    operator: '%',
    left: 'b',
    right: 'c'
  }
}
*/

class OperatorNode implements SyntaxNode {
  public tag: string;

  constructor(
    public operator: string,
    public left?: SyntaxNode,
    public right?: SyntaxNode
  ) {
    this.tag = 'operator';
  }
}

class Parser {
  private start: SyntaxNode;

  constructor(
    private input: string,
    private lexer: Lexer = new Lexer(input)
  ) {}

  private parseOperator(operator: string): OperatorNode {
    return new OperatorNode('');
  }

  private parseLiteral(value: string): OperatorNode {
    const baseNode = new OperatorNode('%');
    const valueArr = value.split('');

    valueArr.reduce((tree: OperatorNode, value: string, index: number) => {
      tree.left = new LiteralNode(value);

      if (index + 1 === valueArr.length) {
        return;
      }

      tree.right = new OperatorNode('%');
      return tree.right as OperatorNode;
    }, baseNode);

    return baseNode;
  }

  public parse(baseNode: SyntaxNode = start): SyntaxNode {
    const [token, value] = this.lexer.scan();

    switch (token) {
      case Lexeme.Literal:
        return this.parseLiteral(value);
      case Lexeme.ZeroOrMore:
        return this.parseOperator(value);
      case Lexeme.EOF:
        return;
      default:
        throw new ParserError(`Unexpected token "${value}"`);
    }
  }
}

export { Lexer, Parser };

