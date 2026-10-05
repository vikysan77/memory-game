function createElementHelper(tagName, className) {
    const element = document.createElement(tagName);

    if (className) {
        element.className = className;
    }

    return element;
}

function createButton(text, className) {
    const button = createElementHelper("button", className);
    button.type = "button";
    button.textContent = text;
    return button;
}

function createStat(labelText) {
    const box = createElementHelper("p", "stat");

    const label = createElementHelper("span", "stat-label");
    label.textContent = labelText;

    const value = createElementHelper("span", "stat-value");
    value.setAttribute("aria-live", "polite");

    box.append(label, value);

    return {
        box: box,
        value: value,
    };
}

const newGameButton = createButton("Новая игра", "button button-gold");
const leadersButton = createButton("Таблица лидеров", "button button-stone");

const eyebrow = createElementHelper("p", "brand-eyebrow");
eyebrow.textContent = "World of Warcraft";

const pageTitle = createElementHelper("h1", "brand-title");
pageTitle.textContent = "Память Азерота";

const brand = createElementHelper("div", "brand");
brand.append(eyebrow, pageTitle);

const headerActions = createElementHelper("div", "header-actions");
headerActions.append(newGameButton, leadersButton);

const header = createElementHelper("header", "header");
header.append(brand, headerActions);

const movesStat = createStat("Ходы");
const pairsStat = createStat("Пары");

const stats = createElementHelper("section", "stats");
stats.setAttribute("aria-label", "Счёт игры");
stats.append(movesStat.box, pairsStat.box);

const board = createElementHelper("div", "board");

const playfield = createElementHelper("main", "table");
playfield.setAttribute("aria-label", "Игровое поле");
playfield.append(board);

const app = createElementHelper("div", "app");
app.append(header, stats, playfield);
document.body.append(app);

const dialog = createElementHelper("dialog", "modal");
const modalTitle = createElementHelper("h2", "modal-title");
const modalContent = createElementHelper("div", "modal-content");
const modalPanel = createElementHelper("div", "modal-panel");

modalTitle.id = "modal-title";
dialog.setAttribute("aria-labelledby", "modal-title");
modalPanel.append(modalTitle, modalContent);
dialog.append(modalPanel);
document.body.append(dialog);

function openModal(titleText, fillContent) {
    modalTitle.textContent = titleText;
    modalContent.replaceChildren();
    fillContent(modalContent);
    document.documentElement.classList.add("scroll-lock");

    if (!dialog.open) {
        dialog.showModal();
    }
}

function closeModal() {
    if (dialog.open) {
        dialog.close();
    }
}

const IMAGE_FOLDER = "assets/cards";
const PAIR_COUNT = 8;
const CLOSE_DELAY = 1000;

let moves = 0;
let foundPairs = 0;
let firstCard = null;
let isLocked = false;
let isFinished = false;
let closeTimer = null;

const CARD_TYPES = [
    { id: "murloc", name: "Мурлок" },
    { id: "dragon", name: "Дракон" },
    { id: "deathknight", name: "Рыцарь смерти" },
    { id: "mage", name: "Маг" },
    { id: "orc", name: "Орк-воин" },
    { id: "paladin", name: "Паладин" },
    { id: "druid", name: "Друид" },
    { id: "goblin", name: "Гоблин" },
];

function shuffle(list) {
    const copy = list.slice();

    for (let i = copy.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        const temp = copy[i];
        copy[i] = copy[randomIndex];
        copy[randomIndex] = temp;
    }

    return copy;
}

function createShuffledDeck() {
    const deck = [];

    for (let i = 0; i < CARD_TYPES.length; i++) {
        const type = CARD_TYPES[i];
        deck.push({ id: type.id, name: type.name });
        deck.push({ id: type.id, name: type.name });
    }

    return shuffle(deck);
}

function createPicture(fileName) {
    const image = createElementHelper("img", "card-image");
    image.src = IMAGE_FOLDER + "/" + fileName;
    image.alt = "";
    image.draggable = false;
    return image;
}

