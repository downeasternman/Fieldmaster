import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Optionally register a custom font here
// Font.register({ family: 'Roboto', src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxM.woff2' });

const styles = StyleSheet.create({
  page: {
    padding: 32,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 12,
  },
  table: {
    display: 'table',
    width: 'auto',
    marginVertical: 8,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCellHeader: {
    fontWeight: 'bold',
    padding: 4,
    borderBottom: '1pt solid #333',
    minWidth: 60,
  },
  tableCell: {
    padding: 4,
    minWidth: 60,
  },
  totalRow: {
    flexDirection: 'row',
    borderTop: '1pt solid #333',
    marginTop: 8,
    fontWeight: 'bold',
  },
});

const BillPDFDocument = ({ bill, formData, customers, appointments }) => {
  // Helper functions for display
  const getCustomerName = () => {
    const customer = customers.find(c => c.id === formData.customer);
    return customer ? `${customer.first_name} ${customer.last_name}` : '';
  };
  const getAppointmentDesc = () => {
    const appt = appointments.find(a => a.id === formData.appointment);
    return appt ? `#${appt.id} - ${appt.description}` : '';
  };
  const total = formData.line_items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.header}>Bill #{bill?.id || ''}</Text>
        <View style={styles.section}>
          <Text>Status: {formData.status}</Text>
          <Text>Date: {bill?.created_at ? new Date(bill.created_at).toLocaleDateString() : ''}</Text>
        </View>
        <View style={styles.section}>
          <Text>Customer: {getCustomerName()}</Text>
          <Text>Appointment: {getAppointmentDesc()}</Text>
        </View>
        <View style={styles.section}>
          <Text>Description: {formData.description}</Text>
          <Text>Notes: {formData.notes}</Text>
        </View>
        <View style={styles.section}>
          <Text>Due Date: {formData.due_date}</Text>
          <Text>Employee Name: {formData.employee_name}</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCellHeader}>Description</Text>
            <Text style={styles.tableCellHeader}>Part/Employee #</Text>
            <Text style={styles.tableCellHeader}>Qty</Text>
            <Text style={styles.tableCellHeader}>Unit Price</Text>
            <Text style={styles.tableCellHeader}>Total</Text>
          </View>
          {formData.line_items.map((item, idx) => (
            <View style={styles.tableRow} key={item.id || idx}>
              <Text style={styles.tableCell}>{item.description}</Text>
              <Text style={styles.tableCell}>{item.is_labor ? item.employee_number : item.part_number}</Text>
              <Text style={styles.tableCell}>{item.quantity}</Text>
              <Text style={styles.tableCell}>${item.unit_price.toFixed(2)}</Text>
              <Text style={styles.tableCell}>${(item.quantity * item.unit_price).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.totalRow}>
            <Text style={[styles.tableCell, { flex: 1 }]}>Total</Text>
            <Text style={styles.tableCell}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default BillPDFDocument; 