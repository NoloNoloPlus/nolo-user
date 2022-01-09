import { Accordion, AccordionDetails, AccordionSummary, Divider, List, ListItem, Typography } from "@material-ui/core"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import DateRangeBreakdown from "./DateRangeBreakdown"
import DiscountInfo from "./DiscountInfo"

import { instancePrice } from "../../common/price";

export default function InstanceBreakdown( { dateRanges, discounts, instanceInfo }) {
    instanceInfo = instanceInfo || {};

    const totalPrice = instancePrice({ dateRanges, discounts }, false)

    let discountedPrice = null;
    if (discounts && discounts.length > 0) {
        discountedPrice = instancePrice({ dateRanges, discounts }, true)
    }
    return (
        <div className="p-3" style={{border: '0px solid black'}}>
            <div expandIcon={<ExpandMoreIcon />}>
                <h2 className="title is-4">📦 {instanceInfo.name}: {totalPrice}€</h2>
            </div>
            <div>
                <div>
                    {dateRanges.map((dateRange, i) => (
                        <div key={i}>
                            <DateRangeBreakdown key={i} {...dateRange} />
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
                { discountedPrice !== null ? <p>Discounted price: {discountedPrice} €</p> : <></> }
            </div>
        </div>
    )
}