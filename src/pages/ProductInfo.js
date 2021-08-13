import { Box, Button, Typography } from "@material-ui/core"
import React, { useState } from "react"
import Header from "../components/Header"

export default function ProductInfo() {
    const [name, setName] = useState('Betsy')
    const [blurb, setBlurb] = useState('Trattore sano e genuino')
    const [imageUrl, setImageUrl] = useState('https://www.evo-tune.it/wp-content/uploads/2019/06/trattore.png')
    const [available, setAvailable] = useState(true)

    
    return (
        <Box>
            <Header showLogin={true} />
            <Box>
                <Typography variant='header1'>{name}</Typography>
                <Typography variant='subtitle1'>{blurb}</Typography>
                <img src={imageUrl} alt={name}/>
                {available ? <Button>Rent</Button> : <></>}
            </Box>
        </Box>
    )
}