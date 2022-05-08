//fetch-wrapper
class FetchWrapper {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    async get(endpoint) {
        const response = await fetch(this.baseURL + endpoint);
        return response.json();
    }

    async put(endpoint, body) {
        return this._send("put", endpoint, body);
    }

    async post(endpoint, body) {
        return this._send("post", endpoint, body);
    }

    async delete(endpoint, body) {
        return this._send("delete", endpoint, body);
    }

    async _send(method, endpoint, body) {
        const response = await fetch(this.baseURL + endpoint, {
                                                                method,
                                                                headers: {
                                                                    "Content-Type": "application/json"
                                                                    },
                                                                body: JSON.stringify(body)
                                                                });
        return response.json();
    }
}

//get element by id
const form = document.querySelector('#todo-form');
const list = document.querySelector('#todos-list');
const title = document.querySelector('#todo-title');
const select = document.querySelector('#todo-status');

//other variables
const API = new FetchWrapper('https://my-todos-project42.herokuapp.com/todos');

//functions
const handleAddSubmit = todo => {
    list.insertAdjacentHTML('beforeend', `<li class='todo'>
                <p>Id: ${todo.id}, title: ${todo.title}, completed: ${todo.completed}</p>
                <button data-id=${todo.id} type="button" class="todo-btn delete-btn" id="delete-btn">Delete</button>
            </li>`)
}

const handleDeleteClick = async() => {
    const deleteBtn = document.querySelectorAll('.delete-btn')
    console.log(deleteBtn)
    deleteBtn.forEach(btn => {
        btn.addEventListener('click', async(event) => {
            console.log('delete clicked!')
            API.delete(`/${event.currentTarget.dataset.id}`)
            console.log(btn.parentElement)
            btn.parentElement.remove()
        })
    })
}

const addTodoList = async() => {
    const data = await API.get('')
    data.forEach(d => {
        handleAddSubmit(d)
    })
    handleDeleteClick()
}

const submitForm = async() => {
    form.addEventListener('submit', async event => {
        event.preventDefault();
        const data = await API.post('', {
            title: title.value,
            completed: select.value
        })
        console.log(data)
        title.value = ''
        handleAddSubmit(data)
        handleDeleteClick()
})
}

submitForm()
addTodoList()