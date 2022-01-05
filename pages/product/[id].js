import { Box, Button, Link, Typography } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import { useRouter } from 'next/router'
import config from "../../config"
import DateFnsUtils from '@date-io/date-fns'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { jwtAccessState, jwtAuthorizationHeader, jwtRefreshState, userIdState } from '../../common/auth'
import { useRecoilState } from "recoil"
import { formatBackendDate } from "../../common/utils"
import { RouteLink } from "../../components"
import ProductBreakdown from "../../components/breakdowns/ProductBreakdown"

export default function ProductInfo() {
    const router = useRouter();
    const { id } = router.query;
    const [name, setName] = useState('Betsy')
    const [description, setDescription] = useState('Trattore sano e genuino')
    const [coverImage, setcoverImage] = useState('https://www.evo-tune.it/wp-content/uploads/2019/06/trattore.png')
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [availability, setAvailability] = useState(null)
    const [quote, setQuote] = useState(null)
    const [userId, setUserId] = useRecoilState(userIdState);
    const [jwtAccess, setJwtAccess] = useRecoilState(jwtAccessState);
    const [jwtRefresh, setJwtRefresh] = useRecoilState(jwtRefreshState);

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
            setcoverImage(parsedResponse.coverImage);
        })
    }, [id])

    const dayToUTC = (day) => {
        const date = day.getDate().toString().padStart(2, '0')
        const month = (day.getMonth() + 1).toString().padStart(2, '0')

        // Date-only format is parsed as UTC
        return new Date(Date.parse(`${day.getFullYear()}-${month}-${date}`));
    }

    useEffect(() => {
        if (userId) {
            console.log('AUTH: ', jwtAuthorizationHeader(jwtAccess, jwtRefresh, setJwtAccess, setJwtRefresh))
            fetch(config.api_endpoint + '/products/' + id + '/availability', {
                headers: {
                    pragma : 'no-cache',
                    'cache-control' : 'no-cache',
                    authorization : jwtAuthorizationHeader(jwtAccess, jwtRefresh, setJwtAccess, setJwtRefresh)
                }
            })
            .then((response) => response.json())
            .then((parsedResponse) => {
                const newAvailability = [];
                for (let availability of Array.from(parsedResponse)) {
                    newAvailability.push([dayToUTC(new Date(availability[0])), dayToUTC(new Date(availability[1]))]);
                }
                setAvailability(newAvailability);
            })
        }
    }, [id, userId])

    useEffect(() => {
        if (!startDate || !endDate) return;

        fetch(config.api_endpoint + '/products/' + id + '/quote?from=' + formatBackendDate(startDate) + '&to=' + formatBackendDate(endDate), {
            headers: {
                pragma: 'no-cache',
                'cache-control' : 'no-cache',
                authorization : jwtAuthorizationHeader(jwtAccess, jwtRefresh, setJwtAccess, setJwtRefresh)
            },
        })
        .then((response) => response.json())
        .then((parsedResponse) => {
            console.log('Quote:')
            console.log(parsedResponse)
            setQuote(parsedResponse)
        })
    }, [startDate, endDate])

    const dateInRanges = (day, ranges) => {
        for (var range of ranges) {
            const [start, end] = range;
            if (day >= start && day <= end) {
                return range;
            }
        }
        return null;
    }

    const startShouldDisableDate = (day) => {
        day = dayToUTC(day)
        if (!availability) {
            return true;
        }
        if (endDate) {
            const utcEndDate = dayToUTC(endDate)
            if (day > utcEndDate) {
                return true;
            }
            const allowedRange = dateInRanges(utcEndDate, availability);
            if (!allowedRange) {
                return true;
            }
            const [allowedStart, allowedEnd] = allowedRange;
            if (day < allowedStart) {
                return true;
            }
        }

        const matchingRange = dateInRanges(day, availability);

        if (!matchingRange) {
            return true;
        }

        return false;
    }

    const endShouldDisableDate = (day) => {
        day = dayToUTC(day)
        if (!availability) {
            return true;
        }
        if (startDate) {
            const utcStartDate = dayToUTC(startDate)
            if (day < utcStartDate) {
                return true;
            }
            const allowedRange = dateInRanges(utcStartDate, availability);
            if (!allowedRange) {
                return true;
            }
            const [allowedStart, allowedEnd] = allowedRange;
            if (day > allowedEnd) {
                return true;
            }
        }

        const matchingRange = dateInRanges(day, availability);

        if (!matchingRange) {
            return true;
        }

        return false;
    }

    const rent = () => {
        const formattedInstances = {};

        for (const [instanceId, instance] of Object.entries(quote.instances)) {
            formattedInstances[instanceId] = {
                dateRanges: []
            }
            for (let i = 0; i < instance.dateRanges.length; i++) {
                formattedInstances[instanceId].dateRanges.push({
                    from: formatBackendDate(instance.dateRanges[i].from),
                    to: formatBackendDate(instance.dateRanges[i].to)
                })
            }
        }

        fetch(config.api_endpoint + '/rentals/', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              authorization : jwtAuthorizationHeader(jwtAccess, jwtRefresh, setJwtAccess, setJwtRefresh)

            },
            body: JSON.stringify({
                products: {
                    [id]: {
                        instances: formattedInstances
                    }
                }
            })
        })
    }
    
    return (
        <div className="is-flex is-flex-direction-column is-align-items-center">
            <p className="title">{name}</p>
            <p className="subtitle">{description}</p>
            <img className="image" style={{width: '13em'}} src={coverImage} alt={name}/>
            { userId ? (
                <Box className="mt-5">
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <p>From:</p>
                        <DatePicker value={startDate} onChange={setStartDate} shouldDisableDate={startShouldDisableDate} disablePast={true} clearable={true} variant='dialog'/>
                        <br></br>
                        <p>To:</p>
                        <DatePicker value={endDate} onChange={setEndDate} shouldDisableDate={endShouldDisableDate} disablePast={true} clearable={true} variant='dialog'/>
                    </MuiPickersUtilsProvider>
                    <br></br>
                    <button className="button is-link mt-2" onClick={rent} title='Rent' disabled={!startDate || !endDate}>Rent</button>
                    {quote ? <Typography>Price: {quote.price}</Typography> : <></>}
                    {quote ? (
                        <Box>
                            <Typography>
                                Cost breakdown:
                            </Typography>
                            <ProductBreakdown {...quote} />
                        </Box>
                    ) : <></>}
                    {quote && quote.instances.length > 1 ? (<Typography>This accomodation requires switching instance mid-rental.</Typography>) : <></>}
                </Box>
            ) : <RouteLink variant="body2" href={'/signin?redirect='}>Login to view availability</RouteLink>
            }
        </div>
    )
}