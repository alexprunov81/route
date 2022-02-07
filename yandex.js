const mapWrap = document.getElementById('map')
const setLength = document.createElement('span')
const suggest1 = document.getElementById('suggest1')
const suggest2 = document.getElementById('suggest2')
const getRoute = document.getElementById('getRoute')


const addRoute = myMap => {
    ymaps.route(
        [suggest1.value,
            suggest2.value]
    ).then(function (router) {
        const length = Math.round(router.getLength())
        setLength.innerHTML = `Растояние ${length/1000} км`
        mapWrap.append(setLength)
        myMap.geoObjects.add(router)
    })
}

function init() {

    const suggestView1 = new ymaps.SuggestView('suggest1')
    const suggestView2 = new ymaps.SuggestView('suggest2')

    getRoute.onclick = function () {
        const multiRoute = new ymaps.multiRouter.MultiRoute(
            {
                referencePoints:
                    [
                        suggest1.value,
                        suggest2.value
                    ],
                params: {results: 2}
            },
            {
                boundsAutoApply: true
            }
        )
        myMap.geoObjects.add(multiRoute)
        addRoute(myMap)
    }


    const myMap = new ymaps.Map('map', {
        center: [55.750625, 37.626],
        zoom: 7,
    })

    myMap.controls.remove('geolocationControl')
    myMap.controls.remove('searchControl')
    myMap.controls.remove('trafficControl')
    myMap.controls.remove('fullscreenControl')
    myMap.controls.remove('zoomControl')
    myMap.controls.remove('rulerControl')
    myMap.controls.remove('typeSelector')
    myMap.behaviors.disable(['scrollZoom'])
}

ymaps.ready(init)
