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