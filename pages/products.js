import React, {useEffect, useState} from "react"
import Product from "../components/Product"
import Header from "../components/Header"
import { Box } from "@material-ui/core"
import config from "../config"
import { useRouter } from 'next/router'

// Messo solo per avere dei dati
const initialProducts = []

const truncate = (input, maxLength) => {
    if (input) {
        return input.length > maxLength ? `${input.substring(0, maxLength - 3)}...` : input;
    }
    else {
        return 'No description available.'
    }
} 
const Products = () => {
    const router = useRouter();
    const [products, setProducts] = useState(initialProducts);
    const [search, setSearch] = useState('');
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
                    coverImage: parsedProduct.coverImage,
                    stars: parsedProduct.stars
                })
            }

            setProducts(newProducts);
        })
    }, [router.query.q])

    const filteredProducts = () => {
        if (!search) {
            return products;
        }

        const keywords = search.split(' ');

        return products.filter((product) => {
            let allowed = true;
            for (const keyword of keywords) {
                if (!product.name.toLowerCase().includes(keyword.toLowerCase())) {
                    allowed = false;
                }
            }

            return allowed;
        })
    }

    return (
        <div>
            <input type="text" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
            <div className="is-flex is-align-items-space-around is-justify-content-space-around is-flex-wrap-wrap">
            {
                filteredProducts().map((product, index) => 
                    <Product name={product.name} coverImage={product.coverImage} blurb={product.blurb} id={product.id} stars={product.stars} key={'product' + index}/>
                )
            }
            </div>
        </div>
        
    )
}

export default Products