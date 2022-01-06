import { Accordion, AccordionDetails, AccordionSummary, List, ListItem, Typography } from "@material-ui/core"

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import InstanceBreakdown from "./InstanceBreakdown"
import DiscountInfo from "./DiscountInfo"

import { productPrice } from "../../common/price";

export default function ProductBreakdown( { instances, discounts, productInfo }) {
    productInfo = productInfo || {};

    instances = Object.entries(instances).map(([instanceId, instance]) => ({ ...instance, id: instanceId }))

    const totalPrice = productPrice({ instances, discounts }, false)

    let discountedPrice = null;
    if (discounts && discounts.length > 0) {
        discountedPrice = productPrice({ instances, discounts }, true)
    }

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{productInfo.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <List>
                    {instances.map((instance, i) => (
                        <ListItem>
                            <InstanceBreakdown key={i} {...instance} instanceInfo={productInfo.instances ? productInfo.instances[instance.id] : null} />
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
                <Typography>Total price: {totalPrice} €</Typography>
                { discountedPrice !== null ? <Typography>Discounted price: {discountedPrice} €</Typography> : <></> }
            </AccordionDetails>
        </Accordion>
    )
}