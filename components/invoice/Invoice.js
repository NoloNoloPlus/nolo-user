import React from 'react';
import { Page, Document, Image, StyleSheet, Text, View } from '@react-pdf/renderer';
import InvoiceTitle from './InvoiceTitle'
import BillTo from './BillTo'
import InvoiceNo from './InvoiceNo'
import InvoiceItemsTable from './InvoiceItemsTable'
import InvoiceThankYouMsg from './InvoiceThankYouMsg'


const borderColor = '#90e5fc'

const sixth = (n) => `${n / 6 * 100}%`

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
        width: sixth(5),
        textAlign: 'left',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    l1: {
        width: sixth(4),
        textAlign: 'left',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    l2: {
        width: sixth(3),
        textAlign: 'left',
        borderRightColor: borderColor,
        borderRightWidth: 1,
        paddingLeft: 8,
    },
    price: {
        width: sixth(1),
        textAlign: 'right',
        paddingRight: 8,
    },
    l1indent : {
        width: sixth(1)
    },
    l2indent : {
        width: sixth(2)
    },
    l3indent : {
        width: sixth(3)
    },

  });
  
const Invoice = ({ invoiceNo, emissionDate, company, address, phone, email, products }) => {
    const chunkSize = 11

    const formattedRows = []

    let overallTotal = 0

    if (products) {
        console.log(products.length)
        for (let i = 0; i < products.length; i++) {
            const product = products[i]
            let totalPrice = 0

            formattedRows.push(
                <View style={styles.row} key={`TR${product.id}`}>
                    <Text style={styles.l0}>{product.name}</Text>
                    {/*<Text style={styles.qty}>{product.qty}</Text>
                    <Text style={styles.rate}>{product.rate}</Text>
            <Text style={styles.amount}>{product.amount}</Text>*/}
                </View>
            )

            console.log('Found dateRanges: ', product.dateRanges)
            for (const dateRange of product.dateRanges) {
                let price = dateRange.price
                
                const formattedDateRange = dateRange.from == dateRange.to ?
                    dateRange.from.toString() : `${dateRange.from} - ${dateRange.to}`

                formattedRows.push(
                    <View style={styles.row} key={`TR${product.id}${dateRange.from}`}>
                        <Text style={styles.l1indent}>{} </Text>
                        <Text style={styles.l1}>{formattedDateRange}</Text>
                        <Text style={styles.price}>{dateRange.price}</Text>
                    </View>
                )

                if (dateRange.discounts.length > 0) {
                    for (const discount of dateRange.discounts) {
                        let formattedDiscount = ''
                        if (discount.type === 'percentage') {
                            formattedDiscount = `-${discount.value * 100}%`
                            price *= (1 - discount.value)
                        }
                        else {
                            formattedDiscount = `-${discount.value}`
                            price -= discount.value
                        }
                        formattedRows.push(
                            <View style={styles.row} key={`TR${product.id}${dateRange.from}${discount.name}`}>
                                <Text style={styles.l2indent}></Text>
                                <Text style={styles.l2}>{discount.name}</Text>
                                <Text style={styles.price}>{formattedDiscount}</Text>
                            </View>
                        )
                    }

                    formattedRows.push(
                        <View style={styles.row} key={`TR${product.id}${dateRange.from}After discounts`}>
                            <Text style={styles.l2indent}></Text>
                            <Text style={styles.l2}>Total</Text>
                            <Text style={styles.price}>{price}</Text>
                        </View>
                    )
                }

                totalPrice += price
            }

            if (product.discounts.length > 0) {
                for (const discount of product.discounts) {
                    let formattedDiscount = ''
                    if (discount.type === 'percentage') {
                        formattedDiscount = `-${discount.value * 100}%`
                        totalPrice *= (1 - discount.value)
                    }
                    else {
                        formattedDiscount = `-${discount.value}`
                        totalPrice -= discount.value
                    }

                    formattedRows.push(
                        <View style={styles.row} key={`TR${product.id}D${discount.name}`}>
                            <Text style={styles.l1indent}></Text>
                            <Text style={styles.l1}>{discount.name}</Text>
                            <Text style={styles.price}>{formattedDiscount}</Text>
                        </View>
                    )
                }

                formattedRows.push(
                    <View style={styles.row} key={`TR${product.id}Total`}>
                        <Text style={styles.l1indent}></Text>
                        <Text style={styles.l1}>Total</Text>
                        <Text style={styles.rate}>{totalPrice}</Text>
                    </View>
                )
            }

            overallTotal += totalPrice
        }

        formattedRows.push(
            <View style={styles.row} key={`TR-OverallTotal`}>
                <Text style={styles.l0}>Overall Total</Text>
                <Text style={styles.rate}>{overallTotal}</Text>
            </View>
        )
    }

    const chunks = []

    for (let i = 0; i < formattedRows.length; i += chunkSize) {
        let chunk = formattedRows.slice(i, i + chunkSize)
        chunks.push(chunk)
    }

    return (
        <Document>
            { chunks.map(chunk => (
                <Page size="A4" style={styles.page}>
                    {/*<Image style={styles.logo} src={logo} />*/}
                    <InvoiceTitle title='NoloNoloPlus'/>
                    <InvoiceNo invoiceNo={invoiceNo} emissionDate={emissionDate}/>
                    <BillTo company={company} address={address} phone={phone} email={email}/>
                    {chunk}
                </Page>
            ))}
        </Document>
        )
    }
  
  export default Invoice