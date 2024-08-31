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

  // Change lang selected at register
  const register_lang_icons = document.querySelectorAll(".register_lang_icon");
  const register_lang_input = document.querySelector("#register_lang_input");
  let selected_lang = "english";
  if (register_lang_icons) {
    for (icon of register_lang_icons) {
      icon.addEventListener("click", (e) => {
        register_lang_icons.forEach((icon) =>
          icon.classList.remove("register_selected_lang")
        );
        e.target.classList.add("register_selected_lang");
        // Add hidden input to form
        selected_lang = e.target.getAttribute("alt");
        register_lang_input.value = selected_lang;
      });
    }
  }

  // Change lang in layout
  const lang_container_layout = document.querySelector(".lang_container");
  if (lang_container_layout) {
    const change_lang_modal_input = document.querySelector(
      "#change_lang_modal_input"
    );
    const change_lang_modal_icons = document.querySelectorAll(
      ".change_lang_modal_icon"
    );
    lang_container_layout.addEventListener("click", () => {
      const modal = document.querySelector(".change_lang_modal");
      modal.style.display = "flex";
      for (icon of change_lang_modal_icons) {
        icon.addEventListener("click", (e) => {
          change_lang_modal_icons.forEach((icon) =>
            icon.classList.remove("change_lang_modal_selected")
          );
          e.target.classList.add("change_lang_modal_selected");
          // Add hidden input to form
          selected_lang = e.target.getAttribute("alt");
          change_lang_modal_input.value = selected_lang;
        });
      }
    });
  }

  // Add new modules and texts to group
  const add_module_to_group = document.querySelector(".add_module_to_group");
  const add_text_to_group = document.querySelector(".add_text_to_group");
  if (add_module_to_group) {
    add_module_to_group.addEventListener("click", () => {
      const module_id = add_module_to_group.classList[2];
      const form = document.querySelector("#add_module_to_group_form");
      add_module_to_group.hidden = true;
      form.style.display = "flex";
    });
  }
  if (add_text_to_group) {
    add_text_to_group.addEventListener("click", () => {
      const text_id = add_text_to_group.classList[2];
      const form = document.querySelector("#add_text_to_group_form");
      add_text_to_group.hidden = true;
      form.style.display = "flex";
    });
  }


  // Shuffle defs in match
  const match_container_defs = document.querySelector('.match_container_defs');
  if (match_container_defs) {
    for (let i = match_container_defs.children.length; i >= 0; i--) {
      match_container_defs.appendChild(match_container_defs.children[Math.random() * i | 0]);
    }
  }


  // Match
  const match_terms = document.querySelectorAll(".match_container_terms_card");
  const match_defs = document.querySelectorAll(".match_container_defs_card");
  if (match_terms) {
    match(match_terms, match_defs, "term")
    match(match_defs, match_terms, "definition")
  };


  // Spell
  const spellCheckBtn  = document.querySelector("#spell_container__buttons__check");
  if (spellCheckBtn) {
    const spellContainer = document.querySelector(".spell_container");
    const spellHelpBtn = document.querySelector("#spell_container__buttons__help");
    const spellInput = document.querySelector("#spellInput");
    const spellMessage = document.querySelector(".spell__message");
    const spellCorrect = document.querySelector("#spell__correct");
    const spellSkip = document.querySelector('#spell__skip');
    spellCheckBtn.addEventListener('click', () => {
      const module_id = spellInput.classList[0];
      collectCard("definition", spellInput.nextElementSibling.textContent, module_id).then(data => {
        if (spellInput.value === data.term) {
          let page_num = spellContainer.classList[1];
          endGame(page_num, "spell", spellMessage.parentElement, spellCorrect);
        } else {
          spellMessage.style.display = "flex";
        }
      })
    });
    spellHelpBtn.addEventListener('click', () => {
      const module_id = spellInput.classList[0];
      collectCard("definition", spellInput.nextElementSibling.textContent, module_id).then(data => {
        if (spellInput.value.length < data.term.length) {
          if (data.term.includes(spellInput.value)) {
            spellInput.value = data.term.slice(0, spellInput.value.length + 1);
          } else {
            spellInput.value = data.term.slice(0, spellInput.value.length);
          }
        } else {
          spellInput.value = data.term;
        }
        
      })
    });
    spellSkip.addEventListener('click', () => {
      let page_num = spellContainer.classList[1];
      endGame(page_num, "spell", spellMessage.parentElement);
    })
  }


  // Quiz
  const quizBtnTrue = document.querySelector("#quiz__buttons__true");
  if (quizBtnTrue) {
    const quizBtnFalse = document.querySelector("#quiz__buttons__false");
    quizBtnTrue.addEventListener('click', () => quizHandler("true"))
    quizBtnFalse.addEventListener('click', () => quizHandler("false"))

    
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

async function collectCard(type, content, module_id) {
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

function matchActivation(e, array, data, type) {
  let subtype;
  type === "definition"? subtype = "term" : subtype = "definition";
  const match__message = document.querySelector('.match__message');
  if(e.target.textContent === data[subtype]) {
      // Desactivate choice
      for (def_card of array) {
        def_card.classList.remove("choice")
      }
      e.target.remove()
      current_term.remove()
      match__message.style.display = "none"
      // Check if container is empty
      if (match__message.nextElementSibling.children.length === 0) {
        const match_container = document.querySelector(".match_container")
        endGame(match_container.classList[1], "match");
      }

  } else {
    match__message.style.display = "flex"
  }
}

function match(main_array, side_array, type) {
  for (card of main_array) {
    card.addEventListener('click', (e) => {
      if(!e.target.classList.contains("choice")) {
        module_id = e.target.classList[1]
        for (card of main_array) {
          card.classList.remove("match_chosen")
        }
        e.target.classList.add("match_chosen")
        current_term = e.target;
        // Activate choice
        for (card of side_array) {
          card.classList.add("choice")
        }
        collectCard(type, current_term.textContent, module_id).then(data => {
          for (card of side_array) {
            card.addEventListener('click', (e) => {
              if (e.target.classList.contains("choice")) {
                matchActivation(e,side_array, data, type)
              }
            })
          }
          
        })
      }
    })
  }
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

function quizHandler(type) {
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

function endGame(nextPage, gameType, parentDiv, message) {
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
    if (gameType === "quiz" || gameType === "spell") {
        message.hidden = false;
        setTimeout(() => {
        parentDiv.textContent = "";
        const buttons = createCongratulationsBanner(parentDiv);
        buttons.backLink.setAttribute("href", location.pathname.slice(0,9));
        buttons.tryAgainBtn.setAttribute("href", `${location.pathname}?page=1`);
        }, 600);
    } else {
      const buttons = createCongratulationsBanner(parentDiv);
      buttons.backLink.setAttribute("href", location.pathname.slice(0,9));
      buttons.tryAgainBtn.setAttribute("href", `${location.pathname}?page=1`);
    }
  }
}