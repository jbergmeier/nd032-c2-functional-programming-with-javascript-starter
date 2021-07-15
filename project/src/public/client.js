let store = Immutable.Map({
    user: Immutable.Map({ name: "Jörn" }),
    curiosity: '',
    opportunity: '',
    apod:'',
    spirit: '',
    perseverance: '',
    rovers: ['Curiosity', 'Opportunity', 'Spirit', 'Perseverance'],
})

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
    let { rovers, perseverance, opportunity, spirit, curiosity } = state
    const chosenRover = perseverance

    return `
        <header></header>
        <main>
            ${Greeting(store.get("user").get("name"))}
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
            
                <p>Please choose a rover</p>
                ${Dropdown(store.get("rovers"))}
                <br />
                <div class="grid" id="roverGrid">
                
                </div>
                </section>
        </main>
        <footer></footer>
    `
}



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

// Dropdown menu to choose the Rover
const Dropdown = (roverList) => {
    const rovers = roverList.map((thisRover => {
        return `
        <option id="${thisRover}" value="${thisRover}">${thisRover}</option>   
        `
    }))

    return ` 
        <div id="roverselection">
            <select id="roverDropdown" disabled="true">
                <option disabled selected value="result" id="blank"> --- </option> 
                ${rovers.join('')}
            </select>
        </div>
    `    
}

const getChoosenRover = () => {
    if(document.getElementById("roverDropdown").value != "blank")
    {
        const roverDropdownValue = document.getElementById("roverDropdown").value
        return roverDropdownValue
    }
}


const roverChoice = (roverData) => {
    const roverDataPoint = document.getElementById("roverGrid")
    const rover = roverData.toLowerCase()
    if(rover == "spirit"){
        roverDataPoint.innerHTML= latestRoverImage(store.spirit)
    }
    else if(rover == "perseverance"){
        roverDataPoint.innerHTML= latestRoverImage(store.perseverance)
    }
    else if(rover == "opportunity"){
        roverDataPoint.innerHTML= latestRoverImage(store.opportunity)
    }
    else if(rover == "curiosity"){
        roverDataPoint.innerHTML= latestRoverImage(store.curiosity)
    }
    return rover
}




// Example of a pure function that renders infomation requested from the backend
const latestRoverImage = (roverData) => {  

    const mapRover = roverData.image.latest_photos.map((thisRover) => {
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

// Get Image Data from API
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

    // Activate Dropdown after Loading Data
    document.getElementById("roverDropdown").disabled = false

}


// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    render(root, store)
    getImageOfTheDay(store)
})

//Event Listener on DropDown Change
root.addEventListener('change', () => {
    roverChoice(getChoosenRover())
  }, false)