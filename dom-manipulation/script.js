const STORAGE_KEY ='quotesApp';
const LAST_QUOTE_KEY = 'lastQuote';


//Load quotes from localStorage or use defaults
let quotes = JSON.parse(localStorage.getItem(STORAGE_KEY)) ||  [
    { text: "Success doesn't come from what you do occasionally, it comes from what you do consistently.", category: "Motivation"},
    { text: "The smartest person in the room is the one still learning.", category: "Motivation"},
    { text: "Joy is not found in things, it's created in moments.", category: "Happiness"},
    { text: "A river cuts through rock not because of its power, but because of its persistence.", category: "Perseverance"},
    { text: "True friends don't just stand by you, they walk with you through every storm.", category: "Friendship"}
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const formContainer = document.getElementById('formContainer');
const importInput = document.getElementById('importFile');
const exportBtn = document.getElementById('exportBtn');

// sace quotes to localStorage

const saveQuotes = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
};


// function to show random quote.
const showRandomQuote = () => {

    if(quotes.length === 0) {
        quoteDisplay.innerText = 'No quotes available!';
        return;
    }

    const selected = categoryFilter.value;
    const filteredQuotes = selected === 'all'
    ? quotes: quotes.filter(q => q.category === selected);
    if(filteredQuotes.length === 0){
        quoteDisplay.innerText = 'No quotes in this category';
        return;
    }
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    quoteDisplay.innerText = `${randomQuote.text} -
    ${randomQuote.category} 
    `;

    //save last viewed quote in sessionStorage
    sessionStorage.setItem(LAST_QUOTE_KEY, JSON.stringify(randomQuote));
}

// add new quotes form
const createAddNewQuoteForm = () => {
    const textInput = document.createElement("input");
    textInput.type = 'text';
    textInput.placeholder = 'Enter quote text';

    const categoryInput = document.createElement("input");
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter category';

    const addBtn = document.createElement('button');
    addBtn.textContent = 'Add Quote';

    // event-listener when button is clicked
    addBtn.addEventListener('click', () => {
        const text = textInput.value.trim();
        const category = categoryInput.value.trim();
        if(text && category){
            quotes.push({text, category});
            saveQuotes();
            updateCategoriesAfterAdd(category);
            quoteDisplay.innerText = `Quote Added!`;
            textInput.value = '';
            categoryInput.value = '';
        } else {
            quoteDisplay.innerText = `Please fill in both fields.`

        }
        
    });

    formContainer.appendChild(textInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addBtn);
};

// Export quotes to JSON file
const exportQuotes = () => {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a  = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    a.click();
    URL.revokeObjectURL(url);
}

//import quotes from JSOn file
const importFromJsonFile = (event) => {
    const file = event.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try{
            const importedQuotes = JSON.parse(e.target.result);
            if(Array.isArray(importedQuotes)){
                quotes.push(...importedQuotes);
                saveQuotes();
                populateCategories();
                alert('quotes imported successfuly!');
                alert('Quotes imported successfully!');
            } else {
                alert('Invalid file format.');
            }
        } catch (err) {
            alert('Error reading file.');
        }
    };
    reader.readAsText(file);
}

newQuoteBtn.addEventListener('click', showRandomQuote);
importInput.addEventListener('change', importFromJsonFile);
exportBtn.addEventListener('click', exportQuotes);

createAddNewQuoteForm();

//show last viewed quote from sessionStorage
const lastQuote = JSON.parse(sessionStorage.getItem(LAST_QUOTE_KEY));
if(lastQuote) {
    quoteDisplay.innerText = `last session quote: '${lastQuote.text}'- ${lastQuote.category}`;
}

const FILTER_KEY = 'selectedCategory';
const categoryFilter = document.getElementById('categoryFilter');

//populate category dropdown dynamically

const populateCategories = () => {
    //get unique categories
    const categories = [...new Set(quotes.map(q => q.category))];

    //clear dropdown first
    categoryFilter.innerHTML = `<option value='all'> All Categories</option>`;

    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categoryFilter.appendChild(option);

    });
    //restore quotes by selected category
    const savedFilter = localStorage.getItem(FILTER_KEY);
    if(savedFilter) {
        categoryFilter.value = savedFilter;
    }
}

//filter quotes by selected category
const filterQuotes = () => {
    const selected = categoryFilter.value;
    localStorage.setItem(FILTER_KEY, selected);
    showRandomQuote();
}

//update categories when new quote is added

const updateCategoriesAfterAdd = (category) => {
    if(![...categoryFilter.options].some(opt => opt.value === category)){
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    }
}

quotes.push
populateCategories();












    

