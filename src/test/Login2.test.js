/* import React from "react";
import Login from '../uWork/components/Login/Login';
import Adapter from "enzyme-adapter-react-16";
import { mount, configure } from "enzyme";
import wait from "waait";
import { BrowserRouter as Router } from 'react-router-dom';

configure({ adapter: new Adapter() });

let ui;

describe("When I insert a wrong email ", () => {
  beforeEach(() => {
    ui = mount( <Router>
                    <Login />
                </Router>);

    const emailField = ui.find("#login-email");

    //insert a wrong email
    emailField.simulate("change", {
      target: {
        value: "foo"
      }
    });

    //simulate the blur
    emailField.simulate("blur");
  });

  it("The error is displayed", async () => {
    await wait(0);
    ui.update();
    const errors = ui.find(".error");
    expect(errors.length).toBeGreaterThan(0);
  });

   it("The new email value should be displayed", () => {
    const emailField = ui.find("#email");
    expect(emailField.prop("value")).toContain("foo");
  }); 
}); */