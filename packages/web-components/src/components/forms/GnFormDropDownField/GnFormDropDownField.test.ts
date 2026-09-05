import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { GnFormDropDownField } from "./index";

describe("GnFormDropDownField", () => {

  it("renders the label associated ", () => {    
    const wrapper = mount(GnFormDropDownField, {
      props: {
        label: "testing",
        options: [ 
          { label: "Option A", value: "a" },
          { label: "Option B", value: "b" },
          { label: "Option C", value: "c" },
        ],
      }
    });

    const label = wrapper.find("label"); 
    expect(label.text()).toBe("testing"); 
    
  });

  it("renders each option from the options prop", () => {
    const wrapper = mount(GnFormDropDownField, {
      props: {
        options: [
          { label: "Option A", value: "a" },
          { label: "Option B", value: "b" },
          { label: "Option C", value: "c" },
        ],
      },
    });
  
    const options = wrapper.findAll('[role="option"]');
    expect(options).toHaveLength(3);
    expect(options.map(o => o.text())).toEqual(["Option A", "Option B", "Option C"]);
  });
  
  it("emits update:modelValue and gn-update when an option is clicked", async () => {
    const wrapper = mount(GnFormDropDownField, {
      props: {
        options: [
          { label: "Option A", value: "a" },
          { label: "Option B", value: "b" },
        ],
      },
    });
  
    await wrapper.findAll('[role="option"]')[1].trigger("click");
  
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["b"]);
    expect(wrapper.emitted("gn-update")?.[0]).toEqual(["b"]);
  });
  
  it("shows the matching option's label on the trigger button when modelValue is set", () => {
    const wrapper = mount(GnFormDropDownField, {
      props: {
        modelValue: "b",
        options: [
          { label: "Option A", value: "a" },
          { label: "Option B", value: "b" },
        ],
      },
    });
  
    expect(wrapper.find("button").text()).toBe("Option B");
  });
  
  it("falls back to the default options when none are provided", () => {
    const wrapper = mount(GnFormDropDownField);
    expect(wrapper.findAll('[role="option"]').map(o => o.text())).toEqual([
      "Option A", "Option B", "Option C",
    ]);
  });
  
}); 