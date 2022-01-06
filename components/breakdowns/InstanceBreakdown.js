import { Accordion, AccordionDetails, AccordionSummary, List, ListItem, Typography } from "@material-ui/core"
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
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{instanceInfo.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <List>
                    {dateRanges.map((dateRange, i) => (
                        <ListItem>
                            <DateRangeBreakdown key={i} {...dateRange} />
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