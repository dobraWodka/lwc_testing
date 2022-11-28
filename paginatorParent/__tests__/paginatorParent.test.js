import {createElement} from "lwc";
import PaginatorParent from "../paginatorParent";
import {fireEvent, registerListener, unregisterAllListeners} from "c/pubsub";


jest.mock(
  "c/pubsub",
  () => {
    return {
      registerListener: jest.fn(),
      unregisterAllListeners: jest.fn(),
      fireEvent: jest.fn()
    }
  });
afterEach(() => {
  if (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
});

async function flushPromises() {
  return Promise.resolve();
}

describe("c-paginator-parent", () => {
  it("registring listener on connectedCallback", async () => {
    const element = createElement("c-paginator-parent", {
      is:PaginatorParent
    });
    document.body.appendChild(element);

    await flushPromises();

    // expect(registerListener.mock.calls.length).toBe(3);
    expect(registerListener).toHaveBeenCalledTimes(3);
    // expect(registerListener.mock.calls[0][0]).toEqual("changepositionpresence");
    expect(registerListener.mock.calls[1][0]).toEqual("search");
    // expect(registerListener.mock.calls[2][0]).toEqual("clearallpositions");
  })
})