// Données des devises (dans un cas réel, celles-ci viendraient d'une API)
        const currencies = {
            "USD": { name: "Dollar américain", flag: "🇺🇸", symbol: "$" },
            "EUR": { name: "Euro", flag: "🇪🇺", symbol: "€" },
            "GBP": { name: "Livre sterling", flag: "🇬🇧", symbol: "£" },
            "JPY": { name: "Yen japonais", flag: "🇯🇵", symbol: "¥" },
            "CAD": { name: "Dollar canadien", flag: "🇨🇦", symbol: "$" },
            "AUD": { name: "Dollar australien", flag: "🇦🇺", symbol: "$" },
            "CHF": { name: "Franc suisse", flag: "🇨🇭", symbol: "CHF" },
            "CNY": { name: "Yuan chinois", flag: "🇨🇳", symbol: "¥" },
            "INR": { name: "Roupie indienne", flag: "🇮🇳", symbol: "₹" },
            "MAD": { name: "Dirham marocain", flag: "🇲🇦", symbol: "DH" },
            "XOF": { name: "Franc CFA", flag: "🌍", symbol: "CFA" },
            "NGN": { name: "Naira nigérian", flag: "🇳🇬", symbol: "₦" },
            "BRL": { name: "Real brésilien", flag: "🇧🇷", symbol: "R$" },
            "RUB": { name: "Rouble russe", flag: "🇷🇺", symbol: "₽" }
        };

        // Taux de change fictifs (dans un cas réel, ceux-ci viendraient d'une API)
        let exchangeRates = {
            "USD": 1.07,
            "EUR": 1.0,
            "GBP": 0.86,
            "JPY": 156.42,
            "CAD": 1.46,
            "AUD": 1.63,
            "CHF": 0.95,
            "CNY": 7.76,
            "INR": 88.92,
            "MAD": 10.75,
            "XOF": 655.96,
            "NGN": 842.50,
            "BRL": 5.36,
            "RUB": 97.85
        };

        // Historique de conversion
        let conversionHistory = [];

        // Initialisation de l'application
        document.addEventListener('DOMContentLoaded', function() {
            initCurrencyAnimation();
            populateCurrencySelects();
            populateRatesTable();
            updateLastUpdateTime();
            
            // Écouteurs d'événements
            document.getElementById('converterForm').addEventListener('submit', handleConversion);
            document.getElementById('swapButton').addEventListener('click', swapCurrencies);
            document.getElementById('refreshRates').addEventListener('click', refreshRates);
            document.getElementById('shareButton').addEventListener('click', shareConversion);
            document.getElementById('historyButton').addEventListener('click', showHistory);
            document.getElementById('amount').addEventListener('input', handleAmountChange);
            
            // Conversion automatique au chargement
            performConversion();
            
            // Animation de chargement
            setTimeout(() => {
                document.getElementById('resultSection').classList.add('show');
            }, 800);
        });

        // Création de l'animation des symboles de devises dans l'en-tête
        function initCurrencyAnimation() {
            const animationContainer = document.getElementById('currencyAnimation');
            const symbols = ['$', '€', '£', '¥', '₹', '₽', '₦', 'R$', 'DH', 'CFA'];
            
            for (let i = 0; i < 15; i++) {
                const symbol = document.createElement('div');
                symbol.className = 'currency-symbol';
                symbol.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                symbol.style.left = `${Math.random() * 100}%`;
                symbol.style.top = `${Math.random() * 100}%`;
                symbol.style.animationDelay = `${Math.random() * 5}s`;
                symbol.style.fontSize = `${Math.random() * 1.5 + 1}rem`;
                animationContainer.appendChild(symbol);
            }
        }

        // Remplir les sélecteurs de devises
        function populateCurrencySelects() {
            const fromSelect = document.getElementById('fromCurrency');
            const toSelect = document.getElementById('toCurrency');
            
            // Vider les sélecteurs
            fromSelect.innerHTML = '';
            toSelect.innerHTML = '';
            
            // Ajouter les options
            for (const code in currencies) {
                const option1 = document.createElement('option');
                option1.value = code;
                option1.textContent = `${code} - ${currencies[code].name}`;
                option1.selected = code === "EUR";
                
                const option2 = document.createElement('option');
                option2.value = code;
                option2.textContent = `${code} - ${currencies[code].name}`;
                option2.selected = code === "USD";
                
                fromSelect.appendChild(option1);
                toSelect.appendChild(option2);
            }
        }

        // Remplir le tableau des taux
        function populateRatesTable() {
            const tableBody = document.getElementById('ratesTable');
            tableBody.innerHTML = '';
            
            // Créer un tableau des devises triées
            const sortedCurrencies = Object.keys(currencies).sort();
            
            sortedCurrencies.forEach(code => {
                if (code === "EUR") return; // On saute l'EUR car c'est la devise de référence
                
                const row = document.createElement('tr');
                
                // Données fictives pour l'évolution
                const change = (Math.random() - 0.5) * 0.1;
                const changeClass = change >= 0 ? 'positive' : 'negative';
                const changeSymbol = change >= 0 ? '+' : '';
                
                row.innerHTML = `
                    <td>
                        <span class="currency-flag">${currencies[code].flag}</span>
                        ${currencies[code].name}
                    </td>
                    <td><strong>${code}</strong></td>
                    <td>${exchangeRates[code].toFixed(4)}</td>
                    <td class="currency-change ${changeClass}">
                        ${changeSymbol}${change.toFixed(2)}%
                    </td>
                `;
                
                tableBody.appendChild(row);
            });
        }

        // Mettre à jour l'heure de la dernière mise à jour
        function updateLastUpdateTime() {
            const now = new Date();
            const formattedTime = now.toLocaleTimeString('fr-FR', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit'
            });
            const formattedDate = now.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
            document.getElementById('updateTime').textContent = 
                `Dernière mise à jour: ${formattedDate} ${formattedTime}`;
        }

        // Gérer la conversion
        function handleConversion(e) {
            e.preventDefault();
            performConversion();
            
            // Animation de résultat
            const resultSection = document.getElementById('resultSection');
            resultSection.classList.remove('show');
            setTimeout(() => {
                resultSection.classList.add('show');
            }, 10);
        }

        // Effectuer la conversion
        function performConversion() {
            const amount = parseFloat(document.getElementById('amount').value);
            const fromCurrency = document.getElementById('fromCurrency').value;
            const toCurrency = document.getElementById('toCurrency').value;
            
            // Vérifier si le montant est valide
            if (isNaN(amount) || amount < 0) {
                alert("Veuillez entrer un montant valide");
                return;
            }
            
            // Taux de conversion (tous les taux sont par rapport à l'EUR)
            let convertedAmount;
            
            if (fromCurrency === "EUR") {
                convertedAmount = amount * exchangeRates[toCurrency];
            } else if (toCurrency === "EUR") {
                convertedAmount = amount / exchangeRates[fromCurrency];
            } else {
                // Conversion via EUR
                const amountInEUR = amount / exchangeRates[fromCurrency];
                convertedAmount = amountInEUR * exchangeRates[toCurrency];
            }
            
            // Afficher le résultat
            document.getElementById('convertedAmount').value = convertedAmount.toFixed(2);
            
            // Mettre à jour la section des résultats
            const fromSymbol = currencies[fromCurrency].symbol;
            const toSymbol = currencies[toCurrency].symbol;
            
            document.getElementById('resultAmount').textContent = 
                `${toSymbol} ${convertedAmount.toFixed(2)}`;
            document.getElementById('conversionDetails').textContent = 
                `${fromSymbol} ${amount.toFixed(2)} ${fromCurrency} = ${toSymbol} ${convertedAmount.toFixed(2)} ${toCurrency}`;
            
            // Calculer et afficher le taux de change
            const exchangeRate = convertedAmount / amount;
            document.getElementById('conversionRate').textContent = 
                `Taux de change: 1 ${fromCurrency} = ${exchangeRate.toFixed(4)} ${toCurrency}`;
            
            // Ajouter à l'historique
            addToHistory(amount, fromCurrency, toCurrency, convertedAmount);
        }

        // Échanger les devises
        function swapCurrencies() {
            const fromSelect = document.getElementById('fromCurrency');
            const toSelect = document.getElementById('toCurrency');
            
            const tempValue = fromSelect.value;
            fromSelect.value = toSelect.value;
            toSelect.value = tempValue;
            
            // Effectuer la conversion après l'échange
            performConversion();
        }

        // Actualiser les taux
        function refreshRates() {
            const refreshButton = document.getElementById('refreshRates');
            
            // Animation de rotation
            refreshButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Actualisation...';
            refreshButton.disabled = true;
            
            // Simuler l'appel à une API
            setTimeout(() => {
                // Mettre à jour quelques taux aléatoirement pour simuler une actualisation
                Object.keys(exchangeRates).forEach(code => {
                    if (code !== "EUR") {
                        // Ajouter une petite variation aléatoire
                        const variation = (Math.random() - 0.5) * 0.02;
                        exchangeRates[code] = exchangeRates[code] * (1 + variation);
                    }
                });
                
                // Mettre à jour l'affichage
                populateRatesTable();
                updateLastUpdateTime();
                
                // Réinitialiser le bouton
                refreshButton.innerHTML = '<i class="fas fa-redo-alt"></i> Actualiser';
                refreshButton.disabled = false;
                
                // Montrer une notification
                showNotification("Taux de change actualisés avec succès!", "success");
                
                // Recalculer la conversion actuelle
                performConversion();
            }, 1500);
        }

        // Partager la conversion
        function shareConversion() {
            const amount = document.getElementById('amount').value;
            const fromCurrency = document.getElementById('fromCurrency').value;
            const toCurrency = document.getElementById('toCurrency').value;
            const result = document.getElementById('convertedAmount').value;
            
            const shareText = `J'ai converti ${amount} ${fromCurrency} en ${result} ${toCurrency} avec le Convertisseur de Devises!`;
            
            // Vérifier si l'API Web Share est disponible
            if (navigator.share) {
                navigator.share({
                    title: 'Conversion de devises',
                    text: shareText,
                    url: window.location.href
                });
            } else {
                // Fallback: copier dans le presse-papier
                navigator.clipboard.writeText(shareText)
                    .then(() => {
                        showNotification("Conversion copiée dans le presse-papier!", "success");
                    })
                    .catch(err => {
                        console.error('Erreur lors de la copie: ', err);
                        showNotification("Impossible de copier la conversion", "error");
                    });
            }
        }

        // Afficher l'historique
        function showHistory() {
            if (conversionHistory.length === 0) {
                showNotification("L'historique est vide. Effectuez une conversion d'abord.", "warning");
                return;
            }
            
            let historyText = "Historique des conversions:\n\n";
            conversionHistory.slice(-5).reverse().forEach((conv, index) => {
                historyText += `${index + 1}. ${conv.amount} ${conv.from} → ${conv.result} ${conv.to}\n`;
            });
            
            alert(historyText);
        }

        // Ajouter une conversion à l'historique
        function addToHistory(amount, from, to, result) {
            const conversion = {
                amount: amount.toFixed(2),
                from,
                to,
                result: result.toFixed(2),
                timestamp: new Date().toISOString()
            };
            
            conversionHistory.push(conversion);
            
            // Garder seulement les 20 dernières conversions
            if (conversionHistory.length > 20) {
                conversionHistory.shift();
            }
        }

        // Gérer le changement de montant
        function handleAmountChange() {
            // Si le montant est valide, effectuer la conversion en temps réel
            const amount = parseFloat(document.getElementById('amount').value);
            if (!isNaN(amount) && amount >= 0) {
                performConversion();
            }
        }

        // Afficher une notification
        function showNotification(message, type) {
            // Créer l'élément de notification
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 25px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                animation: fadeInUp 0.3s ease, fadeOut 0.3s ease 2.7s;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            `;
            
            // Appliquer la couleur en fonction du type
            if (type === "success") {
                notification.style.backgroundColor = "var(--success-color)";
            } else if (type === "error") {
                notification.style.backgroundColor = "var(--error-color)";
            } else if (type === "warning") {
                notification.style.backgroundColor = "var(--warning-color)";
            } else {
                notification.style.backgroundColor = "var(--primary-color)";
            }
            
            // Ajouter la notification au document
            document.body.appendChild(notification);
            
            // Supprimer la notification après 3 secondes
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 3000);
        }

        // Ajouter une animation CSS pour le fondu de sortie
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(-20px); }
            }
        `;
        document.head.appendChild(style);


        