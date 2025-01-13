function returnname() {    
    const input = document.getElementById('namesearch').value;
    const resultsContainer = document.getElementById('card-results');
    
    fetch(`https://api.pokemontcg.io/v2/cards?q=name:${input}`)
        .then((response) => response.json())
        .then((json) => {
            resultsContainer.innerHTML = ''; 
            
            if (json.data && json.data.length > 0) {
                const cardsWrapper = document.createElement('div');
                cardsWrapper.className = 'cards-grid';
                
                json.data.map(card => {
                    const cardElement = document.createElement('div');
                    cardElement.className = 'card-item';
                    cardElement.innerHTML = `
                        <img src="${card.images.small}" alt="${card.name}">
                    `;
                    
                    cardElement.onclick = () => {
                        showCardDetails(card);
                    };
                    
                    cardsWrapper.appendChild(cardElement);
                });
                
                resultsContainer.appendChild(cardsWrapper);
            } else {
                resultsContainer.innerHTML = 'No cards found';
            }
        });
}

function showCardDetails(card) {
    const modalHTML = `
        <div class="modal-content">
            <span class="close-btn">&times;</span>
            <div class="modal-grid">
                <div class="card-image">
                    <img src="${card.images.large}" alt="${card.name}">
                </div>
                <div class="card-details">
                    <h2>${card.name}</h2>
                    <p>Set: ${card.set.name}</p>
                    <p>Artist: ${card.artist}</p>
                    ${card.cardmarket?.prices?.averageSellPrice ? 
                        `<a href="${card.cardmarket.url}">Price: €${card.cardmarket.prices.averageSellPrice.toFixed(2)}</a>` 
                        : ''}
                    
                    ${card.attacks ? `
                        <div class="attacks-section">
                            <h3>Attacks:</h3>
                            ${card.attacks.map(attack => `
                                <div class="attack">
                                    <strong>${attack.name}</strong> - Damage: ${attack.damage || 'N/A'}
                                    <p>${attack.text || ''}</p>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    
                    ${card.weaknesses ? `
                        <div class="weaknesses-section">
                            <h3>Weaknesses:</h3>
                            ${card.weaknesses.map(weakness => `${weakness.type} ${weakness.value}`).join(', ')}
                        </div>
                    ` : ''}

                    ${card.resistances ? `
                        <div class="weaknesses-section">
                            <h3>Resistances:</h3>
                            ${card.resistances.map(resistances => `${resistances.type} ${resistances.value}`).join(', ')}
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

    const modal = document.getElementById('card-modal');
    modal.innerHTML = modalHTML;
    modal.style.display = 'block';

    modal.querySelector('.close-btn').onclick = () => {
        modal.style.display = 'none';
    };


    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
}
