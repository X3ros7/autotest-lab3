const fs = require('fs');
const { expect } = require('chai');
const sinon = require('sinon');
const Matrix = require('../matrix.js');
const FakeMatrix = require('./fakes/fake-matrix');
const { gauss, gauss_forward, gauss_backward, read_input, write_in_file } = require('../gauss_functions.js');

const buildMatrix = (rows) => {
  const m = new Matrix(rows.length);
  rows.forEach((row, i) => row.forEach((value, j) => m.set(i, j, value)));
  return m;
};

const sampleSystem = [
  [3, 6, 9, 15, 18, 15],
  [8, 8, 40, 48, 56, 48],
  [7, 35, 49, 56, 63, 49],
  [6, 18, 30, 36, 48, 54],
  [5, 15, 30, 35, 45, 45]
];

describe('Stub: canned answers without expectations', () => {
  it('a stubbed exists_wrong_row makes gauss return null', () => {
    const m = buildMatrix([[3, 6]]);
    const stub = sinon.stub(m, 'exists_wrong_row').returns(true);

    expect(gauss(m)).to.equal(null);
    expect(stub).to.have.been.calledOnce;
  });

  it('a stubbed get feeds gauss_backward with chosen values', () => {
    const m = new Matrix(2);
    const table = { '1,2': 6, '1,1': 3, '0,1': 1, '0,2': 5, '0,0': 2 };
    const stub = sinon.stub(m, 'get').callsFake((i, j) => table[`${i},${j}`]);

    expect(gauss_backward(m)).to.deep.equal([1.5, 2]);
    expect(stub).to.have.callCount(5);
    expect(stub).to.have.been.calledWith(1, 2);
  });

  it('a stubbed readFileSync supplies the input without touching the disk', () => {
    sinon.stub(fs, 'readFileSync').callThrough();
    fs.readFileSync.withArgs('input.txt', 'utf8').returns('1\n4 8\n');

    const m = read_input();

    expect(fs.readFileSync).to.have.been.calledWith('input.txt', 'utf8');
    expect(m.get(0, 0)).to.equal(4);
    expect(m.get(0, 1)).to.equal(8);
  });
});

describe('Spy: observing real behaviour', () => {
  it('gauss_forward calls mull_add once per eliminated cell', () => {
    const m = buildMatrix([[2, 1, 1, 5], [4, 3, 3, 13], [8, 7, 9, 33]]);
    const spy = sinon.spy(m, 'mull_add');

    gauss_forward(m);

    expect(spy).to.have.callCount(3);
    expect(spy).to.have.been.calledWith(1, 0);
    expect(spy).to.have.been.calledWith(2, 0);
    expect(spy).to.have.been.calledWith(2, 1);
  });

  it('the spied real matrix still solves the system', () => {
    const m = buildMatrix([[2, 1, 1, 5], [4, 3, 3, 13], [8, 7, 9, 33]]);
    sinon.spy(m, 'mull_add');

    const solutions = gauss(m);

    expect(solutions[0]).to.be.closeTo(1, 1e-9);
    expect(solutions[1]).to.be.closeTo(1, 1e-9);
    expect(solutions[2]).to.be.closeTo(2, 1e-9);
  });
});

describe('Fake: working lightweight implementations', () => {
  it('gauss solves the sample system using FakeMatrix', () => {
    const solutions = gauss(new FakeMatrix(sampleSystem));

    const golden = [4.5, 0.25, 1.25, -3.75, 2.5];
    expect(solutions).to.have.lengthOf(golden.length);
    golden.forEach((value, i) => expect(solutions[i]).to.be.closeTo(value, 1e-9));
  });

  it('gauss returns null for an inconsistent system using FakeMatrix', () => {
    expect(gauss(new FakeMatrix([[1, 1, 2], [2, 2, 5]]))).to.equal(null);
  });

  it('gauss returns null for a dependent system using FakeMatrix', () => {
    expect(gauss(new FakeMatrix([[1, 1, 2], [2, 2, 4]]))).to.equal(null);
  });

  it('gauss swaps rows when the pivot is zero using FakeMatrix', () => {
    expect(gauss(new FakeMatrix([[0, 1, 2], [1, 1, 3]]))).to.deep.equal([1, 2]);
  });

  it('an in-memory fake file system runs read_input, gauss and write_in_file end to end', () => {
    const files = {
      'input.txt': '5\n3 6 9 15 18 15\n8 8 40 48 56 48\n7 35 49 56 63 49\n6 18 30 36 48 54\n5 15 30 35 45 45\n'
    };
    sinon.replace(fs, 'readFileSync', sinon.fake((path) => files[path]));
    sinon.replace(fs, 'writeFileSync', sinon.fake((path, data) => { files[path] = data; }));
    sinon.replace(fs, 'appendFileSync', sinon.fake((path, data) => { files[path] = (files[path] || '') + data; }));

    write_in_file(gauss(read_input()));

    expect(files['output.txt']).to.equal('4.5 0.25 1.25 -3.75 2.5 ');
    expect(fs.appendFileSync).to.have.callCount(5);
  });
});
