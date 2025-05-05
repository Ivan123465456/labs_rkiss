var HOST = 'http://web-app.api-web-tech.local';
var TOKEN = ''; 


    document.getElementById("zareg").addEventListener("click", function() {
        var name = document.querySelector('[name=first_name]').value.trim();
        var surname = document.querySelector('[name=last_name]').value.trim();
        var email = document.querySelector('[name=email]').value.trim();
        var password = document.querySelector('[name=password]').value.trim();

        document.getElementById('message').textContent = "";

        if (!name || !surname || !email || !password) {
            document.getElementById('message').textContent = "Пожалуйста, заполните все поля.";
            return;
        }

        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            document.getElementById('message').textContent = "Пожалуйста, введите корректный адрес электронной почты.";
            return;
        }

       

        var request_data = new FormData();
        request_data.append('first_name', name);
        request_data.append('last_name', surname);
        request_data.append('email', email);
        request_data.append('password', password);

        var request = new XMLHttpRequest();
        var url = HOST + '/registration'; 
        request.open('POST', url, true);
        request.send(request_data);
        request.onreadystatechange = function() {
            if (request.readyState === XMLHttpRequest.DONE) {
                if (request.status === 403) {
                    document.getElementById('message').textContent = "Доступ запрещен (403)";
                } else if (request.status === 404) {
                    document.getElementById('message').textContent = 'Ресурс не найден (404)';
                } else if (request.status === 422) {
                    document.getElementById('message').textContent = 'Запрос получен, но не может быть обработан (422).';
                } else if (request.status === 200) {
                    document.getElementById('message').textContent = "Регистрация успешна!";
                } else {
                    document.getElementById('message').textContent = "Произошла ошибка. Пожалуйста, попробуйте позже.";
                }
            }
        };
    });

    




    document.getElementById("avto").addEventListener("click", function() {
        const email = document.querySelector('[name=email]').value.trim();
        const password = document.querySelector('[name=password]').value.trim();

        let formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        let request = new XMLHttpRequest();
        let url = HOST + '/authorization'; 
        request.open('POST', url, true);
        
        request.onreadystatechange = function() {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    TOKEN = JSON.parse(request.responseText); 
                    
                } else if (request.status === 401) {
                    document.getElementById('message').textContent = "Несанкционированный доступ!";
                } else if (request.status === 404) {
                    document.getElementById('message').textContent = 'Ресурс не найден (404)'; 
                } else {
                    document.getElementById('message').textContent = 'Ошибка авторизации'; 
                }
            }
        };
        
        request.send(formData);
    });
