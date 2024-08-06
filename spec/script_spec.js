const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require("path");
const mockWindow = {
  location: {
    reload: jasmine.createSpy(),
  },
  alert: jasmine.createSpy(),
};

describe("script", function () {
  let dom;
  let document;
  let window;
  let guiElements;

  const html = fs.readFileSync(
    path.resolve(__dirname, "../index.html"),
    "utf-8"
  );
  dom = new JSDOM(html, { runScripts: "dangerously" });

  document = dom.window.document;
  window = dom.window;

  global.window = window;
  global.document = document;

  const {
    randomizeEventListener,
    submitEventListener,
    jamBuddy,
  } = require("../src/script");

  beforeEach(function () {
    guiElements = {
      ...require("../src/script").guiElements,
      firstNote: document.querySelector("#a0"),
      secondNote: document.querySelector("#a5"),
    };

    global.window = mockWindow;
    window.alert = jasmine.createSpy();
  });

  describe("Event Listeners:", function () {

    describe("randomizeEventListener", function () {
      beforeEach(function () {
        randomizeEventListener();
      });

      it("should enable input field when triggered", function () {
        guiElements.randomizeButton.click();
        expect(guiElements.inputField.disabled).toBe(false);
      });

      it("should hide the answer messages when triggered", function () {
        guiElements.randomizeButton.click();
        expect(guiElements.correctMessage.style.display).toBe("none");
        expect(guiElements.incorrectMessage.style.display).toBe("none");
      });
    });

    describe("submitEventListener", function () {
      beforeEach(function () {
        jamBuddy.setCurrentNotes(["A", "D"]);
        guiElements.inputField.disabled = false;
        guiElements.submitButton.disabled = false;
        guiElements.inputField.value = "5";
        submitEventListener();
        jasmine.clock().install();
      });

      afterEach(function () {
        jasmine.clock().uninstall();
      });

      it("should trigger an alert when submitted with an empty input field", function () {
        guiElements.inputField.value = "";
        guiElements.submitButton.click();

        expect(mockWindow.alert).toHaveBeenCalledWith("Input can't be empty");
      });

      it("should disable the input field when submitted with correct input answer", function () {
        guiElements.submitButton.click();
        expect(guiElements.inputField.disabled).toBe(true);
      });

      it("should disable the submit button when submitted with correct input answer", function () {
        guiElements.submitButton.click();
        expect(guiElements.submitButton.disabled).toBe(true);
      });

      it("should display correct messages when submitted with correct input answer", function () {
        guiElements.submitButton.click();
        expect(guiElements.correctMessage.style.display).toBe("block");
      });

      it("should display incorrect messages when submitted with incorrect input answer", function () {
        guiElements.inputField.value = "3";
        guiElements.submitButton.click();
        jasmine.clock().tick(200);
        expect(guiElements.incorrectMessage.style.display).toBe("block");
      });
    });
  });
});
