import { onMounted, ref } from "vue";

export const isTouch = ref(false);

export const useAgent = () => {
  onMounted(() => {
    isTouch.value =
      window.matchMedia("(pointer: coarse)").matches && !window.matchMedia("(pointer: fine)").matches;
  });

  return {
    isTouch,
  };
};
