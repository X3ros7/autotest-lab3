class FakeMatrix {
  constructor(rows) {
    this.rows = rows.map((row) => [...row]);
  }

  get_rows() {
    return this.rows.length;
  }

  get_cols() {
    return this.rows.length + 1;
  }

  get(i, j) {
    return this.rows[i][j];
  }

  set(i, j, value) {
    this.rows[i][j] = value;
  }

  mull_add(i, j, d) {
    this.rows[i] = this.rows[i].map((value, k) => value + d * this.rows[j][k]);
  }

  swap_with_nonzero_row(i) {
    const j = this.rows.findIndex((row, index) => index > i && row[i] !== 0);
    if (j !== -1) {
      [this.rows[i], this.rows[j]] = [this.rows[j], this.rows[i]];
    }
  }

  exists_wrong_row() {
    return this.rows.some((row) => row.slice(0, -1).every((v) => v === 0) && row[row.length - 1] !== 0);
  }

  exists_zero_row() {
    return this.rows.some((row) => row.every((v) => v === 0));
  }
}

module.exports = FakeMatrix;
