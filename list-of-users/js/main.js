//----------Buttons and search -------------------
const btn_add = document.getElementById('btn_add');

const btn_quit = document.getElementById('btn_quit');

const btn_mod = document.getElementById('btn_mod');

const search = document.getElementById('search');
const xButon = document.getElementById('xButton');

function disableAllButtons() {
    btn_add.disabled = true;
    btn_quit.disabled = true;
    btn_mod.disabled = true;
    search.disabled = true;

    btn_add.className = 'btn cancel';
    btn_quit.className = 'btn cancel';
    btn_mod.className = 'btn cancel';

    xButon.removeEventListener('click', clearUp);
}

function enableAllButtons() {
    btn_add.disabled = false;
    btn_quit.disabled = false;
    btn_mod.disabled = false;
    search.disabled = false;

    btn_add.className = 'btn';
    btn_quit.className = 'btn';
    btn_mod.className = 'btn';

    xButon.addEventListener('click', clearUp);
}

function disableButtons(button1, button2) {
    button1.disabled = true;
    button1.className = 'btn cancel';
    button2.disabled = true;
    button2.className = 'btn cancel';
}

function buttonPush(button) {
    button.className = 'btn btn_push';
    button.innerHTML = 'Cancel';
}

function buttonPushWait(button) {
    button.disabled = true;
    xButon.removeEventListener('click', clearUp);
    search.disabled = true;
    setTimeout(function() {
        button.disabled = false;
        xButon.addEventListener('click', clearUp);
        search.disabled = false;
    }, 500)
}

function buttonLoader(button) {
    button.className = 'btn loader';
    button.innerHTML = 'Loading';
    button.disabled = true;
}

disableAllButtons(); //Start with the buttons and search disable until the data is ready. To prevent user to use before load.

//-----------Choose-------------------------------

const choose = document.getElementById('choose'); //Message when remove or modify buttons were press

function chooseAppear() {
    if (btn_quit.className == 'btn btn_push') {
        choose.innerHTML = 'Choose a person to remove';
    }
    if (btn_mod.className == 'btn btn_push') {
        choose.innerHTML = 'Choose a person to modify';
    }
    choose.className = 'choose';
}

//----------Form-----------------------------------

const form = document.getElementById('form');

function formClear() {
    form.form_name_in.value = '';
    form.form_lastName_in.value = '';
    form.form_phone_in.value = '';
    form.addres.value = '';
    missing_none.className = 'missing_none';
}

const label_name_in = document.getElementById('label_name');
const label_lastName_in = document.getElementById('label_lastName');
const label_phone_in = document.getElementById('label_phone');
const label_addres_in = document.getElementById('label_addres');

function labelNotRed() {
    label_name_in.className = 'label_in';
    label_lastName_in.className = 'label_in';
    label_phone_in.className = 'label_in';
    label_addres_in.className = 'label_in';
}

const missing_none = document.getElementById('missing_none'); //When miss a data in the form
let missing_bol = false; //To prevent another slide when the missing data message is shown

let rows_to_length = [];

let rows = [];

function getData() { //To add classes for select to each row. The id is for the classes, not for the database
    rows_to_length = document.getElementsByClassName('secondary_normal');

    rows = [];

    for (let i = 1; i <= rows_to_length.length; i++) {
        rows.push(document.getElementById(String(i)));
    }
}

const sub = document.getElementById('sub');

//------------Slides for objects--------------------

function slideToDown(object, speed) {
    $(object).slideUp(0, function() {
        $(this).slideDown(speed);    
    });
}

function slideToUp(object, speed) {
    $(object).slideDown(0, function() {
        $(this).slideUp(speed);    
    });
}

//--------Add Select propertie to the persons----------

function addSelectPropertie(push) {
    for (let i = 0; i < rows.length; i++) {
        rows[i].className = 'secondary';
        rows[i].addEventListener('click', push);
    }
}

function removeSelectPropertie(push) {
    for (let i = 0; i < rows.length; i++) {
        rows[i].className = 'secondary_normal';
        rows[i].removeEventListener('click', push);
    }
}

//-----------Table and Upload Data-----------------

const table = document.getElementById('people');

function uploadUsers(callback = () => {}) {
    const petition = new XMLHttpRequest();
    petition.open('GET', 'php/read-data.php');

    petition.onload = function() {
        let data = JSON.parse(petition.responseText);

        if (data.error) {
            choose.className = 'choose';
            choose.innerHTML = 'ERROR, TRY AGAIN LATER RELOADING';
        } else {
            enableAllButtons();

            table.innerHTML = '<tr class="principal"><th>ID</th><th>Name</th><th>Last name</th><th>Addres</th><th>Phone Number</th></tr>';
            for(let i = 0; i < data.length; i++) {
                let element = document.createElement('tr');
                element.className = 'secondary_normal';
                element.id = String(i + 1);
                element.innerHTML += ("<th>" + data[i].id + "</th>");
                element.innerHTML += ("<th>" + data[i].name + "</th>");
                element.innerHTML += ("<th>" + data[i].lastName + "</th>");
                element.innerHTML += ("<th>" + data[i].addres + "</th>");
                element.innerHTML += ("<th>" + data[i].phone + "</th>");
                table.appendChild(element);
            }
            getData();
            if(search.value != '') {
                callback();
            }
        }
    }
    petition.send();
}

