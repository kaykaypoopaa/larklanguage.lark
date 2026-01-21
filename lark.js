#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readlineSync = require('readline-sync');

const builtinModules = {
  math: {
    pi: 3.14159265359,
    e: 2.71828182846,
    sqrt: { type: 'NativeFunction', fn: (x) => Math.sqrt(x) },
    pow: { type: 'NativeFunction', fn: (x, y) => Math.pow(x, y) },
    abs: { type: 'NativeFunction', fn: (x) => Math.abs(x) },
    floor: { type: 'NativeFunction', fn: (x) => Math.floor(x) },
    ceil: { type: 'NativeFunction', fn: (x) => Math.ceil(x) },
    round: { type: 'NativeFunction', fn: (x) => Math.round(x) },
    sin: { type: 'NativeFunction', fn: (x) => Math.sin(x) },
    cos: { type: 'NativeFunction', fn: (x) => Math.cos(x) },
    tan: { type: 'NativeFunction', fn: (x) => Math.tan(x) },
    max: { type: 'NativeFunction', fn: (...args) => Math.max(...args) },
    min: { type: 'NativeFunction', fn: (...args) => Math.min(...args) }
  },
  random: {
    random: { type: 'NativeFunction', fn: () => Math.random() },
    randint: { type: 'NativeFunction', fn: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min },
    choice: { type: 'NativeFunction', fn: (str) => str[Math.floor(Math.random() * str.length)] },
    shuffle: { type: 'NativeFunction', fn: (arr) => {
      const newArr = [...arr];
      for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
      }
      return newArr;
    }}
  },
  string: {
    len: { type: 'NativeFunction', fn: (s) => String(s).length },
    upper: { type: 'NativeFunction', fn: (s) => String(s).toUpperCase() },
    lower: { type: 'NativeFunction', fn: (s) => String(s).toLowerCase() },
    reverse: { type: 'NativeFunction', fn: (s) => String(s).split('').reverse().join('') },
    replace: { type: 'NativeFunction', fn: (s, old, newStr) => String(s).replace(old, newStr) },
    split: { type: 'NativeFunction', fn: (s, delim) => String(s).split(delim) },
    join: { type: 'NativeFunction', fn: (arr, delim) => arr.join(delim) },
    startswith: { type: 'NativeFunction', fn: (s, prefix) => String(s).startsWith(prefix) },
    endswith: { type: 'NativeFunction', fn: (s, suffix) => String(s).endsWith(suffix) },
    substring: { type: 'NativeFunction', fn: (s, start, end) => String(s).substring(start, end) }
  },
  array: {
    create: { type: 'NativeFunction', fn: (...items) => items },
    length: { type: 'NativeFunction', fn: (arr) => arr.length },
    push: { type: 'NativeFunction', fn: (arr, item) => { arr.push(item); return arr; } },
    pop: { type: 'NativeFunction', fn: (arr) => arr.pop() },
    sum: { type: 'NativeFunction', fn: (arr) => arr.reduce((a, b) => a + b, 0) },
    avg: { type: 'NativeFunction', fn: (arr) => arr.reduce((a, b) => a + b, 0) / arr.length },
    max: { type: 'NativeFunction', fn: (arr) => Math.max(...arr) },
    min: { type: 'NativeFunction', fn: (arr) => Math.min(...arr) },
    sort: { type: 'NativeFunction', fn: (arr) => [...arr].sort((a, b) => a - b) },
    reverse: { type: 'NativeFunction', fn: (arr) => [...arr].reverse() },
    contains: { type: 'NativeFunction', fn: (arr, item) => arr.includes(item) }
  },
  time: {
    now: { type: 'NativeFunction', fn: () => Date.now() },
    timestamp: { type: 'NativeFunction', fn: () => Math.floor(Date.now() / 1000) },
    year: { type: 'NativeFunction', fn: () => new Date().getFullYear() },
    month: { type: 'NativeFunction', fn: () => new Date().getMonth() + 1 },
    day: { type: 'NativeFunction', fn: () => new Date().getDate() },
    hour: { type: 'NativeFunction', fn: () => new Date().getHours() },
    minute: { type: 'NativeFunction', fn: () => new Date().getMinutes() },
    second: { type: 'NativeFunction', fn: () => new Date().getSeconds() }
  },
  input: {
    prompt: { 
      type: 'NativeFunction', 
      fn: (message) => {
        return readlineSync.question(String(message));
      }
    },
    number: {
      type: 'NativeFunction',
      fn: (message) => {
        const input = readlineSync.question(String(message));
        const num = parseFloat(input);
        return isNaN(num) ? 0 : num;
      }
    },
    int: {
      type: 'NativeFunction',
      fn: (message) => {
        const input = readlineSync.question(String(message));
        const num = parseInt(input);
        return isNaN(num) ? 0 : num;
      }
    }
  }
};

