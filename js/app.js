const selectTag = document.querySelectorAll("select"),
  formText = document.querySelector(".from-text"),
  toText = document.querySelector(".to-text"),
  exchangeIcon = document.querySelector(".exchange"),
  translateBtn = document.querySelector("button"),
  icons = document.querySelectorAll(".row i");

selectTag.forEach((tag, id) => {
  // console.log(tag);
  for (const country_code in countries) {
    // console.log(countries[country_code],country_code);
    // selecting english by default as from-lnaguage and Uzbek language as TO language
    let selected;
    if (id == 0 && country_code == "en-GB") {
      selected = "selected";
    } else if (id == 1 && country_code == "uz-UZ") {
      selected = "selected";
    }

    let option = `<option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
    tag.insertAdjacentHTML("beforeend", option); // add options tag inside select tag
  }
});

exchangeIcon.addEventListener("click", () => {
  let tempText = formText.value,
    tempLang = selectTag[0].value;
  formText.value = toText.value;
  selectTag[0].value = selectTag[1].value;
  toText.value = tempText;
  selectTag[1].value = tempLang;
});
translateBtn.addEventListener("click", () => {
  let text = formText.value,
    translateFrom = selectTag[0].value, // get fromSelect tag value
    translateTo = selectTag[1].value; //get toSelect tag value
  //   console.log(text,translateFrom,translateTo);
  if (!text) return;
  toText.setAttribute("placeholder", "Translating....");
  let apiURL = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
  fetch(apiURL)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      toText.value = data.responseData.translatedText;
      toText.setAttribute("placeholder", "Translation");
    });
});

formText.addEventListener("keyup", () => {
  if (!formText.value) {
    toText.value = "";
  }
});

//  icons like volume up and copy

icons.forEach((icon) => {
  icon.addEventListener("click", (e) => {
    const styles = e.target;
    // console.log(styles);
    if (styles.classList.contains("fa-copy")) {
      // if clicked icon has from id ,copy textarea value
      if (styles.id == "from") {
        navigator.clipboard.writeText(formText.value);
      } else {
        navigator.clipboard.writeText(toText.value);
      }
    } else {
      let utterance;
      // if clicked icon has from id ,speak textarea value
      if (styles.id == "from") {
        utterance = new SpeechSynthesisUtterance(formText.value);
        utterance.lang = selectTag[0].value;
      } else {
        utterance = new SpeechSynthesisUtterance(toText.value);
        utterance.lang = selectTag[1].value;
      }
      speechSynthesis.speak(utterance);
    }
  });
});
