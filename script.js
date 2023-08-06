

let bird_json_location = './data/nzbird.json'

let search_query = ''
let conservation_status = ''
let sort_by = ''

let timeout_list = []

function response_callback(response) {
    if (response.status == 200) {
        return response.json()
    }
    return;
}

function data_callback(data) {

    for (var i = 0; i < timeout_list.length; i++) {
        clearTimeout(timeout_list[i]);
    }

    let ordered_data = []
    let data_array = []
    let bird_names = []

    data.forEach(bird => {
        data_array.push(bird)
        bird_names.push(bird.english_name)
    })

    if (sort_by == 'Alphabetical A-Z') {
        bird_names.sort()
        bird_names.forEach(bird_name => {
            ordered_data.push(data_array.find(function(a){
                if(bird_name == a.english_name) {
                    return bird_name;
                }
                return;
            }))
        })
    }

    if (sort_by == 'Alphabetical Z-A') {
        bird_names.sort().reverse()
        bird_names.forEach(bird_name => {
            ordered_data.push(data_array.find(function(a){
                if(bird_name == a.english_name) {
                    return bird_name;
                }
                return;
            }))
        })
    }

    if (sort_by == 'Longest to Shortest') {
        ordered_data = data_array
        ordered_data.sort(function (a, b) {
            return b.size.length.value - a.size.length.value
        })
    }

    if (sort_by == 'Shortest to Longest') {
        ordered_data = data_array
        ordered_data.sort(function (a, b) {
            return a.size.length.value - b.size.length.value
        })
    }

    if (sort_by == 'Lightest to Heaviest') {
        ordered_data = data_array
        ordered_data.sort(function (a, b) {
            return a.size.weight.value - b.size.weight.value
        })
    }

    if (sort_by == 'Heaviest to Lightest') {
        ordered_data = data_array
        ordered_data.sort(function (a, b) {
            return b.size.weight.value - a.size.weight.value
        })
    }

    let results_found = 0
    let timeout = 0
    ordered_data.forEach(bird => {
        if (bird.status === conservation_status || conservation_status === '') {
            if (bird.english_name.toLowerCase().includes(search_query) ||
                bird.primary_name.toLowerCase().includes(search_query) ||
                bird.scientific_name.toLowerCase().includes(search_query) ||
                bird.order.toLowerCase().includes(search_query) ||
                bird.family.toLowerCase().includes(search_query) ||
                JSON.stringify(bird.other_names).toLowerCase().includes(search_query)) {
                results_found += 1
                timeout_list.push(setTimeout(() => create_card(bird), timeout))
                timeout += 250
            }
        }
    });

    let results_found_text = document.getElementById('results-found')
    results_found_text.innerHTML = results_found + " Results Found"

}

// const sleep = ms => new Promise(r => setTimeout(r, ms));

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

function search_for(search) {
    clear_all()

    search_query = search.toLowerCase()

    let status = document.getElementById('conservation-status-sort')
    conservation_status = status.value
    if (status.value == 'All') {
        conservation_status = ''
    }

    let sort = document.getElementById('sort-by')
    sort_by = sort.value

    fetch(bird_json_location).then(response_callback).then(data_callback)
}

