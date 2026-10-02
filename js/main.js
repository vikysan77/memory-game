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

const IMAGE_FOLDER = "assets/cards";

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
    const deck = [];

    for (let i = 0; i < CARD_TYPES.length; i++) {
        const type = CARD_TYPES[i];
        deck.push({ id: type.id, name: type.name });
        deck.push({ id: type.id, name: type.name });
    }

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

        board.append(cards[i].button);
    }
}
drawBoard();
