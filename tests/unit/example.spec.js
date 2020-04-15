import { mount } from "@vue/test-utils";
import Login from "../../src/views/dashboard/pages/Login";

describe("Login", () => {
  // Now mount the component and you have the wrapper
  const wrapper = mount(Login);

  it("renders the correct markups", () => {
    expect(wrapper.html()).toContain(
      '<v-btn color="primary" default="" type="submit" class="v-btn--block"> Sign up </v-btn>'
    );
  });

  // it's also easy to check for the existence of elements
  it("has a button", () => {
    expect(wrapper.contains("v-btn")).toBe(true);
  });
});
