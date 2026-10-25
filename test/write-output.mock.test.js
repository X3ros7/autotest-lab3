const fs = require('fs');
const sinon = require('sinon');
const { write_in_file } = require('../gauss_functions.js');

describe('write_in_file with a mocked file system', () => {
  const validInput = '2\n1 2 3\n4 5 6\n';

  const stubInput = (content) => {
    sinon.stub(fs, 'readFileSync').callThrough();
    fs.readFileSync.withArgs('input.txt', 'utf8').returns(content);
  };

  it('appends every solution to output.txt', () => {
    stubInput(validInput);
    const mock = sinon.mock(fs);
    mock.expects('appendFileSync').withExactArgs('output.txt', '1.5 ').once();
    mock.expects('appendFileSync').withExactArgs('output.txt', '2 ').once();
    mock.expects('writeFileSync').never();

    write_in_file([1.5, 2]);

    mock.verify();
  });

  it('rounds solutions to seven decimal places and drops trailing zeroes', () => {
    stubInput(validInput);
    const mock = sinon.mock(fs);
    mock.expects('appendFileSync').withExactArgs('output.txt', '0.1234568 ').once();
    mock.expects('appendFileSync').withExactArgs('output.txt', '0.25 ').once();

    write_in_file([0.123456789, 0.24999999999999956]);

    mock.verify();
  });

  it('writes "no solution" when the solution list is null', () => {
    stubInput(validInput);
    const mock = sinon.mock(fs);
    mock.expects('writeFileSync').withExactArgs('output.txt', 'no solution').once();
    mock.expects('appendFileSync').never();

    write_in_file(null);

    mock.verify();
  });

  it('writes "wrong imput" when the input file is invalid', () => {
    stubInput('x\n1 2 3\n');
    const mock = sinon.mock(fs);
    mock.expects('writeFileSync').withExactArgs('output.txt', 'wrong imput').once();
    mock.expects('appendFileSync').never();

    write_in_file([1, 2]);

    mock.verify();
  });
});
