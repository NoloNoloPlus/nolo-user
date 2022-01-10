import React, { useState, useEffect } from 'react';

import { Accordion, AccordionDetails, AccordionSummary, List, ListItem, Typography } from "@material-ui/core"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import ProductBreakdown from "./ProductBreakdown"
import DiscountInfo from "./DiscountInfo"

import { rentalPrice } from "../../common/price"
import config from "../../config"
import InvoiceButton from './InvoiceButton';
import EditRentalButton from './EditRentalButton';

import { jwtAccessState, jwtAuthorizationHeader, jwtRefreshState, userIdState } from '../../common/auth'
import { useRecoilState } from "recoil"

export default function RentalBreakdown({ id, products, discounts, status, approvedBy, penalty, onChange }) {
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

    const queryProductInfo = () => {
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
    }

    useEffect(queryProductInfo, [products]);

    const onRentalChanged = () => {
        queryProductInfo();

        if (onChange) {
            onChange();
        }
    }

    // Cancel Rental
    const [jwtAccess, setJwtAccess] = useRecoilState(jwtAccessState);
    const [jwtRefresh, setJwtRefresh] = useRecoilState(jwtRefreshState);

    const cancelRental = async () => {
        await fetch(config.api_endpoint + '/rentals/' + id, {
            method: 'DELETE',
            headers: {
                'content-type': 'application/json',
                authorization : jwtAuthorizationHeader(jwtAccess, jwtRefresh, setJwtAccess, setJwtRefresh)
            }
        })

        onRentalChanged();
    }

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

    const rentalProductName = () => {
        const productId = productList[0]?.id;

        if (!productId) {
            return 'Unknown product';
        }

        if (productIdToProductInfo[productId]) {
            return productIdToProductInfo[productId].name;
        }

        return 'Unknown product';
    }

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <div>
                    <h1 className="title is-5 m-0"> {rentalProductName()} (rental n. {id})</h1>
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

                    { penalty ? (
                        <div className="notification is-danger is-light">
                            <p>{penalty.message}</p>
                            <p className="title is-4">Penalty: {penalty.value}€</p>
                        </div>

                    ) : <></> }

                    <InvoiceButton id={id} products={products} discounts={discounts} productIdToProductInfo={productIdToProductInfo} penalty={penalty} />
                    <div className="mt-3">
                        {
                            status == 'ready' ? (
                                <div>
                                    <EditRentalButton rentalId={id} productId={productId} productInfo={productIdToProductInfo[productId]} onChange={onRentalChanged} />
                                    <button className="button is-danger is-fullwidth mt-2" onClick={cancelRental}>Cancel Rental</button>
                                </div>
                            ) : (
                                <p>Cannot edit or cancel a{'aeiou'.includes(status[0]) ? 'n' : ''} {status} rental.</p>
                            )
                        }
                        
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
                
                <div>
                { discountedPrice !== null ? <Typography>Discounted price: {discountedPrice} €</Typography> : <></> }
                </div>
            </AccordionDetails>
        </Accordion>
    )
}