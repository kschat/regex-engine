import { State, Operator } from './models/state';

const buildNfa = (input: string): State => {
  const stateStack = input.split('').reduce((stack: State[], value: string) => {
    let state1: State;
    let state2: State;

    switch (value.charCodeAt(0)) {
      case Operator.Concatenate:
        state2 = stack.pop();
        state1 = stack.pop();
        stack.push(state1.append(state2));
        break;
      case Operator.Alternate:
        state2 = stack.pop();
        state1 = stack.pop();
        stack.push(state1.branch(state2));
        break;
      case Operator.ZeroOrOne:
        state1 = stack.pop();
        stack.push(state1.branch(State.blank()));
        break;
      case Operator.ZeroOrMore:
        state1 = stack.pop();
        stack.push(state1.branch(State.blank()).append(state1));
        break;
      case Operator.OneOrMore:
        state1 = stack.pop();
        stack.push(state1.append(state1.branch(State.blank())));
        break;
      default:
        stack.push(new State(value));
        break;
    }

    return stack;
  }, []);

  return stateStack.pop();
};

export { buildNfa as compile };

