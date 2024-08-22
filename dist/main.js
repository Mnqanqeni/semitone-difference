/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/helper_objects.js":
/*!*******************************!*\
  !*** ./src/helper_objects.js ***!
  \*******************************/
/***/ ((module) => {

eval("const errorMessages = {\n  notTwoElements: \"The input must consist of exactly two elements to be valid.\",\n  notesNotValid:\n    \"The provided notes are not valid. Please refer to the following array for valid notes: ['A', 'A#', 'Bb', 'B', 'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb', 'G', 'G#'].\",\n  noteDuplicated: \"Each note in the input must be unique and not duplicated.\",\n  distanceOutOfRange:\n    \"The provided answer is out of range. Please input a value from 1 to 11.\",\n  negativeDistance:\n    \"The distance cannot be negative. Please input a non-negative value for the distance.\",\n  mustBeWholeNumber:\n    \"The provided number must be a whole number, e.g., 5, not a decimal number like 5.1.\",\n  onlyDatatypeOfNumber:\n    \"Only the data type 'number' is valid, e.g., 5, not 'five', '5', or {}.\",\n  inharmonicEquivalentNotesError: (note1, note2) =>\n    `${note1} and ${note2} are inharmonic equivalent notes; there is no semitone between them.`,\n};\n\nconst musicalElementsNotesObject = {\n  A: 0,\n  \"A#\": 1,\n  Bb: 1,\n  B: 2,\n  C: 3,\n  \"C#\": 4,\n  Db: 4,\n  D: 5,\n  \"D#\": 6,\n  Eb: 6,\n  E: 7,\n  F: 8,\n  \"F#\": 9,\n  Gb: 9,\n  G: 10,\n  \"G#\": 11,\n};\n\nmodule.exports = { errorMessages, musicalElementsNotesObject };\n\n\n//# sourceURL=webpack://ndiyakholwa-mnqanqeni-199-semitone-difference-basic-algorithm-javascript/./src/helper_objects.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { JamBuddy } = __webpack_require__(/*! ./jam_buddy */ \"./src/jam_buddy.js\");\n\nconst guiElements = {\n  form: document.getElementById(\"distance-input-form\"),\n  streakElement: document.getElementById(\"streak\"),\n  streakNumberElement: document.getElementById(\"streak-number\"),\n  inputField: document.getElementById(\"input-field\"),\n  restartButton: document.getElementById(\"restart-btn\"),\n  giveUpButton: document.getElementById(\"give-up-btn\"),\n  randomizeButton: document.querySelector(\"#randomize-btn\"),\n  submitButton: document.getElementById(\"submit-btn\"),\n  correctMessage: document.getElementById(\"correctMessage\"),\n  incorrectMessage: document.getElementById(\"incorrectMessage\"),\n  explanation: document.querySelector(\"#explanation\"),\n  answerText: document.querySelector(\"#answer-text\"),\n  mainCounter: document.querySelector(\"#main-counter\"),\n  clockwiseAnswer: document.querySelector(\"#clockwise-answer\"),\n  antiClockwiseAnswer: document.querySelector(\"#anti-clockwise-answer\"),\n  firstNote: document.querySelector(\"#first-note\"),\n  secondNote: document.querySelector(\"#second-note\"),\n  correctMusic:document.getElementById('correct-music'),\n  wrongMusic :document.getElementById('wrong-music'),\n  backgroundMusic:document.getElementById(\"background-music\")\n};\n\nconst jamBuddy = new JamBuddy();\nlet streakCounter = 0;\nlet noteOne, noteTwo;\n\nconst colorOne = \"#007bff\";\nconst colorTwo = \"#7da2ca\";\n\n[noteOne, noteTwo] = initNotes(jamBuddy);\ndocument.addEventListener(\"DOMContentLoaded\", () => {\n  restartEventListener();\n  giveUpEventListener();\n  randomizeEventListener();\n  submitEventListener();\n});\n\nfunction restartEventListener() {\n  guiElements.restartButton.addEventListener(\"click\", () => reloadPage(window));\n}\n\nfunction giveUpEventListener() {\n  guiElements.giveUpButton.addEventListener(\"click\", () => {\n    toggleButtons(\"disable\");\n    changeButtonColor(colorTwo);\n    guiElements.inputField.disabled = true;\n    clearTheBoxes(document);\n    doTheExplanation(document, noteOne, noteTwo);\n    streakCounter = 0;\n    updateStrikes(streakCounter);\n  });\n}\n\nfunction randomizeEventListener() {\n  guiElements.randomizeButton.addEventListener(\"click\", () => {\n    guiElements.correctMusic.pause();\n    guiElements.correctMusic.currentTime = 0\n    switchOffAnswerMessages();\n    clearTheBoxes(document);\n    switchOffAnswer(document, noteOne, noteTwo);\n    toggleButtons(\"enable\");\n    changeButtonColor(colorOne);\n    guiElements.inputField.disabled = false;\n    [noteOne, noteTwo] = initNotes(jamBuddy);\n  });\n}\n\nfunction submitEventListener() {\n  guiElements.form.addEventListener(\"submit\", (event) => {\n    event.preventDefault();\n    const distance = parseInt(guiElements.inputField.value);\n\n    if (isNaN(distance)) {\n      window.alert(\"Input can't be empty\");\n      return;\n    }\n\n    guiElements.inputField.value = \"\";\n\n    switchOffAnswer(document, noteOne, noteTwo);\n\n    if (jamBuddy.checkAnswer(distance)) {\n      const colors = streakCounter > 5 ? ['#ff0000', '#00ff00', '#0000ff'] : ['#007bff', '#ffb700'];\n\n      confetti({\n        particleCount: 100 + streakCounter * 10,\n        spread: 160 + streakCounter * 5,\n        origin: { y: 0.6 },\n        colors: colors,\n      });\n\n      \n      guiElements.correctMusic.play();\n\n      displayAnswerMessage(\"correct\");\n      showAnswer(document, noteOne, noteTwo);\n      streakCounter++;\n      toggleButtons(\"disable\");\n      changeButtonColor(colorTwo);\n      guiElements.inputField.disabled = true;\n      updateStrikes(streakCounter);\n    } else {\n\n      guiElements.wrongMusic.play();\n      displayAnswerMessage(\"incorrect\");\n      streakCounter = 0;\n      updateStrikes(streakCounter);\n    }\n  });\n}\n\nfunction initNotes(jamBuddy) {\n  jamBuddy.randomizeCurrentNotes();\n  const [noteOne, noteTwo] = jamBuddy.getCurrentNotes();\n  guiElements.firstNote.innerText = noteOne;\n  guiElements.secondNote.innerText = noteTwo;\n\n  return [noteOne, noteTwo];\n}\n\nfunction reloadPage(window) {\n  window.location.reload();\n}\n\nfunction toggleButtons(status) {\n  const isDisabled = status === \"disable\";\n  guiElements.submitButton.disabled = isDisabled;\n  guiElements.giveUpButton.disabled = isDisabled;\n}\n\nfunction changeButtonColor(color) {\n  guiElements.submitButton.style.backgroundColor = color;\n  guiElements.giveUpButton.style.backgroundColor = color;\n}\n\nfunction displayAnswerMessage(status) {\n  guiElements.correctMessage.style.display =\n    status === \"correct\" ? \"block\" : \"none\";\n  guiElements.incorrectMessage.style.display =\n    status === \"incorrect\" ? \"block\" : \"none\";\n}\n\nfunction updateStrikes(streakCounter) {\n  guiElements.streakNumberElement.innerText = streakCounter;\n}\n\nfunction clearTheBoxes(document) {\n  const arrayObject = [1, 4, 6, 9];\n  for (let i = 0; i < 12; i++) {\n    if (arrayObject.includes(i)) {\n      document.querySelector(`#a${i}a0`).style.backgroundColor = \"#ccc\";\n      document.querySelector(`#a${i}a1`).style.backgroundColor = \"#ccc\";\n    } else {\n      document.querySelector(`#a${i}`).style.backgroundColor = \"#ccc\";\n    }\n  }\n}\n\nfunction switchOffAnswer(document, noteOne, noteTwo) {\n  guiElements.explanation.style.display = \"none\";\n  document.querySelector(\n    `#a${JamBuddy.musicalElements[noteOne]}`\n  ).style.backgroundColor = \"#ccc\";\n  document.querySelector(\n    `#a${JamBuddy.musicalElements[noteTwo]}`\n  ).style.backgroundColor = \"#ccc\";\n}\n\nfunction showAnswer(document) {\n  let noteOne;\n  let noteTwo;\n  [noteOne, noteTwo] = jamBuddy.getCurrentNotes();\n\n  const arrayObject = [1, 4, 6, 9];\n  const index1 = JamBuddy.musicalElements[noteOne];\n  const index2 = JamBuddy.musicalElements[noteTwo];\n\n  guiElements.explanation.style.display = \"block\";\n  guiElements.answerText.style.display = \"none\";\n\n  const getColorSelector = (index, note) =>\n    `#a${index}${\n      arrayObject.includes(index) ? `a${note.includes(\"#\") ? \"0\" : \"1\"}` : \"\"\n    }`;\n\n  document.querySelector(\n    getColorSelector(index1, noteOne)\n  ).style.backgroundColor = \"red\";\n  document.querySelector(\n    getColorSelector(index2, noteTwo)\n  ).style.backgroundColor = \"yellow\";\n}\nfunction switchOffAnswerMessages() {\n  guiElements.correctMessage.style.display = \"none\";\n  guiElements.incorrectMessage.style.display = \"none\";\n}\n\nfunction doTheExplanation(document, noteOne, noteTwo) {\n  showAnswer(document, noteOne, noteTwo);\n  guiElements.answerText.style.display = \"block\";\n\n  let one = JamBuddy.musicalElements[noteOne];\n  let two = JamBuddy.musicalElements[noteTwo];\n\n  [one, two] = one < two ? [one, two] : [two, one];\n\n  doCount(one, two, guiElements.clockwiseAnswer, () => {\n    doCount(two, one, guiElements.antiClockwiseAnswer);\n  });\n}\n\nfunction doCount(num1, num2, id, callback) {\n  let count = 0;\n  const totalNotes = 12;\n\n  const intervalId = setInterval(() => {\n    if (num1 !== num2) {\n      num1 = (num1 + 1) % totalNotes;\n      count++;\n      id.innerText = count;\n      guiElements.mainCounter.innerText = count;\n\n      const element = document.querySelector(`#a${num1}`);\n      const store = element.style.backgroundColor;\n      element.style.backgroundColor = \"blue\";\n      setTimeout(() => {\n        element.style.backgroundColor = store;\n      }, 600);\n    } else {\n      clearInterval(intervalId);\n      if (typeof callback === \"function\") {\n        callback();\n      }\n      guiElements.mainCounter.innerText = \"\";\n    }\n  }, 900);\n}\n\nmodule.exports = {\n  restartEventListener,\n  giveUpEventListener,\n  randomizeEventListener,\n  // submitEventListener,\n  jamBuddy,\n  guiElements,\n};\n\n\n//# sourceURL=webpack://ndiyakholwa-mnqanqeni-199-semitone-difference-basic-algorithm-javascript/./src/index.js?");

/***/ }),

