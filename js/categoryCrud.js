//funciones para operaciones crud del usuario
const urlApiCategory = "http://localhost:8088/categories";
const headersCategory= {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.token}`
};

function listarCategory(){
    validaToken();
    var settingsCategory={
        method: 'GET',
        headers: headersCategory,
    }
    fetch(urlApiCategory, settingsCategory)
    .then(response => response.json())
    .then(function(categories){
        
            var categorias = '';
            for(const category of categories){
                categorias += `
                <tr>
                    <th scope="row">${category.idCategory}</th>
                    <td>${category.nameCategory}</td>
                    <td>
                    <a href="#" onclick="verModificarCategory('${category.idCategory}')" class="btn btn-outline-warning">
                        <i class="fa-solid fa-user-pen"></i>
                    </a>
                    <a href="#" onclick="verCategory('${category.idCategory}')" class="btn btn-outline-info">
                        <i class="fa-solid fa-eye"></i>
                    </a>
                    </td>
                </tr>`;
                
            }
            document.getElementById("listarCategory").innerHTML = categorias;
    })
}

function verModificarCategory(idCategory){
    validaToken();
    var settingsCategory={
        method: 'GET',
        headers:headersCategory,
    }
    fetch(urlApiCategory+"/"+idCategory, settingsCategory)
    .then(category => category.json())
    .then(function(category){
            var cadena='';
            if(category){                
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Modify User</h1>
                </div>
              
                <form action="" method="post" id="modificar">
                    <input type="hidden" name="id" id="id" value="${category.idCategory}">
                    <label for="nameCategory" class="form-label">Name</label>
                    <input type="text" class="form-control" name="nameCategory" id="nameCategory" required value="${category.nameCategory}"> <br>
                    <label for="descriptionCategory"  class="form-label">Description</label>
                    <input type="text" class="form-control" name="descriptionCategory" id="descriptionCategory" required value="${category.descriptionCategory}"> <br>
                    <button type="button" class="btn btn-outline-warning" 
                        onclick="modificarCategory('${category.idCategory}')">Modificar
                    </button>
                </form>`;
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalCategory'))
            myModal.toggle();
    })
}

async function modificarCategory(idCategory){
    validaToken();
    var myForm = document.getElementById("modificar");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApiCategory+"/"+idCategory, {
        method: 'PUT',
        headers:headersCategory,
        body: JSON.stringify(jsonData)
    });
    if(request.ok){
        alertas("The Category has been modified successfully!",1)
        listarCategory();
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
    var myModalEl = document.getElementById('modalCategory')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function verCategory(idCategory){
    validaToken();
    var settingsCategory={
        method: 'GET',
        headers:headersCategory,
    }
    fetch(urlApiCategory+"/"+idCategory, settingsCategory)
    .then(category => category.json())
    .then(function(category){
            var cadena='';
            if(category){                
                cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Information of Category</h1>
                </div>
                <ul class="list-group">
                    <li class="list-group-item">Name: ${category.nameCategory}</li>
                    <li class="list-group-item">Description: ${category.descriptionCategory}</li>
                </ul>`;
              
            }
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalCategory'))
            myModal.toggle();
    })
}

async function createCategory(){
    var myForm = document.getElementById("registerFormCategory");
    var formData = new FormData(myForm);
    var jsonData = {};
    for(var [k, v] of formData){//convertimos los datos a json
        jsonData[k] = v;
    }
    const request = await fetch(urlApiCategory,{
        method: 'POST',
        headers:headersCategory,
        body: JSON.stringify(jsonData)
    });
    if(request.ok){
        alertas("category created", 1);
        listarCategory();
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
    var myModalEl = document.getElementById('modalCategory')
    var modal = bootstrap.Modal.getInstance(myModalEl) // Returns a Bootstrap modal instance
    modal.hide();
}

function createCategoryForm(){
    cadena = `
            <div class="p-3 mb-2 bg-light text-dark">
                <h1 class="display-5"><i class="fa-solid fa-user-pen"></i>Category Register</h1>
            </div>
              
            <form action="" method="post" id="registerFormCategory">
                <input type="hidden" name="idCategory" id="idCategory">
                <label for="nameCategory" class="form-label">Name</label>
                <input type="text" class="form-control" name="nameCategory" id="nameCategory" required> <br>
                <label for="descriptionCategory"  class="form-label">Description</label>
                <input type="text" class="form-control" name="descriptionCategory" id="descriptionCategory" required> <br>
                <button type="button" class="btn btn-outline-info" onclick="createCategory()">Register</button>
            </form>`;
            document.getElementById("contentModal").innerHTML = cadena;
            var myModal = new bootstrap.Modal(document.getElementById('modalCategory'))
            myModal.toggle();
}