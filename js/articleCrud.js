//funciones para operaciones crud del usuario
const urlApiUser = "http://localhost:8088/articles";
const headersUser= {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.token}`
};

function listarArticle(){
    validaToken();
    var settings={
        method: 'GET',
        headers: headersUser,
    }
    fetch(urlApiUser, settings)
    .then(response => response.json())
    .then(function(articles){
        
            var articulos = '';
            for(const article of articles){
                articulos += `
                <tr>
                    <th scope="row">${article.id}</th>
                    <td>${article.nameArticle}</td>
                    <td>${article.price}</td>
                    <td>${article.category}</td>
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
        headers:headersUser,
    }
    fetch(urlApiUser+"/"+id, settings)
    .then(article => article.json())
    .then(function(article){
            var cadena='';
            if(article){                
                cadena = `
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
                    <label for="category" class="form-label">Category</label>
                    <input type="category" class="form-control" name="category" id="category" required value="${article.category}"> <br>
                    <button type="button" class="btn btn-outline-warning" onclick="modificarArticle('${article.id}')">Modificar</button>
                </form>`;
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalArticle'))
            myModal.toggle();
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
    const request = await fetch(urlApiUser+"/"+id, {
        method: 'PUT',
        headers:headersUser,
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
        headers:headersUser,
    }
    fetch(urlApiUser+"/"+id, settings)
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
                    <li class="list-group-item">Category: ${article.category}</li>
                </ul>`;
              
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalArticle'))
            myModal.toggle();
    })
}

async function registerArticle(){
    var myForm = document.getElementById("registerFormArticle");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApiAuth+"/articles", {
        method: 'POST',
        headers:headersAuth,
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
                <label for="category" class="form-label">Category</label>
                <input type="text" class="form-control" name="category" id="category" required> <br>
                <button type="button" class="btn btn-outline-info" onclick="registerArticle()">Register</button>
            </form>`;
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalArticle'))
            myModal.toggle();
}