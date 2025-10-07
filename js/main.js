const dateInput = document.getElementById('date')
const btnLoadTable = document.getElementById('loadTable')
const btnCalculator = document.getElementById('exchangeRateCalculator')
const tableView = document.getElementById('tableView')
const calculatorView = document.getElementById('calculatorView')

const API_URL_PRIVAT = `https://api.privatbank.ua/p24api/exchange_rates?json&date=`
const presentDate = new Date().toLocaleDateString()

btnLoadTable.addEventListener(('click'), () => changeView('table'))
btnCalculator.addEventListener(('click'), () => changeView('calculator'))

async function changeView(view) {
    switch (view) {
        case 'table':{
            tableView.style.display = 'block'
            calculatorView.style.display = 'none'
            const chosenDate = dateInput.value.split('-').reverse().join('.')

            try {
                const respone = await fetch(API_URL_PRIVAT + chosenDate)
                const data = await respone.json()
                showTable(data)
                console.log(data)

            } catch (error) {
                console.error(error)
                tableView.innerHTML = '<h2 style="text-align:center">Помилка завантаження даних. Вкажіть дату для перегляду курсу валют</h2>'
            }
            break
        }
        case 'calculator':{
            tableView.style.display = 'none'
            calculatorView.style.display = 'block'

            try {
                const respone = await fetch(API_URL_PRIVAT + presentDate)
                const data = await respone.json()
                showCalculator(data)
                console.log(data)

            } catch (error) {
                console.error
                calculatorView.innerHTML = '<h2 style="text-align:center">Сталася помилка</h2>'
            }
            break
        }
        
        default:
            tableView.style.display = 'none'
            calculatorView.style.display = 'none'
    }
}

function showTable(data) {
    tableView.innerHTML = ''

    const header = document.createElement('h1')
    header.textContent = `Курс валют на ${data.date}`
    header.style.textAlign = 'center'
    tableView.appendChild(header)

    const table = document.createElement('table')
    table.style.borderCollapse = 'collapse'
    table.style.width = '70%'
    table.style.margin = '0 auto'

    const tr = document.createElement('tr')
    const headers = ['Валюта', 'Курс НБУ', 'Купівля', 'Продаж']
    headers.forEach(text => {
        const th = document.createElement('th')
        th.textContent = text
        th.style.border = '1px solid gray'
        th.style.padding = '6px'
        tr.appendChild(th)
    })
    table.appendChild(tr)

    const highlightCurrencies = ['USD', 'EUR', 'GBP', 'CHF', 'PLN', 'CZK']

    data.exchangeRate.forEach(rate => {
        if (rate.currency === 'UAH') return

        const row = document.createElement('tr')

        if (highlightCurrencies.includes(rate.currency)) {
            row.style.backgroundColor = '#b7f39a'
        }

        const tdCurrency = document.createElement('td')
        tdCurrency.textContent = rate.currency

        const tdSaleRate = document.createElement('td')
        tdSaleRate.textContent = rate.saleRateNB?.toFixed(2) || '-'

        const tdPurchaseRate = document.createElement('td')
        tdPurchaseRate.textContent = rate.purchaseRateNB?.toFixed(2) || '-'

        const tdSaleRatePrivat = document.createElement('td')
        tdSaleRatePrivat.textContent = rate.saleRate?.toFixed(2) || '-'

        row.append(tdCurrency, tdSaleRate, tdPurchaseRate, tdSaleRatePrivat)
        table.appendChild(row)
    })

    tableView.appendChild(table)
}

function showCalculator(data){
    calculatorView.innerHTML = ''

    const selectedCurrencies = ['USD', 'EUR', 'GBP', 'CHF', 'PLN', 'CZK']

    const container = document.createElement('div')
    container.style.textAlign = 'center'
    container.classList.add('container')

    const header = document.createElement('h1')
    header.textContent = `
    Курс обміну валют на ${presentDate}`
    header.style.textAlign = 'center'
    container.appendChild(header)

    const input = document.createElement('input')
    input.type = 'number'
    input.placeholder = 'Сума в UAH'
    input.classList.add('inputAmount')
    container.appendChild(input)

    const select = document.createElement('select')
    data.exchangeRate.forEach(rate => {
        if (selectedCurrencies.includes(rate.currency) && rate.saleRate) {
            const option = document.createElement('option')
            option.value = rate.currency
            option.textContent = rate.currency
            select.appendChild(option)
        }
    })
    container.appendChild(select)

    const button = document.createElement('button')
    button.textContent = 'Обчислити'
    button.classList.add('calculateButton')
    container.appendChild(button)

    const result = document.createElement('h2')
    result.classList.add('result')
    container.appendChild(result)

    button.addEventListener('click', () => {
        const amountUAH = parseFloat(input.value)
        const selectedCurrency = select.value
        const rate = data.exchangeRate.find(r => r.currency === selectedCurrency)
        if (!amountUAH || !rate?.purchaseRateNB) {
            result.textContent = 'Ви не ввели суму для прорахунку!'
            return
        }
        const converted = (amountUAH / rate.purchaseRateNB).toFixed(2)
        result.textContent = `${amountUAH} UAH = ${converted} ${selectedCurrency}. Курс ${rate.saleRate.toFixed(2)} за один ${selectedCurrency} до UAH (за курсом Приват Банку)`
    })

    calculatorView.appendChild(container)
}