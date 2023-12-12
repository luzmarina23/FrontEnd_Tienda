//funciones para operaciones crud del usuario
const urlApiArticle = "http://localhost:8088/articles";
const headersArticle= {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.token}`
};

function listarArticle(){
    validaToken();
    var settings={
        method: 'GET',
        headers: headersArticle,
    }
    fetch(urlApiArticle, settings)
    .then(response => response.json())
    .then(function(articles){
        
            var articulos = '';
            for(const article of articles){
                articulos += `
                <tr>
                    <th scope="row">${article.id}</th>
                    <td>${article.nameArticle}</td>
                    <td>${article.price}</td>
                    <td>${article.stock}</td>
                    <td>${article.category.nameCategory}</td>
                    <td>
                    <a href="#" onclick="verModificarArticle('${article.id}')" class="btn btn-outline-warning">
                        <i class="fa-solid fa-user-pen"></i>
                    </a>
                    <a href="#" onclick="verArticle('${article.id}')" class="btn btn-outline-info">
                        <i class="fa-solid fa-eye"></i>
                    </a>
                    </td>
                </tr>`;
                
            }
            document.getElementById("listarArticle").innerHTML = articulos;
    })
}

function verModificarArticle(id){
    validaToken();
    var settings={
        method: 'GET',
        headers:headersArticle,
    }
    fetch(urlApiArticle+"/"+id, settings)
    .then(article => article.json())
    .then(function(article){
            var cadena='';
                var settingsCategory = {
                    method: 'GET',
                    headers: headersArticle,
                };
                fetch(urlApiCategory, settingsCategory)
                    .then(categories => categories.json())
                    .then(function (categories) {
                var cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Modify Article</h1>
                </div>
              
                <form action="" method="post" id="modificar">
                    <input type="hidden" name="id" id="id" value="${article.id}">
                    <label for="nameArticle" class="form-label">Name</label>
                    <input type="text" class="form-control" name="nameArticle" id="nameArticle" required value="${article.nameArticle}"> <br>
                    <label for="description"  class="form-label">Description</label>
                    <input type="text" class="form-control" name="description" id="description" required value="${article.description}"> <br>
                    <label for="price"  class="form-label">Price</label>
                    <input type="text" class="form-control" name="price" id="price" required value="${article.price}"> <br>
                    <label for="stock" class="form-label">Stock</label>
                    <input type="number" class="form-control" name="stock" id="stock" required value="${article.stock}"> <br>
                    <label for="idCategory" class="form-label">Categoría</label>
                        <select class="form-control" name="idCategory" id="idCategory" required>
                        ${categories.map(category => `<option value="${category.idCategory}" ${article.category.idCategory === category.idCategory ? 'selected' : ''}>${category.nameCategory}</option>`).join('')}
                        </select> <br>
                    <button type="button" class="btn btn-outline-warning" onclick="modificarArticle('${article.id}')">Modificar</button>
                </form>`;
            
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalArticle'))
            myModal.toggle();
        });
    })
}

async function modificarArticle(id){
    validaToken();
    var myForm = document.getElementById("modificar");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApiArticle+"/"+id, {
        method: 'PUT',
        headers:headersArticle,
        body: JSON.stringify(jsonData)
    });
    if(request.ok){
        alertas("The article has been modified successfully!",1)
        listarArticle();
    }
    else{
        const data = await request.json(); // Espera a que la promesa se resuelva
        console.log(data); // Aquí puedes manejar la data de la respuesta
        const dataArray = Object.values(data);
        console.log(dataArray); // Aquí puedes manejar la data de la respuesta
        var dataResponse='';
        for(var v of dataArray){
            dataResponse += "<li>"+v+"</li>";
        }

        alertas("Error: <br>"+dataResponse, 2)
    }
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalArticle')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function verArticle(id){
    validaToken();
    var settings={
        method: 'GET',
        headers:headersArticle,
    }
    fetch(urlApiArticle+"/"+id, settings)
    .then(article => article.json())
    .then(function(article){
            var cadena='';
            if(article){                
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Información de Article</h1>
                </div>
                <ul class="list-group">
                    <li class="list-group-item">Name: ${article.nameArticle}</li>
                    <li class="list-group-item">Description: ${article.description}</li>
                    <li class="list-group-item">Price: ${article.price}</li>
                    <li class="list-group-item">Stock: ${article.stock}</li>
                    <li class="list-group-item">Stock: ${article.category.nameCategory}</li>
                </ul>`;
              
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalArticle'))
            myModal.toggle();
    })
}

async function registerArticle(){
    var idCategory = document.getElementById("idCategory").value;

    var myForm = document.getElementById("registerFormArticle");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApiArticle+ "/" + idCategory, {
        method: 'POST',
        headers:headersArticle,
        body: JSON.stringify(jsonData)
    });
    if(request.ok){
        alertas("Article registered", 1);
        listarArticle();
    }
    else{
        const data = await request.json(); // Espera a que la promesa se resuelva
        console.log(data); // Aquí puedes manejar la data de la respuesta
        const dataArray = Object.values(data);
        console.log(dataArray); // Aquí puedes manejar la data de la respuesta
        var dataResponse='';
        for(var v of dataArray){
            dataResponse += "<li>"+v+"</li>";
        }

        alertas("Error: <br>"+dataResponse, 2)
    }
    document.getElementById("contentModal").innerHTML = '';
    var myModalEl = document.getElementById('modalArticle')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function createArticleForm(){
    validaToken();
    const urlApiCategory = "http://localhost:8080/categories";
    const settingsCategory = {
        method: 'GET',
        headers: headersArticle, // Asegúrate de tener esta variable definida y configurada
    };
    fetch(urlApiCategory, settingsCatefory)
    .then(category => category.json())
    .then(function (Category) {
        var cadena = '';
        if (category) {
            console.log(category);
            cadena = `
            <div class="p-3 mb-2 bg-light text-dark">
                <h1 class="display-5"><i class="fa-solid fa-user-pen"></i>Article Register</h1>
            </div>
              
            <form action="" method="post" id="registerFormArticle">
                <input type="hidden" name="id" id="id">
                <label for="nameArticle" class="form-label"> Name</label>
                <input type="text" class="form-control" name="nameArticle" id="nameArticle" required> <br>
                <label for="description"  class="form-label">Description</label>
                <input type="text" class="form-control" name="description" id="description" required> <br>
                <label for="price"  class="form-label">Price</label>
                <input type="text" class="form-control" name="price" id="price" required> <br>
                <label for="stock" class="form-label">Stock</label>
                <input type="number" class="form-control" name="stock" id="stock" required> <br>
                <label for="idCategory" class="form-label">Categoría</label>
                        <select class="form-control" name="idCategory" id="idCategorySel" required>
                            <option value="" disabled selected>Seleccionar</option>
                            ${category.map(category => `<option value="${category.idCategory}">${category.nameCategory}</option>`).join('')}
                        </select>
                        <br>
                <button type="button" class="btn btn-outline-info" onclick="registerArticle()">Register</button>
            </form>`;
        }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalArticle'))
            myModal.toggle();
        });
}