const fs = require('fs');
const { expect } = require('chai');
const sinon = require('sinon');
const Matrix = require('../matrix.js');
const { read_input } = require('../gauss_functions.js');

describe('read_input with a mocked Matrix.prototype.set', () => {
  it('fills the matrix cell by cell through set', () => {
    sinon.stub(fs, 'readFileSync').callThrough();
    fs.readFileSync.withArgs('input.txt', 'utf8').returns('2\n2 1 5\n1 3 5\n');
    const mock = sinon.mock(Matrix.prototype);
    mock.expects('set').withExactArgs(0, 0, 2).once();
    mock.expects('set').withExactArgs(0, 1, 1).once();
    mock.expects('set').withExactArgs(0, 2, 5).once();
    mock.expects('set').withExactArgs(1, 0, 1).once();
    mock.expects('set').withExactArgs(1, 1, 3).once();
    mock.expects('set').withExactArgs(1, 2, 5).once();

    const m = read_input();

    mock.verify();
    expect(m).to.be.instanceOf(Matrix);
    expect(m.get_rows()).to.equal(2);
    expect(m.get_cols()).to.equal(3);
  });

  it('parses fractional and negative numbers', () => {
    sinon.stub(fs, 'readFileSync').callThrough();
    fs.readFileSync.withArgs('input.txt', 'utf8').returns('1\n-1.5 3\n');
    const mock = sinon.mock(Matrix.prototype);
    mock.expects('set').withExactArgs(0, 0, -1.5).once();
    mock.expects('set').withExactArgs(0, 1, 3).once();

    read_input();

    mock.verify();
  });
});
