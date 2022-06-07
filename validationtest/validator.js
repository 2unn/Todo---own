
// Doi tuong `Validator`
function Validator(options) {

    function getParent (element, selector) {
        while(element.parentElement) {
            if(element.parentElement.matches(selector)){
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }
    
    
   var selectorRules = {};
    

    //Xử lí in ra thông báo lỗi
    function validate (inputElement,rule) {
        var getParentElement = getParent(inputElement, options.formGroupSelector)
        var errorElement = getParentElement.querySelector(options.errorSelector);
        var errorMessage;
        

        //Lấy qua các rule của từng Seclector
        var rules = selectorRules[rule.selector]

        //Check rules
        for (var i = 0; i < rules.length; i++) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if (errorMessage) break;
        }    


         if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParentElement.classList.add('invalid');
         }else{
            errorElement.innerText = '';
            getParentElement.classList.remove('invalid');
             }

        return !errorMessage;
    }

    //Bỏ lỗi khi người dùng nhập
    function oninput (inputElement) {
        var getParentElement = getParent(inputElement, options.formGroupSelector)
        var errorElement = getParentElement.querySelector(options.errorSelector);
            errorElement.innerText = '';
            getParentElement.classList.remove('invalid');
    }

    // Lấy element của form 
    var formElement = document.querySelector(options.form)
    if (formElement) {
        
        formElement.onsubmit = (e) => {
            e.preventDefault();

            var isFromValid = true;


            //Lặp qua từng rule và vaildate
            options.rules.forEach( (rule) => {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);

                if(!isValid) {
                    isFromValid = false;
                }
            });

            if (isFromValid) {
                if (typeof options.onSubmit === 'function') {

                    var enableInput = formElement.querySelectorAll('[name]')

                    var fromValues = Array.from(enableInput).reduce(function (values, input) {
                        
                        switch (input.type){
                            case 'checkbox':
                                if(!input.matches(':checked')) {
                                    values[input.name] = '';
                                    return values;
                                } 
                                if(!Array.isArray(values[input.name])){
                                    values[input.name] = [];
                                }

                                values[input.name].push(input.value)
                                
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                break;
                            case 'file':
                                values[input.name] = input.files
                                break;
                            default:
                                values[input.name] = input.value;
                        }

                        return  values;
                    }, {})
                    

                    options.onSubmit(fromValues)
                }
            }
        }

        // Xử lí lặp qua các rules
        options.rules.forEach(rule => {

            //Lưu lại các rules 
           if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
           }else{
                selectorRules[rule.selector] = [rule.test];
           }

            
            //Lấy inputElement
            var inputElements = formElement.querySelectorAll(rule.selector);
            Array.from(inputElements).forEach(inputElement => {
                if (inputElement) {
                    //Xử lý trường hợp blur khỏi input
                    inputElement.onblur = function () {
                        validate(inputElement, rule)
                    }
                    //Xử lý mỗi khi người dùng nhập
                    inputElement.oninput = () => {
                            oninput(inputElement)
                    }
                }
            })

           
        });
        
    }
}




// Dinh nghia rules
// Nguyên tắc của các rules

Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            if(value === null || value === undefined){
                return 'Vui lòng nhập'
                
            }else{
                return value? undefined : 'Vui lòng nhập'
            }
            
            
        }
    }
}

Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            if (value.trim()) {
                return regex.test(value) ? undefined : 'Email chưa đúng'
            }
        }
    }
}

Validator.minLength = function(selector,min){
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự`
        }
    }

}

Validator.isConfirmed = function (selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị không trùng khớp'
        }
    }
}