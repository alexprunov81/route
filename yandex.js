const mapWrap = document.getElementById('map')
const setDistance = document.createElement('span')
const setTime = document.createElement('span')
const suggest1 = document.getElementById('suggest1')
const suggest2 = document.getElementById('suggest2')
const url = 'http://localhost:3000/posts'




function init() {

    const suggestView1 = new ymaps.SuggestView('suggest1')
    const suggestView2 = new ymaps.SuggestView('suggest2')

    const myMap = new ymaps.Map('map', {
        center: [55.750625, 37.626],
        zoom: 7,
    })

    function clearTheMap(myMap) {
        myMap.controls.remove('geolocationControl')
        myMap.controls.remove('searchControl')
        myMap.controls.remove('trafficControl')
        myMap.controls.remove('fullscreenControl')
        myMap.controls.remove('zoomControl')
        myMap.controls.remove('rulerControl')
        myMap.controls.remove('typeSelector')
        myMap.behaviors.disable(['scrollZoom'])
    }

    function addRoute() {
        ymaps.route([
            suggest1.value,
            suggest2.value
        ])
            .then(function (router) {

                const length = Math.trunc(Math.round(router.getLength()) / 1000)
                const time = Math.trunc(router.getJamsTime())
                const hours = Math.trunc(time / 3600)
                const minutes = Math.trunc((time - hours * 3600) / 60)

                const body =
                    {
                        "item A": suggest1.value,
                        "item B": suggest2.value,
                        "distance": length,
                        "hours": hours,
                        "minutes": minutes
                    }

                setDistance.innerHTML = `Растояние ${length} км`
                setDistance.classList.add('distance')
                mapWrap.append(setDistance)

                setTime.innerHTML = `${hours ? hours + ' ч' : ''} ${minutes ? minutes + ' мин' : ''}`
                setTime.classList.add('time')
                mapWrap.append(setTime)

                return fetch(url, {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {'Content-Type': 'application/json'}
                })
            })
    }

    function getRoute(e) {

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

        addRoute()

    }

    suggestView2.events.add('select', getRoute)
    clearTheMap(myMap)
}

ymaps.ready(init)


