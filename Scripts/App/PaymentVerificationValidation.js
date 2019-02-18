(function () {
    $('#paymentVerificationForm').validate({
        rules: {
            LastPaymentAmount: {
                required: false,
                paymentamount: true
            },
            Last4Digits: {
                required: false,
                minlength: 4,
                maxlength: 4,
                digits: true
            },
            SocialSecurityNumber: {
                required: false,
                minlength: 9,
                maxlength: 9,
                digits: true,
                validSsn: true,
                validateTaxIdConsecutiveNumbers: true
            },
            EmployerIdentificationNumber: {
                required: false,
                digits: true,
                validateTaxIdLength: true,
                validateEmployerIdLength: true
            }
        },
        messages: {
            Last4Digits: {
                required: 'Please enter the last 4 digits of the credit card number',
                minlength: 'Please enter the last 4 digits of the credit card number',
                maxlength: 'Please enter the last 4 digits of the credit card number',
                digits: 'Please enter the last 4 digits of the credit card number'
            },
            SocialSecurityNumber: {
                required: 'Please enter the valid 9 digit Social Security Number or Individual Taxpayer Identification Number or Employer Identification Numberm.',
                minlength: 'Please enter the valid 9 digit Social Security Number or Individual Taxpayer Identification Number or Employer Identification Numberm.',
                maxlength: 'Please enter the valid 9 digit Social Security Number or Individual Taxpayer Identification Number or Employer Identification Numberm.',
                digits: 'Please enter the valid 9 digit Social Security Number or Individual Taxpayer Identification Number or Employer Identification Numberm.',
                validSsn: 'Please enter the valid 9 digit Social Security Number or Individual Taxpayer Identification Number or Employer Identification Numberm.'
            }
        }
    });

})();