function tokenize(source) {
  const tokens = [];
  const keywords = ['let', 'if', 'then', 'else', 'end', 'while', 'do', 'fun', 'print', 'return', 'import'];
  const patterns = [
    { type: 'COMMENT', regex: /#.*/ },
    { type: 'NUMBER', regex: /\d+(\.\d+)?/ },
    { type: 'STRING', regex: /"([^"]*)"/ },
    { type: 'KEYWORD', regex: new RegExp(`\\b(${keywords.join('|')})\\b`) },
    { type: 'IDENTIFIER', regex: /[a-zA-Z_][a-zA-Z0-9_]*/ },
    { type: 'DOT', regex: /\./ },
    { type: 'OPERATOR', regex: /[+\-*/<>=!]+/ },
    { type: 'LPAREN', regex: /\(/ },
    { type: 'RPAREN', regex: /\)/ },
    { type: 'COMMA', regex: /,/ },
    { type: 'NEWLINE', regex: /\n/ },
    { type: 'WHITESPACE', regex: /[ \t]+/ }
  ];

  let pos = 0;
  while (pos < source.length) {
    let matched = false;
    
    for (const { type, regex } of patterns) {
      const match = source.slice(pos).match(new RegExp(`^${regex.source}`));
      if (match) {
        if (type !== 'WHITESPACE' && type !== 'COMMENT') {
          tokens.push({ type, value: match[0], pos });
        }
        pos += match[0].length;
        matched = true;
        break;
      }
    }
    
    if (!matched) {
      pos++;
    }
  }
  
  return tokens.filter(t => t.type !== 'NEWLINE');
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }

  peek() {
    return this.tokens[this.pos];
  }

  consume() {
    return this.tokens[this.pos++];
  }

  match(type, value = null) {
    const token = this.peek();
    if (!token) return false;
    if (token.type !== type) return false;
    if (value !== null && token.value !== value) return false;
    return true;
  }

  expect(type, value = null) {
    if (!this.match(type, value)) {
      throw new Error(`Expected ${type}${value ? ` '${value}'` : ''}`);
    }
    return this.consume();
  }

  parse() {
    const statements = [];
    while (this.pos < this.tokens.length) {
      statements.push(this.parseStatement());
    }
    return { type: 'Program', body: statements };
  }

  parseStatement() {
    if (this.match('KEYWORD', 'import')) {
      return this.parseImport();
    } else if (this.match('KEYWORD', 'let')) {
      return this.parseVarDecl();
    } else if (this.match('KEYWORD', 'if')) {
      return this.parseIf();
    } else if (this.match('KEYWORD', 'while')) {
      return this.parseWhile();
    } else if (this.match('KEYWORD', 'fun')) {
      return this.parseFun();
    } else if (this.match('KEYWORD', 'print')) {
      return this.parsePrint();
    } else if (this.match('KEYWORD', 'return')) {
      this.consume();
      const value = this.parseExpression();
      return { type: 'Return', value };
    } else if (this.match('IDENTIFIER')) {
      const name = this.consume().value;
      if (this.match('OPERATOR', '=')) {
        this.consume();
        const value = this.parseExpression();
        return { type: 'Assignment', name, value };
      } else if (this.match('LPAREN') || this.match('DOT')) {
        this.pos--;
        return { type: 'ExpressionStatement', expression: this.parseExpression() };
      }
    }
    
    const token = this.peek();
    throw new Error(`Unexpected token: ${token?.value}`);
  }

  parseImport() {
    this.expect('KEYWORD', 'import');
    const moduleName = this.expect('IDENTIFIER').value;
    return { type: 'Import', moduleName };
  }

  parseVarDecl() {
    this.expect('KEYWORD', 'let');
    const name = this.expect('IDENTIFIER').value;
    this.expect('OPERATOR', '=');
    const value = this.parseExpression();
    return { type: 'VarDecl', name, value };
  }

  parseIf() {
    this.expect('KEYWORD', 'if');
    const condition = this.parseExpression();
    this.expect('KEYWORD', 'then');
    const thenBody = [];
    while (!this.match('KEYWORD', 'else') && !this.match('KEYWORD', 'end')) {
      thenBody.push(this.parseStatement());
    }
    let elseBody = [];
    if (this.match('KEYWORD', 'else')) {
      this.consume();
      while (!this.match('KEYWORD', 'end')) {
        elseBody.push(this.parseStatement());
      }
    }
    this.expect('KEYWORD', 'end');
    return { type: 'If', condition, thenBody, elseBody };
  }

  parseWhile() {
    this.expect('KEYWORD', 'while');
    const condition = this.parseExpression();
    this.expect('KEYWORD', 'do');
    const body = [];
    while (!this.match('KEYWORD', 'end')) {
      body.push(this.parseStatement());
    }
    this.expect('KEYWORD', 'end');
    return { type: 'While', condition, body };
  }

  parseFun() {
    this.expect('KEYWORD', 'fun');
    const name = this.expect('IDENTIFIER').value;
    this.expect('LPAREN');
    const params = [];
    while (!this.match('RPAREN')) {
      params.push(this.expect('IDENTIFIER').value);
      if (this.match('COMMA')) this.consume();
    }
    this.expect('RPAREN');
    this.expect('KEYWORD', 'do');
    const body = [];
    while (!this.match('KEYWORD', 'end')) {
      body.push(this.parseStatement());
    }
    this.expect('KEYWORD', 'end');
    return { type: 'FunDecl', name, params, body };
  }

  parsePrint() {
    this.expect('KEYWORD', 'print');
    this.expect('LPAREN');
    const value = this.parseExpression();
    this.expect('RPAREN');
    return { type: 'Print', value };
  }

  parseExpression() {
    return this.parseComparison();
  }

  parseComparison() {
    let left = this.parseAdditive();
    while (this.match('OPERATOR') && ['>', '<', '==', '!=', '>=', '<='].includes(this.peek().value)) {
      const op = this.consume().value;
      const right = this.parseAdditive();
      left = { type: 'Binary', op, left, right };
    }
    return left;
  }

  parseAdditive() {
    let left = this.parseMultiplicative();
    while (this.match('OPERATOR') && ['+', '-'].includes(this.peek().value)) {
      const op = this.consume().value;
      const right = this.parseMultiplicative();
      left = { type: 'Binary', op, left, right };
    }
    return left;
  }

  parseMultiplicative() {
    let left = this.parsePrimary();
    while (this.match('OPERATOR') && ['*', '/'].includes(this.peek().value)) {
      const op = this.consume().value;
      const right = this.parsePrimary();
      left = { type: 'Binary', op, left, right };
    }
    return left;
  }

  parsePrimary() {
    if (this.match('NUMBER')) {
      return { type: 'Number', value: parseFloat(this.consume().value) };
    } else if (this.match('STRING')) {
      const val = this.consume().value;
      return { type: 'String', value: val.slice(1, -1) };
    } else if (this.match('IDENTIFIER')) {
      const name = this.consume().value;
      
      if (this.match('DOT')) {
        this.consume();
        const member = this.expect('IDENTIFIER').value;
        
        if (this.match('LPAREN')) {
          this.consume();
          const args = [];
          while (!this.match('RPAREN')) {
            args.push(this.parseExpression());
            if (this.match('COMMA')) this.consume();
          }
          this.expect('RPAREN');
          return { type: 'ModuleCall', module: name, member, args };
        }
        
        return { type: 'ModuleAccess', module: name, member };
      }
      
      if (this.match('LPAREN')) {
        this.consume();
        const args = [];
        while (!this.match('RPAREN')) {
          args.push(this.parseExpression());
          if (this.match('COMMA')) this.consume();
        }
        this.expect('RPAREN');
        return { type: 'Call', name, args };
      }
      return { type: 'Identifier', name };
    } else if (this.match('LPAREN')) {
      this.consume();
      const expr = this.parseExpression();
      this.expect('RPAREN');
      return expr;
    }
    throw new Error('Unexpected token in expression');
  }
}

