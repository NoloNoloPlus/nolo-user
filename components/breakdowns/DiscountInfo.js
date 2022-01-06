import { Typography } from "@material-ui/core";

export default function DiscountInfo({ name, description, type, value }) {
    let formattedDiscount = null;

    if (type === 'percentage') {
        formattedDiscount = `-${value * 100}%`;
    } else if (type === 'amount') {
        formattedDiscount = `-${value}€`;
    } else if (type === 'containsWeekend') {
        formattedDiscount = `Sunday Free, Saturday ${value * 100}% off`
    } else {
        throw new Error('Unknown discount type');
    }
    
    return (
        <div>
            <p>{name} {formattedDiscount}</p>
            <p>{description}</p>
        </div>
    )
}