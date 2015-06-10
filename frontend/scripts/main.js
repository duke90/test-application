var Application = {};

$(window).ready(function() {
    Application.start();
});

Application.config = {
    ajaxEndpoint: '/test/ajax',
    errorMessages: {
        username: {
            empty: 'Please add your name.',
        },
        useremail: {
            empty: 'Please fill in your galactic-mail address.',
            invalid: 'This email address is invalid.'
        },
        birthdate: {
            invalid: 'That cannot be a birthdate!',
            tooYoung: 'Unfortunately you are way too young for us!',
            noBorn: 'You cannot be from the future! Time travel is impossible!'
        }
    }
};

Application.validateInputs = function() {
    var inputs = $('form input');
    var messageContainer = $('#response-container .message').empty();
    var isEmail = function(email) {
        var emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        
        return emailReg.test(email);
    };
    var hasError = false;
    
    for (var i = 0; i < inputs.length; i++) {
        var current = $(inputs[i]);
        var errorMessage = Application.config.errorMessages[current.attr('name')];
        
        if ( current.attr('required') && !current.val() ) {
            current.addClass('warning');
            messageContainer.append( $('<p>').html(errorMessage.empty) );
            hasError = true;
        }
        
        if ( (current.attr('type') == 'email') && current.val() && !isEmail(current.val()) ) {
            current.addClass('warning');
            messageContainer.append( $('<p>').html(errorMessage.invalid) );
            hasError = true;
        }
        
        if ( current.hasClass('pickaday-datepicker') && current.val() ) {
            var value = current.val();
            var timestamp = Date.parse(value);

            if ( isNaN(timestamp) ) {
                current.addClass('warning');
                messageContainer.append( $('<p>').html(errorMessage.invalid) );
                hasError = true;
            } else {
                var timeDiff = Date.now() - timestamp;
                var diffDays = Math.round(timeDiff / (1000 * 3600 * 24)); 
                
                if ( diffDays < 1 ) {
                    current.addClass('warning');
                    messageContainer.append( $('<p>').html(errorMessage.noBorn) );
                    hasError = true;
                } else if ( diffDays < (18*365) ) {
                    current.addClass('warning');
                    messageContainer.append( $('<p>').html(errorMessage.tooYoung) );
                    hasError = true;
                }
            }
        }
    }
    
    return hasError && messageContainer.parent().show();
};

Application.getFormData = function(id) {
    var form = $('#' + id);
    var data = {};
    
    if (!id || !form.length) return;
    
    form.find('input').each(function(index) {
        var current = $(this);
        
        data[current.attr('name')] = current.val();
    });
    
    return data;
};

Application.postData = function(data) {
    var responseContainer = $('#response-container');
    
    $.post( Application.config.ajaxEndpoint + '/validate', data, function( response ) {
        if (response.status == 'OK') {
            $('#thanks-container').fadeIn().delay(2000).fadeOut();            
        } else {
            responseContainer.find('.message').html('Sorry but the data was incorrect. Go again.');
            responseContainer.fadeIn().delay(2000).fadeOut();
        }
    }, "json" ).fail(function() {
        responseContainer.find('.message').html('Something went wrong, please try again!');
        responseContainer.fadeIn().delay(2000).fadeOut();
    });
};

Application.start = function() {
    var okButton = $('#ok-button').click(function() {
        var isValidForm = !Application.validateInputs();
        
        if (isValidForm) {
            Application.postData( Application.getFormData('personal-info') );
            $('input').val('');
        }
    });
    
    var inputs = $('form input').focus(function() {
        $('#response-container').hide();
        $('form input.warning').removeClass('warning');
        
    });
    
    var datePicker = new Pikaday({
        field: $('#birthdate')[0],
        firstDay: 1,
        minDate: new Date('1900-01-01'),
        maxDate: new Date('2020-12-31'),
        yearRange: [1900,2020]
    });
};
