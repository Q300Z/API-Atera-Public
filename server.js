const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const axios = require("axios")

const api_key = '/*insert api key*/' 

app.listen(3001)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(recup)

var datas = {}

function recup(req, res, next) {
    let nbPage = 0
    let datas = [];
    let promises = [];
    axios({
        method: 'get',
        url: 'https://app.atera.com/api/v3/tickets',
        headers: { 'Accept': 'application/json', 'X-API-KEY': api_key },
        params: { 'page': 1, 'itemsInPage': 50 }
    }).then(response => {
        nbPage = response.data.totalPages
        datas.push.apply(datas, response.data.items)
        for (i = 2; i <= nbPage; i++) {
            promises.push(
                axios({
                    method: 'get',
                    url: 'https://app.atera.com/api/v3/tickets',
                    headers: { 'Accept': 'application/json', 'X-API-KEY': api_key },
                    params: { 'page': i, 'itemsInPage': 50 }
                }).then(response => {
                    datas.push.apply(datas, response.data.items)
                }).catch(function (error) {
                    console.log("Error '/tickets' : " + error.message)
                })
            )
        }

        Promise.all(promises).then(() => datas = datas);

    }).catch(function (error) {
        console.log("Error '/tickets' : " + error.message)
    })
    next
}



app.get('/', (request, response) => {
    console.log("Connexion : '/'")
    response.send("Error")
})

app.get('/tickets', (req, res) => {
    var date_ = new Date();
    var time_sys = date_.getFullYear() + "/" + date_.getMonth() + "/" + date_.getDay() + " " + date_.getHours() + ":" + date_.getMinutes() + ":" + date_.getSeconds()
    console.log(time_sys + " | Connexion : '/tickets'")
    res.send(recup())
})

app.get('/tickets/nb', (req, response) => {
    var date_ = new Date();
    var time_sys = date_.getFullYear() + "/" + date_.getMonth() + "/" + date_.getDay() + " " + date_.getHours() + ":" + date_.getMinutes() + ":" + date_.getSeconds()
    console.log(time_sys + " | Connexion : '/tickets/nb'")
    axios({
        method: 'get',
        url: 'https://app.atera.com/api/v3/tickets',
        headers: { 'Accept': 'application/json', 'X-API-KEY': api_key },
        params: { 'page': 1, 'itemsInPage': 50 }
    })
        .then(function (res) {
            const a = { 'totalItemCount': res.data.totalItemCount.toString() }
            response.send(a)
        })
        .catch(function (error) {
            console.log("Error '/tickets/nb' : " + error.message)
        })
})
app.get('/tickets/nb/open', (req, res) => {
    var date_ = new Date();
    var time_sys = date_.getFullYear() + "/" + date_.getMonth() + "/" + date_.getDay() + " " + date_.getHours() + ":" + date_.getMinutes() + ":" + date_.getSeconds()
    console.log(time_sys + " | Connexion : '/tickets/nb/open'")
    let nbPage = 0
    let datas = [];
    let promises = [];
    let nbticketopen = {}
    let nb = 0
    axios({
        method: 'get',
        url: 'https://app.atera.com/api/v3/tickets',
        headers: { 'Accept': 'application/json', 'X-API-KEY': api_key },
        params: { 'page': 1, 'itemsInPage': 50 }
    }).then(response => {
        nbPage = response.data.totalPages
        datas.push.apply(datas, response.data.items)
        for (i = 2; i <= nbPage; i++) {
            promises.push(
                axios({
                    method: 'get',
                    url: 'https://app.atera.com/api/v3/tickets',
                    headers: { 'Accept': 'application/json', 'X-API-KEY': api_key },
                    params: { 'page': i, 'itemsInPage': 50 }
                }).then(response => {
                    datas.push.apply(datas, response.data.items)
                }).catch(function (error) {
                    console.log("Error '/tickets/nb/open' : " + error.message)
                })
            )
        }

        Promise.all(promises).then(() => {
            for (l of datas) {
                if (l.TicketStatus === "Open") {
                    nb++
                }
            }
            nbticketopen = { nb }
            res.send(nbticketopen)
        })
    }).catch(function (error) {
        console.log("Error '/tickets/nb/open' : " + error.message)
    })
})


