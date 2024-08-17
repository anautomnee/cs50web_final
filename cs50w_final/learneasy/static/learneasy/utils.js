window.addEventListener("DOMContentLoaded", () => {
  // Autogrow textarea
  autogrow_textarea();

  // Add card

  const new_module_cards_container = document.querySelector(
    ".new_module_cards_container"
  );
  const add_card_container = document.querySelector(".add_card_container");
  if (add_card_container) {
    add_card_container.addEventListener("click", () => {
      const new_card_num = new_module_cards_container.childNodes.length;
      create_new_card(new_module_cards_container, new_card_num);
    });
  }

  // Delete cards
  const delete_icons = document.querySelectorAll(".delete_card_icon");
  if (delete_icons) {
    for (const icon of delete_icons) {
      icon.addEventListener("click", () => deleteCard(icon));
    }
  }

  // Flip card
  const flip_card = document.querySelector(".flip_card");
  if (flip_card) {
    const flip_card_inner = document.querySelector(".flip_card_inner");
    flip_card.addEventListener("click", () => {
      if (flip_card_inner.classList.contains("rotated")) {
        console.log("check");
        flip_card_inner.classList.remove("rotated");
        flip_card_inner.style.transform = "rotateX(0deg)";
      }
      flip_card_inner.style.transform = "rotateX(180deg)";
      flip_card_inner.classList.toggle("rotated");
    });
  }

  // Blur groups by scroll
  const scroll_container = document.querySelector(".groups_main_container");
  if (scroll_container) {
    const blur_left = document.querySelector("#blur_edge_left");
    const blur_right = document.querySelector("#blur_edge_right");
    blur_left.hidden = true;
    scroll_container.addEventListener("scroll", () =>
      scrollBlurGroups(scroll_container, blur_left, blur_right)
    );
  }

  // Divide text to words

  const text_content = document.querySelector(".text_content");
  if (text_content) {
    const textArray = text_content.textContent.split(" ");
    text_content.textContent = "";
    textArray.forEach((el, ind) => {
      const wordSpan = document.createElement("span");
      wordSpan.classList.add("translatable_item");
      wordSpan.textContent = el;
      text_content.append(wordSpan);
      if (ind !== textArray.length - 1) {
        const spaceSpan = document.createElement("span");
        spaceSpan.textContent = " ";
        text_content.append(spaceSpan);
      }
    });
  }

  // Words translation popover
  let module_selected_for_translation = false;
  let cards_from_text = false;
  const mini_cards_from_text = [];
  const translatable_item_array =
    document.querySelectorAll(".translatable_item");
  for (word of translatable_item_array) {
    word.addEventListener("click", (ev) => {
      const text = ev.target.textContent.replace(/[^a-zA-Z-]+/g, "");
      let translation = "";
      translateText(text).then((data) => {
        translation = data;

        const translation_popover = document.querySelector(
          "#translation_popover"
        );
        const rect = ev.target.getBoundingClientRect();
        if (translation_popover) {
          translation_popover.remove();
          const popover = createPopover(
            text_content,
            text,
            translation,
            module_selected_for_translation,
            mini_cards_from_text
          );
          popover.style.top = `${rect.bottom}px`;
          popover.style.left = `${rect.right}px`;
        } else {
          const popover = createPopover(
            text_content,
            text,
            translation,
            module_selected_for_translation,
            mini_cards_from_text
          );
          popover.style.top = `${rect.bottom}px`;
          popover.style.left = `${rect.right}px`;
        }
      });
    });
  }

  // Select module for adding word
  const text_modules_select = document.querySelector("#text_modules_select");
  if (text_modules_select) {
    text_modules_select.addEventListener("change", () => {
      if (text_modules_select.value) {
        module_selected_for_translation = true;
        const translation_popover = document.querySelector(
          "#translation_popover"
        );
        if (translation_popover) {
          const btn = document.querySelector("#add_translation");
          btn.disabled = false;
        }
      }
    });
  }
});

// Functions

