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
        <div className="p-3" style={{border: '1px solid black'}}>
            <div expandIcon={<ExpandMoreIcon />}>
                <p>{instanceInfo.name}</p>
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
                <p>Total price: {totalPrice} €</p>
                { discountedPrice !== null ? <p>Discounted price: {discountedPrice} €</p> : <></> }
            </div>
        </div>
    )
}