app.get('/tickets/nb/pending', (req, res) => {
    var date_ = new Date();
    var time_sys = date_.getFullYear() + "/" + date_.getMonth() + "/" + date_.getDay() + " " + date_.getHours() + ":" + date_.getMinutes() + ":" + date_.getSeconds()
    console.log(time_sys + " | Connexion : '/tickets/nb/pending'")
    let nbPage = 0
    let datas = [];
    let promises = [];
    let nbticketpending = {}
    let nb = 0
    axios({
        method: 'get',
        url: 'https://app.atera.com/api/v3/tickets',
        headers: { 'Accept': 'application/json', 'X-API-KEY': api_key },
        params: { 'page': 1, 'itemsInPage': 50 }
    }).then(response => {
        nbPage = response.data.totalPages
        datas.push.apply(datas, response.data.items)
        for (i = 2; i <= nbPage; i++) {
            promises.push(
                axios({
                    method: 'get',
                    url: 'https://app.atera.com/api/v3/tickets',
                    headers: { 'Accept': 'application/json', 'X-API-KEY': api_key },
                    params: { 'page': i, 'itemsInPage': 50 }
                }).then(response => {
                    datas.push.apply(datas, response.data.items)
                }).catch(function (error) {
                    console.log("Error '/tickets/nb/pending' : " + error.message)
                })
            )
        }

        Promise.all(promises).then(() => {
            for (l of datas) {
                if (l.TicketStatus === "Pending") {
                    nb++
                }
            }
            nbticketpending = { nb }
            res.send(nbticketpending)
        })
    }).catch(function (error) {
        console.log("Error '/tickets/nb/pending' : " + error.message)
    })
})

app.get('/tickets/nb/close', (req, res) => {
    var date_ = new Date();
    var time_sys = date_.getFullYear() + "/" + date_.getMonth() + "/" + date_.getDay() + " " + date_.getHours() + ":" + date_.getMinutes() + ":" + date_.getSeconds()
    console.log(time_sys + " | Connexion : '/tickets/nb/close'")
    let nbPage = 0
    let datas = [];
    let promises = [];
    let nbticketclose = {}
    let nb = 0
    axios({
        method: 'get',
        url: 'https://app.atera.com/api/v3/tickets',
        headers: { 'Accept': 'application/json', 'X-API-KEY': api_key },
        params: { 'page': 1, 'itemsInPage': 50 }
    }).then(response => {
        nbPage = response.data.totalPages
        datas.push.apply(datas, response.data.items)
        for (i = 2; i <= nbPage; i++) {
            promises.push(
                axios({
                    method: 'get',
                    url: 'https://app.atera.com/api/v3/tickets',
                    headers: { 'Accept': 'application/json', 'X-API-KEY': api_key },
                    params: { 'page': i, 'itemsInPage': 50 }
                }).then(response => {
                    datas.push.apply(datas, response.data.items)
                }).catch(function (error) {
                    console.log("Error '/tickets/nb/close' : " + error.message)
                })
            )
        }

        Promise.all(promises).then(() => {
            for (l of datas) {
                if (l.TicketStatus === "Closed" || l.TicketStatus === "Resolved") {
                    nb++
                }
            }
            nbticketclose = { nb }
            res.send(nbticketclose)
        })
    }).catch(function (error) {
        console.log("Error '/tickets/nb/close' : " + error.message)
    })
})

app.get('/tickets/nb/open/journa', (req, res) => {
    var date_ = new Date();
    var time_sys = date_.getFullYear() + "/" + date_.getMonth() + "/" + date_.getDay() + " " + date_.getHours() + ":" + date_.getMinutes() + ":" + date_.getSeconds()
    console.log(time_sys + " | Connexion : '/tickets/nb/open/journa'")
    let nbPage = 0
    let datas = [];
    let promises = [];
    let nbticketopenjourna = {}
    let nb = 0
    axios({
        method: 'get',
        url: 'https://app.atera.com/api/v3/tickets',
        headers: { 'Accept': 'application/json', 'X-API-KEY': api_key },
        params: { 'page': 1, 'itemsInPage': 50 }
    }).then(response => {
        nbPage = response.data.totalPages
        datas.push.apply(datas, response.data.items)
        for (i = 2; i <= nbPage; i++) {
            promises.push(
                axios({
                    method: 'get',
                    url: 'https://app.atera.com/api/v3/tickets',
                    headers: { 'Accept': 'application/json', 'X-API-KEY': api_key },
                    params: { 'page': i, 'itemsInPage': 50 }
                }).then(response => {
                    datas.push.apply(datas, response.data.items)
                }).catch(function (error) {
                    console.log("Error '/tickets/nb/open/journa' : " + error.message)
                })
            )
        }

        Promise.all(promises).then(() => {
            var date_ = new Date()
            var date_now = date_.getFullYear() + "-" + date_.getMonth() + "-" + date_.getDay()

            for (l of datas) {
                var date = l.TicketCreatedDate.toString().slice(0, 10)
                if (date == date_now) {
                    if (l.TicketStatus === "Open") {
                        nb++
                    }
                }
            }
            nbticketopenjourna = { nb }
            res.send(nbticketopenjourna)
        })
    }).catch(function (error) {
        console.log("Error '/tickets/nb/open/journa' : " + error.message)
    })
})

