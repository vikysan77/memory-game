function createElement(tagName, className) {
    const element = document.createElement(tagName);

    if (className) {
        element.className = className;
    }

    return element;
}

function createButton(text, className) {
    const button = createElement("button", className);
    button.type = "button";
    button.textContent = text;
    return button;
}

function createStat(labelText) {
    const box = createElement("p", "stat");

    const label = createElement("span", "stat-label");
    label.textContent = labelText;

    const value = createElement("span", "stat-value");
    value.setAttribute("aria-live", "polite");

    box.append(label, value);

    return {
        box: box,
        value: value,
    };
}

const newGameButton = createButton("Новая игра", "button button-gold");
const leadersButton = createButton("Таблица лидеров", "button button-stone");

const eyebrow = createElement("p", "brand-eyebrow");
eyebrow.textContent = "World of Warcraft";

const pageTitle = createElement("h1", "brand-title");
pageTitle.textContent = "Память Азерота";

const brand = createElement("div", "brand");
brand.append(eyebrow, pageTitle);

const headerActions = createElement("div", "header-actions");
headerActions.append(newGameButton, leadersButton);

const header = createElement("header", "header");
header.append(brand, headerActions);

const movesStat = createStat("Ходы");
const pairsStat = createStat("Пары");

const stats = createElement("section", "stats");
stats.setAttribute("aria-label", "Счёт игры");
stats.append(movesStat.box, pairsStat.box);

const board = createElement("div", "board");

const playfield = createElement("main", "table");
playfield.setAttribute("aria-label", "Игровое поле");
playfield.append(board);

const app = createElement("div", "app");
app.append(header, stats, playfield);
document.body.append(app);