function create_card(bird) {
    const new_card = document.createElement('div')
    new_card.setAttribute('class', 'card')
    if (bird.status.toLowerCase() == "not threatened") new_card.style.border = "3px solid #02a028";
    if (bird.status.toLowerCase() == "naturally uncommon") new_card.style.border = "3px solid #649a31";
    if (bird.status.toLowerCase() == "relict") new_card.style.border = "3px solid #99cb68";
    if (bird.status.toLowerCase() == "recovering") new_card.style.border = "3px solid #fecc33";
    if (bird.status.toLowerCase() == "declining") new_card.style.border = "3px solid #fe9a01";
    if (bird.status.toLowerCase() == "nationally increasing") new_card.style.border = "3px solid #c26967";
    if (bird.status.toLowerCase() == "nationally vulnerable") new_card.style.border = "3px solid #9b0000";
    if (bird.status.toLowerCase() == "nationally endangered") new_card.style.border = "3px solid #660032";
    if (bird.status.toLowerCase() == "nationally critical") new_card.style.border = "3px solid #320033";
    if (bird.status.toLowerCase() == "extinct") new_card.style.border = "3px solid black";
    if (bird.status.toLowerCase() == "data deficient") new_card.style.border = "3px solid black";


    const bird_image = document.createElement('img')
    bird_image.setAttribute('src', bird.photo.source)
    bird_image.setAttribute('alt', extractBirdNameFromImagePath(bird.photo.source))
    new_card.append(bird_image)

    const info_on_pic = document.createElement('div')
    info_on_pic.setAttribute('class', 'info-on-pic')
    info_on_pic.append(create_element('h2', bird.primary_name))
    info_on_pic.append(create_element('p', `Credit: ${bird.photo.credit}`))
    info_on_pic.append(document.createElement('br'))
    const bird_name = create_element('h2', bird.english_name)
    bird_name.setAttribute('id', 'name-of-bird')
    info_on_pic.append(bird_name)

    new_card.append(info_on_pic)


    const bird_information_titles = document.createElement('div')
    bird_information_titles.setAttribute('class', 'bird-information-titles')
    bird_information_titles.innerHTML = `
    <table class="card_text">
        <tr>
            <td><b>English Name:</b></td>
            <td>${bird.english_name}</td>
        </tr>
        <tr>
            <td><b>Scientific Name:</b></td>
            <td>${bird.scientific_name}</td>
        </tr>
        <tr>
            <td><b>Family:</b></td>
            <td>${bird.family}</td>
        </tr>
        <tr>
            <td><b>Order:</b></td>
            <td>${bird.order}</td>
        </tr>
        <tr>
            <td><b>Status:</b></td>
            <td>${bird.status}</td>
        </tr>
        <tr>
            <td><b>Length:</b></td>
            <td>${bird.size.length.value} ${bird.size.length.units}</td>
        </tr>
        <tr>
            <td><b>Weight:</b></td>
            <td>${bird.size.weight.value} ${bird.size.weight.units}</td>
        </tr>
    </table>
    `;

    const bird_information = document.createElement('div')
    bird_information.setAttribute('class', 'bird-information')
    bird_information.append(bird_information_titles)
    // bird_information.append(bird_information_data)

    new_card.append(bird_information)

    document.querySelector('.bird-cards').append(new_card)
}

function create_element(type, content) {
    const e = document.createElement(type)
    // e.setAttribute('class', className)
    e.textContent = content
    return e
}

function extractBirdNameFromImagePath(imagePath) {
    // Remove the file extension (.jpg) from the path
    const fileNameWithoutExtension = imagePath.split('.')[0];

    // Split the path by slashes (/) and get the last part (the bird name)
    const pathParts = fileNameWithoutExtension.split('/');
    const birdName = pathParts[pathParts.length - 1];

    return birdName;
}

const clear_all = () => {
    console.log('clearing')
    let cards = document.getElementById('bird-cards')
    cards.innerHTML = ''
    // console.log(cards.innerHTML)
}

function testing() {
    console.log("this thing is working!!!")
}


search_for('')

let btn = document.getElementById('filter-button')
let search = document.getElementById('search-input')
// btn.onclick = search_for(search.value);
btn.addEventListener("click", function () { search_for(search.value); });
// btn.onclick = clear_all;

search.addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    console.log(event)
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        btn.click();
    }
});

let status_sort = document.getElementById('conservation-status-sort')
status_sort.addEventListener("change", function () {btn.click()})

let filter_sort = document.getElementById('sort-by')
filter_sort.addEventListener("change", function () {btn.click()})

