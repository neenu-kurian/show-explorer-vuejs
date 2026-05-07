import { defineComponent } from "vue";
import { mount } from "@vue/test-utils";

export function withSetup<T>(useComposable: () => T) {
  let composableResult: T;
  const TestComponent = defineComponent({
    setup() {
      composableResult = useComposable();
      return () => null;
    },
  });
  const wrapper = mount(TestComponent);
  return {
    result: composableResult!,
    unmount: () => wrapper.unmount(),
  };
}
