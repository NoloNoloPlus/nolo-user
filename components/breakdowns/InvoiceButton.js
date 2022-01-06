import React from 'react';

import { Button } from "@material-ui/core"
import Invoice from '../invoice/Invoice';

import { pdf } from '@react-pdf/renderer';
import { utils } from '../../common';
import { format } from 'date-format-parse';

export default function InvoiceButton ({ id, products, discounts, productIdToProductInfo }) {
    const formatInvoiceDate = (date) => format(date, 'MMM d, YYYY')

    for (const product of Object.values(products)) {
        if (!product.instances) {
            // Badly formatted, return
            return null
        }
    }

    const invoiceFriendlyProducts = () => {
        const finalProducts = []

        if (products) {
            console.log('PRODUCTS:', products)
            for (const [productId, product] of Object.entries(products)) {
                const finalProduct = {...product, id: productId}
                for (const instance of Object.values(product.instances)) {
                    for (const dateRange of instance.dateRanges) {
                        // Outdated
                        // dateRange.price = parseFloat(dateRange.price.$numberDecimal)
                    }
                }

                // Keep overallDateRanges?
                finalProduct.dateRanges = utils.overallDateRanges(finalProduct.instances, formatInvoiceDate)
                finalProduct.name = productIdToProductInfo[productId]?.name
                finalProducts.push(finalProduct)
            }
        }
        
        console.log('Final products:', finalProducts)
        
        return finalProducts
    }

    const generateInvoice = () => {
        pdf(<Invoice 
            invoiceNo={id}
            emissionDate={formatInvoiceDate(new Date())}
            products={invoiceFriendlyProducts()}
            />).toBlob().then(blob => saveAs(blob, `Invoice ${id}`));
    }

    return (
        <Button onClick={generateInvoice}>Generate invoice</Button>
    )
}