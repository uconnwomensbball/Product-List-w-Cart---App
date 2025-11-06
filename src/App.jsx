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
const [isOrderConfirmedModalDisplayed, setIsOrderConfirmedModalDisplayed] = React.useState(false)
const [isOrderAtMaxDesserts, setIsOrderAtMaxDesserts] = React.useState(false)
const [isMaxDessertsModalDisplayed, setIsMaxDessertsModalDisplayed] = React.useState(false)

//maps over dessert items to display them on DOM
const mappedDessertData = dessertDataWAllProps.map(function(dessert){
    return (
    <div className = "individual-dessert-div" key={dessert.id}>
            <img className={`dessert-img ${dessert.count >0? "red-border":""}`} src={dessert.image} />

            {dessert.count > 0? 
                <div className = "number-of-dessert-div">
                    <button className = "decrement-btn bold" onClick={()=>decrementCount(dessert.id)} >-</button>
                    <p>{dessert.count}</p>
                    <button className = "increment-btn bold" onClick={()=>addToCart(dessert.id)} disabled={isOrderAtMaxDesserts}>+</button>
                </div>:
                <button className = "add-to-cart-btn" onClick={()=>addToCart(dessert.id)} disabled={isOrderAtMaxDesserts}>
                    <img src="/assets/icon-add-to-cart.svg" /><span className = "bold">Add to Cart</span>
                </button>
            }
     
            <p className = "bold dessert-name">{dessert.name}</p>
            <p className="red-text-color bold dessert-price">${dessert.price.toFixed(2)}</p>
    </div>)
    })

//variable to isolate the desserts in the cart that have a count greater than 0 (so all desserts aren't displayed in the cart)
const selectedDesserts = dessertDataWAllProps.filter(dessert=>dessert.count > 0)

//maps over selected desserts to display in cart and in modal
const mappedSelectedDesserts = selectedDesserts.map(function(dessert){
    return (
    <>
        <div className="cart-dessert" key={dessert.id}>
            <div>  
                <p className="bold dessert-name-cart">{dessert.name}</p>
                <p className="dessert-count-cart"><span className ="red-text-color bold">{dessert.count}x</span> @ ${(dessert.count * dessert.price).toFixed(2)}</p>  
            </div>
                    <div>
                        <button className="remove-btn" onClick={()=>removeFromCart(dessert.name)} disabled={isOrderConfirmedModalDisplayed || isMaxDessertsModalDisplayed}>
                            <img className = "remove-item-x" src="./assets/icon-remove-item.svg"/>
                        </button>
                    </div>
        </div>
        <hr className = "hr"></hr>
    </>)})

//calculates the total number of desserts 
    const dessertsTotalCount = selectedDesserts.reduce(function(accumulator, currentValue) {
  return accumulator + currentValue.count 
}, 0)

//function - adds items to cart (increments the number of a dessert in cart by 1)
function addToCart(id){
    setDessertDataWAllProps(prevDessert=>{ return (
        prevDessert.map(dessert=> dessert.id === id? {...dessert, count: dessert.count + 1}: dessert
        ))})
    }

//function - checks whether user is at 9 desserts, and if so, displays a modal telling user they are at their dessert limit for that order
const prevDessertsCountRef = React.useRef(dessertsTotalCount)
React.useEffect(()=>{
    if (prevDessertsCountRef.current < 9 && dessertsTotalCount === 9){
        setIsOrderAtMaxDesserts(true)
        setIsMaxDessertsModalDisplayed(true)
    }
     else if (dessertsTotalCount < 9){
        setIsOrderAtMaxDesserts(false)
        setIsMaxDessertsModalDisplayed(false)}

    prevDessertsCountRef.current = dessertsTotalCount
    }, [dessertsTotalCount])

//function - decrements the number of a dessert in the cart by 1
function decrementCount(id){
     setDessertDataWAllProps(prevDessert=>{ return (
        prevDessert.map(dessert=> dessert.id === id? {...dessert, count: dessert.count - 1}: dessert
        ))})}