function createCardButton(card) {
    const button = createElementHelper("button", "card");
    button.type = "button";
    button.setAttribute("aria-label", "Закрытая карточка");

    const inner = createElementHelper("span", "card-inner");

    const back = createElementHelper("span", "card-face card-face-back");
    back.setAttribute("aria-hidden", "true");
    back.append(createPicture("card-back.jpg"));

    const front = createElementHelper("span", "card-face card-face-front");
    front.setAttribute("aria-hidden", "true");
    front.append(createPicture(card.id + ".jpg"));

    const name = createElementHelper("span", "card-name");
    name.textContent = card.name;
    front.append(name);

    inner.append(back, front);
    button.append(inner);
    return button;
}

function drawBoard() {
    const deck = createShuffledDeck();
    const cards = [];

    for (let i = 0; i < deck.length; i++) {
        const card = {
            id: deck[i].id,
            name: deck[i].name,
            isOpen: false,
            isMatched: false,
            button: createCardButton(deck[i]),
        };

        cards.push(card);
    }

    board.replaceChildren();

    for (let i = 0; i < cards.length; i++) {
        bindCardButton(cards[i]);
        board.append(cards[i].button);
    }
}

function startNewGame() {

    if (closeTimer !== null) {
        clearTimeout(closeTimer);
        closeTimer = null;
    }

    moves = 0;
    foundPairs = 0;
    firstCard = null;
    isLocked = false;
    isFinished = false;

    movesStat.value.textContent = "0";
    pairsStat.value.textContent = "0 из " + PAIR_COUNT;
    drawBoard();
}

newGameButton.addEventListener("click", function () {
    startNewGame();
});

function bindCardButton(card) {
    card.button.addEventListener("click", function () {
        onCardClick(card);
    });
}

function onCardClick(card) {
    if (isFinished || isLocked || card.isOpen || card.isMatched) {
        return;
    }

    openCard(card);

    if (firstCard === null) {
        firstCard = card;
        return;
    }

    const previousCard = firstCard;
    firstCard = null;

    moves = moves + 1;
    movesStat.value.textContent = String(moves);

    if (previousCard.id === card.id) {
        markFound(previousCard);
        markFound(card);

        foundPairs = foundPairs + 1;
        pairsStat.value.textContent = foundPairs + " из " + PAIR_COUNT;

        if (foundPairs === PAIR_COUNT) {
            isFinished = true;
            openWinModal()
        }

        return;
    }

    isLocked = true;
    previousCard.button.classList.add("is-mismatch");
    card.button.classList.add("is-mismatch");

    closeTimer = setTimeout(function () {
        closeTimer = null;
        closeCard(previousCard);
        closeCard(card);
        isLocked = false;
    }, CLOSE_DELAY);
}

function openCard(card) {
    card.isOpen = true;
    card.button.classList.add("is-open");
    card.button.setAttribute("aria-label", card.name);
}

function closeCard(card) {
    card.isOpen = false;
    card.button.classList.remove("is-open");
    card.button.classList.remove("is-mismatch");
    card.button.setAttribute("aria-label", "Закрытая карточка");
}

function markFound(card) {
    card.isMatched = true;
    card.button.classList.add("is-matched");
    card.button.setAttribute("aria-label", "Найдена пара: " + card.name);
}

function openWinModal() {
    openModal("Победа!", function (container) {
        const text = createElementHelper("p", "modal-text");
        text.textContent = "Все пары найдены. Барды Азерота сложат о тебе песню.";

        const score = createElementHelper("p", "modal-score");

        const scoreLabel = createElementHelper("span", "modal-score-label");
        scoreLabel.textContent = "Ходов";

        const scoreValue = createElementHelper("span", "modal-score-value");
        scoreValue.textContent = String(moves);

        score.append(scoreLabel, scoreValue);

        const actions = createElementHelper("div", "modal-actions");
        const againButton = createButton("Новая игра", "button button-gold");
        const closeButton = createButton("Закрыть", "button button-stone");

        againButton.addEventListener("click", function () {
            closeModal();
            startNewGame();
        });

        closeButton.addEventListener("click", function () {
            closeModal();
        });

        actions.append(againButton, closeButton);
        container.append(text, score, actions);
    });
}
