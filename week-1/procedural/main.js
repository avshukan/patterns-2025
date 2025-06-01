'use strict';

const config = {
  city: {
    setPad: (value) => value.toString().padEnd(18),
  },
  population: {
    setPad: (value) => value.toString().padStart(10),
  },
  area: {
    setPad: (value) => value.toString().padStart(8),
  },
  density: {
    setPad: (value) => value.toString().padStart(8),
  },
  country: {
    setPad: (value) => value.toString().padStart(18),
  },
  densityPercentage: {
    setPad: (value) => value.toString().padStart(6),
  },
};

const splitData = (data = '', rowsSeparator = '\n', cellsSeparator = ',') => {
  const splittedLines = data.split(rowsSeparator);
  const [headerLine, ...rows] = splittedLines;
  const header = headerLine.split(cellsSeparator);
  const lines = rows.map((row) => row.split(cellsSeparator));
  return { header, lines };
};

const removeLastRow = (rows = []) => rows.slice(0, rows.length - 1);

const setColumnsOrderForRow = (row = [], columnsOrder = []) => {
  const orderedRow = [];
  for (const columnIndex of columnsOrder) {
    orderedRow.push(row[columnIndex]);
  }
  return orderedRow;
};

const setColumnsOrderForTable = (table = [], columnsOrder = [], orderHandler) =>
  table.map((row) => orderHandler(row, columnsOrder));

const getMaxColumnValue = (data = [], columnIndex = 0) => {
  let max = 0;
  for (const row of data) {
    const value = parseInt(row[columnIndex]);
    max = value > max ? value : max;
  }
  return max;
};

const addColumnForHeader = (header = [], newColumn = '') => [
  ...header,
  newColumn,
];

const addCalculatedColumnForRows = (rows = [], calculationFunction) => {
  const updatedRows = rows.map((row) => {
    const newCell = calculationFunction(row);
    return [...row, newCell];
  });
  return updatedRows;
};

const formatRow = (row = [], header = [], config = {}) =>
  row.map((cell, index) => {
    const columnName = header[index];
    const defaultSetPad = (value) => value;
    const setPad = config[columnName].setPad ?? defaultSetPad;
    return setPad(cell);
  });

const sortTableByColumnId = (table = [], columnId) => {
  const result = [...table];
  result.sort((row1, row2) => row2[columnId] - row1[columnId]);
  return result;
};

const joinRow = (cells = [], separator = '') => cells.join(separator);

const joinTable = (
  rows = [],
  header = [],
  config = {},
  rowsSeparator = '\n',
  cellsSeparator = '',
) =>
  rows
    .map((row) => {
      const formattedRow = formatRow(row, header, config);
      return joinRow(formattedRow, cellsSeparator);
    })
    .join(rowsSeparator);

const main = (data) => {
  if (!data) {
    return '';
  }
  const { header, lines } = splitData(data);
  const slicedLines = removeLastRow(lines);
  const rowOrderHandler = setColumnsOrderForRow;
  const table = setColumnsOrderForTable(
    slicedLines,
    [0, 1, 2, 3, 4],
    rowOrderHandler,
  );
  const max = getMaxColumnValue(slicedLines, 3);
  const expandedHeader = addColumnForHeader(header, 'densityPercentage');
  const tableWithDensity = addCalculatedColumnForRows(table, (row) =>
    Math.round((row[3] * 100) / max),
  );
  const sortedTable = sortTableByColumnId(tableWithDensity, 5);
  const result = joinTable(sortedTable, expandedHeader, config, '\n', '');
  return result;
};

module.exports = { main };
