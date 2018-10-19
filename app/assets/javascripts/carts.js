document.addEventListener("DOMContentLoaded", function() {
  addToCart()
  viewCart()
})
function addToCart() {
  const forms = document.querySelectorAll("form")
  for(var form of forms) {
    submitForm(form)
  }
}

function submitForm(form) {
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    //get ID, units and user ID that's associated with the cart
    var currentForm = e.srcElement
    var id = currentForm.dataset.productid
    var units = currentForm.elements[0].value
    var user_id = document.getElementById("my-cart").dataset.userid
    var cartData = {
      product_id: id,
      count: units
    }
    //associate the cart with user if user is logged in
    if(user_id !== "") {cartData.user_id = user_id}
    var cart = document.getElementById("my-cart")
    let reqData = {
      body: JSON.stringify(cartData),
      headers: {'Content-Type': 'application/json'}
    }
    //if there is no cart ID, create cart, and store cart ID in the data attribute
    if(cart.dataset.cartid === "") {
      reqData.method = "POST"
      fetch("/carts", reqData).then(resp => resp.json()).then(function(cartResp) {
        alert("Items added to cart")
        //set cart ID after cart created
        cart.setAttribute('data-cartid', cartResp['id'])
      })
    } else {
      //else, update cart
      reqData.method = "PATCH"
      fetch("/carts/" + cart.dataset.cartid, reqData).then(resp => resp.json()).then(function(resp) {
        alert("Items added to cart")
      })
    }
  })
}

function viewCart() {
  const cart = document.getElementById("my-cart")
  const modalBody = document.querySelector(".modal-body")
  cart.addEventListener("click", function(e) {
    //check if cart exists
    if (this.dataset.cartid !== "") {
      fetch("/carts/" + this.dataset.cartid).then(resp => resp.json()).then(function(cart) {
        modalBody.innerHTML = "<ol></ol>"
        for (const key in cart.product_with_units) {
          modalBody.innerHTML += "<li>" +
          key + " * " + cart.product_with_units[key] + "</li>"
        }
        modalBody.innerHTML += "<hr><p>Total Price: " + cart.total + "</p>"
      })
    } else if (this.dataset.userid !== "") {
      //user logged in but cart ID not set yet
      //check if there's any cart associated with the user
    } else {
      modalBody.innerHTML = "Your cart is empty. Add some items!"
    }
  })
}

function placeOrderButton() {
  const button = document.querySelector("#placeOrder")
  const myCart = document.getElementById("my-cart")
  const cartID = myCart.dataset.cartid
  const userID = myCart.dataset.userid
  button.addEventListener("click", function(e) {
    if(cartID === "" || userID === "") {
      alert("Add some items to cart or log in")
    } else {
      placeOrder(cartID, userID)
    }
  })
}

function placeOrder(cartID) {
  //create order and delete cart
  let reqData = {
    method: "POST",
    headers: {'Content-Type': 'application/json'}
  }
  fetch("/carts/" + cartID + "orders/new").then(resp => resp.json()).then()
}

function setUserID() {

}
