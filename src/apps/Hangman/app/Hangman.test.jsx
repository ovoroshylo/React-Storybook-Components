import React from "react";
import { shallow } from "enzyme";

jest.mock("../logic/getNewGame", () => ({ getNewGame: jest.fn() }));
jest.mock("../logic/performGuess", () => ({ performGuess: jest.fn() }));
import { getNewGame, performGuess } from "../logic";

import { Hangman } from ".";
import { UI, EnterField } from "./components";

describe("the Hangman game", () => {
  let wrapper;
  describe("initially", () => {
    beforeEach(() => (wrapper = shallow(<Hangman />)));
    test("renders an EnterField", () => {
      expect(wrapper.find(EnterField)).toExist();
    });
    test("does not render a UI", () => {
      expect(wrapper.find(UI)).not.toExist();
    });

    describe("when starting a game", () => {
      const answer = "indigo";
      const startState = { fake: "state" };
      beforeEach(() => {
        getNewGame.mockReturnValue(startState);
        wrapper = shallow(<Hangman answer={answer} />);
        const submitter = wrapper.find(EnterField).prop("onSubmit");
        submitter(answer);
      });
      test("renders a UI", () => {
        expect(wrapper.find(UI)).toExist();
      });
      test("passed in a new game state to UI", () => {
        expect(wrapper.find(UI)).toHaveProp("state", startState);
      });
      test("created the new state from the give answer", () => {
        expect(getNewGame).toHaveBeenCalledWith({ answer });
      });
      describe("when making a guess", () => {
        const guess = "x";
        const updatedState = { updated: "fake state" };
        beforeEach(() => {
          performGuess.mockReturnValue(updatedState);
          wrapper = shallow(<Hangman />);
          const submitter = wrapper.find(EnterField).prop("onSubmit");
          submitter("secret");
          const makeGuess = wrapper.find(UI).prop("makeGuess");
          makeGuess(guess);
        });
        test("we pass updated state from logic layer to UI", () => {
          expect(wrapper.find(UI)).toHaveProp("state", updatedState);
        });
        test("the performGuess logic was called correctly", () => {
          expect(performGuess).toHaveBeenCalledWith(guess, startState);
        });
      });
    });
  });
});
