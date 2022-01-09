import React, { useState, useEffect } from 'react';

import { Accordion, AccordionDetails, AccordionSummary, List, ListItem, Typography } from "@material-ui/core"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ProductBreakdown from "./ProductBreakdown"
import DiscountInfo from "./DiscountInfo"

import { rentalPrice } from "../../common/price"
import config from "../../config"
import InvoiceButton from './InvoiceButton';
import EditRentalButton from './EditRentalButton';

export default function RentalBreakdown({ id, products, discounts, status, approvedBy, penalty }) {
    // === Product info retrieval ===
    const [productIdToProductInfo, setProductIdToProductInfo] = useState({})

    const statusName = () => {
        if (status === 'ready') {
            if (approvedBy) {
                return 'Approved'
            } else {
                return 'Waiting for approval'
            }
        } else if (status === 'active') {
            return 'Active'
        } else if (status === 'closed') {
            return 'Closed'
        }

        return 'Unknown';
    }

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

    const productId = Object.keys(products)[0];

    let discountedPrice = null;
    if (discounts && discounts.length > 0) {
        discountedPrice = rentalPrice({ products: productList, discounts }, true)
    }

    const renderTag = (status) => {
        switch (status) {
            case 'Approved':
                return <span className="tag is-success">Approved</span>
            case 'Waiting for approval':
                return <span className="tag is-warning">Waiting for approval</span>
            case 'Active':
                return <span className="tag is-primary">Active</span>
            case 'Closed':
                return <span className="tag is-danger">Closed</span>
            default:
                return <span className="tag is-danger">Unknown</span>
        }
    }

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div>
                    <h1 className="title is-5 m-0">Rental n. {id}</h1>
                    <h1 className="subtitle is-5 m-0 mb-2">Status: {renderTag(statusName())}</h1>
                </div>
                
            </AccordionSummary>
            <AccordionDetails>
                <List>
                    {productList.map((product, i) => (
                        <ListItem key={i}>
                            <ProductBreakdown key={i} {...product} productInfo={productIdToProductInfo[product.id]} />
                        </ListItem>
                    ))}
                    <InvoiceButton id={id} products={products} discounts={discounts} productIdToProductInfo={productIdToProductInfo} penalty={penalty} />
                    <div className="mt-3">
                        <EditRentalButton rentalId={id} productId={productId} productInfo={productIdToProductInfo[productId]} />
                    </div>
                    
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
                { penalty ? (
                    <div>
                        <p>Penalty: {penalty.message}</p>
                        <p>{penalty.value} €</p>
                    </div>
                    
                ) : <></> }
                <div>
                { discountedPrice !== null ? <Typography>Discounted price: {discountedPrice} €</Typography> : <></> }
                </div>
            </AccordionDetails>
        </Accordion>
    )
}