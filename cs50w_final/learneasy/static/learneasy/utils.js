window.addEventListener('DOMContentLoaded', () => {

    // Autogrow textarea

    autogrow_textarea();

    // Add card

    const new_module_cards_container = document.querySelector('.new_module_cards_container');
    const add_card_container = document.querySelector('.add_card_container');
    add_card_container.addEventListener('click', () => {
        const new_card_num = new_module_cards_container.childNodes.length;
        create_new_card(new_module_cards_container, new_card_num);
    });

    // Delete cards
    const delete_icons = document.querySelectorAll('.delete_card_icon');
    for (const icon of delete_icons) {
        icon.addEventListener('click', () => deleteCard(icon));
    }
});

function create_new_card(parentDiv, num) {
    const new_module_card_container_new = document.createElement('div');
    const textareas_container_new = document.createElement('div');
    const trash_bin = document.createElement('div');
    const term_container = document.createElement('div');
    const definition_container = document.createElement('div');
    const term_textarea = document.createElement('textarea');
    const definition_textarea = document.createElement('textarea');
    const term_textarea_label = document.createElement('label');
    const definition_textarea_label = document.createElement('label');
    
    new_module_card_container_new.classList.add('new_module_card_container');
    textareas_container_new.classList.add('textareas_container');
    trash_bin.innerHTML = '<svg class="delete_card_icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>';
    term_container.classList.add('term');
    definition_container.classList.add('definition');

    term_textarea.setAttribute('name', `term${num}`);
    term_textarea.setAttribute('id', `term${num}`);
    term_textarea_label.setAttribute('for', `term${num}`);
    term_textarea_label.textContent = 'Term';
    definition_textarea.setAttribute('name', `definition${num}`);
    definition_textarea.setAttribute('id', `definition${num}`);
    definition_textarea.classList.add('definition_texarea');
    definition_textarea_label.setAttribute('for', `definition${num}`);
    definition_textarea_label.textContent = 'Definition';

    parentDiv.insertBefore(new_module_card_container_new, parentDiv.lastElementChild);
    new_module_card_container_new.append(textareas_container_new, trash_bin);
    textareas_container_new.append(term_container, definition_container);
    term_container.append(term_textarea, term_textarea_label);
    definition_container.append(definition_textarea, definition_textarea_label);

    // Add event listeners for new elements

    definition_textarea.addEventListener('input', () => {
        definition_textarea.style.height = `${definition_textarea.scrollHeight}px`;
    });

    trash_bin.addEventListener('click', () => deleteCard(trash_bin));
};

function autogrow_textarea() {
    const definition_texarea = document.querySelectorAll('.definition_texarea');
    definition_texarea.forEach(textarea => {
        textarea.addEventListener('input', () => {
            textarea.style.height = `${textarea.scrollHeight}px`;
        });
    });
};

function deleteCard(icon) {
    const card = icon.parentElement;
    const textarea_term = icon.previousElementSibling.firstElementChild.firstElementChild;
    const textarea_def = icon.previousElementSibling.lastElementChild.firstElementChild;
    console.log(icon.previousElementSibling);
    icon.previousElementSibling.style.height = "0px";
    textarea_term.style.height = "0px";
    textarea_term.style.border = "none";
    textarea_term.nextElementSibling.style.fontSize = "0";
    textarea_def.style.height = "0px";
    textarea_def.style.border = "none";
    textarea_def.nextElementSibling.style.fontSize = "0";
    card.style.height = "0px";
    card.style.padding = "0px";
    setTimeout(() => {
        card.remove();
    }, 600);
}