import React from 'react'
import { dessertsData } from "./data.js"
import { nanoid } from 'nanoid'

export default function App(){

//variables 
const [cart, setCart] = React.useState([])
const [numberOfItems, setNumberOfItems] = React.useState(cart.length)
const [totalPrice, setTotalPrice] = React.useState(0)
const [isModalDisplayed, setIsModalDisplayed] = React.useState(false)

//add ids to dessert items 
const mappedDessertsDataWithIDs = dessertsData.map(function(dessert){
    return {id: nanoid(), count: null, ...dessert}
})

//maps over dessert items to display them on DOM
const mappedDessertData = mappedDessertsDataWithIDs.map(function(dessert){
    let count = cart.filter(cartdessert=>cartdessert.name === dessert.name).length
    console.log("dessertcount", dessert.count)
    return (
    <div key={dessert.id}>
            <img className="dessert-img" src={dessert.image} />
        
            {count > 0? 
                <div className = "number-of-dessert-div">
                    <button className = "decrement-btn" onClick={()=>decrementCount(dessert.id)}>-</button>
                    <button className = "increment-btn" onClick={()=>incrementCount(dessert.id)}>+</button>
                </div>:
                <button className = "add-to-cart-btn" onClick={()=>addToCart(dessert.id)}>
                    <img src="/assets/icon-add-to-cart.svg" /><span className = "bold">Add to Cart</span>
                </button>
            }
          
          
        <p className = "bold">{dessert.name}</p><p className="red-text-color">${dessert.price.toFixed(2)}</p>
    </div>)
    })

//creates a new array of desserts in the cart with the variable "count" that displays how many of that item the user has selected
const numberofEachDessertInCart = dessertsData.map(function(masterdessert){
    let count = cart.filter(cartdessert=>cartdessert.name === masterdessert.name).length
    return {...masterdessert, count: count}})

//variable to isolate the desserts in the cart that have a count greater than 0 so all desserts aren't displayed in the cart
const selectedDesserts = numberofEachDessertInCart.filter(dessert=>dessert.count > 0)

//maps over selected desserts to display in cart and in modal
const mappedSelectedDesserts = selectedDesserts.map(function(dessert){
    return (
    <>
        <div className="cart-dessert" key={dessert.id}>
            <div>  
                <p className="bold">{dessert.name}</p>
                <p><span className ="red-text-color bold">{dessert.count}x</span> @ ${dessert.price.toFixed(2)}</p>
                <p>placeholder - total price</p>   
            </div>
            <div> 
                <button className="remove-btn" onClick={()=>removeFromCart(dessert.id)}><img src="./assets/icon-remove-item.svg"/></button>
            </div>
        </div>
        <hr></hr>
    </>)})

//function - adds items to cart
function addToCart(id){ 
    const newItem = mappedDessertsDataWithIDs.find(item =>item.id === id)
    setCart(prevItems =>[...prevItems, newItem])
    setNumberOfItems(prevLength=>prevLength + 1)
}

//function - removes items from cart
function removeFromCart(id){
    const cartWithoutRemovedItem = cart.filter(item =>item.id != id)
    setCart(cartWithoutRemovedItem)
    setNumberOfItems(prevLength=>prevLength - 1)
}

// calculates total price 
const dessertsTotalPrice = cart.reduce(function(accumulator, currentValue) {
    console.log(accumulator + currentValue.price)
  return accumulator + currentValue.price
}, 0)

//function - updates total price 
 React.useEffect(()=>{
        setTotalPrice(dessertsTotalPrice)
    }, [cart])

//function - confirms order (aka displays modal)
function confirmOrder(){
    console.log("order confirmed!")
    setIsModalDisplayed(true)
}

//function - starts new order and clears out prior order
function startNewOrder(){
    console.log("Start new order!")
    setIsModalDisplayed(false)
    setCart([])
    setNumberOfItems(0)
}

return (
     <>
        <h1>Desserts</h1>
            <div className="main">
                <div id="desserts" className="desserts-div">
                    {mappedDessertData}
                </div>
                <div className="cart-div">
                    <h2 className="red-text-color">Your Cart (<span>{numberOfItems}</span>)</h2>
                    <div id="cart-content">
                    {numberOfItems === 0? 
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
        <footer>&copy;JDJD Code <i className="fa-solid fa-scale-balanced"></i></footer>
    </>
)}