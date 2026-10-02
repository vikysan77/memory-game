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