app.get('/tickets/nb/pending/journa', (req, res) => {
    var date_ = new Date();
    var time_sys = date_.getFullYear() + "/" + date_.getMonth() + "/" + date_.getDay() + " " + date_.getHours() + ":" + date_.getMinutes() + ":" + date_.getSeconds()
    console.log(time_sys + " | Connexion : '/tickets/nb/pending/journa'")
    let nbPage = 0
    let datas = [];
    let promises = [];
    let nbticketpendingjourna = {}
    let nb = 0
    axios({
        method: 'get',
        url: 'https://app.atera.com/api/v3/tickets',
        headers: { 'Accept': 'application/json', 'X-API-KEY': api_key },
        params: { 'page': 1, 'itemsInPage': 50 }
    }).then(response => {
        nbPage = response.data.totalPages
        datas.push.apply(datas, response.data.items)
        for (i = 2; i <= nbPage; i++) {
            promises.push(
                axios({
                    method: 'get',
                    url: 'https://app.atera.com/api/v3/tickets',
                    headers: { 'Accept': 'application/json', 'X-API-KEY': api_key },
                    params: { 'page': i, 'itemsInPage': 50 }
                }).then(response => {
                    datas.push.apply(datas, response.data.items)
                }).catch(function (error) {
                    console.log("Error '/tickets/nb/pending/journa' : " + error.message)
                })
            )
        }

        Promise.all(promises).then(() => {
            var date_ = new Date()
            var date_now = date_.getFullYear() + "-" + date_.getMonth() + "-" + date_.getDay()

            for (l of datas) {
                var date = l.TicketCreatedDate.toString().slice(0, 10)
                if (date == date_now) {
                    if (l.TicketStatus === "Pending") {
                        nb++
                    }
                }
            }
            nbticketpendingjourna = { nb }
            res.send(nbticketpendingjourna)
        })
    }).catch(function (error) {
        console.log("Error '/tickets/nb/pending/journa' : " + error.message)
    })
})

app.get('/tickets/nb/close/journa', (req, res) => {
    var date_ = new Date();
    var time_sys = date_.getFullYear() + "/" + date_.getMonth() + "/" + date_.getDay() + " " + date_.getHours() + ":" + date_.getMinutes() + ":" + date_.getSeconds()
    console.log(time_sys + " | Connexion : '/tickets/nb/close/journa'")
    let nbPage = 0
    let datas = [];
    let promises = [];
    let nbticketclosejourna = {}
    let nb = 0
    axios({
        method: 'get',
        url: 'https://app.atera.com/api/v3/tickets',
        headers: { 'Accept': 'application/json', 'X-API-KEY': api_key },
        params: { 'page': 1, 'itemsInPage': 50 }
    }).then(response => {
        nbPage = response.data.totalPages
        datas.push.apply(datas, response.data.items)
        for (i = 2; i <= nbPage; i++) {
            promises.push(
                axios({
                    method: 'get',
                    url: 'https://app.atera.com/api/v3/tickets',
                    headers: { 'Accept': 'application/json', 'X-API-KEY': api_key },
                    params: { 'page': i, 'itemsInPage': 50 }
                }).then(response => {
                    datas.push.apply(datas, response.data.items)
                }).catch(function (error) {
                    console.log("Error '/tickets/nb/close/journa' : " + error.message)
                })
            )
        }

        Promise.all(promises).then(() => {
            var date_now = date_.getFullYear() + "-" + date_.getMonth() + "-" + date_.getDay()

            for (l of datas) {
                var date = l.TicketCreatedDate.toString().slice(0, 10)
                if (date == date_now) {
                    if (l.TicketStatus === "Closed" || l.TicketStatus === "Resolved") {
                        nb++
                    }
                }
            }
            nbticketclosejourna = { nb }
            res.send(nbticketclosejourna)
        })
    }).catch(function (error) {
        console.log("Error '/tickets/nb/close/journa' : " + error.message)
    })
})

