/**
 * @file Wiki Hover
 * @description Hover over a link to see the content of the link
 * Doesn't work on mobile and header
 * @see tippy https://atomiks.github.io/tippyjs/
 */

const blogURL = document.querySelector('meta[name="site_url"]')
  ? document.querySelector('meta[name="site_url"]').content
  : location.origin;
let position = ["top", "right", "bottom", "left"];

/**
 * Fix broken image in the contents (first paragraph)
 * @param {HTMLElement | null} firstPara 
 * @returns {HTMLElement | null} firstPara
 */
function brokenImage(firstPara) {
  const brokenImage = firstPara?.querySelectorAll("img");
  if (brokenImage) {
    for (let i = 0; i < brokenImage.length; i++) {
      const encodedImage = brokenImage[i];
      encodedImage.src = decodeURI(decodeURI(encodedImage.src));
      //replace broken image with encoded image in first para
      encodedImage.src = encodedImage.src.replace(
        location.origin,
        blogURL
      );
    }
  }
  return firstPara
}

/**
 * Remove characters from the contents (first paragraph)
 * @param {HTMLElement | null} firstPara 
 * @returns {HTMLElement | null} firstPara
 */
function cleanText(firstPara) {
  firstPara.innerText = firstPara.innerText
    .replaceAll("↩", "")
    .replaceAll("¶", "");
  return firstPara
}

try {
  const tip = tippy(`.md-content a[href^="${blogURL}"], a.footnote-ref`, {
    content: "",
    allowHTML: true,
    animation: "scale-subtle",
    theme: "translucent",
    followCursor: true,
    arrow: false,
    placement: position[Math.floor(Math.random() * position.length - 1)],
    onShow(instance) {
      fetch(instance.reference.href)
        .then((response) => response.text())
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          let firstPara = doc.querySelector("article");
          const firstHeader = doc.querySelector("h1");
          if (firstHeader && firstHeader.innerText === "Index") {
            const realFileName = decodeURI(
              doc.querySelector('link[rel="canonical"]').href
            )
              .split("/")
              .filter((e) => e)
              .pop();
            firstHeader.innerText = realFileName;
          }
          //broken link in first para
          brokenImage(firstPara);
          const element1 = document.querySelector(`[id^="tippy"]`);
          if (element1) {
            element1.classList.add("tippy");
          }
          const partOfText = instance.reference.href.replace(/.*#/, "#");
          let toDisplay = firstPara;
          if (partOfText.startsWith("#")) {
            firstPara = doc.querySelector(
              `[id="${partOfText.replace("#", "")}"]`
            );
            if (firstPara.tagName.startsWith("H")) {
              instance.hide();
              instance.destroy();
              return;
            }
            else if (firstPara.innerText.replace(partOfText).length === 0) {
              firstPara = doc.querySelector("div.citation");
              toDisplay = firstPara;
            } else {
              toDisplay = cleanText(firstPara).innerText;
            }
            instance.popper.style.height = "auto";
          } else {
            const height = Math.floor(
              firstPara.innerText.split(" ").length / 100
            );
            if (height < 10 && height > 3) {
              instance.popper.style.height = `50%`;
            }
            if (height < 3) {
              instance.popper.style.height = `auto`;
            } else if (height > 10) {
              instance.popper.style.height = `${height - 5}%`;
            }
          }

          instance.popper.placement =
            position[Math.floor(Math.random() * position.length)];
          if (firstPara.innerText.length > 0) {
            instance.setContent(toDisplay);
          } else {
            firstPara = doc.querySelector("article");
            instance.reference.href.replace(/.*#/, "#");
          }
        })
        .catch((error) => {
          console.log(error);
          instance.hide();
          instance.destroy();
        });
    },
  });
} catch {
  console.log("tippy error, ignore it");
}