function create_new_card(parentDiv, num) {
  const new_module_card_container_new = document.createElement("div");
  const textareas_container_new = document.createElement("div");
  const trash_bin = document.createElement("div");
  const term_container = document.createElement("div");
  const definition_container = document.createElement("div");
  const term_textarea = document.createElement("textarea");
  const definition_textarea = document.createElement("textarea");
  const term_textarea_label = document.createElement("label");
  const definition_textarea_label = document.createElement("label");

  new_module_card_container_new.classList.add("new_module_card_container");
  textareas_container_new.classList.add("textareas_container");
  trash_bin.innerHTML =
    '<svg class="delete_card_icon" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>';
  term_container.classList.add("term");
  definition_container.classList.add("definition");

  term_textarea.setAttribute("name", `term${num}`);
  term_textarea.setAttribute("id", `term${num}`);
  term_textarea_label.setAttribute("for", `term${num}`);
  term_textarea_label.textContent = "Term";
  definition_textarea.setAttribute("name", `definition${num}`);
  definition_textarea.setAttribute("id", `definition${num}`);
  definition_textarea.classList.add("definition_texarea");
  definition_textarea_label.setAttribute("for", `definition${num}`);
  definition_textarea_label.textContent = "Definition";

  parentDiv.insertBefore(
    new_module_card_container_new,
    parentDiv.lastElementChild
  );
  new_module_card_container_new.append(textareas_container_new, trash_bin);
  textareas_container_new.append(term_container, definition_container);
  term_container.append(term_textarea, term_textarea_label);
  definition_container.append(definition_textarea, definition_textarea_label);

  // Add event listeners for new elements

  definition_textarea.addEventListener("input", () => {
    definition_textarea.style.height = `${definition_textarea.scrollHeight}px`;
  });

  trash_bin.addEventListener("click", () => deleteCard(trash_bin));
}

function autogrow_textarea() {
  const definition_texarea = document.querySelectorAll(".definition_texarea");
  definition_texarea.forEach((textarea) => {
    textarea.addEventListener("input", () => {
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  });
}

function create_mini_card(parentDiv, term, def) {
  const mini_card_container = document.createElement("div");
  const term_par = document.createElement("p");
  const def_par = document.createElement("p");
  const divider = document.createElement("p");

  parentDiv.append(mini_card_container);
  mini_card_container.classList.add("mini_card_container");
  mini_card_container.append(term_par, divider, def_par);

  term_par.textContent = term;
  def_par.textContent = def;
  divider.innerHTML = "—————";
}

function deleteCard(icon) {
  const card = icon.parentElement;
  const textarea_term =
    icon.previousElementSibling.firstElementChild.firstElementChild;
  const textarea_def =
    icon.previousElementSibling.lastElementChild.firstElementChild;
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

function scrollBlurGroups(container, left, right) {
  console.log(container.scrollLeft);
  if (container.scrollLeft > 205) {
    right.hidden = true;
  } else if (container.scrollLeft > 5 && container.scrollLeft < 205) {
    left.hidden = false;
    right.hidden = false;
  } else if (container.scrollLeft < 5) {
    left.hidden = true;
  }
}

function getCookie(name) {
  var cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

async function translateText(text) {
  try {
    const response = await fetch(`/translate`, {
      method: "POST",
      body: JSON.stringify({ text: text }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.text();
    return result;
  } catch (error) {
    console.error(error.message);
  }
}

function addMiniCardFromText(popover, text, translation, mini_cards) {
  popover.remove();
  const added_cards_container = document.querySelector(
    ".added_cards_container"
  );
  create_mini_card(added_cards_container, text, translation);
  // Add card to mini_cards_from_text array
  mini_cards.push({
    text: text,
    translation: translation,
  });

  // Check if btn exists
  const added_cards_btn_container = document.querySelector(
    ".added_cards_btn_container"
  );
  if (mini_cards.length === 1) {
    const add_card_btn = document.createElement("button");
    add_card_btn.classList.add("add_card_btn_from_text");
    add_card_btn.textContent = "Add to module";
    added_cards_btn_container.append(add_card_btn);

    add_card_btn.addEventListener("click", () => {
      try {
        const text_modules_select = document.querySelector(
          "#text_modules_select"
        );
        mini_cards.forEach(async (card) => {
          const response = await fetch("/add_new_card", {
            method: "POST",
            body: JSON.stringify({
              term: card.text,
              def: card.translation,
              module: text_modules_select.value,
            }),
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": getCookie("csrftoken"),
            },
          });
          if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
          }
        });
        const added_note = document.createElement("span");
        added_note.classList.add("added_note");
        added_note.textContent = "Cards successfully added";
        added_cards_btn_container.append(added_note);
        add_card_btn.disabled = true;
        mini_cards.length = 0;
        console.log(mini_cards);
      } catch (error) {
        console.log(error);
      }
    });
  }
}

function createPopover(parentDiv, text, translation, flag, mini_cards) {
  const popover_div = document.createElement("div");
  parentDiv.append(popover_div);
  popover_div.setAttribute("id", "translation_popover");
  const def_par = document.createElement("p");
  def_par.textContent = translation;
  const add_translation_btn = document.createElement("button");
  add_translation_btn.setAttribute("id", "add_translation");
  add_translation_btn.textContent = "add card";
  if (!flag) {
    add_translation_btn.disabled = true;
  }

  const close_btn = document.createElement("button");
  close_btn.textContent = "x";
  close_btn.addEventListener("click", (e) => {
    e.stopPropagation();
    popover_div.remove();
  });
  popover_div.append(close_btn, def_par, add_translation_btn);
  add_translation_btn.addEventListener(
    "click",
    () => addMiniCardFromText(popover_div, text, translation, mini_cards),
    false
  );
  return popover_div;
}
