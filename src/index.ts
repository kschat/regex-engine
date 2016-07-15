import { inspect } from 'util';
import { compile } from './compiler';
import { Lexer, Parser } from './parser';

const log = (arg: Object): void => console.log(inspect(arg, { depth: null, colors: true }));

for (let token of new Lexer('asdf+')) {
  log(token);
}
