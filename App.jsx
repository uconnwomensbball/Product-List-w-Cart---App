import React from 'react'
import { dessertsData } from "./data.js"
import { nanoid } from 'nanoid'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faScaleBalanced } from '@fortawesome/free-solid-svg-icons'
export default function App(){

//variables 
const [dessertDataWAllProps, setDessertDataWAllProps] = React.useState(
    dessertsData.map(dessert=>({
        ...dessert, 
        id: nanoid(), 
        count: 0})))
        

const [totalPrice, setTotalPrice] = React.useState(0)
const [isModalDisplayed, setIsModalDisplayed] = React.useState(false)

//maps over dessert items to display them on DOM
const mappedDessertData = dessertDataWAllProps.map(function(dessert){
    console.log("dessert", dessert)
    return (
    <div key={dessert.id}>
            <img className="dessert-img" src={dessert.image} />

            {dessert.count > 0? 
                <div className = "number-of-dessert-div">
                    <button className = "decrement-btn" onClick={()=>decrementCount(dessert.id)}>-</button>
                    <p>{dessert.count}</p>
                    <button className = "increment-btn" onClick={()=>addToCart(dessert.id)}>+</button>
                </div>:
                <button className = "add-to-cart-btn" onClick={()=>addToCart(dessert.id)}>
                    <img src="/assets/icon-add-to-cart.svg" /><span className = "bold">Add to Cart</span>
                </button>
            }
        <p className = "bold">{dessert.name}</p><p className="red-text-color">${dessert.price.toFixed(2)}</p>
    </div>)
    })

//variable to isolate the desserts in the cart that have a count greater than 0 so all desserts aren't displayed in the cart
const selectedDesserts = dessertDataWAllProps.filter(dessert=>dessert.count > 0)

//maps over selected desserts to display in cart and in modal
const mappedSelectedDesserts = selectedDesserts.map(function(dessert){
    return (
    <>
        <div className="cart-dessert" key={dessert.id}>
            <div>  
                <p className="bold">{dessert.name}</p>
                <p><span className ="red-text-color bold">{dessert.count}x</span> @ ${(dessert.count * dessert.price).toFixed(2)}</p>
                <p>placeholder - total price</p>   
            </div>
                {isModalDisplayed? null: 
                    <div>
                        <button className="remove-btn" onClick={()=>removeFromCart(dessert.name)}>
                            <img src="./assets/icon-remove-item.svg"/>
                        </button>
                    </div>}
          
        </div>
        <hr></hr>
    </>)})

//function - adds items to cart (increments the number of a dessert in cart by 1)
function addToCart(id){
    setDessertDataWAllProps(prevDessert=>{ return (
        prevDessert.map(dessert=> dessert.id === id? {...dessert, count: dessert.count + 1}: dessert
        ))})}

//function - decrements the number of a dessert in cart by 1
function decrementCount(id){
     setDessertDataWAllProps(prevDessert=>{ return (
        prevDessert.map(dessert=> dessert.id === id? {...dessert, count: dessert.count - 1}: dessert
        ))})}

//function - completely removes a dessert from cart (no matter how many of that dessert were in the cart)
function removeFromCart(name){
    setDessertDataWAllProps(prevDessert=>{ return (
        prevDessert.map(dessert=> dessert.name === name? {...dessert, count: 0}: dessert
        ))})}

// calculates total price 
const dessertsTotalPrice = selectedDesserts.reduce(function(accumulator, currentValue) {
  return accumulator + (currentValue.count * currentValue.price)
}, 0)

//function - updates total price 
 React.useEffect(()=>{
        setTotalPrice(dessertsTotalPrice)
    }, [dessertDataWAllProps])

//function - confirms order (aka displays modal)
function confirmOrder(){
    setIsModalDisplayed(true)
}

//function - starts new order and clears out prior order
function startNewOrder(){
    setIsModalDisplayed(false)
   

    setDessertDataWAllProps(dessertsData.map(dessert=>({
        ...dessert,  
        count: 0})))
}

return (
     <>
        <h1>Desserts</h1>
            <div className="main">
                <div id="desserts" className="desserts-div">
                    {mappedDessertData}
                </div>
                <div className="cart-div">
                    <h2 className="red-text-color">Your Cart (<span></span>)</h2>
                    <div id="cart-content">
                    {selectedDesserts.length === 0? 
                    <div className = "empty-cart-content-div">
                        <img src="./assets/illustration-empty-cart.svg"/>
                        <p>Your added items will appear here</p>
                    </div>:
                    <>
                       {mappedSelectedDesserts}
                        <div className="order-div">
                            <p className="bold">Order Total</p> 
                            <p className="bold">${totalPrice.toFixed(2)}</p>
                        </div>
                        <button className = "red-bg-color confirm-btn bold" onClick={confirmOrder}>Confirm Order</button>
                    </> }   
                </div>
                </div>
            </div>
            {isModalDisplayed &&  
            <div className="modal-div">
                <img src="./assets/icon-order-confirmed.svg"/>
                <h1>Order Confirmed</h1>
                <p>We hope you enjoy your food!</p>
                {mappedSelectedDesserts}
                <button className = "red-bg-color start-new-order-btn bold" onClick={startNewOrder}>Start New Order</button>
            </div>}
        <footer>JDJD Codes <FontAwesomeIcon icon={faScaleBalanced} /></footer>
    </>
)}