app.get('/contracts', (req, res) => {
    var date_ = new Date();
    var time_sys = date_.getFullYear() + "/" + date_.getMonth() + "/" + date_.getDay() + " " + date_.getHours() + ":" + date_.getMinutes() + ":" + date_.getSeconds()
    console.log(time_sys + " | Connexion : '/contracts'")
    let nbPage = 0
    let datas = [];
    let promises = [];
    axios({
        method: 'get',
        url: 'https://app.atera.com/api/v3/contracts',
        headers: { 'Accept': 'application/json', 'X-API-KEY': api_key },
        params: { 'page': 1, 'itemsInPage': 50 }
    }).then(response => {
        nbPage = response.data.totalPages
        datas.push.apply(datas, response.data.items)
        for (i = 2; i <= nbPage; i++) {
            promises.push(
                axios({
                    method: 'get',
                    url: 'https://app.atera.com/api/v3/contracts',
                    headers: { 'Accept': 'application/json', 'X-API-KEY': api_key },
                    params: { 'page': i, 'itemsInPage': 50 }
                }).then(response => {
                    datas.push.apply(datas, response.data.items)
                }).catch(function (error) {
                    console.log("Error '/contracts' : " + error.message)
                })
            )
        }

        Promise.all(promises).then(() => res.send(datas));
    }).catch(function (error) {
        console.log("Error '/contracts' : " + error.message)
    })
})

app.get('/contracts/expire', (req, res) => {
    var date_ = new Date();
    var time_sys = date_.getFullYear() + "/" + date_.getMonth() + "/" + date_.getDay() + " " + date_.getHours() + ":" + date_.getMinutes() + ":" + date_.getSeconds()
    console.log(time_sys + " | Connexion : '/contracts/expire'")
    let nbPage = 0
    let datas = [];
    let promises = [];
    let send = []
    axios({
        method: 'get',
        url: 'https://app.atera.com/api/v3/contracts',
        headers: { 'Accept': 'application/json', 'X-API-KEY': api_key },
        params: { 'page': 1, 'itemsInPage': 50 }
    }).then(response => {
        nbPage = response.data.totalPages
        datas.push.apply(datas, response.data.items)
        for (i = 2; i <= nbPage; i++) {
            promises.push(
                axios({
                    method: 'get',
                    url: 'https://app.atera.com/api/v3/contracts',
                    headers: { 'Accept': 'application/json', 'X-API-KEY': api_key },
                    params: { 'page': i, 'itemsInPage': 50 }
                }).then(response => {
                    datas.push.apply(datas, response.data.items)
                }).catch(function (error) {
                    console.log("Error '/contracts/expire' : " + error.message)
                })
            )
        }

        Promise.all(promises).then(() => {
            var date_now = date_.getFullYear() + "-" + date_.getMonth() + "-" + date_.getDay()
            for (c of datas) {
                var date = c.EndDate.toString().slice(0, 10)
                if (date <= date_now) {
                    send.push(c)
                }
            }
            res.send(send)
        });
    }).catch(function (error) {
        console.log("Error '/contracts/expire' : " + error.message)
    })
})

app.get('/contracts/valide', (req, res) => {
    var date_ = new Date();
    var time_sys = date_.getFullYear() + "/" + date_.getMonth() + "/" + date_.getDay() + " " + date_.getHours() + ":" + date_.getMinutes() + ":" + date_.getSeconds()
    console.log(time_sys + " | Connexion : '/contracts/valide'")
    let nbPage = 0
    let datas = [];
    let promises = [];
    let send = []
    axios({
        method: 'get',
        url: 'https://app.atera.com/api/v3/contracts',
        headers: { 'Accept': 'application/json', 'X-API-KEY': api_key },
        params: { 'page': 1, 'itemsInPage': 50 }
    }).then(response => {
        nbPage = response.data.totalPages
        datas.push.apply(datas, response.data.items)
        for (i = 2; i <= nbPage; i++) {
            promises.push(
                axios({
                    method: 'get',
                    url: 'https://app.atera.com/api/v3/contracts',
                    headers: { 'Accept': 'application/json', 'X-API-KEY': api_key },
                    params: { 'page': i, 'itemsInPage': 50 }
                }).then(response => {
                    datas.push.apply(datas, response.data.items)
                }).catch(function (error) {
                    console.log("Error '/contracts/valide' : " + error.message)
                })
            )
        }

        Promise.all(promises).then(() => {
            var date_now = date_.getFullYear() + "-" + date_.getMonth() + "-" + date_.getDay()
            for (c of datas) {
                var date = c.EndDate.toString().slice(0, 10)
                if (date >= date_now) {
                    send.push(c)
                }
            }
            res.send(send)
        });
    }).catch(function (error) {
        console.log("Error '/contracts/valide' : " + error.message)
    })
})
