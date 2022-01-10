import { Accordion, AccordionDetails, AccordionSummary, List, ListItem, Typography } from "@material-ui/core"

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import InstanceBreakdown from "./InstanceBreakdown"
import DiscountInfo from "./DiscountInfo"

import { productPrice } from "../../common/price";

import utils from "../../common/utils";

export default function ProductBreakdown( { instances, discounts, productInfo }) {

    productInfo = productInfo || {};

    instances = Object.entries(instances).map(([instanceId, instance]) => ({ ...instance, id: instanceId }))

    const totalPrice = productPrice({ instances, discounts }, false)

    let discountedPrice = null;
    if (discounts && discounts.length > 0) {
        discountedPrice = productPrice({ instances, discounts }, true)
    }

    return (
        <div className="p-3" style={{border: '0px solid black'}}>
            <div>
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
                        <h1 className="title is-4">Discounts:</h1>
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
                { discountedPrice !== null ? <h1 className="title is-3">Discounted price: {utils.formatPrice(discountedPrice)}</h1> : <></> }
            </div>
        </div>
    )
}