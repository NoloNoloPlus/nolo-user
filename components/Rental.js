import React from 'react';
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import { useRouter } from 'next/router'
import ProductRental from './ProductRental';
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@material-ui/core"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { utils } from '../common';
import config from "../config"

import { format } from 'date-format-parse'

import ReactPDF from '@react-pdf/renderer';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';

import Invoice from './invoice/Invoice';


const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

export default function Rental({ id, products }) {
    const router = useRouter();
    const classes = useStyles();

    const [productIdToProductInfo, setProductIdToProductInfo] = useState({})

    useEffect(() => {
        for (const productId of Object.keys(products)) {
            fetch(config.api_endpoint + '/products/' + productId, {
                headers: {
                    pragma: 'no-cache',
                    'cache-control' : 'no-cache'
                }
            })
            .then((response) => response.json())
            .then((parsedResponse) => {
                console.log('Received update for id ' + productId)
                const newProductIdToProductInfo = {...productIdToProductInfo, [productId] : parsedResponse}
                setProductIdToProductInfo(newProductIdToProductInfo)
            })
        }
    }, [products])

    if (!products) {
        return <></>
    }

    
    const formatInvoiceDate = (date) => format(date, 'MMM d, YYYY')

    for (const product of Object.values(products)) {
        if (!product.instances) {
            // Badly formatted, return
            return null
        }
    }

    console.log('Products:', products)

    const invoiceFriendlyProducts = () => {
        const finalProducts = []

        if (products) {
            console.log('PRODUCTS:', products)
            for (const [productId, product] of Object.entries(products)) {
                const finalProduct = {...product, id: productId}
                for (const instance of Object.values(product.instances)) {
                    for (const dateRange of instance.dateRanges) {
                        dateRange.price = parseFloat(dateRange.price.$numberDecimal)
                    }
                }

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
        <Accordion>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            >
                <Typography>Rental n. {id}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {products ? Object.entries(products).map(([id, product]) => (
                    <ProductRental id={id} productInfo={productIdToProductInfo[id]} {...product} />
                    )
                ) : <></>}
                <Button onClick={generateInvoice}>Generate invoice</Button>
            </AccordionDetails>
        </Accordion>
    );
}