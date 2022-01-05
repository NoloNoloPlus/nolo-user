import React, {useEffect, useState} from "react"
import Product from "../components/Product"
import Header from "../components/Header"
import { Accordion, AccordionDetails, AccordionSummary, Typography } from "@material-ui/core"
import config from "../config"
import { useRouter } from 'next/router'
import { useRecoilState } from "recoil"
import { jwtAccessState, jwtAuthorizationHeader, jwtRefreshState, userIdState } from '../common/auth'

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Rental from "../components/Rental"

const Rentals = () => {
    const router = useRouter();
    const [rentals, setRentals] = useState([])
    const [userId, setUserId] = useRecoilState(userIdState)
    const [jwtAccess, setJwtAccess] = useRecoilState(jwtAccessState)
    const [jwtRefresh, setJwtRefresh] = useRecoilState(jwtRefreshState)

    useEffect(() => {
        fetch(config.api_endpoint + '/rentals/', {
            headers: {
                pragma: 'no-cache',
                'cache-control' : 'no-cache',
                authorization : jwtAuthorizationHeader(jwtAccess, jwtRefresh, setJwtAccess, setJwtRefresh)
            }
        })
        .then((response) => response.json())
        .then((parsedResponse) => {
            console.log('Rentals:')
            console.log(parsedResponse.results)
            setRentals(parsedResponse.results)
        })
    }, [])

    return (
        <div>
            {rentals.map((rental) => (
                <Rental key={rental.id} {...rental} />
            ))}
        </div>
    )
}

export default Rentals