import { Box, Button, Typography } from "@material-ui/core"
import React, { useEffect, useState } from "react"
import Header from "../../components/Header"
import { useRouter } from 'next/router'
import config from "../../config"
import DateFnsUtils from '@date-io/date-fns'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import { format } from 'date-format-parse'

export default function ProductInfo() {
    const router = useRouter();
    const { id } = router.query;
    const [name, setName] = useState('Betsy')
    const [description, setDescription] = useState('Trattore sano e genuino')
    const [coverImage, setcoverImage] = useState('https://www.evo-tune.it/wp-content/uploads/2019/06/trattore.png')
    const [startDate, setStartDate] = useState(null)
    const [endDate, setEndDate] = useState(null)
    const [available, setAvailable] = useState(true)
    const [availability, setAvailability] = useState(null)
    const [quote, setQuote] = useState(null)

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

        fetch(config.api_endpoint + '/products/' + id + '/availability', {
            headers: {
                pragma: 'no-cache',
                'cache-control' : 'no-cache'
            }
        })
        .then((response) => response.json())
        .then((parsedResponse) => {
            console.log(parsedResponse)
            const newAvailability = [];
            for (let availability of Array.from(parsedResponse)) {
                newAvailability.push([new Date(availability[0]), new Date(availability[1])]);
            }
            setAvailability(newAvailability);
        })
    }, [id])

    const formatDate = (date) => format(date, 'YYYY-MM-DD')

    useEffect(() => {
        if (!startDate || !endDate) return;

        fetch(config.api_endpoint + '/products/' + id + '/quote?from=' + formatDate(startDate) + '&to=' + formatDate(endDate), {
            headers: {
                pragma: 'no-cache',
                'cache-control' : 'no-cache'
            },
        })
        .then((response) => response.json())
        .then((parsedResponse) => {
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
        day.setHours(0, 0, 0, 0);
        if (!availability) {
            return true;
        }
        if (endDate) {
            if (day > endDate) {
                return true;
            }
            const allowedRange = dateInRanges(endDate, availability);
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
        day.setHours(0, 0, 0, 0);
        if (!availability) {
            return true;
        }
        if (startDate) {
            if (day < startDate) {
                return true;
            }
            const allowedRange = dateInRanges(startDate, availability);
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

    // TODO: Remove?
    const renderStartDate = (day) => {

    }

    const rentBody = () => {
        const body = {
            products: {}
        }
        body.products[id] = {
            instances: quote.instances
        }

        console.log('Body: ', JSON.stringify(body))

        return body;
    }

    const rent = () => {
        fetch(config.api_endpoint + '/rentals/', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                products: {
                    [id]: {
                        instances: quote.instances
                    }
                }
            })
        })
        
    }
    
    return (
        <Box>
            <Header showLogin={true} />
            <Box>
                <Box>
                    <Typography variant='header1'>{name}</Typography>
                    <img src={coverImage} alt={name}/>
                </Box>
                <Typography variant='paragraph'>{description}</Typography>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <DatePicker value={startDate} onChange={setStartDate} shouldDisableDate={startShouldDisableDate} disablePast={true} clearable={true} variant='dialog'/>
                    <DatePicker value={endDate} onChange={setEndDate} shouldDisableDate={endShouldDisableDate} disablePast={true} clearable={true} variant='dialog'/>
                </MuiPickersUtilsProvider>

                <Button onClick={rent} title='Rent' disabled={!startDate || !endDate}>Rent</Button>
                {quote ? <Typography>Price: {quote.price}</Typography> : <></>}
                {quote && quote.instances.length > 1 ? (<Typography>This accomodation requires switching instance mid-rental.</Typography>) : <></>}
            </Box>
        </Box>
    )
}