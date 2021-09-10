import React from 'react';
import { Link } from "@material-ui/core"
import { useRouter } from 'next/router'

export default function RouteLink(props) {
    const router = useRouter();

    const handleClick = (event) => {
        event.preventDefault()
        router.push(props.href)
    }

    return <Link onClick={handleClick} {...props}/>
}