const sinon = require('sinon');
const Matrix = require('../matrix.js');
const { gauss_forward } = require('../gauss_functions.js');

describe('gauss_forward with a mocked Matrix', () => {
  it('eliminates the first column of a 2x2 system', () => {
    const m = new Matrix(2);
    const mock = sinon.mock(m);
    mock.expects('get_rows').once().returns(2);
    mock.expects('get_cols').once().returns(3);
    mock.expects('get').withExactArgs(0, 0).twice().returns(2);
    mock.expects('get').withExactArgs(1, 0).once().returns(4);
    mock.expects('mull_add').withExactArgs(1, 0, -2).once();
    mock.expects('swap_with_nonzero_row').never();

    gauss_forward(m);

    mock.verify();
  });

  it('swaps rows instead of eliminating when the pivot is zero', () => {
    const m = new Matrix(2);
    const mock = sinon.mock(m);
    mock.expects('get_rows').once().returns(2);
    mock.expects('get_cols').once().returns(3);
    mock.expects('get').withExactArgs(0, 0).once().returns(0);
    mock.expects('swap_with_nonzero_row').withExactArgs(0).once();
    mock.expects('mull_add').never();

    gauss_forward(m);

    mock.verify();
  });

  it('performs three row operations for a 3x3 system', () => {
    const m = new Matrix(3);
    const mock = sinon.mock(m);
    mock.expects('get_rows').once().returns(3);
    mock.expects('get_cols').once().returns(4);
    mock.expects('get').withExactArgs(0, 0).thrice().returns(2);
    mock.expects('get').withExactArgs(1, 0).once().returns(4);
    mock.expects('get').withExactArgs(2, 0).once().returns(6);
    mock.expects('get').withExactArgs(1, 1).twice().returns(5);
    mock.expects('get').withExactArgs(2, 1).once().returns(10);
    mock.expects('mull_add').withExactArgs(1, 0, -2).once();
    mock.expects('mull_add').withExactArgs(2, 0, -3).once();
    mock.expects('mull_add').withExactArgs(2, 1, -2).once();

    gauss_forward(m);

    mock.verify();
  });

  it('does nothing for a 1x1 system', () => {
    const m = new Matrix(1);
    const mock = sinon.mock(m);
    mock.expects('get_rows').once().returns(1);
    mock.expects('get_cols').once().returns(2);
    mock.expects('get').never();
    mock.expects('mull_add').never();
    mock.expects('swap_with_nonzero_row').never();

    gauss_forward(m);

    mock.verify();
  });
});
