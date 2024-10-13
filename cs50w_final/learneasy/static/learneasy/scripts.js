import { create_new_card, autogrow_textarea, deleteCard, scrollBlurGroups, translateText, createPopover, collectCard, match, quizHandler, endGame  } from "./utils.js";


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
        delete_icons.forEach(icon => {
            icon.addEventListener("click", () => deleteCard(icon));
          });
    }
  
    // Flip card
    const flip_card = document.querySelector(".flip_card");
    if (flip_card) {
      const flip_card_inner = document.querySelector(".flip_card_inner");
      flip_card.addEventListener("click", () => {
        if (flip_card_inner.classList.contains("rotated")) {
          flip_card_inner.classList.remove("rotated");
          flip_card_inner.style.transform = "rotateX(0deg)";
        } else {
  
          flip_card_inner.style.transform = "rotateX(180deg)";
          flip_card_inner.classList.toggle("rotated");
        }
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
      // Split into sentences
      const paragraphsArray = text_content.textContent.split('\n\n');
      text_content.textContent = "";
      paragraphsArray.forEach(par => {
        const parDiv = document.createElement("div");
        parDiv.style.marginBottom = "18px";
        const sentencesArray = par.match( /[^\.!\?]+[\.!\?]+/g );
        if(sentencesArray) {
          sentencesArray.forEach(sentence => {
            const sentenceSpan = document.createElement("span");
            parDiv.append(sentenceSpan);
            const wordsArray = sentence.split(/(\s+)/);
            wordsArray.forEach(word => {
              const wordSpan = document.createElement("span");
              if (/[a-zA-Z]/g.test(word)) {
                wordSpan.classList.add("translatable_item");
              }
              wordSpan.textContent = word;
              sentenceSpan.append(wordSpan);
            });
          });
        }
        text_content.append(parDiv);
      })
    }
  
    // Words translation popover
    let module_selected_for_translation = false;
    let cards_from_text = false;
    const mini_cards_from_text = [];
    const translatable_item_array =
      document.querySelectorAll(".translatable_item");
      translatable_item_array.forEach(word => {
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
              popover.style.top = `${rect.bottom + window.scrollY}px`;
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
      });
  
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
    let selected_lang = "en";
    if (register_lang_icons) {
        register_lang_icons.forEach(icon => {
            icon.addEventListener("click", (e) => {
              register_lang_icons.forEach((icon) =>
                icon.classList.remove("register_selected_lang")
              );
              e.target.classList.add("register_selected_lang");
              // Add hidden input to form
              selected_lang = e.target.getAttribute("alt");
              register_lang_input.value = selected_lang;
            });
          });
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
        change_lang_modal_icons.forEach(icon => {
            icon.addEventListener("click", (e) => {
              change_lang_modal_icons.forEach((icon) =>
                icon.classList.remove("change_lang_modal_selected")
              );
              e.target.classList.add("change_lang_modal_selected");
              // Add hidden input to form
              selected_lang = e.target.getAttribute("alt");
              change_lang_modal_input.value = selected_lang;
            });
          });
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
  
  
  
    // Emoji
    // New module
    const moduleEmojis = document.querySelectorAll('.module__emoji__input');
    if (moduleEmojis) {
      const emojiiInput = document.querySelector('#module_emoji');
      const emojiActive = document.querySelector('.emoji__active');
      if(!emojiActive) {
        moduleEmojis.forEach(emoji => {
          if (emoji.textContent === emojiiInput.value) {
            emoji.classList.add('emoji__active');
          }
        })
      }
      moduleEmojis.forEach(emoji => {
        emoji.addEventListener('click', (e) => {
          moduleEmojis.forEach(el => el.classList.remove('emoji__active'));
          e.target.classList.add('emoji__active');
          emojiiInput.value = e.target.textContent;
        })
      })
    }
  
    // Curtain
    const menuBurger = document.querySelector("#layout_menu");
    if(menuBurger) {
      const curtainMenu = document.querySelector("#curtain_menu");
      const curtainMenuClose = document.querySelector("#curtain_menu__close");
      menuBurger.addEventListener('click', () => curtainMenu.style.left = "0px")
      curtainMenuClose.addEventListener('click', () => curtainMenu.style.left = "-240px")
    }
  
  
  });