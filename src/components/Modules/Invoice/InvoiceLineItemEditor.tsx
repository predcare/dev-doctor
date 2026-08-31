import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { GstMode, InvoiceLineItem } from '../../../typescripts/types/invoice.types';

interface InvoiceLineItemEditorProps {
  items: InvoiceLineItem[];
  gstMode?: GstMode;
  onUpdateItem: (id: string, field: keyof InvoiceLineItem, value: any) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: () => void;
}

const fmt = (n: number) => `₹ ${n.toFixed(2)}`;

export const InvoiceLineItemEditor: React.FC<InvoiceLineItemEditorProps> = ({
  items,
  gstMode = 'intra',
  onUpdateItem,
  onDeleteItem,
  onAddItem,
}) => {
  return (
    <View style={styles.container}>
      {/* Heading Row */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>🧾 Invoice Items</Text>
        <TouchableOpacity onPress={onAddItem} style={styles.addBtn} activeOpacity={0.7}>
          <Text style={styles.addBtnTxt}>+ Add Item</Text>
        </TouchableOpacity>
      </View>

      {/* Card Body */}
      <View style={styles.sectionCard}>
        {items.map((item, idx) => (
          <View key={item.id} style={[styles.itemBlock, idx === 0 && { borderTopWidth: 0, paddingTop: 0 }]}>
            {/* Description */}
            <Text style={styles.fieldLbl}>DESCRIPTION</Text>
            <TextInput
              style={styles.descInput}
              placeholder="Consultation / Medicine / Test"
              placeholderTextColor="#D1D5DB"
              value={item.name}
              onChangeText={v => onUpdateItem(item.id, 'name', v)}
            />

            {/* QTY | RATE | TOTAL */}
            <View style={styles.threeCol}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.fieldLbl}>QTY</Text>
                <TextInput
                  style={styles.smallInput}
                  keyboardType="numeric"
                  value={item.qty}
                  onChangeText={v => onUpdateItem(item.id, 'qty', v)}
                  placeholderTextColor="#D1D5DB"
                  placeholder="1"
                />
              </View>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.fieldLbl}>RATE</Text>
                <TextInput
                  style={styles.smallInput}
                  keyboardType="numeric"
                  value={item.price}
                  onChangeText={v => onUpdateItem(item.id, 'price', v)}
                  placeholderTextColor="#D1D5DB"
                  placeholder="0"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.fieldLbl}>TOTAL</Text>
                <View style={[styles.smallInput, { justifyContent: 'center', backgroundColor: '#FAFAFA' }]}>
                  <Text style={{ fontSize: 13, color: '#374151', fontWeight: '600' }}>
                    {fmt(item.total)}
                  </Text>
                </View>
              </View>
            </View>

            {/* DISCOUNT | GST | DELETE */}
            <View style={styles.threeCol}>
              <View style={{ flex: gstMode === 'none' ? 1.5 : 1.2, marginRight: 8 }}>
                <Text style={styles.fieldLbl}>DISCOUNT</Text>
                <View style={styles.discountRow}>
                  <TextInput
                    style={[
                      styles.smallInput,
                      { flex: 1, borderTopRightRadius: 0, borderBottomRightRadius: 0, borderRightWidth: 0 },
                    ]}
                    keyboardType="numeric"
                    value={item.discount}
                    onChangeText={v => onUpdateItem(item.id, 'discount', v)}
                    placeholderTextColor="#D1D5DB"
                    placeholder="0"
                  />
                  <TouchableOpacity
                    style={styles.discTypeBtn}
                    onPress={() =>
                      onUpdateItem(
                        item.id,
                        'discount_type',
                        item.discount_type === '%' ? 'flat' : '%'
                      )
                    }
                    activeOpacity={0.7}
                  >
                    <Text style={styles.discTypeTxt}>
                      {item.discount_type === 'flat' ? '₹' : '%'} ▾
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {gstMode !== 'none' && (
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={styles.fieldLbl}>GST</Text>
                  <View style={[styles.smallInput, { justifyContent: 'center', backgroundColor: '#F0FDF9' }]}>
                    <Text style={{ fontSize: 12, color: '#00897B', fontWeight: '700' }}>
                      {gstMode === 'intra' ? '18% (C+S)' : '18% IGST'}
                    </Text>
                  </View>
                </View>
              )}

              {items.length > 1 ? (
                <TouchableOpacity style={styles.deleteIconBtn} onPress={() => onDeleteItem(item.id)}>
                  <Text style={{ fontSize: 16, color: '#EF4444' }}>🗑️</Text>
                </TouchableOpacity>
              ) : (
                <View style={{ width: 36 }} />
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  addBtn: {
    backgroundColor: '#F0FDF9',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addBtnTxt: {
    fontSize: 12,
    fontWeight: '700',
    color: '#00897B',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  itemBlock: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 14,
    marginTop: 4,
  },
  fieldLbl: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  descInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#FAFAFA',
    marginBottom: 12,
  },
  threeCol: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  smallInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 13,
    color: '#111827',
    backgroundColor: '#FAFAFA',
  },
  discountRow: {
    flexDirection: 'row',
  },
  discTypeBtn: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  discTypeTxt: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  deleteIconBtn: {
    width: 36,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
});

export default InvoiceLineItemEditor;
