document.getElementById('search').addEventListener("submit", e => {
    search(e.target['city'].value, axios);


    e.preventDefault();
});