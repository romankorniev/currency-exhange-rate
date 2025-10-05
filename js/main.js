const date = document.getElementById('date')
const btn = document.getElementById('loadPrivat')
const output = document.getElementById('output')

btn.addEventListener('click', showPrivat)

const API_URL_PRIVAT = `https://api.privatbank.ua/p24api/exchange_rates?json&date=`

async function showPrivat() {
    try {
        const chosenDate = date.value.split("-").reverse().join('.')
        const response = await fetch(API_URL_PRIVAT + chosenDate)

        const data = await response.json()

        console.log(data)
        showData(data)

    } catch (error) {
        console.log('Error:', error)
    }
}

function showData(data) {
    output.innerHTML = ''

    const header = document.createElement('h1')
    header.textContent = `Курс валют на : ${data.date}`
    output.appendChild(header)
    header.style.textAlign = 'center'

    const table = document.createElement('table')
    table.style.borderCollapse = 'collapse'
    table.style.width = '70%'
    table.style.margin = '0 auto'

    const tr = document.createElement('tr')
    const headers = ['Валюта', 'Курс НБУ', 'Купівля', 'Продаж']

    headers.forEach((text) =>{
        const th = document.createElement('th')
        th.textContent = text
        th.style.border = '1px solid gray'
        tr.appendChild(th)
    })
    
    table.appendChild(tr)

    const highlightCurrencies = ['USD', 'EUR', 'GBP', 'CHF', 'PLN', 'CZK']

    data.exchangeRate.forEach((rate)=>{
        if (rate.currency === 'UAH') return

        const row = document.createElement('tr')

        const tdCurrency = document.createElement('td')
        tdCurrency.textContent = rate.currency

        if (highlightCurrencies.includes(rate.currency)) {
            row.style.backgroundColor = '#b7f39aff'
        }

        const tdSaleRate = document.createElement('td')
        tdSaleRate.textContent = rate.saleRateNB?.toFixed(2) || '-'

        const tdPurchaseRate = document.createElement('td')
        tdPurchaseRate.textContent = rate.purchaseRateNB?.toFixed(2) || '-'

        const tdSaleratePrivat = document.createElement('td')
        tdSaleratePrivat.textContent = rate.saleRate?.toFixed(2) || '-'

        row.append(tdCurrency, tdSaleRate, tdPurchaseRate, tdSaleratePrivat)
        table.appendChild(row)
    })

    output.appendChild(table)
}