var request = require('request')

module.exports = sply

function sply(email,variant,firstname,lastname,address,city,state,country,phone,zip,step=2){
    //put phone # into (xxx)xxx-xxx format
    var newphone = "(" + phone[0] + phone[1] + phone[2] + ")" + phone[3] + phone[4] + phone[5] + "-" + phone[6] + phone[7] + phone[8] + phone[9]
    
    //creates session/cookie-jar
    var jar = request.jar()

    var options1 = {
        method: 'POST',

        //endpoint for adding to cart
        url: "https://yeezysupply.com/cart/add.js",

        formData: {
            id: variant,
            quantity: 1
        },

        headers: {
            "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36"
        },
        jar:jar
    }
        
    var form = {
        "_method": "patch",
        "previous_step": "contact_information",
        "step": "shipping_method",
        "checkout[email]": email,
        "checkout[buyer_accepts_marketing]": 0,
        "checkout[shipping_address][first_name]": firstname,
        "checkout[shipping_address][last_name]": lastname,
        "checkout[shipping_address][address1]": address,
        "checkout[shipping_address][city]": city,
        "checkout[shipping_address][country]": country,
        "checkout[shipping_address][province]": state,
        "checkout[shipping_address][zip]": zip,
        "checkout[shipping_address][phone]": newphone,
        "checkout[remember_me]": false,
        "checkout[remember_me]": 0,
        "checkout[client_details][browser_width]": 718,
        "checkout[client_details][browser_height]": 711,
        "checkout[client_details][javascript_enabled]": 1
        }
    

    request(options1,function(error,response,body){
        if (response.statusCode == 200){
            genlink(jar,form,step)
        }else{
            console.log("Error adding to cart")
        }
    })
}


function genlink(jar,form,step){
    var options2 = {
        method: 'POST',
        url: "https://yeezysupply.com/cart",
        headers: {
            "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36"
        },
        jar:jar,
        form: {
            "updates[]": 1,
            checkout: "CHECK OUT",
            note: "ALL SALES FINAL NO RETURNS OR MODIFICATIONS"
        }
    }
    request(options2,function(error,response,body){
        if (response.statusCode == 302){
            //response.headers['location'] is the checkout link
            if (step == 2){
                submitshippinginfo(response.headers['location'],form,jar,step)
            }else if (step == 1){
                key(response.headers['location'],jar,step)
            }
        }else{
            console.log("Error generating checkout")
        }
    })
}

function submitshippinginfo(location,form,jar,step){
    var opt = {
        url: location,
        method: "POST",
        headers: {
            //"content-type": "application/x-www-form-urlencoded",
            "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36",
        },
        jar:jar,
        form:form
    }

    request(opt,function(error,response,body){
        if (response.statusCode == 302){
            key(response.headers['location'],jar,step)
        }else{
            console.log("Error submitting shipping")
        }
    })
}

function key(location,jar,step){
    var op = {
        url: location,
        method: "GET",
        jar:jar,
        headers: {
            "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36", 
        }
    }
    request(op,function(error,response,body){
        try{
            //console.log(response.statusCode)
            console.log(location.split("?")[0] + "?key=" + body.split('authorization-token" content="')[1].split('"')[0])
            //console.log(body.split('data-shipping-method="')[1].split('"')[0])
            if(step !== 1){
                var g = {
                    method: "PATCH",
                    url: location,
                    jar:jar,
                    form: {
                        "checkout[shipping_rate][id]": (body.split('data-shipping-method="')[1].split('"')[0]),
                    },
                    headers: {
                        "User-Agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.142 Safari/537.36", 
                    }
                }
                request(g,function(err,res,body){
                    //console.log(res.statusCode)
                })
            }
        }catch (err){
            console.log("Error retrieving key")
        }
    })
}

//sply("john.smith@example.com",19434493018242,"John","Smith","78 George Ave","Waynesboro","PA","US","1234567890","17268",1)