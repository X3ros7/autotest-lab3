const { expect } = require('chai');
const sinon = require('sinon');
const Matrix = require('../matrix.js');
const { gauss } = require('../gauss_functions.js');

describe('gauss with a mocked Matrix', () => {
  const singleRowMatrix = () => {
    const m = new Matrix(1);
    const mock = sinon.mock(m);
    mock.expects('get_rows').atLeast(1).returns(1);
    mock.expects('get_cols').atLeast(1).returns(2);
    return { m, mock };
  };

  it('returns null when the matrix has an inconsistent row', () => {
    const { m, mock } = singleRowMatrix();
    mock.expects('exists_wrong_row').once().returns(true);
    mock.expects('exists_zero_row').never();
    mock.expects('get').never();

    expect(gauss(m)).to.equal(null);
    mock.verify();
  });

  it('returns null when the matrix has a zero row', () => {
    const { m, mock } = singleRowMatrix();
    mock.expects('exists_wrong_row').once().returns(false);
    mock.expects('exists_zero_row').once().returns(true);
    mock.expects('get').never();

    expect(gauss(m)).to.equal(null);
    mock.verify();
  });

  it('runs back substitution when the system is solvable', () => {
    const { m, mock } = singleRowMatrix();
    mock.expects('exists_wrong_row').once().returns(false);
    mock.expects('exists_zero_row').once().returns(false);
    mock.expects('get').withExactArgs(0, 1).once().returns(6);
    mock.expects('get').withExactArgs(0, 0).once().returns(3);

    expect(gauss(m)).to.deep.equal([2]);
    mock.verify();
  });
});
