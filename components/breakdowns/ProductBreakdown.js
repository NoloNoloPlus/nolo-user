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
        <div className="p-3" style={{border: '1px solid black'}}>
            <div>
                <p>{productInfo.name}</p>
            </div>
            <div>
                <div>
                    {instances.map((instance, i) => (
                        <div key={i}>
                            <InstanceBreakdown key={i} {...instance} instanceInfo={productInfo.instances ? productInfo.instances[instance.id] : null} />
                        </div>
                    ))}
                </div>
                { discountedPrice !== null ? (
                    <div>
                        <p>Discounts:</p>
                        <div>
                            {
                                discounts.map((discount, i) => (
                                    <div key={i}>
                                        <DiscountInfo {...discount} />
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                ) : <></> }
                <p>Total price: {totalPrice} €</p>
                { discountedPrice !== null ? <p>Discounted price: {discountedPrice} €</p> : <></> }
            </div>
        </div>
    )
}