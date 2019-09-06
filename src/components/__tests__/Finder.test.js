import { mount } from "@vue/test-utils";
import Finder from "../Finder";

describe("Finder", () => {
  const tree = {
    id: "test1",
    children: [
      {
        id: "test11",
        label: "Test 11",
        selected: true,
        children: [
          {
            id: "test111",
            label: "Test 111"
          },
          {
            id: "test112",
            label: "Test 112"
          }
        ]
      },
      {
        id: "test12",
        label: "Test 12"
      }
    ]
  };

  it("should match snapshot", () => {
    const wrapper = mount(Finder, {
      propsData: {
        tree
      }
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should match snapshot with no children", () => {
    const wrapper = mount(Finder, {
      propsData: {
        tree: {
          id: "root"
        }
      }
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should match snapshot with a custom item component", () => {
    const wrapper = mount(Finder, {
      propsData: {
        tree,
        itemComponent: "span"
      }
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should match snapshot with expanded item and emit event", () => {
    const wrapper = mount(Finder, {
      propsData: {
        tree
      }
    });

    wrapper
      .findAll(".item")
      .at(0)
      .trigger("click");
    expect(wrapper.emitted().expand).toEqual([
      [{ expanded: ["test1", "test11"] }]
    ]);
    expect(wrapper).toMatchSnapshot();
  });

  it("should match snapshot with initial filter", () => {
    const wrapper = mount(Finder, {
      propsData: {
        tree,
        filter() {
          return ({ id }) => id === "test12";
        }
      }
    });

    expect(wrapper).toMatchSnapshot();
  });

  it("should match snapshot with filter", () => {
    const wrapper = mount(Finder, {
      propsData: {
        tree
      }
    });

    wrapper.setProps({
      filter: ({ id }) => id === "test12"
    });
    expect(wrapper).toMatchSnapshot();
  });

  it("should match snapshot with an updated tree", () => {
    const wrapper = mount(Finder, {
      propsData: {
        tree
      }
    });
    wrapper.setProps({
      tree: {
        id: "test3",
        children: [
          {
            id: "test31",
            label: "Test 31",
            children: [
              {
                id: "test311",
                label: "Test 311"
              },
              {
                id: "test312",
                label: "Test 312",
                selected: true
              }
            ]
          }
        ]
      }
    });
    expect(wrapper).toMatchSnapshot();
  });

  describe("Selection", () => {
    it("should match snapshot", () => {
      const wrapper = mount(Finder, {
        propsData: {
          tree,
          selectable: true
        }
      });

      expect(wrapper).toMatchSnapshot();
    });

    it("should emit a `select` event", () => {
      const wrapper = mount(Finder, {
        propsData: {
          tree,
          selectable: true
        }
      });

      wrapper
        .findAll(".item > input[type=checkbox]")
        .at(1)
        .trigger("click");

      expect(wrapper.emitted().select).toEqual([
        [{ selected: ["test11", "test12"] }]
      ]);
    });
  });

  describe("Drag & Drop", () => {
    it("should match snapshot", () => {
      const wrapper = mount(Finder, {
        propsData: {
          tree,
          dragEnabled: true
        }
      });

      expect(wrapper).toMatchSnapshot();
    });

    it("should emit a `move` event", () => {
      const wrapper = mount(Finder, {
        propsData: {
          tree,
          dragEnabled: true
        }
      });

      wrapper
        .findAll(".item")
        .at(0)
        .trigger("dragstart", {
          dataTransfer: {
            setData() {}
          }
        });
      wrapper
        .findAll(".item")
        .at(1)
        .trigger("drop");

      expect(wrapper.emitted().move).toEqual([
        [{ moved: "test11", to: "test12" }]
      ]);
    });
  });
});
