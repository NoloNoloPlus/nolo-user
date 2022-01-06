import React, { useState, useEffect } from 'react';

import { Accordion, AccordionDetails, AccordionSummary, List, ListItem, Typography } from "@material-ui/core"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ProductBreakdown from "./ProductBreakdown"
import DiscountInfo from "./DiscountInfo"

import { rentalPrice } from "../../common/price"
import config from "../../config"
import InvoiceButton from './InvoiceButton';

export default function RentalBreakdown({ id, products, discounts, closed }) {
    // === Product info retrieval ===
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
                setProductIdToProductInfo((currentProductIdToProductInfo) => ({...currentProductIdToProductInfo, [productId] : parsedResponse}))
            })
        }
    }, [products])

    // === Discounts ===
    const productList = Object.entries(products).map(([productId, product]) => ({ ...product, id: productId }))

    const totalPrice = rentalPrice({ products: productList, discounts }, false)

    let discountedPrice = null;
    if (discounts && discounts.length > 0) {
        discountedPrice = rentalPrice({ products: productList, discounts }, true)
    }

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Rental n. {id}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <List>
                    {productList.map((product, i) => (
                        <ListItem>
                            <ProductBreakdown key={i} {...product} productInfo={productIdToProductInfo[product.id]} />
                        </ListItem>
                    ))}
                </List>
                { discountedPrice !== null ? (
                    <div>
                        <Typography>Discounts:</Typography>
                        <List>
                            {
                                discounts.map((discount, i) => (
                                    <ListItem key={i}>
                                        <DiscountInfo {...discount} />
                                    </ListItem>
                                ))
                            }
                        </List>
                    </div>
                ) : <></> }
                <Typography>Status: {closed ? 'Closed' : 'Open'}</Typography>
                <Typography>Total price: {totalPrice} €</Typography>
                { discountedPrice !== null ? <Typography>Discounted price: {discountedPrice} €</Typography> : <></> }
                <InvoiceButton id={id} products={products} discounts={discounts} productIdToProductInfo={productIdToProductInfo} />
            </AccordionDetails>
        </Accordion>
    )
}