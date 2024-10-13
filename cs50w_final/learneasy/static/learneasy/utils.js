// Functions

export function create_new_card(parentDiv, num) {
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

export function autogrow_textarea() {
  const definition_texarea = document.querySelectorAll(".definition_texarea");
  definition_texarea.forEach((textarea) => {
    textarea.addEventListener("input", () => {
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  });
}

function create_mini_card(parentDiv, term, def) {
  const mini_card_container = document.createElement("div");
  const term_par = document.createElement("div");
  const def_par = document.createElement("div");

  parentDiv.append(mini_card_container);
  mini_card_container.classList.add("mini_card_container");
  mini_card_container.append(term_par,def_par);

  term_par.textContent = term;
  term_par.setAttribute("lang", parentDiv.getAttribute("lang"));
  def_par.textContent = def;
  def_par.setAttribute("lang", parentDiv.getAttribute("lang"));
  def_par.style.textAlign = "center";
}

export function deleteCard(icon) {
  const card = icon.parentElement;
  const textarea_term =
    icon.previousElementSibling.firstElementChild.firstElementChild;
  const textarea_def =
    icon.previousElementSibling.lastElementChild.firstElementChild;
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

export function scrollBlurGroups(container, left, right) {
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

export async function translateText(text) {
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
        const added_link = document.createElement("a");
        added_link.textContent = "Go to module";
        added_link.style.textDecoration = "underline";
        added_link.style.fontWeight = "600";
        added_link.setAttribute("href", `/module/${text_modules_select.value}`)
        added_cards_btn_container.append(added_note, added_link);
        add_card_btn.hidden = true;
        mini_cards.length = 0;
      } catch (error) {
        console.log(error);
      }
    });
  }
}

export function createPopover(parentDiv, text, translation, flag, mini_cards) {
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

export async function collectCard(type, content, module_id) {
  try {
    const response = await fetch(`/collect`, {
      method: "POST",
      body: JSON.stringify({ 
        type: type,
        content: content,
        module_id: module_id
       }),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error.message);
  }
}

export function matchActivation(e, array, data, type, current_term) {
  console.log(data)
  let subtype;
  type === "definition"? subtype = "term" : subtype = "definition";
  const match__message = document.querySelector('.match__message');
  if(e.target.textContent === data[subtype]) {
      // Desactivate choice
      array.forEach(def_card => def_card.classList.remove("choice"));
      e.target.remove()
      current_term.remove()
      match__message.style.display = "none"
      // Check if container is empty
      if (match__message.nextElementSibling.children.length === 0) {
        const match_container = document.querySelector(".match_container")
        endGame(match_container.classList[1], "match", match_container);
      }

  } else {
    match__message.style.display = "flex"
  }
}

export function match(main_array, side_array, type) {
  main_array.forEach(card => {
    card.addEventListener('click', (e) => {
      if(!e.target.classList.contains("choice")) {
        console.log(e.target)
        const module_id = e.target.classList[1];
        main_array.forEach(card => card.classList.remove("match_chosen"));
        e.target.classList.add("match_chosen")
        const current_term = e.target;
        // Activate choice
        side_array.forEach(card => card.classList.add("choice"));
        collectCard(type, current_term.textContent, module_id).then(data => {
          side_array.forEach(card => {
            card.addEventListener('click', (e) => {
              if (e.target.classList.contains("choice")) {
                matchActivation(e,side_array, data, type, current_term)
              }
            })
          });
          
        })
      }
    })
  });
}

function createCongratulationsBanner(parentDiv) {
  const container = document.createElement('div');
  const header = document.createElement('h1');
  const tryAgainBtn = document.createElement('a');
  const backLink = document.createElement('a');
  container.classList.add("congratulationsBanner");
  tryAgainBtn.classList.add("tryAgainBtn");
  header.textContent = "Good job!";
  tryAgainBtn.textContent = "Try again";
  backLink.textContent = " Back to module";
  backLink.setAttribute("href", "#");
  parentDiv.append(container);
  container.append(header, tryAgainBtn, backLink);
  return {
    tryAgainBtn: tryAgainBtn,
    backLink: backLink
  };
}

export function quizHandler(type) {
  const quizTerm = document.querySelector("#quiz__term");
  const quizDef = document.querySelector("#quiz__def");
  const module_id = quizTerm.parentElement.classList[1];
  const nextPage = quizTerm.previousElementSibling.classList[1];
  collectCard("term", quizTerm.textContent, module_id).then(data => {
    if (type === "true") {
      if (data.definition === quizDef.textContent) {
        const quizCorrect = document.querySelector("#quiz__correct");
        endGame(nextPage, "quiz", quizTerm.parentElement, quizCorrect);
      } else {
        const quizIncorrect = document.querySelector("#quiz__incorrect");
        endGame(nextPage, "quiz", quizTerm.parentElement, quizIncorrect);
      }
    } else {
      if (data.definition !== quizDef.textContent) {
        const quizCorrect = document.querySelector("#quiz__correct");
        endGame(nextPage, "quiz", quizTerm.parentElement, quizCorrect)
      } else {
        const quizIncorrect = document.querySelector("#quiz__incorrect");
        endGame(nextPage, "quiz", quizTerm.parentElement, quizIncorrect);
      }
    }
  })
}

export function endGame(nextPage, gameType, parentDiv, message) {
  if (nextPage) {
    if (gameType === "quiz" || gameType === "spell") {
      if (message) {
        setTimeout(() => window.location.replace(`${location.pathname}?page=${nextPage}`), 600);
        message.hidden = false;
      } else {
        window.location.replace(`${location.pathname}?page=${nextPage}`);
      }
    } else {
      window.location.replace(`${location.pathname}?page=${nextPage}`)
    }
  } else {
    const pathArray = location.pathname.split('/');
    if (gameType === "quiz" || gameType === "spell") {
        message.hidden = false;
        setTimeout(() => {
        parentDiv.textContent = "";
        const buttons = createCongratulationsBanner(parentDiv);
        buttons.backLink.setAttribute("href", `/module/${pathArray[2]}`);
        buttons.tryAgainBtn.setAttribute("href", `${location.pathname}?page=1`);
        }, 600);
    } else {
      const buttons = createCongratulationsBanner(parentDiv);
      buttons.backLink.setAttribute("href", `/module/${pathArray[2]}`);
      buttons.tryAgainBtn.setAttribute("href", `${location.pathname}?page=1`);
    }
  }
}