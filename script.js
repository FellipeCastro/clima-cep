// Capturando o form e a div do resultado
const form = document.getElementById("form")
const resultContainer = document.getElementById("result-container")
const cepInput = document.getElementById("cep")

// Deixando o input em foco
cepInput.focus()

// Adicionando uma ação quando o formulário for enviado
form.addEventListener("submit", (e) => {
    // Previnindo que o formulário seja enviado e seja direcionado a outra página
    e.preventDefault()

    // Limpando o campo de resultado para evitar exibir resultados antigos
    resultContainer.innerHTML = ""
    resultContainer.classList.add("hidden")

    // Capturando valores do formulário
    const cep = document.getElementById("cep").value

    // URL da API ViaCEP com dados do formulário como parâmetro
    const cepUrl = `https://viacep.com.br/ws/${cep}/json/`

    // Fazendo requisição à API do ViaCEP
    fetch(cepUrl)
        .then(res => res.json())
        .then(cepData => {
            // Verificando se o CEP foi encontrado
            if (cepData.erro) {
                // Exibindo mensagem de erro
                resultContainer.innerHTML = "<p class='error'>CEP não encontrado</p>"
                resultContainer.classList.remove("hidden")

                // Limpando o campo de input e colocando o foco de volta no campo de input do CEP
                form.reset()
                cepInput.focus()
                return
            } else {
                // Criando um link para o Google Maps com o endereço enviado
                const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${cepData.logradouro + ', ' + cepData.bairro + ', ' + cepData.localidade + ', ' + cepData.uf}`

                // Criando o HTML para exibir as informações do endereço
                const cepResult = `
                    <div class="result cep-result">
                        <h2>${cepData.cep}</h2>
                        <hr>
                        <img src="img/city-img.svg" alt="Cidade">
                        <p><strong>Rua: </strong>${cepData.logradouro}</p>
                        <p><strong>Bairro: </strong>${cepData.bairro}</p>
                        <p><strong>Cidade: </strong>${cepData.localidade}</p>
                        <p><strong>Estado: </strong>${cepData.estado}</p>
                        <p><a href="${mapsUrl}" target="_blank">Ver no Google Maps</a></p> 
                    </div>
                `

                // Atribuindo valor a variável da cidade
                const city = cepData.localidade
   
                // Variável para a chave da API
                const apiKey = "363a658636f85bd05be2658e0ee68a53"

                // URL da API openweather com base na cidade retornada pelo ViaCEP
                const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`

                // Fazendo requisição à API do OpenWeather
                fetch(weatherUrl)
                    .then(res => res.json())
                    .then(weatherData => {
                        // Criando o HTML para exibir as informações do clima
                        const weatherResult = `
                            <div class="result weather-result">
                                <h2>${cepData.localidade} - ${cepData.uf}</h2>
                                <hr>
                                <div class="infos">
                                    <div class="temp">
                                        <img src="http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png" alt="Clima">
                                        <div>
                                            <h3>${weatherData.main.temp.toFixed(1)}<sup>ºC</sup></h3>
                                            <p>${weatherData.weather[0].description}</p>
                                        </div>
                                    </div>
                                    <div class="other-infos">
                                        <div class="info">
                                            <i class="fa-solid fa-temperature-high"></i>
                                            <div>
                                                <h4>Temp. max</h4>
                                                <p>${weatherData.main.temp_max.toFixed(1)}<sup>ºC</sup></p>
                                            </div>
                                        </div>
                                        <div class="info">
                                            <i class="fa-solid fa-temperature-low"></i>
                                            <div>
                                                <h4>Temp. min</h4>
                                                <p>${weatherData.main.temp_min.toFixed(1)}<sup>ºC</sup></p>
                                            </div>
                                        </div>
                                        <div class="info">
                                            <i class="fa-solid fa-droplet"></i>
                                            <div>
                                                <h4>Humidade</h4>
                                                <p>${weatherData.main.humidity}%</p>
                                            </div>
                                        </div>
                                        <div class="info">
                                            <i class="fa-solid fa-wind"></i>
                                            <div>
                                                <h4>Vento</h4>
                                                <p>${weatherData.wind.speed} km/h</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `

                        // Adicionando HTML no campo de resultado
                        resultContainer.innerHTML = cepResult + weatherResult

                        // Exibindo HTML dos resultados quando ambos forem renderizados
                        resultContainer.classList.remove("hidden")
                        
                        // Limpando o campo de input e colocando o foco de volta no campo de input do CEP
                        form.reset()
                        cepInput.focus()
                    })
                    .catch(err => {
                        // Exibindo mensagem de erro
                        console.error(err)
                        resultContainer.innerHTML += "<p class='error'>Não foi possível obter o clima</p>"
                        resultContainer.classList.remove("hidden")

                        // Limpando o campo de input e colocando o foco de volta no campo de input do CEP
                        form.reset()
                        cepInput.focus()
                    })
            }
        })
        .catch(err => {
            // Exibindo mensagem de erro
            console.error(err)
            resultContainer.innerHTML = "<p class='error'>Digite um CEP válido</p>"
            resultContainer.classList.remove("hidden")

            // Limpando o campo de input e colocando o foco de volta no campo de input do CEP
            form.reset()
            cepInput.focus()
        })
})
