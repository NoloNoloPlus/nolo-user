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
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                    {utils.formatFrontendDate(from)} - {utils.formatFrontendDate(to)}: { discountedPrice === null ? totalPrice : discountedPrice} €
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>Price per day: {price} €</Typography>
                {
                    discountedPrice !== null ? (
                        <div>
                            <Typography>Discounts:</Typography>
                            <List>
                                {discounts.map((discount, i) => (
                                    <ListItem key={i}>
                                        <DiscountInfo {...discount} />
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    ) : <></>
                }
                <Typography>Total price: {totalPrice} €</Typography>
                { discountedPrice !== null ? <Typography>Discounted price: {discountedPrice} €</Typography> : <></> }
            </AccordionDetails>
        </Accordion>
    )
}