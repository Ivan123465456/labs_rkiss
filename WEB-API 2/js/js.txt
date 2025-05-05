//#region Константы

const host = "http://web-app.api-web-tech.local"
const context = _elem('.content')

//#endregion

var token = ''
var files_table = ''
var edit_id = ''
var edit_name = ''

//#region Функции-комбайны
function _elem(selector) {
    return document.querySelector(selector)
}

function _get(params, callback) {
    let xhr = new XMLHttpRequest ();
    xhr.open('GET',params.url)
    xhr.send()

    xhr.onreadystatechange = function() {
        if(xhr.readyState==4){
            callback(xhr.responseText)
        }
    }
}

function _post(params, callback) {
    let xhr = new XMLHttpRequest ();
    xhr.open('POST',params.url)
    xhr.send(params.data)

    xhr.onreadystatechange = function() {
        if(xhr.readyState==4){
            callback(xhr.responseText)
        }
    }
}

function _load(url, c, callback) {
    let xhr = new XMLHttpRequest ();
    xhr.open('GET', url)
    xhr.send()
    
    console.log(c)
    xhr.onreadystatechange = function() {
        if(xhr.readyState==4){http://127.0.0.1:3000/i.html
            c.innerHTML = xhr.responseText;
            if (callback){
                callback()
            }
        }
    }
}
//#endregion

_load('/modules/authorization.html', context, onLoadAuth)

function onLoadAuth() {
    _elem('.go-register').addEventListener('click', function(){
        _load('/modules/registration.html', context, onLoadReg)
    })
    _elem('.authorize').addEventListener('click', function(){
        let request_data = new FormData();
        request_data.append('email', _elem('input[name="email"]').value);
        request_data.append('password', _elem('input[name="password"]').value)

        _post({url: `${host}/authorization/`, data: request_data}, function(response) {
            response = JSON.parse(response);
            console.log(response);
            
            if (response.success==true) {
                token = response.token;
                _load('/modules/profile.html', context, onLoadProfile);
            } else {
                _elem('.callback').innerHTML = 'Login failed';
            }
        })
    })
}

function onLoadReg() {
    _elem('.register').addEventListener('click', function(){
        let register_data = new FormData();
        register_data.append('first_name', _elem('input[name="first_name"]').value);
        register_data.append('last_name', _elem('input[name="last_name"]').value)
        register_data.append('email', _elem('input[name="email"]').value);
        register_data.append('password', _elem('input[name="password"]').value)

        _post({url: `${host}/registration/`, data: register_data}, function(response){
            response = JSON.parse(response);
            console.log(response);

            if (response.success) {
                token = response.token;
                _load('/modules/profile.html', context, onLoadProfile);
            } else {
                _elem('.callback').innerHTML = 'Registration failed';
            }
        })
    })
}

function onLoadProfile() {
    _elem('.btn-upload-file').addEventListener('click', function(){
        _load('/modules/upload.html', context, onLoadUpload)
    })
    let profileData = new FormData();
    profileData.append('token', token)
    _post ({url: `${host}/disk`, data: profileData}, function(response){
        // console.log(response)
        files_table=JSON.parse(response);
        
        var table = _elem('tbody')      // Получили тело таблицы до начала цикла
        for (u=0; u<files_table.length; u++) {
            const element = files_table[u];
                

                

            let row = document.createElement('tr')      // Создаем строку таблицы
            let id = document.createElement('td')       // Создаем ячейку таблицы для id
            id.textContent = element.file_id            // Задаем значение ячейки id
            row.append(id)                              // Добавлем ячейку id в строку таблицы
            
            let name = document.createElement('td')
            name.textContent = element.name
            row.append(name)

            let download = document.createElement('td')
            let dow_link = document.createElement('a')
            dow_link.setAttribute('href', `${host}${element.url}`)
            dow_link.setAttribute('download', `${host}${element.file_id}`)
            dow_link.textContent = 'Скачать'
            download.append(dow_link)
            row.append(download)
            
            let delete_file = document.createElement('td')
            let del_btn = document.createElement('button')
            del_btn.setAttribute('href', `${host}${element.url}`)
            del_btn.addEventListener('click', function (){
                let del_data = new FormData()
                del_data.append('id_file', element.file_id)
                del_data.append('token', token)

                _post ({url:`${host}/delete`, data: del_data},function(){
                    _load('/modules/profile.html', context, onLoadProfile)
                })
            })
            del_btn.textContent = 'Удалить'
            delete_file.append(del_btn)
            row.append(delete_file)

            let edit_file = document.createElement('td')
            let edit_btn = document.createElement('button')
            edit_btn.setAttribute('href', `${host}${element.url}`)
            edit_btn.addEventListener('click', function(){
                edit_id = element.file_id
                edit_name = element.name
                _load('/modules/edit.html',context, onloadEdit)
            })
            edit_btn.textContent = 'Изменить'
            edit_file.append(edit_btn)
            row.append(edit_file)

            let edit_rights = document.createElement('td')
            let edac_btn = document.createElement('button')
            edac_btn.addEventListener('click', function(){
                edit_id = element.file_id
                edit_name = element.name
                _load('/modules/accesses.html', context, onLoadEdac)
            })
            edac_btn.textContent = 'Изменить права'
            edit_rights.append(edac_btn)
            row.append(edit_rights)

            table.append(row)
            
    
        }


    })


}