//function - completely removes a dessert from the cart (no matter how many of that dessert are in the cart)
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
         console.log(dessertsTotalCount)
    }, [dessertDataWAllProps])

//function - confirms order (aka displays modal)
function confirmOrder(){
    setIsOrderConfirmedModalDisplayed(true)
}

//function - starts new order and clears out prior order
function startNewOrder(){
    setIsOrderConfirmedModalDisplayed(false)
    setDessertDataWAllProps(dessertsData.map(dessert=>({
        ...dessert, 
        id: nanoid(),  
        count: 0})))
}

//function - returns user to prior order after modal displays letting them know they are capped at 9 items per order
function returntoOrder(){
    setIsMaxDessertsModalDisplayed(false)
}

return (
     <>
        <h1 className={`${isOrderConfirmedModalDisplayed? "overlay dessert-header": "dessert-header"}`}>Desserts</h1>
            <div className={`main ${isOrderConfirmedModalDisplayed? "overlay": ""}`}>
                <div id="desserts" className="desserts-div">
                    {mappedDessertData}
                </div>
                <div className="cart-div">
                    <h2 className="red-text-color">Your Cart (<span>{dessertsTotalCount}</span>)</h2>
                    <div id="cart-content">
                    {selectedDesserts.length === 0? 
                    <div className = "empty-cart-content-div">
                        <img src="./assets/illustration-empty-cart.svg"/>
                        <p>Your added items will appear here</p>
                    </div>:
                    <>
                       {mappedSelectedDesserts}
                        <div className="order-div">
                            <p className="bold order-total">Order Total</p> 
                            <p className="bold">${totalPrice.toFixed(2)}</p>
                        </div>
                        <button className = "red-bg-color confirm-btn bold" onClick={confirmOrder} disabled={isMaxDessertsModalDisplayed}>Confirm Order</button>
                    </> }   
                </div>
                </div>
            </div>
            {isOrderConfirmedModalDisplayed &&  
             <div className="modal-overlay" onClick={e => e.stopPropagation()}>
                <div className="modal-div">
                    <img src="./assets/icon-order-confirmed.svg"/>
                    <h1>Order Confirmed</h1>
                    <p>Your order ID: {nanoid().slice(0, 5)}</p>
                    <p>We hope you enjoy your food!</p>
                    <div className = "modal-desserts-total">
                        {selectedDesserts.map(function(dessert){
                                return (
                                <>
                                    <div className="cart-dessert" key={dessert.id}>
                                        <div className="modal-dessert-details">
                                            {isOrderConfirmedModalDisplayed && <img className = "modal-small-order-conf-img" src={dessert.image}/>}
                                        
                                            <div>  
                                                <p className="bold dessert-name-cart">{dessert.name}</p>
                                                <p className="dessert-count-cart"><span className ="red-text-color bold">x{dessert.count}</span></p>  
                                            </div>
                                        </div>
                                            <p>${(dessert.count * dessert.price).toFixed(2)}</p>
                                    </div>
                                 
                                    <hr className = "hr"></hr>
                                </>)})}
                        <div className="order-div">
                            <p className="bold">Order Total</p> 
                            <p className="bold">${totalPrice.toFixed(2)}</p>
                        </div>
                </div>
                    <button className = "red-bg-color start-new-order-btn bold" onClick={startNewOrder}>Start New Order</button>
                </div>
            </div>}
            {isMaxDessertsModalDisplayed &&
            <div className="modal-overlay" onClick={e => e.stopPropagation()}> 
                <div className="modal-div">
                    <p>You have reached the maximum number of items for this order. To order more than 9 items, please submit your current order, and then start a new order.</p>
                    <button className = "red-bg-color start-new-order-btn bold" onClick={returntoOrder}>Return to Order</button>
                </div>
            </div>}
        <footer>JDJD Codes <FontAwesomeIcon icon={faScaleBalanced} /></footer>
    </>
)}