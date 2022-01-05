import { Typography } from "@material-ui/core";

export default function DiscountInfo({ name, description, type, value }) {
    const formattedDiscount = type == 'percentage' ? `${value * 100}%` : `${value}€`;
    
    return (
        <div>
            <Typography variant="h5">{name} -{formattedDiscount}</Typography>
            <Typography variant="body1">{description}</Typography>
        </div>
    )
}