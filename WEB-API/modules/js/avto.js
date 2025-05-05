document.addEventListener('DOMContentLoaded', function() {
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const messageDiv = document.getElementById('message');
    const authButton = document.getElementById('avto');
    const regButton = document.getElementById('zareg');

    
    function isValidEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

 
    authButton.addEventListener('click', function() {
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        
        messageDiv.textContent = '';
    
        if (!email || !password) {
            messageDiv.textContent = 'Все поля обязательны для заполнения';
            return;
        }
        
        if (!isValidEmail(email)) {
            messageDiv.textContent = 'Пожалуйста, введите корректный email';
            return;
        }
        
      
        console.log('Попытка авторизации:', { email, password });
        
       
        messageDiv.textContent = 'Выполняется вход...';
        setTimeout(() => {
            messageDiv.textContent = 'Неверный email или пароль'; 
        }, 1500);
    });

    regButton.addEventListener('click', function(){
        window.location.href='http://127.0.0.1:3002/modules/регистрация.html';
    })
});