function onLoadUpload() {
    _elem('.btn-to-disk').addEventListener('click', function(){
        _load('/modules/profile.html', context, onLoadProfile);
    })
    _elem('.upload-files').addEventListener('click', function(){
        
        for (let i = 0; i < _elem('input[name="files"]').files.length; i++) {
            const element = _elem('input[name="files"]').files[i];
            
       
            console.log(element);

            let uploadData = new FormData();
            uploadData.append('files', element)
            uploadData.append('token', token)
    
            _post ({url: `${host}/upload/`,data: uploadData}, function(response){
                response = JSON.parse(response);
                console.log(response);
            
                
            })

        }
    })

    let upload_table = _elem('tbody')
    for (u=0; u<files_table.length; u++) {
        const element = files_table[u];


        let row = document.createElement('tr')
        let name = document.createElement('td')
        name.textContent = element.name
        row.append(name)
        
        let upload_status = document.createElement('td')
        upload_status.textContent = 'Успешно загружен'
        row.append(upload_status)

        let download_file = document.createElement('td')
        download_file.textContent = ''
        row.append(download_file)

        upload_table.append(row)
        

    }


}

function onloadEdit() {
    let table = _elem('tbody')
    let row = document.createElement('tr')
    let id = document.createElement('td')
    id.textContent = edit_id
    row.append(id)

    let name = document.createElement('td')
    name.textContent = edit_name
    row.append(name)

    table.append(row)
    
    _elem('.editFile').addEventListener('click', function(){
        let edit_data = new FormData()
        edit_data.append('name', _elem('input[name=edit]').value)
        edit_data.append('id_file', id.textContent)
        edit_data.append('token', token)

        _post({url: `${host}/edit`, data: edit_data}, function(){
            _load('/modules/profile.html', context, onLoadProfile)
        })
    })
}

function onLoadEdac() {
    let table = _elem('tbody')
    let row = document.createElement('tr')
    let id = document.createElement('td')
    id.textContent = edit_id
    row.append(id)

    let name = document.createElement('td')
    name.textContent = edit_name
    row.append(name)

    table.append(row)

    _elem('.edit-access').addEventListener('click', function(){
        let edac_data = new FormData()
        edac_data.append('id_file', edit_id)
        edac_data.append('email', _elem('input[name=edac]').value)
        edac_data.append('token', token)

        _post({url: `${host}/accesses`, data:edac_data}, function(response){
            response=JSON.parse(response)
        })
    })
    _elem('.share').addEventListener('click', function(){
        let share_data = new FormData()
        share_data.append('token', token)

        _post({url: `${host}/shared`, data: share_data}, function(response){
            response= JSON.parse(response)
        })
    })
    _elem('.delete-access').addEventListener('click', function(){
        let edac_data = new FormData()
        edac_data.append('id_file', edit_id)
        edac_data.append('email', _elem('input[name=edac]').value)
        edac_data.append('token', token)

        _post({url: `${host}/deleteaccesses`, data:edac_data}, function(response){
            
        })
    })
}

