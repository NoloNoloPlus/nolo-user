import React from 'react';

import Invoice from '../invoice/Invoice';

import { pdf } from '@react-pdf/renderer';
import { format } from 'date-format-parse';
import { saveAs } from 'file-saver';

import { useRecoilState } from 'recoil';
import { billingInfoState } from '../../common/auth';

export default function InvoiceButton ({ id, products, discounts, productIdToProductInfo, penalty }) {
    const [billingInfo, setBillingInfo] = useRecoilState(billingInfoState);

    const billingLines = () => {
        if (!billingInfo) {
            return [];
        }
        const lines = [];

        if (billingInfo.firstName || billingInfo.lastName) {
            lines.push((billingInfo.firstName || '') + ' ' + (billingInfo.lastName || ''));
        }

        if (billingInfo.company) {
            lines.push(billingInfo.company);
        }

        if (billingInfo.address) {
            if (billingInfo.address.street.line1 || billingInfo.address.street.line2) {
                let line = '';

                if (billingInfo.address.street.line1) {
                    line += billingInfo.address.street.line1;
                }
                if (billingInfo.address.street.line2) {
                    line += ' ' + billingInfo.address.street.line2;
                }

                lines.push(line);
            }

            if (billingInfo.address.city || billingInfo.address.state || billingInfo.address.zip) {
                let line = '';

                if (billingInfo.address.city) {
                    line += billingInfo.address.city;
                }

                if (billingInfo.address.state) {
                    line += ', ' + billingInfo.address.state;
                }

                if (billingInfo.address.zip) {
                    line += ' ' + billingInfo.address.zip;
                }

                if (billingInfo.country) {
                    line += ' ' + billingInfo.country;
                }

                lines.push(line);
            }
        }

        return lines;
    }

    const formatInvoiceDate = (date) => format(date, 'MMM DD, YYYY')

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
            penalty={penalty}
            billingLines={billingLines()}
            />).toBlob().then(blob => saveAs(blob, `Invoice ${id}`));
    }

    return (
        <button className="button is-black is-small" onClick={generateInvoice}>Invoice</button>
    )
}