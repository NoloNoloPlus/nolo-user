import { List, ListItem } from "@material-ui/core"

import ProductBreakdown from "./ProductBreakdown"
import DiscountInfo from "./DiscountInfo"

export default function RentalBreakdown({ products, discounts }) {
    return (
        <List>
            {products.map((product, i) => (
                <ListItem key={i}>
                    <ProductBreakdown {...product} />
                </ListItem>
            ))}
            { discounts && discounts.length > 0 ? (
                discounts.map((discount, i) => (
                    <ListItem key={i}>
                        <DiscountInfo {...discount} />
                    </ListItem>
                ))
            ) : <></> }
        </List>
    )
}