import React from 'react';
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import { Accordion, AccordionDetails, AccordionSummary, List, ListItem, ListItemText, Typography } from "@material-ui/core"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Button from '@material-ui/core/Button';
import { useRouter } from 'next/router'

import { renderToStaticMarkup } from 'react-dom/server';

import config from '../config'
import { formatFrontendDate } from '../common/utils'

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

export default function ProductRental({ id, instances, productInfo }) {
    const router = useRouter();
    const classes = useStyles();

    const firstRentalDay = () => {
        let firstDay = null;

        for (const instance of Object.values(instances)) {
            for (const dateRange of instance.dateRanges) {
                const day = new Date(dateRange.from)
                if (firstDay == null || day < firstDay) {
                    firstDay = day;
                }
            }
        }
        return firstDay
    }

    const lastRentalDay = () => {
        let lastDay = null;

        for (const instance of Object.values(instances)) {
            for (const dateRange of instance.dateRanges) {
                const day = new Date(dateRange.from)
                if (lastDay == null || day > lastDay) {
                    lastDay = day;
                }
            }
        }
        return lastDay
    }


    const effectiveDateRanges = () => {
        const effectiveDateRanges = []

        const dateRangeList = []
        console.log('Effective instances:', instances)

        for (const [instanceId, instance] of Object.entries(instances)) {
            for (const dateRange of instance.dateRanges) {
                const from = new Date(dateRange.from)
                const to = new Date(dateRange.to)
                const price = parseFloat(dateRange.price.$numberDecimal)
                dateRangeList.push([instanceId, {from, to, price}])
            }
        }

        dateRangeList.sort((a, b) => a[1].from - b[1].from)

        for (let i = 0; i < dateRangeList.length; i++) {
            const [instanceId, {from, to, price}] = dateRangeList[i]
            if (i < dateRangeList.length - 1) {
                const [nextInstanceId, x] = dateRangeList[i + 1]

                effectiveDateRanges.push({
                    from: formatFrontendDate(from),
                    to: formatFrontendDate(to),
                    price
                })

                if (instanceId != nextInstanceId) {
                    effectiveDateRanges.push(null)
                }
            }
            else {
                effectiveDateRanges.push({
                    from: formatFrontendDate(from),
                    to: formatFrontendDate(to),
                    price
                })
            }
        }

        console.log('Effective date ranges:', effectiveDateRanges)
        
        return effectiveDateRanges
    }

    const rentalStatus = () => {
        if (Date.now() < firstRentalDay()) {
            return 'future'
        }
        else if (Date.now() <= lastRentalDay()) {
            return 'current'
        }
        else {
            return 'past'
        }
    }

    if (!instances) return <></>

    return (
        <Accordion>
            <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
            >
                <Typography>{productInfo?.name || 'Loading...'}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <List>
                    {effectiveDateRanges().map((dateRange, i) => (
                        <ListItem key={i}>
                            <ListItemText>
                                {dateRange == null ? 'Change instance' : (
                                    (dateRange.from == dateRange.to ? dateRange.from : (
                                        dateRange.from + ' - ' + dateRange.to
                                    )) + ' ' + dateRange.price + '€'
                                )}
                            </ListItemText>
                        </ListItem>
                    ))}
                </List>
                {
                    rentalStatus() == 'current' ? <Button>Return product</Button> : <></>
                }
                {
                    rentalStatus() != 'past' ? <Button>Leave a review</Button> : <></>
                }
            </AccordionDetails>
        </Accordion>
    )
}