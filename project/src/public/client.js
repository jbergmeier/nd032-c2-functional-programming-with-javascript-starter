let store = {
    user: { name: "Jörn" },
    curiosity: '',
    opportunity: '',
    apod:'',
    spirit: '',
    perseverance: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit', 'Perseverance'],
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, perseverance } = state

    return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                <h3>Latest Mars Rover Photos</h3>
                <p>Here is an example section.</p>
                <p>
                    One of the most popular websites at NASA is the Astronomy Picture of the Day. In fact, this website is one of
                    the most popular websites across all federal agencies. It has the popular appeal of a Justin Bieber video.
                    This endpoint structures the APOD imagery and associated metadata so that it can be repurposed for other
                    applications. In addition, if the concept_tags parameter is set to True, then keywords derived from the image
                    explanation are returned. These keywords could be used as auto-generated hashtags for twitter or instagram feeds;
                    but generally help with discoverability of relevant imagery.
                </p>
                <div class="grid">
                ${ImageOfTheDay(opportunity)}
                </div>
                </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
    getImageOfTheDay(store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
        
    `
}



// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {    

    const mapRover = apod.image.latest_photos.map((thisRover) => {
        console.log("this rover: " + thisRover.img_src)
        return (`
            <div class="frame">
            <p><img src="${thisRover.img_src}" alt="latest Rover pic" class="responsive frameImg" /></p>
            <p>${thisRover.camera.full_name} (Date: ${thisRover.earth_date})</p>
            </div>
        `)

    })
    return mapRover.join('')
    
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = async (state) => {
    let { perseverance, curiosity, spirit } = state

    // Get Data for Perseverance Rover (newest)
    const perseveranceData = await fetch(`http://localhost:3000/perseverance`)
    perseverance = await perseveranceData.json()
    
    updateStore(store, { perseverance })

    // Get Data for Curiosity Rover
    const ciuriosityData = await fetch(`http://localhost:3000/curiosity`)
    curiosity = await ciuriosityData.json()
    
    updateStore(store, { curiosity })

    // Get Data for Spirit Rover
    const spiritData = await fetch(`http://localhost:3000/spirit`)
    spirit = await spiritData.json()
    
    updateStore(store, { spirit })

    // Get Data for Opportunity Rover
    const opportunityData = await fetch(`http://localhost:3000/spirit`)
    opportunity = await opportunityData.json()
    
    updateStore(store, { opportunity })

    //.then(res => res.json())
    //    .then(perseverance => updateStore(store, { perseverance }))
}



setTimeout(function(){ console.log(store); }, 3000);
