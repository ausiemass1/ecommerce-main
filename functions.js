const axios = require('axios');



// Function to get PayPal access token
exports.getAccessToken = async () => {
    const response = await axios.post('https://api.sandbox.paypal.com/v1/oauth2/token', null, {
        auth: {
            username: 'AWBJAQpHjgvEHpN4y3k3YVbXSrR2NKgr4phaQDemZuhbzaHg80-7VWt0x-YIbft7z6x9_TBVeQFDqZgV',
            password: 'ELnW_mxuEui9aV5sJ0yvL7DHCoMXyfQEj1U01fLxs68NLBA_fEv1LrOjz4BrhwzlHg_qDMHHlUsbDgPz'
        },
        params: {
            grant_type: 'client_credentials'
        },
        headers: {
            'Accept': 'application/json',
            'Accept-Language': 'en_US'
        }
    });
  
  
    return response.data.access_token;
  }


// function to restrict access to admin pages
exports.isAuthenticated = (req, res, next) => {
    if (req.session.loggedin) {
      return next();
    }
    res.redirect('/login');
  }



  exports.createOrder = async () => {
    const accessToken = await generateAccessTocken();
    const response = await axios({
        url: 'https://api-m.sandbox.paypal.com/v2/checkout/orders',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        data: JSON.stringify({
            intent: "CAPTURE",
            purchase_units: [ { 
                items: [{
                    name: 'Node Js code',
                    description: 'node js',
                    quantity: 1,
                    unit_amount: { "currency_code": "USD", "value": "100.00" } } ], 

                
               amount: { 
                currency_code: "USD",
                 value: "100.00",
                breakdown: {
                    item_total: {
                        currency_code: "USD",
                        value: "100.00"
                    }
                  

                } } 

            }],

            application_context: {
                return_url: 'http://localhost:3000/order_complete',
                cancel_url: 'http://localhost:3000/order_cancel',
                user_action: 'PAY_NOW',
                brand_name: 'demo supermarket',
            }
                
        })
    })

   return response.data.links.find(link => link.rel === 'approve').href
}
