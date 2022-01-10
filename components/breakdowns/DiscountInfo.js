import { Typography } from "@material-ui/core";

import { utils } from "../../common";

export default function DiscountInfo({ name, description, type, value }) {
    let formattedDiscount = null;

    if (type === 'percentage') {
        formattedDiscount = `-${value * 100}%`;
    } else if (type === 'fixed') {
        formattedDiscount = `-${utils.formatPrice(value)}`;
    } else if (type === 'containsWeekend') {
        formattedDiscount = `Sunday Free, Saturday ${value * 100}% off`
    } else {
        throw new Error('Unknown discount type ' + type);
    }
    
    return (
        <div className="mb-3">
            <p className="has-text-success has-text-weight-bold">{name} {formattedDiscount}</p>
            <p className="is-size-7">{description}</p>
        </div>
    )
}