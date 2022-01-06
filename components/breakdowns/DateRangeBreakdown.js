import { Accordion, AccordionDetails, AccordionSummary, List, ListItem, Typography } from "@material-ui/core"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import DiscountInfo from "./DiscountInfo"

import utils from "../../common/utils"

import { dateRangePrice } from "../../common/price"

export default function DateRangeBreakdown( { from, to, price, discounts }) {
    const totalPrice = dateRangePrice({ from, to, price, discounts }, false)

    let discountedPrice = null;
    if (discounts && discounts.length > 0) {
        discountedPrice = dateRangePrice({ from, to, price, discounts }, true)
    }

    return (
        <div className="p-3" style={{border: '1px solid black'}}>
            <div expandIcon={<ExpandMoreIcon />}>
                <p>
                    {utils.formatFrontendDate(from)} - {utils.formatFrontendDate(to)}: { discountedPrice === null ? totalPrice : discountedPrice} €
                </p>
            </div>
            <div>
                <p>Price per day: {price} €</p>
                {
                    discountedPrice !== null ? (
                        <div>
                            <p>Discounts:</p>
                            <div>
                                {discounts.map((discount, i) => (
                                    <div key={i}>
                                        <DiscountInfo {...discount} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : <></>
                }
                <p>Total price: {totalPrice} €</p>
                { discountedPrice !== null ? <p>Discounted price: {discountedPrice} €</p> : <></> }
            </div>
        </div>
    )
}