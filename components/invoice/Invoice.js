import React from 'react';
import { Page, Document, Image, StyleSheet, Text, View } from '@react-pdf/renderer';
import InvoiceTitle from './InvoiceTitle'
import BillTo from './BillTo'
import InvoiceNo from './InvoiceNo'
// import InvoiceItemsTable from './InvoiceItemsTable'
// import InvoiceThankYouMsg from './InvoiceThankYouMsg'

import { applyContainsWeekendDiscount, rentalPrice, productPrice, instancePrice, dateRangePrice } from '../../common/price';
import { utils } from '../../common';

const formatPrice = utils.formatPrice;

const borderColor = '#90e5fc'

const twelfth = (n) => `${n * 100 / 12}%`

const styles = StyleSheet.create({
    page: {
        fontFamily: 'Helvetica',
        fontSize: 11,
        paddingTop: 30,
        paddingLeft:60,
        paddingRight:60,
        lineHeight: 1.5,
        flexDirection: 'column',
    }, 
    logo: {
        width: 74,
        height: 66,
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    row: {
        flexDirection: 'row',
        borderBottomColor: '#bff0fd',
        borderBottomWidth: 1,
        alignItems: 'center',
        height: 24,
        fontStyle: 'bold',
    },
    description: {
        width: '60%',
        textAlign: 'left',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    qty: {
        width: '10%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    rate: {
        width: '15%',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        textAlign: 'right',
        paddingRight: 8,
    },
    amount: {
        width: '15%',
        textAlign: 'right',
        paddingRight: 8,
    },
    l0 : {
        width: twelfth(10),
        textAlign: 'left',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    l1: {
        width: twelfth(9),
        textAlign: 'left',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    l2: {
        width: twelfth(8),
        textAlign: 'left',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    l3: {
        width: twelfth(7),
        textAlign: 'left',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    price: {
        width: twelfth(2),
        textAlign: 'right',
        paddingRight: 8,
    },
    l1indent : {
        width: twelfth(1)
    },
    l2indent : {
        width: twelfth(2)
    },
    l3indent : {
        width: twelfth(3)
    },

  });

const indentationStyle = (level) => {
    return {
        width: twelfth(level)
    }
}

const indentedContentStyle = (level) => {
    return {
        width:twelfth(12 - level),
        textAlign: 'left',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingLeft: 8,
    }
}
  
const Invoice = ({ invoiceNo, emissionDate, billingLines, products, discounts, penalty }) => {
    discounts = discounts || [];
    const chunkSize = 23;
    const formattedRows = []

    let currentRowIndex = 0;

    const createRow = (indent, content, price) => {
        formattedRows.push(
            <View style={styles.row} key={'row' + currentRowIndex}>
                <Text style={indentationStyle(indent)} />
                <Text style={indentedContentStyle(indent)}>{content}</Text>
                <Text style={styles.price}>{price}</Text>
            </View>
        )

        currentRowIndex++;
    }

    const createStandardDiscountRow = (indent, discount) => {
        let formattedDiscount = ''
        if (discount.type === 'percentage') {
            formattedDiscount = `-${discount.value * 100}%`
        }
        else if (discount.type === 'fixed') {
            formattedDiscount = `-${formatPrice(discount.value)}`
        }
        else if (discount.type === 'containsWeekend') {
            throw new Error('containsWeekend is not a standard discount type');
        }
        else {
            throw new Error(`Unknown discount type: ${discount.type}`)
        }

        createRow(indent, discount.name, formattedDiscount)
    }

    
    console.log(products.length)
    for (const [productId, product] of Object.entries(products)) {

        createRow(0, product.name, null);

        console.log('Found dateRanges: ', product.dateRanges)
        for (const [instanceId, instance] of Object.entries(product.instances)) {
            createRow(1, instance.name, null);

            for (const dateRange of instance.dateRanges) {
                let price = dateRange.price
                
                const formattedDateRange = dateRange.from == dateRange.to ?
                    dateRange.from.toString() : `${dateRange.from} - ${dateRange.to}`

                createRow(2, formattedDateRange, '');

                createRow(3, 'Price per day', formatPrice(parseFloat(dateRange.price)));
                createRow(3, 'Date range total', formatPrice(dateRangePrice(dateRange, false)));

                if (dateRange.discounts.length > 0) {
                    createRow(3, 'Discounts', '');

                    for (const discount of dateRange.discounts) {
                        let formattedDiscount = ''
                        if (discount.type === 'percentage') {
                            formattedDiscount = `-${discount.value * 100}%`
                            price *= (1 - discount.value)
                        } else if (discount.type === 'fixed') {
                            formattedDiscount = `-${formatPrice(discount.value)}`
                            price -= discount.value
                        } else if (discount.type === 'containsWeekend') {
                            const weekendDiscount = applyContainsWeekendDiscount(0, dateRange, discount);
                            formattedDiscount = `-${formatPrice(weekendDiscount)}`;
                        } else {
                            throw new Error(`Unknown discount type: ${discount.type}`)
                        }
                        createRow(4, discount.name, formattedDiscount);
                    }

                    createRow(3, 'Date range total (discounted)', formatPrice(dateRangePrice(dateRange, true)));
                }

                createRow(2, 'Instance total', formatPrice(instancePrice(instance, false)));

                if (instance.discounts.length > 0) {
                    for (const discount of instance.discounts) {
                        createStandardDiscountRow(2, discount);
                    }
                    createRow(2, 'Instance total (discounted)', formatPrice(instancePrice(instance, true)));
                }
            }
        }

        createRow(1, 'Product total', formatPrice(productPrice(product, false)));

        if (product.discounts.length > 0) {
            createRow(1, 'Discounts', '');

            for (const discount of product.discounts) {
                createStandardDiscountRow(2, discount);
            }

            createRow(1, 'Product total (discounted)', formatPrice(productPrice(product, true)));
        }
    }

    if (penalty) {
        createRow(0, 'Penalty: ' + penalty.message, formatPrice(penalty.value));
    }

    createRow(0, 'Rental total', formatPrice(rentalPrice({ products, discounts }, false)));
    
    if (discounts.length > 0) {
        createRow(0, 'Discounts', '');
        for (const discount of discounts) {
            createStandardDiscountRow(1, discount);
        }
        createRow(0, 'Rental total (discounted)', formatPrice(rentalPrice({products, discounts}, true)));
    }

    const chunks = []

    for (let i = 0; i < formattedRows.length; i += chunkSize) {
        let chunk = formattedRows.slice(i, i + chunkSize)
        if (chunk.length < chunkSize) {
            for (let j = 0; j < chunkSize - chunk.length; j++) {
                chunk.push(
                    <View style={styles.row} key={'padding' + i + '-' + j}>
                        <Text style={indentationStyle(0)}> </Text>
                        <Text style={indentedContentStyle(0)}> </Text>
                        <Text style={styles.price}> </Text>
                    </View>
                )
            }
        }
        chunks.push(chunk)
    }

    return (
        <Document>
            { chunks.map(chunk => (
                <Page size="A4" style={styles.page}>
                    <InvoiceTitle title='NoloNoloPlus'/>
                    <InvoiceNo invoiceNo={invoiceNo} emissionDate={emissionDate}/>
                    <BillTo lines={billingLines}/>
                    {chunk}
                </Page>
            ))}
        </Document>
        )
    }
  
  export default Invoice