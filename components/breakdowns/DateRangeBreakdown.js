import { Accordion, AccordionDetails, AccordionSummary, List, ListItem, Typography } from "@material-ui/core"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import DiscountInfo from "./DiscountInfo"

import { applyDiscounts, formatFrontendDate } from "../../common/utils"


export default function DateRangeBreakdown( { from, to, price, discounts }) {
    if (discounts && discounts.length > 0) {
        const discountedPrice = applyDiscounts(price, discounts)
        return (
            <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>
                        {formatFrontendDate(from)} - {formatFrontendDate(to)}: {discountedPrice} €
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>Original price: {price} €</Typography>
                    <List>
                        {discounts.map((discount, i) => (
                            <ListItem key={i}>
                                <DiscountInfo {...discount} />
                            </ListItem>
                        ))}
                    </List>
                </AccordionDetails>
            </Accordion>
        )
    }

    return (
        <Typography>
            {formatFrontendDate(from)} - {formatFrontendDate(to)}: {price} €
        </Typography>
    )
}