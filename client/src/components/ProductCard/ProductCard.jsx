import React from 'react'
import products from '../../products.json'
import './ProductCard.css'

export default function ProductCard({ setSelectedProduct}) {
    
  return (
    <div>
        {products.map((product, index) => (
            <div key={index} className='ProductCard' onClick={()=>
             setSelectedProduct({name: product.name, price: product.price}) 
            }>
                <img src={product.img} alt={product.name} className='card-image' />
                <h3 className='card-name'>{product.name}</h3>
                <p>${product.price}</p>
            </div>
        ))}
    </div>
  )
}
