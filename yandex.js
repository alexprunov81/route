const mapWrap = document.getElementById('map')
const setDistance = document.createElement('span')
const setTime = document.createElement('span')
const suggest1 = document.getElementById('suggest1')
const suggest2 = document.getElementById('suggest2')

function clearthemap(myMap) {
    myMap.controls.remove('geolocationControl')
    myMap.controls.remove('searchControl')
    myMap.controls.remove('trafficControl')
    myMap.controls.remove('fullscreenControl')
    myMap.controls.remove('zoomControl')
    myMap.controls.remove('rulerControl')
    myMap.controls.remove('typeSelector')
    myMap.behaviors.disable(['scrollZoom'])
}


function init() {

    const suggestView1 = new ymaps.SuggestView('suggest1')
    const suggestView2 = new ymaps.SuggestView('suggest2')

    const myMap = new ymaps.Map('map', {
        center: [55.750625, 37.626],
        zoom: 7,
    })

    const addRoute = myMap => {

        ymaps.route(
            [
                suggest1.value,
                suggest2.value
            ]
        ).then(function (router) {
            const length = Math.round(router.getLength())
            const time = Math.trunc(router.getJamsTime())

            const hours = Math.trunc(time / 3600)
            const minutes = Math.trunc((time - hours * 3600) / 60)

            console.log(hours)
            console.log(minutes)

            setDistance.innerHTML = `Растояние ${Math.trunc(length / 1000)} км`
            setDistance.classList.add('distance')
            mapWrap.append(setDistance)

            setTime.innerHTML = `${hours ? hours + ' ч' : ''} ${minutes ? minutes + ' мин' : ''}`
            setTime.classList.add('time')
            mapWrap.append(setTime)
        })
    }


    suggestView2.events.add('select', function (e) {

        const multiRoute = new ymaps.multiRouter.MultiRoute(
            {
                referencePoints:
                    [
                        suggest1.value,
                        e.get('item').value
                    ],
                params: {results: 2}
            },
            {
                boundsAutoApply: true,
                zoomMargin: 30
            }
        )

        myMap.geoObjects.removeAll(multiRoute)
        myMap.geoObjects.add(multiRoute)

        
        addRoute(myMap)
    })
clearthemap(myMap)

}

ymaps.ready(init)
