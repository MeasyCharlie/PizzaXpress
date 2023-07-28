// mix.browserSync('myapp.test')
import axios from 'axios';
import Noty from 'noty';
import {initAdmin } from './admin'

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter')
function updateCart(pizza){
    axios.post('/update-cart', pizza).then(res=>{
        console.log(res);

        cartCounter.innerText = res.data.totalQty
        new Noty({
            type: 'success',
            timeout:1000,
            progressBar: false,
            text: "Item added to cart"
        }).show();
    }).catch(err =>{
        new Noty({
            type: 'error',
            timeout:1000,
            progressBar: false,
            text: "Something went wrong"
        }).show();
    })
}

addToCart.forEach((btn)=>{
    btn.addEventListener('click', (e)  =>{
        let pizza = JSON.parse(btn.dataset.pizza);
        updateCart(pizza);
        
    })
})

//remove alert message after x seconds
const alertMsg = document.querySelector('#success-alert')
if(alertMsg){
    console.log("message for alert");
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)

}
initAdmin();

// change order status 
let statuses = document.querySelectorAll(".status_line");
let hiddenInput = document.querySelector('#hiddenInput');
let order = hiddenInput? hiddenInput.value : null;
order = JSON.parse(order)

function updateStatus(order) {
    statuses.forEach((status)=>{
        status.classList.remove('step-completed');
        status.classList.remove('current');
    })
    let stepCompleted = true;
    statuses.forEach((status)=>{
        let dataProp = status.dataset.status;
        if(stepCompleted){
            status.classList.add('step-completed');
        }
        if(dataProp=== order.status){
            stepCompleted = false;
            if(status.nextElementSibling){
                status.nextElementSibling.classList.add('current');
            }
            
        }
    })

}

updateStatus(order);

//Socket
let socket = io()
//Join
if(order){
    socket.emit('join', `order_${order._id}`);
    //order_sdkhklzllafjljaldj98alfkdjla8d3l23kdf9
}
socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order };
    updatedOrder.updatedAt = moment().format();
    updatedOrder.status = data.status;
    updateStatus(updatedOrder);
    console.log("checked");
    new Noty({
        type: 'success',
        timeout:1000,
        progressBar: false,
        text: "Order Updated"
    }).show();
})

