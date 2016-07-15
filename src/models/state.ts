enum Operator {
  Concatenate = '%'.charCodeAt(0),
  Alternate   = '|'.charCodeAt(0),
  ZeroOrOne   = '?'.charCodeAt(0),
  ZeroOrMore  = '*'.charCodeAt(0),
  OneOrMore   = '+'.charCodeAt(0)
}

type OutputDirection = 'left' | 'right';

class State {
  static clone(state: State) {
    return new State(state.value, state.left, state.right);
  }

  static blank(left?: State, right?: State) {
    return new State('', left, right);
  }

  constructor(
    public value: string,
    public left?: State,
    public right?: State
  ) {}

  private traverse(direction: OutputDirection): State {
    let output: State = this;
    while ((<any>output)[direction]) {
      output = (<any>output)[direction];
    }

    return output;
  }

  public append(state: State): State {
    const appendedState = State.clone(this);
    appendedState.traverse('left').left = state;

    return appendedState;
  }

  public branch(state: State): State {
    return new State('', this, state);
  }
}

export { State, Operator };

