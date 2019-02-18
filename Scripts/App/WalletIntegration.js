function WalletIntegration(paymentAmountId, validationFunction) {
    this.paymentAmountId = paymentAmountId;
    this.validationFunction = validationFunction;

    this.setUpMasterPass = function (masterPassConfig) {
        //add click event to call initialization at our server before opening lightbox.
        $("#" + masterPassConfig.masterPassClickedId).on("click",
            function () {
                //try to load a progress overlay
                var pageLoadPrompt = document.getElementById("pageLoadPrompt");
                if (pageLoadPrompt) {
                    window.PageAnimation_Start();
                }
                //we can load the masterpass lightboxurl anytime
                console.log("Loading Masterpass SDK");
                $.getScript(masterPassConfig.masterPassLightboxUrl)
                    .done(function () {
                        console.log("Masterpass SDK loaded successfully.");
                    })
                    .fail(function () {
                        if (pageLoadPrompt) {
                            window.PageAnimation_End();
                        }
                        /* boo, fall back to something else */
                        alert('Masterpass is currently unavailable.  Please pick a different payment method.');
                    });

                if (validationFunction()) {
                    console.log("Form validated successfully.  Initializing Masterpass.");
                    //Initialize MasterPass
                    var formSerialized = $("#" + masterPassConfig.formToPostId).serialize();
                    $.post(masterPassConfig.masterPassInitializationUrl,
                        {
                            paymentAmount: $("#" + paymentAmountId).val(),
                            formValues: formSerialized
                        },
                        function (data) {
                            if ((typeof (data) === "string") && (data.indexOf("Error") !== -1)) {
                                if (pageLoadPrompt) {
                                    window.PageAnimation_End();
                                }
                                console.log(data);
                            } else {
                                window.setTimeout(function () {
                                    if (pageLoadPrompt) {
                                        window.PageAnimation_End();
                                    }
                                    //call lightbox
                                    console.log("Masterpass trying to open lightbox.");
                                    MasterPass.client.checkout({
                                        "requestToken": data.requestToken,
                                        "callbackUrl": data.callbackUrl,
                                        "merchantCheckoutId": data.merchantCheckoutId,
                                        "allowedCardTypes": data.allowedCardTypes,
                                        "suppressShippingAddressEnable": true,
                                        "loyaltyEnabled": false,
                                        "requestBasicCheckout": false,
                                        "version": "v6",
                                        "failureCallback": masterpassFailed,
                                        "cancelCallback": masterpassCancelled,
                                        "successCallback": masterpassSuccess
                                    });
                                }, 1000);
                            }
                        });
                }
            });

        function masterpassFailed(data) {
            var pageLoadPrompt = document.getElementById("pageLoadPrompt");
            if (pageLoadPrompt) {
                window.PageAnimation_End();
            }
            //show page and let them pick another payment method
            alert("Masterpass failed to load: " + JSON.stringify(data));
        }

        function masterpassCancelled() {
            var pageLoadPrompt = document.getElementById("pageLoadPrompt");
            if (pageLoadPrompt) {
                window.PageAnimation_End();
            }
            //show page and let them pick another payment method
            console.log("Masterpass cancelled by user.");
        }

        function masterpassSuccess(data) {
            console.log("Masterpass payment success.");
            //set hidden field values
            $("#" + masterPassConfig.authVerifierHiddenFieldId).val(data.oauth_verifier);
            $("#" + masterPassConfig.checkoutResourceUrlHiddenFieldId).val(data.checkout_resource_url);
            $("#" + masterPassConfig.authTokenHiddenFieldId).val(data.oauth_token);
            //submit form
            $("#" + masterPassConfig.formToPostId).submit();
        }
    }

    this.setUpMasterPassV7 = function (masterPassConfig) {
        //add click event to call initialization at our server before opening lightbox.
        $("#" + masterPassConfig.masterPassClickedId).on("click",
            function () {
                //try to load a progress overlay
                var pageLoadPrompt = document.getElementById("pageLoadPrompt");
                if (pageLoadPrompt) {
                    window.PageAnimation_Start();
                }
                //we can load the masterpass lightboxurl anytime
                console.log("Loading Masterpass SDK");
                $.getScript(masterPassConfig.masterPassLightboxUrl)
                    .done(function () {
                        console.log("Masterpass SDK loaded successfully.");
                    })
                    .fail(function () {
                        if (pageLoadPrompt) {
                            window.PageAnimation_End();
                        }
                        /* boo, fall back to something else */
                        alert('Masterpass is currently unavailable.  Please pick a different payment method.');
                    });

                if (validationFunction()) {
                    console.log("Form validated successfully.  Initializing Masterpass.");
                    //Initialize MasterPass
                    var formSerialized = $("#" + masterPassConfig.formToPostId).serialize();
                    $.post(masterPassConfig.masterPassInitializationUrl,
                        {
                            paymentAmount: $("#" + paymentAmountId).val(),
                            formValues: formSerialized
                        },
                        function (data) {
                            if ((typeof (data) === "string") && (data.indexOf("Error") !== -1)) {
                                if (pageLoadPrompt) {
                                    window.PageAnimation_End();
                                }
                                console.log(data);
                            } else {
                                window.setTimeout(function () {
                                    if (pageLoadPrompt) {
                                        window.PageAnimation_End();
                                    }
                                    //call lightbox
                                    console.log("Masterpass trying to open lightbox.");
                                    console.log("Callback Url:  " + data.callbackUrl);
                                    console.log("Data.CartId: " + data.cartId);

                                    // Invoke below javascript method

                                    //"callbackUrl": data.callbackUrl                    // The URL to which the browser must redirect when checkout is complete
                                    masterpass.checkout({
                                        "checkoutId": data.merchantCheckoutId,              // Merchant checkout identifier received when merchant onboarded for masterpass
                                        "allowedCardTypes": ["master,amex,diners,discover,jcb,maestro,visa"],          // Card types accepted by merchant
                                        "amount": data.paymentAmount,                       // Shopping cart subtotal
                                        "currency": "USD",                                  // Currency code for cart
                                        "suppressShippingAddressEnable": true,
                                        "suppress3Ds": true,                                // Set true when 3DS not mandatory for the spcecific country
                                        "suppressShippingAddress": true,                    // Set true when cart items has digital goods only
                                        "cartId": data.cartId,                              // Unique identifier for cart generated by merchant
                                        "callbackUrl": data.callbackUrl
                                    });
                                }, 1000);
                            }
                        });
                }
            });
    }

    this.setUpVisaCheckout = function (visaCheckoutConfig) {
        //Create a div dynamically which is used to launch Visa Checkout LightboxUrl.
        var myDiv = document.createElement('div');
        myDiv.id = "launchVisaCheckoutLightbox";
        myDiv.className = "v-button";
        document.body.appendChild(myDiv);

        $("#" + visaCheckoutConfig.visaCheckoutClickedId).on("click",
            function () {
                var pageLoadPrompt = document.getElementById("pageLoadPrompt");
                if (pageLoadPrompt) {
                    window.PageAnimation_Start();
                }

                //we can load the Visa Checkout lightboxurl anytime
                console.log("Loading VISA Checkout SDK");
                $.getScript(visaCheckoutConfig.visaCheckoutLightboxUrl)
                    .done(function () {
                        window.setTimeout(function () {
                            //give script time to load and process
                            console.log("VISA Checkout SDK loaded successfully.");
                        }, 500);
                    })
                    .fail(function () {
                        /* boo, fall back to something else */
                        if (pageLoadPrompt) {
                            window.PageAnimation_End();
                        }
                        alert('Visa Checkout is currently unavailable.  Please pick a different payment method.');
                    });

                if (validationFunction()) {
                    console.log("Form validated successfully.  Initializing VISA Checkout.");
                    //Initialize MasterPass
                    $.post(visaCheckoutConfig.visaCheckoutInitializationUrl,
                        { paymentAmount: $("#" + paymentAmountId).val() },
                        function (data) {
                            console.log("VISA Checkout vps initialized successfully.");

                            if ((typeof (data) === "string") && (data.indexOf("Error") !== -1)) {
                                if (pageLoadPrompt) {
                                    window.PageAnimation_End();
                                }
                                console.log(data);
                            } else {
                                //initialize lightbox
                                window.setTimeout(function () {
                                    (function onVisaCheckoutReady() {
                                        V.init({
                                            apikey: data.apiKey,
                                            settings: {
                                                displayName: "payUSAtax",
                                                dataLevel: "FULL",
                                                logoUrl: data.logoUrl,
                                                shipping: {
                                                    collectShipping: "false"
                                                }
                                            }
                                        });
                                        V.on("payment.success",
                                            function (payment) {
                                                if (pageLoadPrompt) {
                                                    window.PageAnimation_End();
                                                }
                                                console.log("VISA Checkout payment.success");
                                                var paymentData = JSON.stringify(payment);
                                                $("#" + visaCheckoutConfig.visaCheckoutPaymentDataHiddenFieldId)
                                                    .val(paymentData);
                                                //submit form
                                                $("#" + visaCheckoutConfig.formToPostId).submit();
                                            });
                                        V.on("payment.cancel",
                                            function (payment) {
                                                if (pageLoadPrompt) {
                                                    window.PageAnimation_End();
                                                }
                                                //They can return to this page if they cancel and select another
                                                //payment method
                                                console.log("VISA Checkout payment.cancel.");
                                            });
                                        V.on("payment.error",
                                            function (payment, error) {
                                                if (pageLoadPrompt) {
                                                    window.PageAnimation_End();
                                                }
                                                alert("Error: " + JSON.stringify(error));
                                                //If there is an error they can return to this page and select
                                                //another payment method -- should we hide visa checkout button?

                                            });
                                    })();

                                    //call lightbox - highjack authorize of visa checkout
                                    $("#launchVisaCheckoutLightbox").click();
                                },
                                    1000);
                            }
                        });
                }
            });

    }

    this.setUpPayPal = function (payPalConfig) {
        $("#" + payPalConfig.payPalClickedId).on("click",
            function () {
                var pageLoadPrompt = document.getElementById("pageLoadPrompt");
                if (pageLoadPrompt) {
                    window.PageAnimation_Start();
                }

                var futurePay = false;
                if ($("#" + payPalConfig.isFuturePayId).is(":checked")) {
                    futurePay = true;
                }
                if (validationFunction()) {
                    console.log("Form validated successfully.  Initializing PayPal.");

                    $.getJSON(payPalConfig.payPalInitizationUrl,
                        { paymentAmount: $("#" + paymentAmountId).val(), taxPayerIdentification: $("#" + payPalConfig.taxPayerId).val(), isFuturePay: futurePay },
                        function (data) {
                            if (data === "OK") {
                                $("#" + payPalConfig.formToPostId)
                                    .attr("action", payPalConfig.formNameToSubmit + "?btnSubmit=PayPal");
                                console.log("Paypal vps initialization success.  Posting form.");

                                if (pageLoadPrompt) {
                                    window.PageAnimation_End();
                                }

                                $("#" + payPalConfig.formToPostId).submit();
                            } else {
                                alert(data);
                            }
                        }
                    );
                }
            });
    }

    this.setUpAmexMove = function (amexMoveConfig) {
        $("#" + amexMoveConfig.amexMoveClickedId).on("click",
            function (e) {
                var pageLoadPrompt = document.getElementById("pageLoadPrompt");
                if (pageLoadPrompt) {
                    window.PageAnimation_Start();
                }

                if (validationFunction()) {
                    //Initialize American Express
                    console.log("Form validated successfully.  Initializing AMEX Move.");
                    var formSerialized = $("#" + amexMoveConfig.formToPostId).serialize();
                    $.post(amexMoveConfig.amexMoveInitializationUrl,
                        {
                            paymentAmount: $("#" + paymentAmountId).val(),
                            formValues: formSerialized
                        },
                        function (data) {
                            console.log("AMEX Move was initialized successfully.");

                            if ((typeof (data) === "string") && (data.indexOf("Error") !== -1)) {
                                if (pageLoadPrompt) {
                                    window.PageAnimation_End();
                                }

                                console.log(data);
                            } else {
                                $("#" + amexMoveConfig.amexMoveRequestId).val(data.requestId);
                                //console.log("CliendId: " + data.clientId);
                                //console.log("requestId: " + data.requestId);
                                //console.log("env: " + data.environment);
                                console.log("encrypted_data: " + data.encryptedData);

                                window.amexMoveResponse = function (response) {
                                    $("#" + amexMoveConfig.amexMoveResponse).val(response.enc_data);

                                    if (response.error_msg) {
                                        $("#" + amexMoveConfig.amexMoveErrorMessage).val(response.error_msg);
                                    }

                                    if (response.status && response.status !== 'error') {
                                        $("#" + amexMoveConfig.formToPostId).submit();
                                    }
                                }

                                $("#" + amexMoveConfig.amexMoveStaticImage).hide();

                                var achJsonVal = 'var amex_ach = { "client_id": "' +
                                    data.clientId +
                                    '", "env": "' +
                                    data.environment +
                                    '", "market": "US", "callback": "amexMoveResponse", "encrypted_data": "' +
                                    data.encryptedData +
                                    '"	}; ';
                                console.log("achJson: " + achJsonVal);

                                var scriptTagJson = document.createElement("script");
                                scriptTagJson.text = achJsonVal;
                                scriptTagJson.type = "application/javascript";
                                $("#achJson").html(scriptTagJson);

                                //"https://qicm.americanexpress.com/Internet/IMDC/achplus/js/ACHPlus.js"
                                var scriptTagSdkACH = document.createElement("script");
                                scriptTagSdkACH.src = amexMoveConfig.amexMoveSdk;
                                //scriptTagSdkACH.src = "https://qicm.americanexpress.com/Internet/IMDC/achplus/js/ACHPlus.js";
                                document.body.appendChild(scriptTagSdkACH);

                                setTimeout(function () {
                                    console.log("Calling AMEX Move SDK");
                                    if (pageLoadPrompt) {
                                        window.PageAnimation_End();
                                    }
                                    $amexmove.ach.authorize();
                                },
                                    3000);
                            }
                        });
                }
            });
    }

    this.setUpAmexExpressCheckout = function (amexExpressConfig) {
        $("#" + amexExpressConfig.amexExpressCheckoutClickedId).on("click",
            function (e) {
                var pageLoadPrompt = document.getElementById("pageLoadPrompt");
                if (pageLoadPrompt) {
                    window.PageAnimation_Start();
                }

                if (validationFunction()) {
                    //Initialize American Express
                    console.log("Form validated successfully.  Initializing AMEX Express Checkout.");
                    $.post(amexExpressConfig.amexExpressInitializationUrl,
                        { paymentAmount: $("#" + paymentAmountId).val() },
                        function (data) {
                            console.log("AMEX Express Checkout vps initialized successfully.");

                            if ((typeof (data) === "string") && (data.indexOf("Error") !== -1)) {
                                if (pageLoadPrompt) {
                                    window.PageAnimation_End();
                                }

                                console.log(data);
                            } else {
                                $("#" + amexExpressConfig.amexExpressStaticImageId).hide();

                                window.aec_init = {
                                    "client_id": data.clientId,
                                    "request_id": data.requestId,
                                    "theme ": "desktop",
                                    "button_color": "dark",
                                    "action": "checkout",
                                    "locale": data.locale,  //"en_US" or "en_ES"
                                    "country": "US",
                                    "callback": "aec_callback_handler",
                                    "env": data.environment,  //"qa" or "production"
                                    "dialog_type": "popup",
                                    "button_type": "standard",
                                    "disable_btn": "false"
                                }

                                window.aec_callback_handler = function (response) {
                                    $("#" + amexExpressConfig.amexExpressPaymentDataHiddenFieldId).val(response.enc_data);
                                    $("#" + amexExpressConfig.formToPostId).submit();
                                }

                                $.getScript(amexExpressConfig.amexExpressLightboxUrl)
                                    .done(function () {
                                        console.log("AMEX script loaded successfully!");
                                        window.setTimeout(function () {
                                            //Call the AMEX Authorize method
                                            if (pageLoadPrompt) {
                                                window.PageAnimation_End();
                                            }

                                            console.log("Calling AMEX SDK");
                                            window.$amex.aec.authorize();
                                        }, 500);
                                    })
                                    .fail(function () {
                                        /* boo, fall back to something else */
                                        if (pageLoadPrompt) {
                                            window.PageAnimation_End();
                                        }

                                        alert('AMEX Express Checkout is currently unavailable.  Please pick a different payment method.');
                                    });
                            }
                        });
                }
            });
    }
}



