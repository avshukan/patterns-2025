'use strict';

const identity = (value) => value;

class Cell {
  constructor(value = '', format = identity) {
    this.setValue(String(value).trim());
    this.setFormat(format);
  }

  loadFromString(data = '') {
    this.value = data.trim();
  }

  getValue() {
    return this.value;
  }

  setValue(value) {
    this.value = value;
  }

  setFormat(format) {
    if (typeof format !== 'function') {
      throw new Error('Format must be a function');
    }

    this.format = format;
  }

  toString() {
    return this.format(this.value.toString());
  }
}

class Row {
  #cells = [];
  #format = identity;
  #defaultFormat = identity;

  constructor(cells = [], format = identity, formatCells = {}) {
    this.#cells = cells;
    this.#format = format;
    this.setFormatCells(formatCells);
  }

  loadFromString(data, separator = ',') {
    this.#cells = data.split(separator).map((cellData) => {
      const cell = new Cell();
      cell.loadFromString(cellData);
      return cell;
    });
  }

  getValue(index) {
    return this.getCell(index).getValue();
  }

  getCell(index) {
    if (index < 0 || index >= this.#cells.length) {
      throw new Error('Invalid cell index');
    }

    return this.#cells[index];
  }

  setCell(index, value) {
    if (index < 0 || index >= this.#cells.length) {
      throw new Error('Invalid cell index');
    }

    this.#cells[index] = value;
  }

  setFormatCells(formatCells = {}) {
    if (typeof formatCells !== 'object') {
      throw new Error('Format must be an object');
    }

    for (let index = 0; index < this.#cells.length; index++) {
      const cell = this.getCell(index);

      const format =
        typeof formatCells[index] === 'function'
          ? formatCells[index]
          : this.#defaultFormat;

      cell.setFormat(format);
    }
  }

  addCalculatedColumn(calculatedFunction) {
    const value = calculatedFunction(this);
    const cell = new Cell(value, this.#defaultFormat);
    this.#cells.push(cell);
  }

  toString() {
    const formattedCells = this.#cells.map((cell) => cell.toString());
    return this.#format(formattedCells.join('')).toString();
  }
}

class Table {
  #header = [];
  #rows = [];
  #format = identity;

  constructor(rows = [], header = [], format = identity, formatCells = {}) {
    this.#header = header;
    this.#rows = rows;
    this.#format = format;
    this.setFormatCells(formatCells);
  }

  loadFromString(data = '', rowsSeparator = '\n', cellsSeparator = ',') {
    const splittedLines = data.split(rowsSeparator);
    const [headerLine, ...rows] = splittedLines;
    this.#header = headerLine.split(cellsSeparator);
    this.#rows = rows.map((rowData) => {
      const row = new Row();
      row.loadFromString(rowData, cellsSeparator);
      return row;
    });
  }

  getRowsCount() {
    return this.#rows.length;
  }

  getColumnsCount() {
    return this.#header.length;
  }

  setFormatCells(formatCells = {}) {
    this.#rows.forEach((row) => {
      row.setFormatCells(formatCells);
    });
  }

  removeRow(rowIndex) {
    if (rowIndex < 0 || rowIndex >= this.rows.length) {
      throw new Error('Invalid row index');
    }

    this.rows.splice(rowIndex, 1);
  }

  addCalculatedColumn(calculatedFunction, title = 'new column') {
    this.#header.push(title);
    this.#header.length += 1;
    for (const row of this.#rows) {
      row.addCalculatedColumn(calculatedFunction);
    }
  }

  filterRows(filterFunction) {
    this.#rows = this.#rows.filter(filterFunction);
  }

  sortRows(sortFunction) {
    this.#rows.sort(sortFunction);
  }

  aggregateRows({ aggregationFunction, initValue }) {
    const result = this.#rows.reduce(aggregationFunction, initValue);
    return result;
  }

  toString() {
    const formattedRows = this.#rows.map((row) => row.toString());
    return this.#format(formattedRows.join('\n'));
  }
}

const main = (data) => {
  const table = new Table();

  table.loadFromString(data);

  const rowsCount = table.getRowsCount();

  const removeLastRow = (row, index) => index < rowsCount - 1;

  table.filterRows(removeLastRow);

  const densityColumnIndex = 3;

  const getMaxValueByColumnIndex = (columnIndex) => (acc, row) => {
    const value = parseInt(row.getValue(columnIndex));
    return value > acc ? value : acc;
  };

  const getMaxDensity = getMaxValueByColumnIndex(densityColumnIndex);

  const maxDensity = table.aggregateRows({
    aggregationFunction: getMaxDensity,
    initValue: 0,
  });

  const calculatePercentage = (maxValue, columnIndex) => (row) => {
    const value = parseInt(row.getValue(columnIndex));
    const percentage = Math.round((value * 100) / maxValue);
    return percentage;
  };

  const calculateDensityPercentage = calculatePercentage(
    maxDensity,
    densityColumnIndex,
  );

  table.addCalculatedColumn(calculateDensityPercentage, 'densityPercentage');

  const sortFunctionByIndex = (columnIndex) => (row1, row2) => {
    const value1 = parseInt(row1.getValue(columnIndex));
    const value2 = parseInt(row2.getValue(columnIndex));
    return value2 - value1;
  };

  const sortByDensityPercentage = sortFunctionByIndex(5);

  table.sortRows(sortByDensityPercentage);

  const formatSells = {
    0: (value) => `  ${value}`.toString().padEnd(18),
    1: (value) => value.toString().padStart(10),
    2: (value) => value.toString().padStart(8),
    3: (value) => value.toString().padStart(8),
    4: (value) => value.toString().padStart(18),
    5: (value) => value.toString().padStart(6),
  };

  table.setFormatCells(formatSells);

  return table.toString();
};

module.exports = { main };
