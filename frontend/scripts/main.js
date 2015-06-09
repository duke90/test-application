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
        }
    }
};

Application.validateInputs = function() {
    var inputs = $('form input');
    var messageContainer = $('#response-container .message').empty();
    var isEmail = function(email) {
        var emailReg = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        
        return emailReg.test(email);
    }
    
    for (var i = 0; i < inputs.length; i++) {
        var current = $(inputs[i]);
        
        if ( current.attr('required') && !current.val() ) {
            current.addClass('warning');
            messageContainer.append( $('<p>').html(Application.config.errorMessages[current.attr('name')].empty) );
            messageContainer.parent().show();
        }
        
        if ( (current.attr('type') == 'email') && !isEmail(current.val()) ) {
            current.addClass('warning');
            messageContainer.append( $('<p>').html(Application.config.errorMessages[current.attr('name')].invalid) );
            messageContainer.parent().show();
        }
        
        if ( (current.attr('name') == 'birthdate') && current.val() ) {
            var dateFormatReg = /^(([0-9][0-9]-){2}([0-9]){4})$/;
            var value = current.val();
            
            dateFormatReg.test(value)
            
            // TODO: use this lib because html datepcker and input field is a big shit
            // http://dbushell.github.io/Pikaday/
            
            
            
            console.log(current.val());
            console.log(new Date(current.val()));
        }
        
    }
    
    //return {err: err, values: values};
};

Application.start = function() {
    var okButton = $('#ok-button').click(function() {
        Application.validateInputs();
    });
    
    var inputs = $('form input').focus(function() {
        $('#response-container').hide();
        $('form input.warning').removeClass('warning');
        
    });
    
    var datePicker = $()
};