class Interpreter {
  constructor(fileSystem, builtins) {
    this.fileSystem = fileSystem;
    this.builtins = builtins;
    this.globals = {};
    this.modules = {};
    this.output = [];
  }

  interpret(ast, currentFile = 'main.lark') {
    for (const stmt of ast.body) {
      this.execute(stmt, this.globals, currentFile);
    }
    return this.output.join('\n');
  }

  loadModule(moduleName, currentFile) {
    if (this.modules[moduleName]) {
      return this.modules[moduleName];
    }

    if (this.builtins[moduleName]) {
      this.modules[moduleName] = this.builtins[moduleName];
      return this.builtins[moduleName];
    }

    const moduleFile = moduleName + '.lark';
    if (!this.fileSystem[moduleFile]) {
      throw new Error(`Module '${moduleName}' not found. Available built-in modules: ${Object.keys(this.builtins).join(', ')}`);
    }

    const moduleCode = this.fileSystem[moduleFile];
    const tokens = tokenize(moduleCode);
    const parser = new Parser(tokens);
    const ast = parser.parse();

    const moduleEnv = {};
    for (const stmt of ast.body) {
      this.execute(stmt, moduleEnv, moduleFile);
    }

    this.modules[moduleName] = moduleEnv;
    return moduleEnv;
  }

  execute(stmt, env, currentFile) {
    switch (stmt.type) {
      case 'Import':
        const module = this.loadModule(stmt.moduleName, currentFile);
        env[stmt.moduleName] = module;
        break;
      case 'VarDecl':
        env[stmt.name] = this.evaluate(stmt.value, env,
