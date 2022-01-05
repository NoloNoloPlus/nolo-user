import { Accordion, AccordionDetails, AccordionSummary, List, ListItem, Typography } from "@material-ui/core"

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import DateRangeBreakdown from "./DateRangeBreakdown"
import DiscountInfo from "./DiscountInfo"

import { formatFrontendDate, overallDateRanges } from "../../common/utils"

export default function ProductBreakdown( { name, instances, discounts }) {
    const overallRanges = overallDateRanges(instances, formatFrontendDate)

    return (
        <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <List>
                    {overallRanges.map((range, i) => (
                        <ListItem>
                            <DateRangeBreakdown key={i} {...range} />
                        </ListItem>
                    ))}
                    { (discounts && discounts.length > 0) ? (
                        discounts.map((discount, i) => (
                            <ListItem key={i}>
                                <DiscountInfo {...discount} />
                            </ListItem>
                        ))
                    ) : <></> }
                </List>
            </AccordionDetails>
        </Accordion>
    )
}