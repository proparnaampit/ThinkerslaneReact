import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import type {SizeChart} from '../../../utils/categoryFields';

const CELL_WIDTH = 110;

interface Props {
  chart: SizeChart;
  /** When set, sizes can be added, edited and removed. */
  onChangeRows?: (rows: Array<Record<string, any>>) => void;
  /** The first N rows are the category's default sizes: shown, not editable. */
  lockedCount?: number;
}

const SizeChartTable: React.FC<Props> = ({
  chart,
  onChangeRows,
  lockedCount = 0,
}) => {
  const editable = !!onChangeRows;

  // Add the unit only when the label does not already carry one, e.g. "(cm)".
  const header = (label: string, unit: string) =>
    unit && !label.includes('(') ? `${label} (${unit})` : label;

  const setCell = (index: number, key: string, value: string) =>
    onChangeRows?.(
      chart.rows.map((r, i) => (i === index ? {...r, [key]: value} : r)),
    );

  const addSize = () => {
    const row: Record<string, any> = {size: ''};
    chart.columns.forEach(c => {
      row[c.key] = '';
    });
    onChangeRows?.([...chart.rows, row]);
  };

  const removeRow = (index: number) =>
    onChangeRows?.(chart.rows.filter((_, i) => i !== index));

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.table}>
          <View style={[styles.row, styles.headerRow]}>
            <Text style={[styles.cell, styles.headerText]}>Size</Text>
            {chart.columns.map(c => (
              <Text key={c.key} style={[styles.cell, styles.headerText]}>
                {header(c.label, c.unit)}
              </Text>
            ))}
            {editable ? <View style={styles.actionCell} /> : null}
          </View>
          {chart.rows.map((row, i) => {
            const rowEditable = editable && i >= lockedCount;
            return (
            <View key={`${i}`} style={styles.row}>
              {rowEditable ? (
                <TextInput
                  style={[styles.cell, styles.sizeText, styles.input]}
                  value={String(row.size ?? '')}
                  placeholder="Size"
                  placeholderTextColor="#9ca3af"
                  onChangeText={t => setCell(i, 'size', t)}
                />
              ) : (
                <Text style={[styles.cell, styles.sizeText]}>{row.size}</Text>
              )}
              {chart.columns.map(c =>
                rowEditable ? (
                  <TextInput
                    key={c.key}
                    style={[styles.cell, styles.input]}
                    value={String(row[c.key] ?? '')}
                    keyboardType="decimal-pad"
                    placeholder="-"
                    placeholderTextColor="#9ca3af"
                    onChangeText={t => setCell(i, c.key, t)}
                  />
                ) : (
                  <Text key={c.key} style={styles.cell}>
                    {row[c.key] ?? '-'}
                  </Text>
                ),
              )}
              {editable ? (
                rowEditable ? (
                  <TouchableOpacity
                    style={styles.actionCell}
                    onPress={() => removeRow(i)}>
                    <Text style={styles.removeText}>✕</Text>
                  </TouchableOpacity>
                ) : (
                  <View style={styles.actionCell} />
                )
              ) : null}
            </View>
            );
          })}
        </View>
      </ScrollView>
      {editable ? (
        <TouchableOpacity style={styles.addButton} onPress={addSize}>
          <Text style={styles.addButtonText}>+ Add size</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },
  headerRow: {backgroundColor: '#f3f4f6'},
  cell: {
    width: CELL_WIDTH,
    paddingVertical: 10,
    paddingHorizontal: 8,
    fontSize: 13,
    color: '#111',
    textAlign: 'center',
  },
  input: {paddingVertical: 6},
  actionCell: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {color: '#dc2626', fontSize: 16},
  headerText: {fontWeight: '700'},
  sizeText: {fontWeight: '600'},
  addButton: {
    marginTop: 10,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
  },
  addButtonText: {fontWeight: '600', color: '#111'},
});

export default SizeChartTable;
