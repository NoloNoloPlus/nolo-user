import React from 'react';

import { Button } from "@material-ui/core"
import Invoice from '../invoice/Invoice';

import { pdf } from '@react-pdf/renderer';
import { utils } from '../../common';
import { format } from 'date-format-parse';
import { saveAs } from 'file-saver';

export default function InvoiceButton ({ id, products, discounts, productIdToProductInfo }) {
    const formatInvoiceDate = (date) => format(date, 'MMM d, YYYY')

    for (const product of Object.values(products)) {
        if (!product.instances) {
            // Badly formatted, return
            return null
        }
    }

    const invoiceFriendlyProducts = () => {
        const finalProducts = {...products};

        for (const [productId, product] of Object.entries(finalProducts)) {
            if (productIdToProductInfo[productId]) {
                finalProducts[productId].name = productIdToProductInfo[productId].name;
                for (const [instanceId, instance] of Object.entries(product.instances)) {
                    instance.name = productIdToProductInfo[productId].instances[instanceId].name;
                }
            }

        }

        return finalProducts;
    }

    const generateInvoice = () => {
        pdf(<Invoice 
            invoiceNo={id}
            emissionDate={formatInvoiceDate(new Date())}
            products={invoiceFriendlyProducts()}
            discounts={discounts}
            />).toBlob().then(blob => saveAs(blob, `Invoice ${id}`));
    }

    return (
        <button className="button is-black is-small" onClick={generateInvoice}>Invoice</button>
    )
}