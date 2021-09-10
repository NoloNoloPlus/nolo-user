import React, {useEffect, useState} from "react"
import Product from "../components/Product"
import Header from "../components/Header"
import { Box } from "@material-ui/core"
import config from "../config"
import { useRouter } from 'next/router'

// Messo solo per avere dei dati
const initialProducts = [
    {
        name: 'Betsy',
        blurb: 'Trattore sano e genuino',
        imageUrl: 'https://www.evo-tune.it/wp-content/uploads/2019/06/trattore.png'
    }
]

const truncate = (input, maxLength) => input.length > maxLength ? `${input.substring(0, maxLength - 3)}...` : input;

const Products = () => {
    const router = useRouter();
    const [products, setProducts] = useState(initialProducts)
    // Use this to handle search queries

    useEffect(() => {
        fetch(config.api_endpoint + '/products?keywords=' + (router.query.q || ''), {
            headers: {
                pragma: 'no-cache',
                'cache-control' : 'no-cache'
            }
        })
        .then((response) => {
            return response.json()
        })
        .catch((error) => {
            console.log(error)
        })
        .then((parsedResponse) => {
            const parsedProducts = parsedResponse.results;
            console.log(parsedResponse)
            const newProducts = [];
            for (let parsedProduct of parsedProducts) {
                newProducts.push({
                    name: parsedProduct.name,
                    id: parsedProduct.id,
                    blurb: truncate(parsedProduct.description, 50),
                    coverImage: parsedProduct.coverImage
                })
            }

            setProducts(newProducts);
        })
    }, [router.query.q])

    return (
        <Box>
            <Box>
            {
                products.map((product, index) => 
                    <Product name={product.name} coverImage={product.coverImage} blurb={product.blurb} id={product.id} key={'product' + index}/>
                )
            }
            </Box>
        </Box>
        
    )
}

export default Products