uploadUsers();

//----------------Filter users when search---------------

function clearSearch() {
    xButon.className = 'empty fa fa-times';
    search.value = '';
    search.style.width = '100%';
}

function clearUp() {
    clearSearch();
    let counter = 1;
    table.innerHTML = '<tr class="principal"><th>ID</th><th>Name</th><th>Last name</th><th>Addres</th><th>Phone Number</th></tr>';
    for (let i = 0; i < rows.length; i++) {
        table.appendChild(rows[i]);
        rows[i].id = counter;
        counter ++;
    }
}

function searchRows() {
    xButon.className = 'fa fa-times';
    let counter = 1;
    const text = search.value.trim().toLowerCase();
        table.innerHTML = '<tr class="principal"><th>ID</th><th>Name</th><th>Last name</th><th>Addres</th><th>Phone Number</th></tr>';
        for (let i = 0; i < rows.length; i++) {
            temporal_array = rows[i].getElementsByTagName('th'); 
            let name_search = temporal_array[1].innerText.toLowerCase();
            let lastName_search = temporal_array[2].innerText.toLowerCase();
            if (name_search.indexOf(text) !== -1 || lastName_search.indexOf(text) !== -1 || (name_search + " " + lastName_search).indexOf(text) !== -1) {
                table.appendChild(rows[i]);
                rows[i].id = counter;
                counter ++;
            }
        }
}

search.addEventListener('keyup', function() {
    if (search.value.trim() == '') {
        clearUp();
    } else {
        if (document.documentElement.scrollWidth <= 433) {
            search.style.width = '78%';
        } else {
            search.style.width = '80%';
        }
        searchRows();
    }
})

xButon.addEventListener('click', clearUp);

//----------------Add user to the data base--------------

let user_name,
    user_lastName,
    user_addres,
    user_phone;

function addUser() {
    const petition = new XMLHttpRequest();
    petition.open('POST', 'php/insert-user.php');

    user_name = form.form_name_in.value.trim();
    user_lastName = form.form_lastName_in.value.trim();
    user_addres = form.addres.value.trim();
    user_phone = form.form_phone_in.value.trim(); 
    
    let parameters = 'namei=' + user_name + '&lastName=' + user_lastName + '&addres=' + user_addres + '&phone=' + user_phone;

    petition.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    petition.onload = function () {
        uploadUsers(clearSearch);
        formClear();
    }

    petition.onreadystatechange = function() {
        if (petition.readyState == 4 && petition.status == 200) {
            enableAllButtons();
            btn_add.innerHTML = 'Add Person';
        }
    }

    petition.send(parameters);
}

//----------------Delete user of the data base--------------

function deleteUser() {
    const petition = new XMLHttpRequest();
    petition.open('POST', 'php/delete-user.php');

    user_id = temporal_array[0].innerText;
    let parameter = 'ID=' + user_id;
    petition.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    petition.onload = function () {
        uploadUsers(searchRows);
    }

    petition.onreadystatechange = function() {
        if (petition.readyState == 4 && petition.status == 200) {
            enableAllButtons();
            btn_quit.innerHTML = 'Remove Person';
        }
    }

    petition.send(parameter);
}

//----------------Modify user of the data base--------------

function modifyUser() {
    const petition = new XMLHttpRequest();
    petition.open('POST', 'php/modify-user.php');

    user_name = form.form_name_in.value.trim();
    user_lastName = form.form_lastName_in.value.trim();
    user_addres = form.addres.value.trim();
    user_phone = form.form_phone_in.value.trim(); 

    user_id = temporal_array[0].innerText;
    
    let parameters = 'namei=' + user_name + '&lastName=' + user_lastName + '&addres=' + user_addres + '&phone=' + user_phone + '&ID=' + user_id;

    petition.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    petition.onload = function () {
        uploadUsers(searchRows);
        formClear();
    }

    petition.onreadystatechange = function() {
        if (petition.readyState == 4 && petition.status == 200) {
            enableAllButtons();
            btn_mod.innerHTML = 'Modify Person';
            sub.innerHTML = 'Add +';
            form.className = 'form_none';
            valor = false;
        }
    }

    petition.send(parameters);
}

