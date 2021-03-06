import React, {useEffect, useState} from "react"
import config from "../config"
import { useRouter } from 'next/router'
import { useRecoilState } from "recoil"
import { jwtAccessState, jwtAuthorizationHeader, jwtRefreshState, userIdState } from '../common/auth'

import RentalBreakdown from "../components/breakdowns/RentalBreakdown"

const Rentals = () => {
    const router = useRouter();
    const [rentals, setRentals] = useState(null)
    const [userId, setUserId] = useRecoilState(userIdState)
    const [jwtAccess, setJwtAccess] = useRecoilState(jwtAccessState)
    const [jwtRefresh, setJwtRefresh] = useRecoilState(jwtRefreshState)

    useEffect(() => {
        if (!userId) {
            router.push('/signin');
        }
    }, [userId]);

    const queryRentals = () => {
        fetch(config.api_endpoint + '/rentals/?userId=' + userId, {
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
    }

    useEffect(queryRentals, [])

    return (
        <div>
            <h1 className="title is-1 has-text-centered mt-2">Your rentals</h1>
            {
                rentals ? (
                    rentals.length > 0 ? (
                        <div>
                            {
                            rentals.map((rental) => (
                                <RentalBreakdown key={rental.id} {...rental} onChange={queryRentals} />
                            ))
                            }
                        </div>
                    ) : <p>No rentals. The Monkey God is displeased with you.</p>
                ) : <p>Loading...</p>
            }
        </div>
    )
}

export default Rentals