/***/ "./src/jam_buddy.js":
/*!**************************!*\
  !*** ./src/jam_buddy.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const { validateDistance, validateNotesArray } = __webpack_require__(/*! ./validate */ \"./src/validate.js\");\nconst { musicalElementsNotesObject } = __webpack_require__(/*! ./helper_objects */ \"./src/helper_objects.js\");\n\nclass JamBuddy {\n  static #musicalElements = musicalElementsNotesObject;\n  #currentNotes = [];\n\n  static get musicalElements() {\n    return this.#musicalElements;\n  }\n\n  getCurrentNotes() {\n    return this.#currentNotes;\n  }\n\n  setCurrentNotes(arrayNotes) {\n    validateNotesArray(arrayNotes, Object.keys(JamBuddy.#musicalElements));\n    this.#currentNotes = arrayNotes;\n  }\n\n  randomizeCurrentNotes() {\n    const tempArray = Object.keys(JamBuddy.#musicalElements);\n    let firstNote, secondNote;\n\n    do {\n      firstNote = getRandomNote(tempArray);\n      secondNote = getRandomNote(tempArray);\n    } while (\n      JamBuddy.#musicalElements[firstNote] ===\n      JamBuddy.#musicalElements[secondNote]\n    );\n\n    this.setCurrentNotes([firstNote, secondNote]);\n  }\n\n  checkAnswer(distance) {\n    validateDistance(distance);\n    const [index1, index2] = getIndexes(this.getCurrentNotes());\n    const totalHarmonicNotes = 12;\n    const absDiff = Math.abs(index1 - index2);\n    const cyclicDistance = [absDiff, totalHarmonicNotes - absDiff];\n    return cyclicDistance.includes(distance);\n  }\n}\n\nfunction getIndexes(currentNotes) {\n  const index1 = musicalElementsNotesObject[currentNotes[0]];\n  const index2 = musicalElementsNotesObject[currentNotes[1]];\n  return [index1, index2];\n}\n\nconst getRandomNote = (arrayOfAllNotes) =>\n  arrayOfAllNotes[Math.floor(Math.random() * arrayOfAllNotes.length)];\n\nmodule.exports = { JamBuddy };\n\n\n//# sourceURL=webpack://ndiyakholwa-mnqanqeni-199-semitone-difference-basic-algorithm-javascript/./src/jam_buddy.js?");

