(function () {
    console.log("jqueryvalidationrules.js");
    function stripHtml(value) {
        // remove html tags and space chars
        return value.replace(/<.[^<>]*?>/g, ' ').replace(/&nbsp;|&#160;/gi, ' ')
            // remove punctuation
            .replace(/[.(),;:!?%#$'"_+=\/\-]*/g, '');
    }

    $.validator.addMethod("maxWords", function (value, element, params) {
        return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length <= params;
    }, jQuery.validator.format("Please enter {0} words or less."));

    $.validator.addMethod("minWords", function (value, element, params) {
        return this.optional(element) || stripHtml(value).match(/\b\w+\b/g).length >= params;
    }, jQuery.validator.format("Please enter at least {0} words."));

    $.validator.addMethod("rangeWords", function (value, element, params) {
        var valueStripped = stripHtml(value);
        var regex = /\b\w+\b/g;
        return this.optional(element) || valueStripped.match(regex).length >= params[0] && valueStripped.match(regex).length <= params[1];
    }, jQuery.validator.format("Please enter between {0} and {1} words."));

    $.validator.addMethod("checkSelect", function (value, element, arg) {
        console.log("checkSelect validation");
        return arg !== value;
    }, "Please select a value.");

    $.validator.addMethod("alphaletters", function (value, element) {
        return this.optional(element) || /^[a-zA-Z]*$/i.test(value);
    }, "Letters only please");

    $.validator.addMethod("vpsCustomerNameValidation", function (value, element) {
        var result = this.optional(element) || /^\s+|[^A-Za-z '\\.,-]/.test(value);
        if (result === "dependency-mismatch") {
            return true;
        }
        return !result;
    }, "No leading spaces and only letters, commas (','), hyphens ('-'), periods ('.'), and apostrophe's (') are acceptable.");

    $.validator.addMethod("vpsBusinessNameValidation", function (value, element) {
        var result = this.optional(element) || /^\s+|[^A-Za-z0-9' \\.&!,-]/.test(value);
        if (result === "dependency-mismatch") {
            return true;
        }
        return !result;
    }, "No leading spaces and only letters, numbers, commas (','), hyphens ('-'), periods ('.'), apostrophe\'s ('), ampersand (&), and exclamation marks ('!') are acceptable.");

    $.validator.addMethod("nonUsPostalCodeValidation", function (value, element) {
        return this.optional(element) || /^[a-zA-Z0-9]+([ ]?[a-zA-Z0-9\-\.\,\'])*$/.test(value);
    }, "No leading or consecutive spaces and only letters, commas (,), hyphens (-), periods (.), and apostrophe\'s (\') are acceptable.");

    $.validator.addMethod("vpsSuffixValidation", function (value, element) {
        var result = this.optional(element) || /^\s+|[^A-Za-z0-9'.,-]/.test(value);
        if (result === "dependency-mismatch") {
            return true;
        }
        return !result;
    }, "No leading, consecutive, or trailing spaces and only letters, numbers, periods (.), hyphens (-) and apostrophe's (') are acceptable.");

    $.validator.addMethod("vpsAddressValidation", function (value, element) {
        var result = this.optional(element) || /^\s+|[^A-Za-z0-9' ./#,-]/.test(value);
        if (result === "dependency-mismatch") {
            return true;
        }
        return !result;
    }, "No leading spaces and only letters, numbers, commas (,), hyphens (-), periods (.), forward slashes (/), pound signs (#),  and apostrophe's (') are acceptable.");

    $.validator.addMethod("vpsCityValidation", function (value, element) {
        var result = this.optional(element) || /^\s+|[^A-Za-z' ./,-]/.test(value);
        if (result === "dependency-mismatch") {
            return true;
        }
        return !result;
    }, "No leading or consecutive spaces and only letters, commas (,), hyphens (-), periods (.), forward slashes (/), and apostrophe's (') are acceptable.");

    $.validator.addMethod("vpsTownValidation", function (value, element) {
        var result = this.optional(element) || /^\s+|[^A-Za-z0-9' ./,-]/.test(value);
        if (result === "dependency-mismatch") {
            return true;
        }
        return !result;
    }, "No leading or consecutive spaces and only letters, numbers, commas (,), hyphens (-), periods (.), forward slashes (/), and apostrophe's (') are acceptable.");

    $.validator.addMethod("nonUsPostalCode", function (value, element) {
        var result = this.optional(element) || /^\s+|[^A-Za-z0-9-]/.test(value);
        if (result === "dependency-mismatch") {
            return true;
        }
        return !result;
    }, "No leading or consecutive spaces and only letters, numbers, and hyphens (-) are acceptable.");

    $.validator.addMethod("consecutiveSpaces", function (value, element) {
        var result = this.optional(element) || /  +/g.test(value);
        if (result === "dependency-mismatch") {
            return true;
        }
        return !result;
    }, "No consecutive spaces");

    $.validator.addMethod("alphaletterswithspaces", function (value, element) {
        return this.optional(element) || /^[a-zA-Z ]*$/i.test(value);
    }, "Letters and spaces only please");

    $.validator.addMethod("alphanumeric", function (value, element) {
        return this.optional(element) || /^[a-zA-Z0-9]*$/i.test(value);
    }, "Letters and numbers only please");

    $.validator.addMethod("numbersWithCommas", function (value, element) {
        return this.optional(element) || /^(\d+|\d{1,3}(,\d{3})*)(\.\d+)?$/.test(value);
    }, "Numbers with commas only");

    $.validator.addMethod("alphanumericwithspaces", function (value, element) {
        return this.optional(element) || /^[a-zA-Z0-9 ]*$/i.test(value);
    }, "Letters and numbers only please");

    $.validator.addMethod("validUsPhoneNumber", function (value, element) {
        var invalidPrefixNumbers = ["000", "001", "411", "611", "711", "900", "911"];

        if (invalidPrefixNumbers.indexOf(value.substr(0, 3)) > 0) {
            return false;
        }

        return this.optional(element) || /^[01]?[- .]?(\([2-9]\d{2}\)|[2-9]\d{2})[- .]?\d{3}[- .]?\d{4}$/i.test(value);
    }, "Please enter a valid Phone Number, using only numbers.");

    $.validator.addMethod("amountMin", function (value, element) {
        if (value === '') {
            return false;
        }

        //make sure it is greater than a 1.00
        var testValue = value;
        testValue *= 1;
        if (testValue < 1.00) {
            return false;
        }

        return true;
    }, "Please enter the payment amount in dollars and cents (only numbers and a decimal are accepted). Field length should be 11 max. A minimum amount of $1.00 is allowed.");

    $.validator.addMethod("paymentamountMax", function (value, element) {
        //split the string so we have cents
        var moneyparts = value.split('.');
        //convert parts to integer
        var cents = 0;
        var dollars = 0;

        if (moneyparts.length === 1) {
            dollars = moneyparts[0];
            dollars *= 1;
        }
        if (moneyparts.length === 2) {
            cents = moneyparts[1];
            cents *= 1;
            dollars = moneyparts[0];
            dollars *= 1;
        } else if (moneyparts.length > 2) {
            //invalid format
            return false;
        }
        
        //check if we are at maximum whole value amount
        if (dollars === 10000000) {
            //check if we are a penny over and if so return false
            if (cents > 0) {
                return false;
            }
        } else if (dollars > 10000000) {
            return false;
        }

        return true;
    }, "Please enter the payment amount in dollars and cents (only numbers and a decimal are accepted). Field length should be 11 max. A minimum amount of $1.00 is allowed.");

    $.validator.addMethod("valueNotEquals", function (value, element, arg) {
        return arg !== value;
    }, "Value must not equal arg.");

    $.validator.addMethod("NotEqualTo", function (value, element) {
        return $('#SpouseSocialSecurityNumber').val() != $('#SocialSecurityNumber').val()
    }, "Spouse Social Security Number cannot be same as Primary Social Security Number.");
    
    $.validator.addMethod("validEIN", function (value, element) {
        if (value === '')
            return true;

        var arrayOfInvalidValues = [
            "00", "07", "08", "09", "17", "18", "19", "28", "29", "49",
            "78", "79", "89"
        ];

        if (arrayOfInvalidValues.indexOf(value.substr(0, 2)) > 0) {
            return false;
        }

        return true;
    }, "Valid EIN.");


    jQuery.validator.addMethod("validEmail", function (value, element) {
        if (value == '')
            return true;
        var temp1;
        temp1 = true;
        var ind = value.indexOf('@');
        var str2 = value.substr(ind + 1);
        var str3 = str2.substr(0, str2.indexOf('.'));
        if (str3.lastIndexOf('-') == (str3.length - 1) || (str3.indexOf('-') != str3.lastIndexOf('-')))
            return false;
        var str1 = value.substr(0, ind);
        if ((str1.lastIndexOf('_') == (str1.length - 1)) || (str1.lastIndexOf('.') == (str1.length - 1)) || (str1.lastIndexOf('-') == (str1.length - 1)))
            return false;
        str = /(^[a-zA-Z0-9]+[\._-]{0,1})+([a-zA-Z0-9]+[_]{0,1})*@([a-zA-Z0-9]+[-]{0,1})+(\.[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,3})$/;
        temp1 = str.test(value);
        return temp1;
    }, "Please enter valid email.");


    $.validator.addMethod("validPassword", function (value, element) {
        var regexString = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{7,16}$/g;
        return this.optional(element) || regexString.test(value);
    }, "Please enter a valid password.  The password must be a minimum of 7 characters and must contain a Capital letter, and a number and a special character. No spaces are allowed");


}());


