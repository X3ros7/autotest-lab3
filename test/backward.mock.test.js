const { expect } = require('chai');
const sinon = require('sinon');
const Matrix = require('../matrix.js');
const { gauss_backward } = require('../gauss_functions.js');

describe('gauss_backward with a mocked Matrix', () => {
  it('solves a 2x2 upper triangular system', () => {
    const m = new Matrix(2);
    const mock = sinon.mock(m);
    mock.expects('get_rows').once().returns(2);
    mock.expects('get_cols').once().returns(3);
    mock.expects('get').withExactArgs(1, 2).once().returns(6);
    mock.expects('get').withExactArgs(1, 1).once().returns(3);
    mock.expects('get').withExactArgs(0, 1).once().returns(1);
    mock.expects('get').withExactArgs(0, 2).once().returns(5);
    mock.expects('get').withExactArgs(0, 0).once().returns(2);

    const solutions = gauss_backward(m);

    mock.verify();
    expect(solutions).to.deep.equal([1.5, 2]);
  });

  it('solves a 3x3 upper triangular system', () => {
    const m = new Matrix(3);
    const mock = sinon.mock(m);
    mock.expects('get_rows').once().returns(3);
    mock.expects('get_cols').once().returns(4);
    mock.expects('get').withExactArgs(2, 3).once().returns(3);
    mock.expects('get').withExactArgs(2, 2).once().returns(1);
    mock.expects('get').withExactArgs(1, 2).once().returns(1);
    mock.expects('get').withExactArgs(1, 3).once().returns(7);
    mock.expects('get').withExactArgs(1, 1).once().returns(2);
    mock.expects('get').withExactArgs(0, 1).once().returns(1);
    mock.expects('get').withExactArgs(0, 2).once().returns(1);
    mock.expects('get').withExactArgs(0, 3).once().returns(6);
    mock.expects('get').withExactArgs(0, 0).once().returns(1);

    const solutions = gauss_backward(m);

    mock.verify();
    expect(solutions).to.deep.equal([1, 2, 3]);
  });

  it('solves a 1x1 system', () => {
    const m = new Matrix(1);
    const mock = sinon.mock(m);
    mock.expects('get_rows').once().returns(1);
    mock.expects('get_cols').once().returns(2);
    mock.expects('get').withExactArgs(0, 1).once().returns(6);
    mock.expects('get').withExactArgs(0, 0).once().returns(3);

    expect(gauss_backward(m)).to.deep.equal([2]);
    mock.verify();
  });
});
