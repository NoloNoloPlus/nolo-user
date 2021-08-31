import { Box, Button, Typography } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import Header from "../../components/Header"
import { useRouter } from 'next/router'
import config from "../../config"

export default function ProductInfo() {
    const router = useRouter();
    const { id } = router.query;
    const [name, setName] = useState('Betsy')
    const [description, setDescription] = useState('Trattore sano e genuino')
    const [coverImage, setcoverImage] = useState('https://www.evo-tune.it/wp-content/uploads/2019/06/trattore.png')
    const [available, setAvailable] = useState(true)

    useEffect(() => {
        fetch(config.api_endpoint + '/products/' + id, {
            headers: {
                pragma: 'no-cache',
                'cache-control' : 'no-cache'
            }
        })
        .then((response) => response.json())
        .then((parsedResponse) => {
            setName(parsedResponse.name);
            setDescription(parsedResponse.description);
            setcoverImage(parsedResponse.coverImage)
        })
    })

    
    return (
        <Box>
            <Header showLogin={true} />
            <Box>
                <Typography variant='header1'>{name}</Typography>
                <img src={coverImage} alt={name}/>
                <Typography variant='paragraph'>{description}</Typography>
                {available ? <Button>Rent</Button> : <></>}
            </Box>
        </Box>
    )
}