//-----------------Add Person-------------------------------

btn_add.addEventListener('click', function() {

    if (btn_add.className == "btn") {

        buttonPush(btn_add);

        form.className = 'form';

        slideToDown('.form', 500);

        disableButtons(btn_quit, btn_mod);

        buttonPushWait(btn_add);

    } else if (btn_add.className == 'btn btn_push') {

        slideToUp('.form', 500);

        btn_add.innerHTML = 'Add Person';

        missing_bol = false;

        disableAllButtons();

        setTimeout(function() {

            formClear();
            labelNotRed();
            enableAllButtons();

        }, 500);
    }
})

//---------Remove Person------------------------------------

function row_push() {

    if (confirm('Are you sure you want to delete this person?')) {

        buttonLoader(btn_quit);

        temporal_array = this.getElementsByTagName('th');

        slideToUp('.choose', 100);

        removeSelectPropertie(row_push);

        deleteUser();
    }
}


btn_quit.addEventListener('click', function() {

    if (btn_quit.className == "btn") {

        buttonPush(btn_quit);

        disableButtons(btn_add, btn_mod);

        chooseAppear();

        slideToDown('.choose', 100);

        addSelectPropertie(row_push);

    } else if (btn_quit.className == 'btn btn_push') {
        
        enableAllButtons();
        
        btn_quit.innerHTML = 'Remove Person';

        slideToUp('.choose', 100);

        removeSelectPropertie(row_push);

    }
})

//--------------------Modify Person---------------------------

let valor = false; //Important to know when a perosn is selected to modify

let temporal_array; //Array Selected

function row_push_mod() {

    choose.innerHTML = 'Modify the data';

    removeSelectPropertie(row_push_mod);
    
    this.className = 'selected';

    temporal_array = this.getElementsByTagName('th'); 

    form.form_name_in.value = temporal_array[1].innerText;
    form.form_lastName_in.value = temporal_array[2].innerText;
    form.form_phone_in.value = temporal_array[4].innerText;
    form.addres.value = temporal_array[3].innerText;

    form.className = 'form';

    slideToDown('.form', 500);

    buttonPushWait(btn_mod);
    
    valor = true;

    sub.innerHTML = 'Modify';
}


btn_mod.addEventListener('click', function() {

    if (btn_mod.className == "btn") {

        buttonPush(btn_mod);

        disableButtons(btn_add, btn_quit);

        chooseAppear();

        slideToDown('.choose', 100);

        addSelectPropertie(row_push_mod);

    } else if (btn_mod.className == 'btn btn_push') {

        if (valor == true) {

            disableAllButtons();

            slideToUp('.form', 500);

            valor = false;

            setTimeout(function() {

                sub.innerHTML = 'Add +';

                formClear();

                choose.innerHTML = 'Choose a person';

                labelNotRed();

                enableAllButtons();
    
            }, 500);
        } else {
            enableAllButtons();
        }

        btn_mod.innerHTML = 'Modify Person';

        missing_bol = false;

        slideToUp('.choose', 100);

        removeSelectPropertie(row_push_mod);

    }
})

//---------Validate Missing data in the form-----------------

function validateForm(e) {

    labelNotRed();
    
    if (form.form_name_in.value.trim() == '' || form.form_lastName_in.value.trim() == '' || form.form_phone_in.value.trim() == '' || form.addres.value.trim() == '') {

        e.preventDefault();

        missing_none.className = 'missing';

        if (missing_bol == false) {

            slideToDown('.missing', 100);

            missing_bol = true;
        }

        if (form.form_name_in.value.trim() == '') {

            label_name_in.className = 'label_missing';
        }

        if (form.form_lastName_in.value.trim() == '') {

            label_lastName_in.className = 'label_missing';
        }

        if (form.form_phone_in.value.trim() == '') {

            label_phone_in.className = 'label_missing';

        }

        if (form.addres.value.trim() == '') {

            label_addres_in.className = 'label_missing';

        }

    } else if (sub.innerHTML == 'Modify') {

        if (confirm("Are you sure you want to change the data?") == true) {

            slideToUp('.form', 500)
        
            if (choose.className == 'choose') {

                slideToUp('.choose', 100);

            }
        
            disableAllButtons();

            buttonLoader(btn_mod);
        
            e.preventDefault();

            setTimeout(function() {

                modifyUser();

            }, 500)

        } else {

            e.preventDefault();

            slideToUp('.missing', 100);
            
            missing_bol = false;
        }

    } else if (sub.innerHTML == 'Add +') {

        slideToUp('.form', 500);

        disableAllButtons();

        buttonLoader(btn_add);
    
        e.preventDefault();
    
        setTimeout(function() {

            addUser();

        }, 500)
    }
}

form.addEventListener('submit', validateForm);