/***/ }),

/***/ "./src/validate.js":
/*!*************************!*\
  !*** ./src/validate.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const {\n  errorMessages,\n  musicalElementsNotesObject,\n} = __webpack_require__(/*! ./helper_objects */ \"./src/helper_objects.js\");\nconst maxDistance = 11;\n\nfunction validateNotesArray(arrayNotes, musicalElementsArray) {\n  if (arrayNotes.length !== 2) throw new Error(errorMessages.notTwoElements);\n\n  if (!arrayNotes.every((note) => musicalElementsArray.includes(note)))\n    throw new Error(errorMessages.notesNotValid);\n\n  if (arrayNotes[0] === arrayNotes[1])\n    throw new Error(errorMessages.noteDuplicated);\n\n  if (\n    musicalElementsNotesObject[arrayNotes[0]] ===\n    musicalElementsNotesObject[arrayNotes[1]]\n  ) {\n    throw new Error(\n      errorMessages.inharmonicEquivalentNotesError(arrayNotes[0], arrayNotes[1])\n    );\n  }\n}\n\nfunction validateDistance(distance) {\n  if (typeof distance !== \"number\")\n    throw new Error(errorMessages.onlyDatatypeOfNumber);\n\n  if (!Number.isInteger(distance))\n    throw new Error(errorMessages.mustBeWholeNumber);\n\n  if (distance > maxDistance || distance === 0)\n    throw new Error(errorMessages.distanceOutOfRange);\n\n  if (distance < 0) throw new Error(errorMessages.negativeDistance);\n}\n\nmodule.exports = {\n  validateDistance,\n  validateNotesArray,\n};\n\n\n//# sourceURL=webpack://ndiyakholwa-mnqanqeni-199-semitone-difference-basic-algorithm-javascript/./src/validate.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;