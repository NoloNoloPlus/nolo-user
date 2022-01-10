import React from 'react';
import {Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    headerContainer: {
        marginTop: 36
    },
    billTo: {
        marginTop: 20,
        paddingBottom: 3,
        fontFamily: 'Helvetica-Oblique'
    },
  });


const BillTo = ({ lines }) => {
    if (lines && lines.length > 0) {
        return (
            <View style={styles.headerContainer}>
                <Text style={styles.billTo}>Bill To:</Text>
                {
                    lines.map((line, index) => (
                        <Text key={index}>{' ' + line}</Text>
                    ))
                }
                <Text></Text>
            </View>
        )
    } else {
        return <></>
    }
};

export default BillTo